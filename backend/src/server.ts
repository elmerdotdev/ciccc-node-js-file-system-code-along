import http from 'http'
import fs from 'fs'
import path from 'path'
import url from 'url'
import { listFiles, readAFile, deleteAFile, addAFile } from './lib/functions'

const directory = "docs"

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  // Allow all clients to access server
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Pre-flight check
  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  // Parse url
  const parsedUrl = url.parse(req.url || '', true)
  const fileName = parsedUrl.query.filename as string | undefined
  const parsedPath = parsedUrl.pathname

  // Home route
  if (parsedPath === "/") {
    res.writeHead(200, { "content-type": "text/plain" })
    res.end("Welcome to my server!")
    return
  }

  // List files
  if (parsedPath === "/list" && req.method === "GET") {
    listFiles().then(files => {
      res.writeHead(200, { "content-type": "application/json" })
      res.end(JSON.stringify(files))
    }).catch(err => {
      console.error(err)
    })
    return
  }

  // Read file
  if (parsedPath === "/read" && fileName && req.method === "GET") {
    readAFile(fileName).then(data => {
      res.writeHead(200, { 'content-type': 'application/json'})
      res.end(JSON.stringify(data))
    }).catch(err => {
      console.error(err)
    })
    return
  }

  // Delete file
  if (parsedPath === "/delete" && fileName && req.method === "DELETE") {
    deleteAFile(fileName).then(file => {
      res.writeHead(200, { "content-type": "application/json" })
      res.end(JSON.stringify(file))
    }).catch(err => {
      console.error(err)
    })
    return
  }
  
  // Add file
  if (parsedPath === "/add" && req.method === "POST") {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', async () => {
      const { filename, fileContent } = JSON.parse(body)
      const success = await addAFile(filename, fileContent)
      if (success) {
        res.writeHead(201, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ message: 'File was created successfully...' }))
      } else {
        res.writeHead(500, { 'Content-type': 'application/json'})
        res.end(JSON.stringify({ message: 'Server error. File not created...' }))
      }
      return
    })
    return
  }

  // Append file
  if (req.url === "/update") {
    const fileName = "update.txt"
    const filePath = path.join(directory, fileName)
    const fileContent = "\r\nI AM NEW CONTENT!"
    fs.appendFile(filePath, fileContent, 'utf8', (err) => {
      if (err) {
        console.error(err)
        res.writeHead(500, { "content-type": "text/plain" })
        res.end("Server error")
        return
      }
      res.writeHead(201, { "content-type": "text/plain" })
      res.end(`${fileName} was updated successfully...`)
    })
    return
  }

  // 404 Fallback if route isn't available
  res.writeHead(404, { "content-type": "text/html" })
  res.end("<h1>Page not found! :(</h1>")
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})