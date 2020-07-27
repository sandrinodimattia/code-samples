const express = require('express');
const layouts = require('express-ejs-layouts');

const app = express();
app.set('view engine', 'ejs');
app.use(layouts);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/protected', (req, res) => {
  res.render('protected', {
    user: req.user,
    headers: req.headers
  });
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Express listening on http://localhost:${port}`);
});
