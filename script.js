import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const app = express();
const port = 3000;

// Middleware
dotenv.config();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],  // Allowed methods
    credentials: true,         // If you need cookies/auth
};
app.use(cors(corsOptions));

// Root route
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/api/start-analysis', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  try {
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const n8nData = await n8nResponse.json();
    console.log('Req is working');
    res.status(200).json(n8nData);
  } catch (error) {
    console.error('Error triggering n8n workflow:', error);
    res.status(500).json({ error: 'Failed to start analysis workflow.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});