import express from 'express';
import XLSX from 'xlsx';
const router = express.Router();
import { ensureAdmin } from '../common/authGuard';

import { createTable, fetchTableData } from '../models/upload';

router.get('/', ensureAdmin, (req, res) => {

  res.render('admin/index', {title: 'Admin'});
});

router.post('/upload', (req, res) => {

  if(req.files == undefined || req.files == null || req.files.length == 0) {

    res.render('admin/index', { errors: [{msg: 'Please select file to upload'}], title: 'Admin' });

  } else {

    let file = req.files[0];

    let originalname = file.originalname;
    let filename = file.filename;
    let mimetype = file.mimetype;
    let path = file.path;
    let size = file.size;

    const workbook = XLSX.readFile(path);

    const sheet = workbook.Sheets.MAIN;

    if(sheet == undefined || sheet == null) {
      res.render('admin/index', { errors: [{msg: 'This file is not correct. Please try again.'}], title: 'Admin' });
    } else {
      const rows = XLSX.utils.sheet_to_json(sheet);

      createTable(rows, () => {
        res.render('admin/index', { errors: [{msg: 'Successfully Uploaded.'}] });
      });
    }

  }



});

router.get('/viewtable', ensureAdmin, (req, res) => {

  fetchTableData((result) => {
    result.shift();
    res.render('admin/viewtable', { title: 'Admin', tabledata: result });
  });

});

export default router;
