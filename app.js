const express = require('express');
const app = express();
const port = 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// localhost:3000

app.get('/', (req, res, next) => {
  res.send('Hello world')
})

