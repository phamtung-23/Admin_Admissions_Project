import User from '../../models/User.js';
import { mongooseToObject } from '../../utils/mongooses.js';
import OpenAI from "openai";


const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


async function chatGPTStream(prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {"role": "user", "content": prompt}
    ],
    // stream: true,
  }
  );
  // let messArray = []
  // for await (const chunk of completion) {
  //   if(chunk.choices[0].finish_reason != 'stop'){
  //     messArray.push(chunk.choices[0].delta.content);
  //   }
  // }
  // return messArray
  return (completion.choices[0].message);
}


export const getChatBox = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    res.render('chat/formChat',{
      user: mongooseToObject(user),
      activeSideBar: 'chat'
    })
  } catch (error) {
    next();
  }
}

export const handleChatGPT = async (req, res, next) => {
  try {
    let { prompt } = req.body
    let result = await chatGPTStream(prompt)
    return  res.status(200).json({message:result})
  } catch (error) {
    next();
  }
}


