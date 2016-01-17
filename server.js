var express = require('express'),
    path = require('path'),
    http = require('http'),
    knits = require('./routers/knits');
 
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});
 
app.get('/knits', knits.findAll);
app.get('/knits/:id', knits.findById);
app.post('/knits', knits.addKnit);
app.put('/knits/:id', knits.updateKnit);
app.delete('/knits/:id', knits.deleteKnit); 

app.listen(8080);
console.log('Listening on port 8080...');
