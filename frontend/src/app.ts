const filesList = document.querySelector('.files-list') as HTMLUListElement
const fileContent = document.querySelector('.file-content') as HTMLDivElement
const fileForm = document.querySelector('#file-form') as HTMLFormElement
const fileNameInput = document.querySelector('#filename') as HTMLInputElement
const fileContentInput = document.querySelector('#content') as HTMLTextAreaElement

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

// Save file
const saveFile = async (filename: string, fileContent: string): Promise<void> => {
  await fetch(`${BACKEND_URL}/add`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, fileContent })
  })
  buildList()
}

// Delete file
const deleteFile = async (filename: string): Promise<void> => {
  const res = await fetch(`${BACKEND_URL}/delete?filename=${filename}`, {
    method: "DELETE"
  })
  const data = await res.json()
  console.log(`Deleted file ${data}`)
  buildList()
}

// Submit form
fileForm.addEventListener('submit', async (e: Event) => {
  e.preventDefault()
  await saveFile(fileNameInput.value, fileContentInput.value)
})

// Build list
const buildList = async (): Promise<void> => {
  filesList.innerHTML = ''
  const files = await getFiles()

  files.forEach(file => {
    const li = document.createElement('li')
    li.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'list-group-item')
    li.textContent = file
    li.addEventListener('click', () => readFile(file))

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add("btn", "btn-danger")
    deleteBtn.textContent = "Delete"
    deleteBtn.addEventListener('click', () => deleteFile(file))
    
    li.appendChild(deleteBtn)
    filesList.appendChild(li)
  })
}

// Initialize
buildList()