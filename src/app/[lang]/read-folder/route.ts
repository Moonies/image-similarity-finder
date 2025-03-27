import { NextResponse } from 'next/server'
import fs from 'fs'

export async function GET(req: Request, { params }: { params: { lang: string } }) {
  // Adjust path based on `lang`

  let files: string[] = []
  try {
    files = fs.readdirSync('/app/manual') // Read files in the directory
  } catch (error) {
    console.error('Error reading folder:', error)
  }

  return NextResponse.json({ files })
}
