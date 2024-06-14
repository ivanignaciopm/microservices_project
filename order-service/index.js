// order-service/index.js
const express = require('express');
const app = express();
const port = 3002;

app.get('/orders', (req, res) => {
  res.json([{ id: 1, user: 1, product: 1 }, { id: 2, user: 2, product: 2 }]);
});

app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});
