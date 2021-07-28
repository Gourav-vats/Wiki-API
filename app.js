const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { response } = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ----------------------------------------------------------

const mongoDb = "mongodb://localhost:27017/wikiDB";
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
   title: String,
   content: String,
});

const Article = mongoose.model("Article", articleSchema);

// ----------------------------------------------------------

app.route("/articles")
   .get((req, res) => {
      Article.find({}, (err, foundArticles) => {
         if (!err) {
            res.send(foundArticles);
         } else {
            res.send(err);
         }
      });
   })
   .post((req, res) => {
      const newArticle = new Article({
         title: req.body.title,
         content: req.body.content,
      });

      newArticle.save((err) => {
         if (err) {
            res.send(err);
         } else {
            res.send("Succesfully Added to the Database");
         }
      });
   })
   .delete((req, res) => {
      Article.deleteMany((err) => {
         if (!err) {
            res.send("Succesfully Deleted all articles");
         } else {
            res.send(err);
         }
      });
   });

// ----------------------------------------------------------

app.route("/articles/:name")
   .get((req, res) => {
      Article.findOne({ title: req.params.name }, (err, foundArticle) => {
         if (foundArticle) {
            res.send(foundArticle);
         } else {
            res.send("No Article Found!");
         }
      });
   })

   .put((req, res) => {
      Article.update(
         { title: req.params.name },
         { title: req.body.title, content: req.body.content },
         { overwrite: true },
         (err) => {
            if (!err) {
               res.send("Successfully Updated");
            } else {
               res.send(err);
            }
         }
      );
   })

   .patch((req, res) => {
      Article.updateOne(
         { title: req.params.name },
         { $set: req.body },
         (err) => {
            if (!err) {
               res.send("Successfully Updated");
            } else {
               res.send(err);
            }
         }
      );
   })

   .delete((req, res) => {
      Article.deleteOne({ title: req.params.name }, (err) => {
         if (!err) {
            res.send("Successfully Deleted the Article");
         } else {
            res.send(err);
         }
      });
   });

// ----------------------------------------------------------

app.listen(3000, () => {
   console.log("Server is up & running on port 3000");
});
