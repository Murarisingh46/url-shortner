import { GetServerSideProps } from 'next';
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://murariiisingh46:yT0vYAbQY9HSwytH@cluster0.mnv4r8g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { shortCode } = context.params!;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('urlshortener');
    const collection = db.collection('urls');
    const record = await collection.findOne({ shortCode });

    if (record && record.url) {
      // Redirect to the original URL
      return {
        redirect: {
          destination: record.url,
          permanent: false,
        },
      };
    } else {
      // Not found, show 404
      return { notFound: true };
    }
  } catch (err) {
    return { notFound: true };
  } finally {
    await client.close();
  }
};

export default function RedirectPage() {
  // This page will never be rendered because of the redirect or 404
  return null;
} 