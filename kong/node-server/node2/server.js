const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  console.log(req.headers.host);
  res.send('Hello World! index2')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})