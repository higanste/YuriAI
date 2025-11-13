import { NextRequest, NextResponse } from 'next/server'
import { createReadStream } from 'fs'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request: NextRequest) {
  try {
    // Path to the extension directory
    const extensionPath = join(process.cwd(), 'extension')
    
    // Check if extension directory exists
    if (!existsSync(extensionPath)) {
      return NextResponse.json(
        { error: 'Extension not found' },
        { status: 404 }
      )
    }

    // For now, we'll create a response that tells users to download from GitHub
    // In production, you'd want to create a ZIP file on the fly or serve a pre-built one
    return NextResponse.json({
      message: 'Please download the extension from the GitHub repository',
      githubUrl: 'https://github.com/higanste/AiAgent/tree/main/extension',
      instructions: 'Download the extension folder, zip it, and follow the installation guide'
    })
  } catch (error: any) {
    console.error('Extension download error:', error)
    return NextResponse.json(
      { error: 'Failed to prepare extension download' },
      { status: 500 }
    )
  }
}

