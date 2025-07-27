import React, { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShortUrl('');
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setShortUrl(data.shortUrl);
      }
    } catch (err) {
      setError('Network error');
    }
    setIsLoading(false);
  };

  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-blue-600">URL Shortener</h1>
        </div>
      </header>
      <main className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Shorten your URL</h2>
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Paste your long URL here"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? 'Shortening...' : 'Shorten URL'}
              </button>
            </div>
            {error && <p className="mt-2 text-red-600">{error}</p>}
          </form>
          {shortUrl && (
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-2">Your shortened URL:</h3>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 bg-white border border-gray-300 rounded-md px-4 py-3 break-all">
                  {shortUrl}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors w-full md:w-auto"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 font-bold text-xl mb-2">1</div>
              <h3 className="font-medium mb-2">Paste your URL</h3>
              <p className="text-gray-600">Enter the long URL you want to shorten</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 font-bold text-xl mb-2">2</div>
              <h3 className="font-medium mb-2">Get shortened URL</h3>
              <p className="text-gray-600">Click the button and get your easy-to-share link</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 font-bold text-xl mb-2">3</div>
              <h3 className="font-medium mb-2">Share anywhere</h3>
              <p className="text-gray-600">Use your short link in messages, posts, or emails</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500">
          URL Shortener Demo - Built with Next.js
        </div>
      </footer>
    </div>
  );
} 