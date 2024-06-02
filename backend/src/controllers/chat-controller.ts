import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import User from "../models/User.js";
import { configOpenAI } from "../config/openai.js";
import { NextFunction } from "express";

export const generateChatCompletion = async (req, res, next) => {
  const { message } = req.body;
  console.log(message);

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res
        .status(401)
        .json({ message: "User not registered or Token malfunction" });
      //grap chat of User
    }
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    chats.push({ content: message || "Hello", role: "user" });
    user.chats.push({ content: message, role: "user" });

    //send all chat with new one to open ai API
    const config = configOpenAI();
    const openai = new OpenAIApi(config);
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chats,
    });
    const openaiMessage = chatResponse.data.choices[0].message;
    user.chats.push(openaiMessage);
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser = async (req, res, next) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    const chats = user.chats.map(({ role, content }) => ({ role, content }));
    return res.status(200).json({ message: "OK", chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (req, res, next) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
