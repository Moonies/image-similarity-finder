import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const uploadFolder = path.join(process.cwd(), '/manual') // Adjust this to your folder path

  try {
    // Read all files in the folder
    const files = fs.readdirSync(uploadFolder)

    // Optionally, return file names or contents
    const fileContents = files
      .map(file => {
        const filePath = path.join(uploadFolder, file)
        const content = fs.readFileSync(filePath) // Read file content
        const base64Content = content.toString('base64')
        return { fileName: file, content: base64Content } // Return file name and content
      })
      .filter(file => file.fileName !== '.DS_Store')

    return NextResponse.json({ files: fileContents })
  } catch (error) {
    console.error('Error reading uploads folder:', error)
    return NextResponse.json({ error: 'Unable to read uploads folder' }, { status: 500 })
  }
}
