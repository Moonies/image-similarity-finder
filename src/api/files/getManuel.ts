import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const folderPath = path.join(process.cwd(), 'folderName')
  try {
    const files = fs.readdirSync(folderPath)
    res.status(200).json({ files })
  } catch (error) {
    console.error('Error reading folder:', error)
    res.status(500).json({ error: 'Unable to read folder' })
  }
}
