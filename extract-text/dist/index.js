"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const formidable = __importStar(require("formidable"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.post('/extract', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error('Form parse error:', err);
            return res.status(500).json({ error: 'File parsing failed' });
        }
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file) {
            console.error('No file received.');
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        const filepath = file.filepath;
        console.log('📄 Received file:', file.originalFilename || file.newFilename);
        try {
            const dataBuffer = yield fs_1.default.promises.readFile(filepath);
            const pdfData = yield (0, pdf_parse_1.default)(dataBuffer);
            res.json({ text: pdfData.text });
        }
        catch (error) {
            console.error('❌ PDF read error:', error);
            res.status(500).json({ error: 'Failed to read PDF' });
        }
        finally {
            if (filepath) {
                fs_1.default.unlink(filepath, unlinkErr => {
                    if (unlinkErr)
                        console.error('Error deleting temp file:', unlinkErr);
                    else
                        console.log(`🗑️ Deleted temporary file: ${filepath}`);
                });
            }
        }
    }));
});
app.listen(4000, () => {
    console.log('✅ Microservice running on http://localhost:4000');
});
