//jshint esversion:6

require('dotenv').config()   ///for env

const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongooose = require("mongoose");
const encrypt = require('mongoose-encryption');


app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));
const https = require('https');

app.set("view engine", "ejs");




mongooose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongooose.Schema({
    email: String,
    password: String
});

// console.log(process.env.API_KEY);

// const secret = "thisisourlittleencryption."; //////////moved to .env file////////
userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password'] });


const User = new mongooose.model("user", userSchema);



app.get('/', function (req, res) {
    res.render("home");
});

//login route
app.get('/login', function (req, res) {
    res.render("login");
});

////register route
app.get('/register', function (req, res) {
    res.render("register");
});
app.post("/register", (req, res) => {



    //first check and then register
    User.findOne({ email: req.body.username }).then((result) => {
        // console.log(result);
        if (result == null) {

            const newUser = new User({
                email: req.body.username,
                password: req.body.password
            });
            newUser.save().then((result) => {
                // console.log(result);
                if (result == null) {
                    res.send("Error 404");
                }
                else {
                    res.render("secrets");
                }
            });
        }
        else if (result.password === req.body.password) {
            res.render("secrets");
        }
        else {
            res.send("Already register ,Wrong Password||login with correct pass");
        }

    });

});
app.post("/login",(req,res)=>{
    User.findOne({ email: req.body.username}).then((result) => {
        if(result.password===req.body.password )
        {
            res.render("secrets");
            
        }
        else
        {
            res.send("Incorrect Email or password");
            
        }
    });

});
app.get("/logout",(req,res)=>{
    res.render("login");
});



app.listen(3000, function () {
    console.log('Server started at 3000');
});