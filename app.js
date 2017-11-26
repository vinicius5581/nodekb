const express = require('express');
const path = require('path');

// Init App
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home Route
app.get('/', (req, res) => {
  const articles = [
    {
      id:1,
      title:'Article One',
      author:'Doe',
      body:'This is article one'
    },
    {
      id:2,
      title:'Article Two',
      author:'Santana',
      body:'This is article two'
    },
    {
      id:3,
      title:'Article Three',
      author:'Santana',
      body:'This is article trhee'
    }
  ]
  res.render('index', {
    title:'Articles',
    articles: articles
  });
});

// Add Route
app.get('/articles/add', function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
});

// Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});