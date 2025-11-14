import { NextRequest, NextResponse } from 'next/server'
import { existsSync, readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'
import archiver from 'archiver'

export async function GET(request: NextRequest) {
  try {
    const extensionPath = join(process.cwd(), 'extension')
    
    // Check if extension directory exists
    if (!existsSync(extensionPath)) {
      console.error('Extension directory not found at:', extensionPath)
      return NextResponse.json(
        { error: 'Extension directory not found', path: extensionPath },
        { status: 404 }
      )
    }

    // Create a stream for the ZIP file
    const chunks: Buffer[] = []
    
    return new Promise<NextResponse>((resolve, reject) => {
      const archive = archiver('zip', {
        zlib: { level: 9 }
      })

      archive.on('error', (err) => {
        console.error('Archive error:', err)
        reject(err)
      })

      archive.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

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

      // Function to recursively add files
      function addDirectory(dirPath: string, basePath: string = '') {
        try {
          const items = readdirSync(dirPath)
          
          for (const item of items) {
            const fullPath = join(dirPath, item)
            const relativePath = basePath ? `${basePath}/${item}` : item
            
            try {
              const stat = statSync(fullPath)
              
              if (stat.isDirectory()) {
                // Skip unnecessary folders
                if (item !== 'node_modules' && !item.startsWith('.') && item !== 'dist') {
                  addDirectory(fullPath, relativePath)
                }
              } else {
                // Add file to archive
                try {
                  const fileContent = readFileSync(fullPath)
                  archive.append(fileContent, { name: relativePath })
                } catch (fileErr) {
                  console.warn(`Failed to read file ${fullPath}:`, fileErr)
                }
              }
            } catch (err) {
              console.warn(`Skipping ${fullPath}:`, err)
            }
          }
        } catch (err) {
          console.error(`Error reading directory ${dirPath}:`, err)
        }
      }

      // Add all files from extension directory
      addDirectory(extensionPath)

      // Finalize the archive
      archive.finalize()
    })
  } catch (error: any) {
    console.error('Extension download error:', error)
    
    // Fallback response
    return NextResponse.json(
      { 
        error: 'Failed to create extension ZIP',
        message: 'Please try downloading from GitHub',
        githubUrl: 'https://github.com/higanste/YuriAI/tree/main/extension'
      },
      { status: 500 }
    )
  }
}
