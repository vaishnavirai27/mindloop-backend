import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import geminiResponse from "../utils/gemini.js";

// Create a new test thread
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadID: "XYZ", // Make sure it's unique or handle conflict
      title: "testing new thread",
    });
    const response = await thread.save();
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

// Get all threads (most recently updated first)
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// Get messages from a specific thread
router.get("/thread/:threadID", async (req, res) => {
  const { threadID } = req.params;
  try {
    const thread = await Thread.findOne({ threadID }); // 🔧 FIXED: was `findOne` undefined
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Delete a thread
router.delete("/thread/:threadID", async (req, res) => {
  const { threadID } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadID });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" }); // 🔧 FIXED: was `res.send(200).json`
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadID, message } = req.body;

  if (!threadID || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadID });

    if (!thread) {
      thread = new Thread({
        threadID,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // ✅ Await Gemini response
    const assistantReply = await geminiResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    const savedThread = await thread.save();

    // ✅ Send only one response
    res.status(200).json({
      reply: assistantReply,
      messages: savedThread.messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
