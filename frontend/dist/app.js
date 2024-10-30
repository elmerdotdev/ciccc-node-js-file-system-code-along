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
// Build list
const buildList = () => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield getFiles();
    files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file;
        li.addEventListener('click', () => readFile(file));
        filesList.appendChild(li);
    });
});
// Initialize
buildList();
