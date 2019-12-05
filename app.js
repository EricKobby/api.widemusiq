const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

//setting up express-fileupload middleware
app.use(fileUpload({
    createParentPath: true
}));

//setting up cors middleware
app.use(cors());

//setting up body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//importing routes
const tracksRouter = require('./routes/tracks');

const port = process.env.PORT || 1455;

app.use(express.static('clientapp'));

app.get('/', (req, res) => {

    res.sendFile(__dirname + "/clientapp/index.html");
});

app.use('/api/tracks', tracksRouter);
app.listen(port, () => {
    console.log("Api Running on port ".concat(port));
});