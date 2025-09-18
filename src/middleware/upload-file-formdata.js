import {parse} from 'csv-parse/sync';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

export const uploadExcelFile = () => {
  return async (req, res, next) => {
    const form = formidable({maxFiles: 1, keepExtensions: true});

    form.parse(req, async (err, fields, files) => {
      if (err) return next(err);

      const excelFile = files.file?.[0];
      if (!excelFile) {
        return res.status(400).json({error: 'No file uploaded'});
      }

      try {
        // 1. Read Excel as buffer
        const fileBuffer = await fs.readFileSync(excelFile.filepath);

        // 2. Parse workbook
        const workbook = await XLSX.read(fileBuffer, {type: 'buffer'});

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // 3. Convert sheet to CSV
        const csvData = await XLSX.utils.sheet_to_csv(sheet);
        const records = parse(csvData, {
          columns: true, // Set to true to get objects with column headers as keys
          skip_empty_lines: true,
          from_line: 5
        });
        // 4. (Optional) Save CSV file
        const csvFileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.csv`;
        const csvFilePath = path.join('uploads', csvFileName); // Make sure 'uploads/' exists
        fs.writeFileSync(csvFilePath, csvData);

        // 5. Attach CSV data or path to request
        req.body.students = records;

        next();
      } catch (error) {
        console.error('Excel to CSV conversion error:', error);
        return res.status(500).json({error: 'Failed to convert Excel to CSV'});
      }
    });
  };
};

