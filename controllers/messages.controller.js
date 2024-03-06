import Messages from '../models/Messages.js';

export const handleSaveMessage = async (req, res, next) => {
  try {
    const { userId, messages } = req.body;
    const userChat = await  Messages.findOne({ userId: userId });
    if (userChat) {
      await userChat.messages.push(messages);
      await userChat.save()
    }else{
      const newMess = new Messages({
        userId,
        messages
      });
      await newMess.save(); 
    }
    res.status(200).json({message: 'save okok'}); 
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}
export const handleGetMessageById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userChat = await  Messages.findOne({ userId: userId });
    if (userChat) {
      return  res.status(200).json({messages: userChat.messages})
    }else{
      return  res.status(200).json({messages: []})
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}


