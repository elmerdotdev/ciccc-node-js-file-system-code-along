"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const functions_1 = require("./lib/functions");
const directory = "docs";
const server = http_1.default.createServer((req, res) => {
    // Allow all clients to access server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // Pre-flight check
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }
    // Parse url
    const parsedUrl = url_1.default.parse(req.url || '', true);
    const fileName = parsedUrl.query.filename;
    const parsedPath = parsedUrl.pathname;
    // Home route
    if (parsedPath === "/") {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("Welcome to my server!");
        return;
    }
    // List files
    if (parsedPath === "/list" && req.method === "GET") {
        (0, functions_1.listFiles)().then(files => {
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(files));
        }).catch(err => {
            console.error(err);
        });
        return;
    }
    // Read file
    if (parsedPath === "/read" && fileName && req.method === "GET") {
        (0, functions_1.readAFile)(fileName).then(data => {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(data));
        }).catch(err => {
            console.error(err);
        });
        return;
    }
    // Delete file
    if (parsedPath === "/delete" && fileName && req.method === "DELETE") {
        (0, functions_1.deleteAFile)(fileName).then(file => {
            res.writeHead(200, { "content-type": "text/plain" });
            res.end(`${file} was deleted successfully...`);
        }).catch(err => {
            console.error(err);
        });
        return;
    }
    // Create file
    if (req.url === "/create") {
        const fileName = "newfile.txt";
        const filePath = path_1.default.join(directory, fileName);
        const fileContent = "Hello world! I am a new file.";
        fs_1.default.writeFile(filePath, fileContent, 'utf8', (err) => {
            if (err) {
                console.error(`Error found: ${err}`);
                res.writeHead(500, { "content-type": "text/plain" });
                res.end("Error found");
                return;
            }
            res.writeHead(201, { "content-type": "text/plain" });
            res.end(`${fileName} was created successfully...`);
        });
        return;
    }
    // Append file
    if (req.url === "/update") {
        const fileName = "update.txt";
        const filePath = path_1.default.join(directory, fileName);
        const fileContent = "\r\nI AM NEW CONTENT!";
        fs_1.default.appendFile(filePath, fileContent, 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { "content-type": "text/plain" });
                res.end("Server error");
                return;
            }
            res.writeHead(201, { "content-type": "text/plain" });
            res.end(`${fileName} was updated successfully...`);
        });
        return;
    }
    // 404 Fallback if route isn't available
    res.writeHead(404, { "content-type": "text/html" });
    res.end("<h1>Page not found! :(</h1>");
});
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
