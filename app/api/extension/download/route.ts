import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Try to get the extension ZIP from Supabase storage
    const { data, error } = await supabase.storage
      .from('extensions')
      .download('yuriai-extension.zip')

    if (error || !data) {
      console.error('Supabase download error:', error)
      
      // Fallback: Create ZIP on-the-fly
      return await createZipOnTheFly()
    }

    // Convert blob to buffer
    const arrayBuffer = await data.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="yuriai-extension.zip"',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('Extension download error:', error)
    
    // Fallback: Create ZIP on-the-fly
    try {
      return await createZipOnTheFly()
    } catch (fallbackError) {
      return NextResponse.json(
        { 
          error: 'Failed to download extension',
          message: 'Please try downloading from GitHub',
          githubUrl: 'https://github.com/higanste/YuriAI/tree/main/extension'
        },
        { status: 500 }
      )
    }
  }
}

async function createZipOnTheFly() {
  const { existsSync, readdirSync, statSync, readFileSync } = await import('fs')
  const { join } = await import('path')
  const archiver = (await import('archiver')).default

  const extensionPath = join(process.cwd(), 'extension')
  
  if (!existsSync(extensionPath)) {
    throw new Error('Extension directory not found')
  }

  const chunks: Buffer[] = []
  
  return new Promise<NextResponse>((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } })

    archive.on('error', reject)
    archive.on('data', (chunk: Buffer) => chunks.push(chunk))
    archive.on('end', () => {
      const zipBuffer = Buffer.concat(chunks)
      resolve(
        new NextResponse(zipBuffer, {
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="yuriai-extension.zip"',
            'Content-Length': zipBuffer.length.toString(),
          },
        })
      )
    })

    function addDirectory(dirPath: string, basePath: string = '') {
      try {
        const items = readdirSync(dirPath)
        for (const item of items) {
          const fullPath = join(dirPath, item)
          const relativePath = basePath ? `${basePath}/${item}` : item
          const stat = statSync(fullPath)
          
          if (stat.isDirectory()) {
            if (item !== 'node_modules' && !item.startsWith('.') && item !== 'dist') {
              addDirectory(fullPath, relativePath)
            }
          } else {
            const fileContent = readFileSync(fullPath)
            archive.append(fileContent, { name: relativePath })
          }
        }
      } catch (err) {
        console.warn(`Error reading ${dirPath}:`, err)
      }
    }

    addDirectory(extensionPath)
    archive.finalize()
  })
}
