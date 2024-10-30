import fs from 'fs'
import path from 'path'

const directory = 'docs'
const docsDirectory = path.join(__dirname, '../../', directory)

// List files
export const listFiles = async (): Promise<string[] | undefined> => {
  try {
    const files = fs.promises.readdir(docsDirectory)
    return files
  } catch (err) {
    console.error(err)
    return undefined
  }
}

// Read a file
export const readAFile = async (filename: string): Promise<string | undefined> => {
  try {
    const filePath = path.join(docsDirectory, filename)
    const data = await fs.promises.readFile(filePath, 'utf8')
    return data
  } catch (err) {
    console.error(err)
    return undefined
  }
}

// Delete a file
export const deleteAFile = async (filename: string): Promise<string | undefined> => {
  try {
    const filePath = path.join(docsDirectory, filename)
    await fs.promises.unlink(filePath)
    return filename
  } catch (err) {
    console.error(err)
    return undefined
  }
}