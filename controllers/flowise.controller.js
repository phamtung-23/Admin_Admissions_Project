import fs from 'fs';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";



export const handleChatAI = async (req, res, next) => {
  
  try {
    const { question } = req.body;
    const flowiseData = {
      question: question
    }

    const response = await fetch(
      "http://localhost:3000/api/v1/prediction/81a941b7-094c-46fc-bf97-10c186d14fe9",
      {
          headers: {
              Authorization: "Bearer KHXSfRmYG8JI+uNhl8CCsdUhG51RejXpveEatmLu64E=",
              "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(flowiseData)
      }
    );
    const result = await response.json();
    // console.log(result)

    return res.status(200).json({message: result.text})
  } catch (error) {
    console.log(error)
    return res.status(200).json({message: error.message})
  }
}

export const handleChatPDF = async (req, res, next) => {
  
  try {
    const { question } = req.body;
    const data = {
      question: question
    }
    // let formData = new FormData();
    // formData.append("files", req.files[0])
    // formData.append("question", question)
    console.log(req.files[0])
    const response = await fetch(
      "http://localhost:3000/api/v1/prediction/47ffa23d-89f8-4179-8e05-c334e633e685",
      {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      }
  );
  const result = await response.json();
  console.log(result)

    // return res.status(200).json({message: result.text})
  } catch (error) {
    console.log(error)
    return res.status(200).json({message: error.message})
  }
}


export const handleChatPDFWithPinecone =  async (req, res, next) => {
  try {
    const { prompt } = req.body
    // use FormData to upload files
    async function query(data) {
      const response = await fetch(
          "http://localhost:3000/api/v1/prediction/47ffa23d-89f8-4179-8e05-c334e633e685",
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(data)
          }
      );
      const result = await response.json();
      return result;
  }
  
  query({"question": prompt}).then((response) => {
    res.status(200).json({message: response})
  });
  

  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

