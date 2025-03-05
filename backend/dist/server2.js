"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const url_1 = __importDefault(require("url"));
const path_1 = __importDefault(require("path"));
const PORT = 3500;
// const FILE_PATH = './docs/data.txt';
const FILE_PATH = path_1.default.join(__dirname, '../docs', 'data.txt');
const server = http_1.default.createServer((req, res) => {
    const parsedUrl = url_1.default.parse(req.url || '', true);
    const { pathname } = parsedUrl;
    if (pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Welcome to the File Manager API");
        return;
    }
    if (pathname === "/read") {
        fs_1.default.readFile(FILE_PATH, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error reading file");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(data || "File is empty");
        });
        return;
    }
    // Change: Use writeFile() in /add (creates or overwrites)
    if (pathname === "/add" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            fs_1.default.writeFile(FILE_PATH, body, err => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Error creating file");
                    return;
                }
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("File created successfully");
            });
        });
        return;
    }
    // Change: Use appendFile() in /update (appends to existing file)
    if (pathname === "/update" && req.method === "PATCH") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            fs_1.default.appendFile(FILE_PATH, body + "\r\n", err => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Error updating file");
                    return;
                }
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("File updated successfully");
            });
        });
        return;
    }
    if (pathname === "/delete" && req.method === "DELETE") {
        fs_1.default.unlink(FILE_PATH, err => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error deleting file or file does not exist");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("File deleted successfully");
        });
        return;
    }
    if (pathname === "/log") {
        fs_1.default.appendFile("./log.txt", `${new Date()}\r\n`, err => {
            if (err) {
                res.writeHead(500, { "content-type": "text/plain" });
                res.end("Something went wrong...");
                return;
            }
            res.writeHead(200, { "content-type": "text/plain" });
            res.end("Logged!");
        });
        return;
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route not found");
    return;
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
