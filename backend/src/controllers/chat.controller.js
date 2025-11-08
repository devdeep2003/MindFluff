import { generateToken } from "../lib/stream.js"

export const getChatToken = async (req, res) => {
  try {
    const token = await generateToken(req.user.id);
    return res.json({ token });
  } catch (error) {
    console.error("❌ Error generating Stream token:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
