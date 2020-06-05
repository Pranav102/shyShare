//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


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


emailSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ["password"] });

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
  const user = new email({
    email:req.body.username,
    password:req.body.password
  })

  user.save(function(err,result){
    if(!err){
      res.render("secrets")
    }else{
      console.log(err);
    }
  });

})

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  email.findOne({email:username},function(err,result){
    if(!err){
      if(result.password === password){
        res.render("secrets");
      }
    }else{
      console.log(err);
    }
  })
});












app.listen(3000, function() {
  console.log("Server started on port 3000");
});
