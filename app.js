const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//To handle initial connection errors, you should use .catch()
mongoose.connect("mongodb://localhost:27017/wikiDB").catch(error => handleError(error));

//To handle errors after initial connection was established, you should listen for error events on the connection.
mongoose.connection.on('error', err => {
  logError(err);
});

const articleSchema = {
  title: String,
  content: String
};
// create a model
const Article = mongoose.model("Article", articleSchema)

///////////////// Request Targetting All Articles ////////////////

// app.route("/articles").get().post().delete();
app.route("/articles")
//Create a get request
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);

    }else {
      res.send(err);
    }
    // console.log(foundArticles);
  });
}) // app.get end without ; beacause of the route

//Create a post request
.post(function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content:req.body.content
  })
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    }else {
      res.send(err);
    }
  });

})//app.post

//delete request
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles.");
    } else{
      res.send(err);
    }
  });

})// delete request


///////////////// Request Targetting a Specific Article ////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle){
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

//wiped the preview article and replace with an other
.put(function(req,res){
    console.log("req.params.articleTitle" + req.params.articleTitle);
    console.log("req.body.title" + req.body.title);

  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},

    function(err){
      if (!err){
      res.send("Successfully updated articles.");
    }else{
      res.send("No match found!");
    }

    }
  );
  }

)
//wiped a specific content of preview article and replace with an other

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully update article.");
      }else{
        res.send(err);

      }
    }
  );
}) // end patch

.delete(function(req, res){
Article.deleteOne(
  {title:req.params.articleTitle},
  function(err){
    if(!err){
      res.send("Successfully deleted the corresponding article.");
    }else{
      res.send(err);
    }
  }

);
});// end of delete and the route


app.listen(3000, function(){
  console.log("Server started on port 3000");
});
