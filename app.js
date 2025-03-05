const express = require('express');
const app = express();
const pool = require('./db/dbConnect.js');
const authRouter = require('./routes/auth.js')
const homeRouter = require('./routes/home.js')
const path = require('path');
const cookieParser = require('cookie-parser');
require('express-async-errors');


app.set("views", path.join(__dirname, "views")); //use while using ejs files..

app.set('view engine','ejs'); //use while using ejs files..

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(cookieParser()); // Use while using jwt tokens



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


