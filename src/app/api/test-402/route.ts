import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/services/db/client";

export async function POST(request: NextRequest) {
  try {
    const { url, method = 'GET', outputSchema } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate that this URL exists in our Accepts table for security
    const acceptExists = await prisma.accepts.findFirst({
      where: { resource: url }
    });

    if (!acceptExists) {
      return NextResponse.json({ error: 'URL not found in accepts list' }, { status: 403 });
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
    };

    // If it's a POST request, add sample data based on bodyFields
    if (method.toUpperCase() === 'POST' && outputSchema?.input?.bodyFields) {
      const sampleBody: any = {};
      const bodyFields = outputSchema.input.bodyFields;
      
      // Generate sample data based on field types
      Object.entries(bodyFields).forEach(([key, type]) => {
        switch (type) {
          case 'string':
            sampleBody[key] = `sample_${key}`;
            break;
          case 'number':
            sampleBody[key] = 123;
            break;
          default:
            sampleBody[key] = `sample_${key}`;
        }
      });

      fetchOptions.headers = {
        'Content-Type': 'application/json',
      };
      fetchOptions.body = JSON.stringify(sampleBody);
    }

    // Make the actual request
    const response = await fetch(url, fetchOptions);
    const responseBody = await response.text();

    // Extract headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Don't log 402 responses as they are expected
    const shouldLog = response.status !== 402;
    if (shouldLog) {
      console.log(`[Test-402] ${method} ${url} -> ${response.status}`);
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
    });

  } catch (error) {
    console.error('[Test-402] Error:', error);
    return NextResponse.json(
      { 
        status: 0,
        statusText: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        headers: {},
        body: ''
      },
      { status: 200 } // Return 200 so client can display the error
    );
  }
}