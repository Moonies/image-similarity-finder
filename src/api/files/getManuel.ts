import fs from 'fs'
import path from 'path'

export default async function handler(): Promise<{ result: any }> {
  // Path to the mounted folder in the container
  const folderPath = path.join(process.cwd(), 'manual')

  try {
    // Read the contents of the folder
    const files = fs.readdirSync(folderPath)

    // Respond with the list of files
    return { result: files }
  } catch (error) {
    console.error('Error reading folder:', error)

    // Respond with an error message
    return { result: undefined }
  }
}
