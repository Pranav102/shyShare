//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');





const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/shyShareEmailDB",{ useNewUrlParser: true ,useUnifiedTopology: true })

const emailSchema = new mongoose.Schema({
    email:String,
    password:String
  })


const email = mongoose.model("email",emailSchema)


app.get("/",function(req,res){
  res.render("home")
})
app.get("/login",function(req,res){
  res.render("login")
})
app.get("/register",function(req,res){
  res.render("register")
})

app.post("/register",function(req,res){

  bcrypt.hash(req.body.password, 12, function(err, hash) {
    const user = new email({
      email:req.body.username,
      password:hash
    })

    user.save(function(err,result){
      if(!err){
        res.render("secrets")
      }else{
        console.log(err);
      }
    });
  });
})

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  email.findOne({email:username},function(err,result){
    if(!err){
      bcrypt.compare(password, result.password, function(err, result) {
        if(result === true){
          res.render("secrets");
        }
      });
    }else{
      console.log(err);
    }
  })
});












app.listen(3000, function() {
  console.log("Server started on port 3000");
});
