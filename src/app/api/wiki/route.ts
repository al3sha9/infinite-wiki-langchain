import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for faster subsequent requests
const cache = new Map<string, { content: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Initialize the Gemini models
const primaryModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: 'gemini-1.5-flash', // Even faster and more reliable
  temperature: 0.5, // Lower temperature for faster, more focused responses
  maxOutputTokens: 250, // Reduced even more for speed
  topK: 1, // More focused responses
  topP: 0.7, // More deterministic for speed
});

// Fallback model for when primary is slow
const fallbackModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: 'gemini-1.5-flash-8b', // Fastest available
  temperature: 0.3,
  maxOutputTokens: 200,
  topK: 1,
  topP: 0.6,
});

// Create the prompt template
const promptTemplate = PromptTemplate.fromTemplate(`
Write a concise wiki about "{word}" in 150 words. Use Markdown:

**{word}:** Definition in 1 sentence.

## Key Facts
- 3 core facts with bullet points
- Include 1 historical detail if relevant

## Related
Brief connections to other topics.

Be accurate and engaging.
`);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word');

    if (!word) {
      return NextResponse.json(
        { error: 'Word parameter is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = word.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Cache hit for "${word}"`);
      return NextResponse.json({
        title: word.charAt(0).toUpperCase() + word.slice(1),
        content: cached.content
      });
    }

    // Start timing for performance monitoring
    const startTime = Date.now();

    // Generate the prompt
    const prompt = await promptTemplate.format({ word });

    // Retry logic for better reliability
    let response;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        const modelToUse = attempts === 1 ? primaryModel : fallbackModel;
        console.log(`Attempt ${attempts} using ${attempts === 1 ? 'primary' : 'fallback'} model for "${word}"`);
        
        // Generate content using Gemini with extended timeout
        response = await Promise.race([
          modelToUse.invoke(prompt),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 6000) // 6 second timeout per attempt
          )
        ]);
        break; // Success, exit loop
      } catch (error) {
        console.log(`Attempt ${attempts} failed for "${word}":`, error);
        if (attempts >= maxAttempts) {
          throw error; // Re-throw if all attempts failed
        }
        // Brief delay before retry
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Extract the content from the LangChain response
    const content = (response as { content: string }).content;
    
    // Store in cache
    cache.set(cacheKey, { content, timestamp: Date.now() });
    
    // Log performance for monitoring
    const duration = Date.now() - startTime;
    console.log(`Generated article for "${word}" in ${duration}ms`);

    // Return the structured response
    return NextResponse.json({
      title: word.charAt(0).toUpperCase() + word.slice(1),
      content: content
    });

  } catch (error) {
    console.error('Error generating wiki article:', error);
    return NextResponse.json(
      { error: 'Failed to generate wiki article. Please try again.' },
      { status: 500 }
    );
  }
}
