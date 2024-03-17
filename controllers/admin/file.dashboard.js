import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import { convertFilename, convertTextSearch } from '../../utils/convertFileName.js';
import University from '../../models/University.js';
import {PythonShell} from  "python-shell";
import { mergePDFs } from '../chat.controller.js';



export const getHandleGetPdf = async (req, res, next) => {
  try {
    const allUniversity = await University.find()
    const user  = await User.findOne({_id: req.user.id})
    res.render('file/listLPdf', 
    {
      user: mongooseToObject(user),
      universities: mutipleMongooseTonObject(allUniversity),
      activeSideBar: 'file'
    });
  } catch (err) {
    next(err);
  }
}

export const getAddPdf = async (req, res, next) => {
  try {
    const allUniversity = await University.find()
    const user  = await User.findOne({_id: req.user.id})
    res.render('file/getFromGetFile', 
    {
      user: mongooseToObject(user),
      universities: mutipleMongooseTonObject(allUniversity),
      activeSideBar: 'file' 
    });
  } catch (err) {
    next(err);
  }
}

export const handleGetPdfForUniversity =  async (req, res, next) => {
  try {
    const { codeUniversity, linkHtml  } = req.body;
    if (codeUniversity == "0"){
      return res.status(404).json({message: "University not found!"});
    }
    if (!linkHtml){
      return res.status(404).json({message: "Link not found!"});
    }
    // Run Python script
    await PythonShell.run('convertHtmlToPdf/main.py', { args: [linkHtml, codeUniversity] }, function (err, results) {
      if (err) {
        return res.status(404).json({message: err.message});
      }
    });
    const updateUniversity = {
      infoAdmission: `${codeUniversity}.pdf`
    }

    await University.updateOne({code: codeUniversity}, updateUniversity)
    // Send response or do other processing
    return res.status(200).json({message: "PDF generation process started."});
  } catch (error) {
    next(error);
  }
}

export const handleFilePdf = async (req, res, next) => {
  try {
    const idUniversity = req.params.id
    await University.findByIdAndUpdate(idUniversity, {
      infoAdmission:''
    })
    return res.status(200).json({message: "Delete file successful!"});
  } catch (error) {
    next(error);
  }
}
export const downloadFilePdfAll = async (req, res, next) => {
  try {
    const inputFolder = 'outputPDF'; // Folder containing input PDF files
    const outputPath = 'outputPDF/all.pdf';
    await mergePDFs(inputFolder, outputPath)
    res.download('outputPDF/all.pdf')
  } catch (error) {
    next(error);
  }
}

