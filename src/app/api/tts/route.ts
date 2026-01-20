import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

// Rate limiting for TTS (more expensive than chat)
const ttsRateLimitMap = new Map<string, { count: number; resetTime: number }>()
const ttsDailyLimitMap = new Map<string, { count: number; resetTime: number }>()

const TTS_RATE_LIMIT = 5 // requests per minute
const TTS_RATE_WINDOW = 60 * 1000 // 1 minute
const TTS_DAILY_LIMIT = 30 // max TTS requests per day per IP (very strict)
const TTS_DAILY_WINDOW = 24 * 60 * 60 * 1000 // 24 hours

// Simple HMAC-like verification to ensure TTS is only called with legitimate responses
// This isn't cryptographically secure but adds friction for casual abuse
const TTS_SECRET = process.env.TTS_INTERNAL_SECRET || 'rigsy-tts-2024'

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'anonymous'
  return ip
}

function isTTSRateLimited(key: string): { limited: boolean; reason?: string } {
  const now = Date.now()

  // Check daily limit first
  const dailyRecord = ttsDailyLimitMap.get(key)
  if (!dailyRecord || now > dailyRecord.resetTime) {
    ttsDailyLimitMap.set(key, { count: 1, resetTime: now + TTS_DAILY_WINDOW })
  } else if (dailyRecord.count >= TTS_DAILY_LIMIT) {
    return { limited: true, reason: 'daily' }
  } else {
    dailyRecord.count++
  }

  // Check per-minute limit
  const record = ttsRateLimitMap.get(key)
  if (!record || now > record.resetTime) {
    ttsRateLimitMap.set(key, { count: 1, resetTime: now + TTS_RATE_WINDOW })
    return { limited: false }
  }

  if (record.count >= TTS_RATE_LIMIT) {
    return { limited: true, reason: 'minute' }
  }

  record.count++
  return { limited: false }
}

// Simple hash to verify the text came from our chat endpoint
function generateTextHash(text: string): string {
  let hash = 0
  const str = text + TTS_SECRET
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

export async function POST(request: NextRequest) {
  try {
    // Basic origin check - only allow requests from our domain
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    const allowedPatterns = [
      'localhost',
      'rigsy.co',
      'rigsy.ai',
      'rigsy-webapp.vercel.app',
      'vercel.app',
    ]

    const host = request.headers.get('host')
    const checkOrigin = origin || referer || host || ''
    const isValidOrigin = allowedPatterns.some(pattern =>
      checkOrigin.includes(pattern)
    )

    if (!isValidOrigin && process.env.NODE_ENV === 'production') {
      console.warn('TTS: Blocked request from:', { origin, referer, host })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { text, hash } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Please provide text to convert.' },
        { status: 400 }
      )
    }

    // Verify the hash matches - prevents direct API abuse
    const expectedHash = generateTextHash(text)
    if (hash !== expectedHash) {
      console.warn('TTS: Invalid hash received, possible abuse attempt')
      return NextResponse.json(
        { error: 'Invalid request.' },
        { status: 403 }
      )
    }

    // Limit text length (TTS is expensive)
    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Text is too long for voice synthesis.' },
        { status: 400 }
      )
    }

    // Rate limiting check (per-minute and daily)
    const rateLimitKey = getRateLimitKey(request)
    const rateLimitResult = isTTSRateLimited(rateLimitKey)
    if (rateLimitResult.limited) {
      const errorMsg = rateLimitResult.reason === 'daily'
        ? 'Daily voice limit reached. Please come back tomorrow.'
        : 'Too many voice requests. Please wait a moment.'
      return NextResponse.json(
        { error: errorMsg },
        { status: 429 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured')
      return NextResponse.json(
        { error: 'Voice service is not configured.' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })

    // Use OpenAI TTS with a friendly female voice
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1', // Use tts-1 for faster response (tts-1-hd for higher quality)
      voice: 'nova', // Friendly, warm female voice
      input: text,
      speed: 1.0,
    })

    // Get the audio buffer
    const audioBuffer = Buffer.from(await mp3Response.arrayBuffer())

    // Return the audio file
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'no-store', // Don't cache voice responses
      },
    })
  } catch (error) {
    console.error('TTS API error:', error)
    return NextResponse.json(
      { error: 'Voice synthesis failed. Please try again.' },
      { status: 500 }
    )
  }
}
