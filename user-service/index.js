// user-service/index.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]);
});

app.listen(port, () => {
  console.log(`User service running on port ${port}`);
});
