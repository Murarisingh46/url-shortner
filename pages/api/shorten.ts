import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://murariiisingh46:yT0vYAbQY9HSwytH@cluster0.mnv4r8g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

function generateRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    await client.connect();
    const db = client.db('urlshortener');
    const collection = db.collection('urls');

    // Generate a unique short code
    let shortCode = '';
    let exists = true;
    while (exists) {
      shortCode = generateRandomString(6);
      exists = Boolean(await collection.findOne({ shortCode }));
    }

    // Save to DB
    await collection.insertOne({ url, shortCode });

    res.status(200).json({ shortUrl: `https://your-domain.vercel.app/${shortCode}` });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
} 