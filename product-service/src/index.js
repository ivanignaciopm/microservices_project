// product-service/index.js
const express = require('express');
const app = express();
const port = 3001;

app.get('/products', (req, res) => {
  res.json([{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }]);
});

app.listen(port, () => {
  console.log(`Product service running on port ${port}`);
});
