const express = require('express');
const cors = require('cors');
const formidable = require('formidable');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors());

app.post('/extract', (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'File parsing failed' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    const filepath = file.filepath || file.path;

    console.log('📄 Received file:', file);

    try {
      const dataBuffer = await fs.promises.readFile(filepath); // ✅ async/await
      const pdfData = await pdfParse(dataBuffer);

      res.json({ text: pdfData.text });
    } catch (error) {
      console.error('❌ PDF read error:', error);
      res.status(500).json({ error: 'Failed to read PDF' });
    }
  });
});

app.listen(4000, () => {
  console.log('✅ Microservice running on http://localhost:4000');
});
