import fs from 'fs'

import express from 'express'
import cors from 'cors'
import * as formidable from 'formidable'
import pdfParse from 'pdf-parse'

const app = express()

app.use(cors())

app.post('/extract', (req, res) => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      console.error('Form parse error:', err)

      return res.status(500).json({ error: 'File parsing failed' })
    }

    const file = Array.isArray(files.file) ? (files.file[0] as formidable.File) : (files.file as formidable.File)

    if (!file) {
      console.error('No file received.')

      return res.status(400).json({ error: 'No file uploaded.' })
    }

    const filepath = file.filepath

    console.log('📄 Received file:', file.originalFilename || file.newFilename)

    try {
      const dataBuffer = await fs.promises.readFile(filepath)

      const pdfData = await pdfParse(dataBuffer)

      res.json({ text: pdfData.text })
    } catch (error) {
      console.error('❌ PDF read error:', error)

      res.status(500).json({ error: 'Failed to read PDF' })
    } finally {
      if (filepath) {
        fs.unlink(filepath, unlinkErr => {
          if (unlinkErr) console.error('Error deleting temp file:', unlinkErr)
          else console.log(`🗑️ Deleted temporary file: ${filepath}`)
        })
      }
    }
  })
})

app.listen(4000, () => {
  console.log('✅ Microservice running on http://localhost:4000')
})
