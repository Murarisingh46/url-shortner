import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://murariiisingh46:yT0vYAbQY9HSwytH@cluster0.mnv4r8g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length-1; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Please provide a valid URL (must start with http:// or https://)' });
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
  
    // Use the provided domain for the short URL
    const baseUrl = 'https://url-shortner-theta-green.vercel.app';
    res.status(200).json({ shortUrl: `${baseUrl}/${shortCode}` });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
} 