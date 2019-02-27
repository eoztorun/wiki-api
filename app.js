const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("article", articleSchema);

//Requests targeting all articles
app.route("/articles") 
    .get(function(req, res) {
        Article.find({}, function(err, foundArticles) {
            if(!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content    
        });
    
        newArticle.save(function(err) {
            if(!err) {
                res.send("Successfully added new document.");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function(req, res) {
        Article.deleteMany({}, function(err) {
            if(!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

//Requests targeting a specific article
app.route("/articles/:articleName")
    .get(function(req, res) {
        var articleName = req.params.articleName;
        Article.findOne({title: articleName}, function(err, foundArticle) {
            if(!err) {
                res.send(foundArticle);
            } else {
                res.send(err);
            }
        });
    })

    .put(function(req, res) {
        var articleName = req.params.articleName;
        Article.replaceOne(
            { title: articleName },
            { title: req.body.title, content: req.body.content },
            function(err) {
                if(!err) {
                    res.send("Successfully updated the document.");
                } else {
                    res.send(err);
                }
            }
        );
    })

    .patch(function(req, res) {
        Article.updateOne(  { title: req.params.articleName }, 
                            { $set: req.body },
                            function(err) {
                                if(!err) {
                                    res.send("Successfully updated the article.");
                                } else {
                                    res.send(err);
                                }
                            });
    })

    .delete(function(req, res) {
        Article.deleteOne({title: req.params.articleName}, function(err) {
            if(!err) {
                res.send("Successfully deleted the article.");
            } else {
                res.send(err);
            }
        });
    });

app.listen(3000, function() {
    console.log("Server is listening on port 3000.")
});