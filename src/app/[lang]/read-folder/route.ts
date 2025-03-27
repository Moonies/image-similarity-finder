import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  const uploadFolder = '/app/manual'

  try {
    const files = fs.readdirSync(uploadFolder).map(file => {
      const stats = fs.statSync(path.join(uploadFolder, file))
      return {
        name: file,
        size: stats.size,
        createdAt: stats.birthtime,
      }
    })

    res.status(200).json({ files })
  } catch (error) {
    console.error('Error reading uploads folder:', error)
    res.status(500).json({ error: 'Unable to read uploads folder' })
  }
}
