const fs = require('fs');
const express = require('express');

const app = express();
const port = 8080;

app.use(express.static('dist'));

app.get('/*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(fs.readFileSync('./dist/index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
