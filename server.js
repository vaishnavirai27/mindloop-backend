import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with db");
  } catch (err) {
    console.log("failed to connect with db", err);
  }
};
// app.post("/test", async (req, res) => {
//   const userMessage = req.body.message || "Hello!"; // optional dynamic message

//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [{ text: userMessage }],
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       options
//     );

//     const data = await response.json();

//     const reply =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

//     console.log("Gemini:", reply);
//     res.send({ reply });
//   } catch (err) {
//     console.error("Error from Gemini:", err);
//     res.status(500).send({ error: "Something went wrong." });
//   }
// });
