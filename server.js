


let express = require('express');
let path = require('path');
let app = express();

//Set content directories
app.use('/js', express.static(path.resolve(__dirname, './dist/js')))
app.use('/css', express.static(path.resolve(__dirname, './dist/css')))
app.use('/images', express.static(path.resolve(__dirname, './dist/images')))
app.use('/sets', express.static(path.resolve(__dirname, './dist/sets')))

app.get('/', function(request, response) {
  response.sendFile(path.resolve(__dirname,'./dist/index.html'));
});

module.exports = app;


