// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from "../../lib/mongodb";

export default async function handler(req, res) {
  await connectDB();
  res.status(200).json({ message: "MongoDB Connected Successfully (Local)!" });
}
