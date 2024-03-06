import MessagesPdf from "../models/MessagesPdf.js";



export const handleSaveMessagePdf = async (req, res, next) => {
  try {
    const { userId, type, messages } = req.body;
    const userChat = await  MessagesPdf.findOne({ userId: userId, type: type });
    if (userChat) {
      await userChat.messages.push(messages);
      await userChat.save()
    }else{
      if(!type || !userId || !messages){
        console.log('null')
      }else{
        const newMess = new MessagesPdf({
          userId,
          messages,
          type
        });
        await newMess.save(); 
      }
    }
    res.status(200).json({message: 'save okok'}); 
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}
export const handleGetMessagePdfById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const type = req.params.type;
    const userChat = await  MessagesPdf.findOne({ userId: userId, type: type });
    if (userChat) {
      return  res.status(200).json({messages: userChat.messages})
    }else{
      return  res.status(200).json({messages: []})
    }
  } catch (error) {
    return res.status(500).json({message: []});
  }
}


