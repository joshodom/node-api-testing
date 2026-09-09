const express = require('express');
const app = express();
const PORT = 3030;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Welcome to the Express server:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});