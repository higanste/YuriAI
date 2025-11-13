import { NextRequest, NextResponse } from 'next/server'
import { callOpenRouter } from '@/lib/openrouter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and must not be empty' },
        { status: 400 }
      )
    }

    // Add system message if not present
    let enhancedMessages = [...messages]
    const hasSystemMessage = messages.some((msg: any) => msg.role === 'system')
    
    if (!hasSystemMessage) {
      enhancedMessages = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide clear and helpful responses.'
        },
        ...messages
      ]
    }

    const response = await callOpenRouter(enhancedMessages, model)

    if (!response || response.trim() === '') {
      return NextResponse.json(
        { error: 'Empty response from AI' },
        { status: 500 }
      )
    }

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to get AI response',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
