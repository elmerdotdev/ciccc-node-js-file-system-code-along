"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const filesList = document.querySelector('.files-list');
const fileContent = document.querySelector('.file-content');
const fileForm = document.querySelector('#file-form');
const fileNameInput = document.querySelector('#filename');
const fileContentInput = document.querySelector('#content');
const BACKEND_URL = 'http://localhost:3000';
// Fetch files
const getFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`${BACKEND_URL}/list`);
    const data = yield res.json();
    return data;
});
// Read file
const readFile = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`${BACKEND_URL}/read?filename=${filename}`);
    const data = yield res.json();
    fileContent.textContent = data;
});
// Save file
const saveFile = (filename, fileContent) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(`${BACKEND_URL}/add`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, fileContent })
    });
    buildList();
});
// Delete file
const deleteFile = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(`${BACKEND_URL}/delete?filename=${filename}`, {
        method: "DELETE"
    });
    buildList();
});
// Submit form
fileForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    yield saveFile(fileNameInput.value, fileContentInput.value);
}));
// Build list
const buildList = () => __awaiter(void 0, void 0, void 0, function* () {
    filesList.innerHTML = '';
    fileContent.textContent = '';
    const files = yield getFiles();
    files.forEach(file => {
        const li = document.createElement('li');
        li.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'list-group-item');
        const span = document.createElement('span');
        span.textContent = file;
        span.addEventListener('click', () => readFile(file));
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add("btn", "btn-danger");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener('click', () => deleteFile(file));
        li.appendChild(span);
        li.appendChild(deleteBtn);
        filesList.appendChild(li);
    });
});
// Initialize
buildList();
