// Vercel Serverless Function — /api/config
// Returns the Google Gemini API key from Vercel Environment Variables
// Add GOOGLE_API_KEY in Vercel Dashboard → Project → Settings → Environment Variables

export default function handler(req, res) {
  // Allow CORS for the portfolio frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey =
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    '';

  return res.status(200).json({ apiKey });
}
