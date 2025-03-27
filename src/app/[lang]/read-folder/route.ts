import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: Request, { params }: { params: { lang: string } }) {
  const { lang } = params // Get the dynamic `lang` from the URL
  const folderPath = path.join(process.cwd(), 'manual', lang) // Adjust path based on `lang`

  let files: string[] = []

  try {
    files = fs.readdirSync(folderPath) // Read files in the directory
  } catch (error) {
    console.error('Error reading folder:', error)
  }

  return NextResponse.json({ files })
}
