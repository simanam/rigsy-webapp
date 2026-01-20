import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

// Rate limiting for TTS (more expensive than chat)
const ttsRateLimitMap = new Map<string, { count: number; resetTime: number }>()
const TTS_RATE_LIMIT = 5 // requests per minute
const TTS_RATE_WINDOW = 60 * 1000 // 1 minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'anonymous'
  return ip
}

function isTTSRateLimited(key: string): boolean {
  const now = Date.now()
  const record = ttsRateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    ttsRateLimitMap.set(key, { count: 1, resetTime: now + TTS_RATE_WINDOW })
    return false
  }

  if (record.count >= TTS_RATE_LIMIT) {
    return true
  }

  record.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Please provide text to convert.' },
        { status: 400 }
      )
    }

    // Limit text length (TTS is expensive)
    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Text is too long for voice synthesis.' },
        { status: 400 }
      )
    }

    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request)
    if (isTTSRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many voice requests. Please wait a moment.' },
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

    // Use OpenAI TTS with a friendly voice
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1', // Use tts-1 for faster response (tts-1-hd for higher quality)
      voice: 'onyx', // Deep, warm voice good for a co-pilot character
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
