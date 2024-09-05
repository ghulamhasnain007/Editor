import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    try {
      const { db } = await connectToDatabase();
      const result = await db.collection("blogs").insertOne({
        content,
        createdAt: new Date(),
      });
      res.status(200).json({ message: "Blog created successfully", blogId: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: "Error saving blog" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
