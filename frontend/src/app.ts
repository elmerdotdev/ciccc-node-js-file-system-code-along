const filesList = document.querySelector('.files-list') as HTMLUListElement
const fileContent = document.querySelector('.file-content') as HTMLDivElement

const BACKEND_URL = 'http://localhost:3000'

// Fetch files
const getFiles = async (): Promise<string[]> => {
  const res = await fetch(`${BACKEND_URL}/list`)
  const data = await res.json()
  return data
}

// Read file
const readFile = async (filename: string): Promise<void> => {
  const res = await fetch(`${BACKEND_URL}/read?filename=${filename}`)
  const data = await res.json()
  fileContent.textContent = data
}

// Build list
const buildList = async (): Promise<void> => {
  const files = await getFiles()

  files.forEach(file => {
    const li = document.createElement('li')
    li.textContent = file
    li.addEventListener('click', () => readFile(file))
    filesList.appendChild(li)
  })
}

// Initialize
buildList()