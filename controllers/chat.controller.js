

import { OpenAI } from "langchain/llms/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { OpenAIEmbeddings } from "@langchain/openai";

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs'
import { PDFDocument } from  "pdf-lib"
import Messages from '../models/Messages.js';
import MessagesPdf from "../models/MessagesPdf.js";

import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config()


export async function mergePDFs(inputFolder, outputPath) {
  const mergedPdf = await PDFDocument.create();

  const files = fs.readdirSync(inputFolder);
  for (const file of files) {
      if (file.toLowerCase().endsWith('.pdf') && file != 'all.pdf') {
          const filePath = path.join(inputFolder, file);
          const pdfBytes = fs.readFileSync(filePath);
          const pdfDoc = await PDFDocument.load(pdfBytes);

          const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
          copiedPages.forEach((page) => {
              mergedPdf.addPage(page);
          });
      }
  }

  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, mergedPdfBytes);
}


export const inject_docs = async(req, res, next) => {
  try {
    const { filename } = req.body

    if (filename == 'all.pdf'){
      const inputFolder = 'outputPDF'; // Folder containing input PDF files
      const outputPath = 'outputPDF/all.pdf'; // Path to output merged PDF file
  
      await mergePDFs(inputFolder, outputPath)
            .then(() => console.log('PDFs merged successfully!'))
            .catch((error) => console.error('Error merging PDFs:', error));
    }

    const loader = new PDFLoader(`outputPDF/${filename}`); //you can change this to any PDF file of your choice.
    const docs = await loader.load();
    // console.log('docs loaded')
    
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 400,
    })

    const docOutput = await textSplitter.splitDocuments(docs)
    let vectorStore = await FaissStore.fromDocuments(
      docOutput,
      new OpenAIEmbeddings(),
    )
      // console.log('saving...')

    const directory = path.join(__dirname, '../vectorStore');
    await vectorStore.save(directory);
    // console.log('saved!')

    return res.status(200).json({ message: 'Inject pdf successful' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  

}



export const chatPdfOpenAi = async (req, res, next) => {
  try {
    const { prompt } = req.body
    // inject_docs()
    const llmA = new OpenAI({ modelName: "gpt-3.5-turbo"});
    const chainA = loadQAStuffChain(llmA);
    const directory = path.join(__dirname, '../vectorStore') //saved directory in .env file
    
    const loadedVectorStore = await FaissStore.load(
      directory,
      new OpenAIEmbeddings()
      );
      
      const question = prompt; //question goes here. 
      const result = await loadedVectorStore.similaritySearch(question, 1);
      const resA = await chainA.call({
        input_documents: result,
        question,
      });
      // console.log({ resA });
      let data = {
        role: 'assistant',
        content: resA.text
      }
      res.status(200).json({ data }); // Send the response as JSON
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
  }
}

export const deleteChat = async (req, res, next) => {
  try {
    const {type} = req.body
    if (type == 'gpt'){
      const chat = await Messages.findOne({userId: req.params.userId})
      await chat.deleteOne()
      res.status(200).json({ message: "Delete chat successful!" })
    }else{
      const chat = await MessagesPdf.findOne({userId: req.params.userId, type})
      await chat.deleteOne()
      res.status(200).json({ message: "Delete chat successful!" })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const inject_Pinecone = async(req, res, next) => {
  try {
    const { filename } = req.body
    const pinecone = new Pinecone();
 
    const pineconeIndex = pinecone.Index('indexchatpdf');

    if (filename == 'all.pdf'){
      const inputFolder = 'outputPDF'; // Folder containing input PDF files
      const outputPath = 'outputPDF/all.pdf'; // Path to output merged PDF file
  
      await mergePDFs(inputFolder, outputPath)
            .then(() => console.log('PDFs merged successfully!'))
            .catch((error) => console.error('Error merging PDFs:', error));
    }

    const loader = new PDFLoader(`outputPDF/${filename}`); //you can change this to any PDF file of your choice.
    const docs = await loader.load();
    // console.log('docs loaded')

    await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
      pineconeIndex,
      maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    });

    return res.status(200).json({ message: 'Inject pdf successful' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

}

export const chatPdfOpenAiPineCone = async (req, res, next) => {
  try {
    const { prompt } = req.body
    // inject_docs()
    const llmA = new OpenAI({ modelName: "gpt-3.5-turbo"});
    const chainA = loadQAStuffChain(llmA);
    // const directory = path.join(__dirname, '../vectorStore') //saved directory in .env file/\
    
    // const loadedVectorStore = await FaissStore.load(
    //   directory,
    //   new OpenAIEmbeddings()
    //   );
    const pinecone = new Pinecone();

    const pineconeIndex = pinecone.Index("indexchatpdf");

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex }
    );
      
      const question = prompt; //question goes here. 
      const result = await vectorStore.similaritySearch(question, 1);
      const resA = await chainA.call({
        input_documents: result,
        question,
      });
      // console.log({ resA });
      let data = {
        role: 'assistant',
        content: resA.text
      }
      console.log(data)
      res.status(200).json({ data }); // Send the response as JSON
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
  }
}


