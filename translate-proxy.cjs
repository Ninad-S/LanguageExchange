const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
  try {
    const { q, source, target } = req.body;

    const response = await axios.post('https://translate.argosopentech.com/translate', {
      q,
      source,
      target,
      format: 'text'
    }, {
      headers: { 'accept': 'application/json' }
    });

    res.json(response.data);
  } catch (err) {
    console.error('Translation Proxy Error:', err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
