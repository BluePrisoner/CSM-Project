const express = require('express');
const app = express();
const pool = require('./db/dbConnect.js');

const port = 8080;

app.use(express.static('./public'));

app.get('/',(req,res) => {
    res.status(200).send("Home Page");
});

app.get('/about', (req,res) => {
    res.status(200).send("About");
});

app.all('*', (req,res)=>{
    res.status(404).send('404 Not Found');
})

app.listen(port, () => {
    console.log(`listening to port ${port} .....`);
});

