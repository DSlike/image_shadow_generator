const express = require('express');
const app = express();

app.listen(3000, ()=>{
  console.log('App started on localhost:3000');
})

app.get('/', (req, res)=>{
  res.sendFile(__dirname+'/index.html');
})

app.get('/*', (req, res)=>{
  res.sendFile(__dirname+'/'+req.params[0]);
})
