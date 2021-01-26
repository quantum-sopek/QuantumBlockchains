import express from 'express';
import bodyParser from 'body-parser';

import { sendTransaction } from './api';
import { getAllPeersHashes } from './utils';

const jsonParser = bodyParser.json();

const app = express();
const port = 3015;

app.post('/send-transaction', jsonParser, async (req, res) => {
  try {
    const body = req.body;
    const peerHashes = getAllPeersHashes();
    await Promise.all(peerHashes.map(peerHash => sendTransaction(peerHash, body)));
    res.send({
      message: 'Transactions sent',
    });
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
});

app.listen(port, () => {
  console.log(`Client listening at http://localhost:${port}`);
});
