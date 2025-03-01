const express = require('express');
const app = express();
const pool = require('./db/dbConnect.js');
const authRouter = require('./routes/auth.js')
const path = require('path');



app.use(express.static('./public'));
app.use('/', authRouter);


app.get('/', (req, res) => {
    res.status(200).send("Home Page");
});

app.get('/about', (req, res) => {
    res.status(200).send("About");
});



app.all('*', (req, res) => {
    res.status(404).send('404 Not Found');
})


const start = async () => {
    try {
        app.listen(process.env.PORT, () => {
    console.log(`listening to port ${process.env.PORT} .....`);
});
    } catch (error) {
        console.log('Error connecting to Port', error);
    }
}

start();


