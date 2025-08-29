import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: 'gemini-2.0-flash-exp',
  temperature: 0.7,
});

// Create the prompt template
const promptTemplate = PromptTemplate.fromTemplate(`
Write a comprehensive wiki article about "{word}" in approximately 250 words using proper Markdown formatting.

Structure your response with:
1. **Definition:** Start with a clear definition using bold text
2. **Background/Origin:** Historical or contextual information
3. **Key Features/Facts:** Use bullet points or numbered lists for interesting details
4. **Related Concepts:** Connections to other topics

Use Markdown formatting including:
- **Bold text** for emphasis and section labels
- ## Headings for major sections
- - Bullet points for lists
- *Italic text* for scientific names or emphasis

Write in an engaging, informative style suitable for a wiki. Focus on accuracy and interesting details that would make someone want to explore related topics.

Topic: {word}
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

    // Generate the prompt
    const prompt = await promptTemplate.format({ word });

    // Generate content using Gemini
    const response = await model.invoke(prompt);

    // Extract the content from the LangChain response
    const content = response.content;

    // Return the structured response
    return NextResponse.json({
      title: word.charAt(0).toUpperCase() + word.slice(1),
      content: content
    });

  } catch (error) {
    console.error('Error generating wiki article:', error);
    return NextResponse.json(
      { error: 'Failed to generate wiki article' },
      { status: 500 }
    );
  }
}
