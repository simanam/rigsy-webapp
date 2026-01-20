import { Client, APIErrorCode, isNotionClientError } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID || "";

export async function POST(request: NextRequest) {
  // Check for missing configuration
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.error("Missing Notion configuration");
    return NextResponse.json(
      { error: "Service temporarily unavailable", code: "config_error" },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { email, role } = body;

  if (!email || !role) {
    return NextResponse.json(
      { error: "Email and role are required" },
      { status: 400 }
    );
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  // Map role values to display names
  const roleDisplayNames: Record<string, string> = {
    "owner-operator": "Owner-Operator",
    "company-driver": "Company Driver",
    "fleet-manager": "Fleet Manager",
    "investor": "Investor",
    "other": "Other",
  };

  try {
    const now = new Date().toISOString();

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        // Name is the title property - using email as the name
        Name: {
          title: [
            {
              text: {
                content: email,
              },
            },
          ],
        },
        // Email property
        Email: {
          email: email,
        },
        // Role select property
        Role: {
          select: {
            name: roleDisplayNames[role] || role,
          },
        },
        // Source - where the signup came from
        Source: {
          rich_text: [
            {
              text: {
                content: "website",
              },
            },
          ],
        },
        // Status select property
        Status: {
          select: {
            name: "New",
          },
        },
        // Signup Date
        "Signup Date": {
          date: {
            start: now,
          },
        },
        // Created At
        "Created At": {
          date: {
            start: now,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    // Handle Notion-specific errors gracefully
    if (isNotionClientError(error)) {
      console.error(`Notion API error [${error.code}]:`, error.message);

      if (error.code === APIErrorCode.ObjectNotFound) {
        return NextResponse.json(
          { error: "Service configuration error. Please try again later.", code: "database_not_found" },
          { status: 503 }
        );
      }

      if (error.code === APIErrorCode.Unauthorized) {
        return NextResponse.json(
          { error: "Service configuration error. Please try again later.", code: "unauthorized" },
          { status: 503 }
        );
      }

      if (error.code === APIErrorCode.RateLimited) {
        return NextResponse.json(
          { error: "Too many requests. Please try again in a moment.", code: "rate_limited" },
          { status: 429 }
        );
      }

      if (error.code === APIErrorCode.ValidationError) {
        return NextResponse.json(
          { error: "Invalid data submitted. Please check your information.", code: "validation_error" },
          { status: 400 }
        );
      }
    }

    // Generic error fallback
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist. Please try again." },
      { status: 500 }
    );
  }
}
