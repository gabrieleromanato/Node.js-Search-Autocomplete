'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const path = require('path');
const favicon = require('serve-favicon');
const app = express();

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/users');

const Users = require('./models/Users');

app.disable('x-powered-by');

app.engine('.hbs', exphbs({extname: '.hbs'}));

app.set('view engine', '.hbs');
app.set('env', 'development');


app.use(favicon(path.join(__dirname, 'favicon.png')));
app.use('/public', express.static(path.join(__dirname, '/public'), {
  maxAge: 0,
  dotfiles: 'ignore',
  etag: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
   Users.find().limit(6).then(usrs => {
    res.render('index', {
      pageTitle: 'Node Search',
      users: usrs
    });
  }).catch(err => {
      res.sendStatus(404);
  });

});

app.post('/search', (req, res) => {
  let q = req.body.query;
  let query = {
    "$or": [{"name.first": {"$regex": q, "$options": "i"}}, {"name.last": {"$regex": q, "$options": "i"}}]
  };
  let output = [];

  Users.find(query).limit(6).then( usrs => {
      if(usrs && usrs.length && usrs.length > 0) {
          usrs.forEach(user => {
            let obj = {
                id: user.name.first + ' ' + user.name.last,
                label: user.name.first + ' ' + user.name.last
            };
            output.push(obj);
          });
      }
      res.json(output);
  }).catch(err => {
    res.sendStatus(404);
  });

});


if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
});

app.listen(port);
