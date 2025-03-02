const express = require('express');
const app = express();
const pool = require('./db/dbConnect.js');
const authRouter = require('./routes/auth.js')
const homeRouter = require('./routes/home.js')
const path = require('path');
require('express-async-errors');


app.set("views", path.join(__dirname, "views")); //use will using ejs files..

app.set('view engine','ejs'); //use will using ejs files..



app.use(express.static('./public'));
app.use('/', authRouter);


app.use('/', homeRouter);

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


