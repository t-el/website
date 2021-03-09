const exprese= require("express");
const server = require("http");
const path = require("path");

var sessionStorage = require('sessionstorage');
 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;
const bodyParser = require("body-parser");
const { url } = require("inspector");

mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true);
const UserSchema = new Schema({
    username:  String, // String is shorthand for {type: String}
    password: String,
  }); 
const app = exprese();
app.use(bodyParser.urlencoded({ extended: true }));



app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.use(exprese.static(path.join(__dirname,'public')));

app.get("/",(req,res) =>{
    mongoose.connect("mongodb+srv://taha:taha12345678@space.mvokz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err =>{console.log("Can Not Connect To MongoDb")}) ;
    
    const username = sessionStorage.getItem("currentloggedin");
    res.render("index.ejs",{username:username});
    
    // we're connected! 
    console.log("connected ");
})

app.get("/login",(req,res) =>{
    mongoose.connect("mongodb+srv://taha:taha12345678@space.mvokz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err =>{console.log("Can Not Connect To MongoDb")}) ;
    res.render("login.ejs");
})

app.get("/logout",(req,res) =>{
    
   sessionStorage.setItem("currentloggedin","");
   res.redirect("/");
})
app.post("/login",(req,res) =>{
    const User = mongoose.model('User', UserSchema);
    User.findOne({ username: req.body.username}).then((user) =>{
        if(user){
            if(user.password == req.body.password){
                sessionStorage.setItem("currentloggedin",req.body.username);
                res.redirect("/");
            }else{
                return res.status(400).json({password:"Incorrect"});
            }
            
        } else {
            return res.status(400).json({username:"Count Not Found"});
        }
    });
 
   
})

app.get("/register",(req,res) =>{    
     mongoose.connect("mongodb+srv://taha:taha12345678@space.mvokz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
    .catch(() =>{console.log("Can Not Connect To MongoDb")}) ;
    res.render("register.ejs");
})
app.post("/register",(req,res) =>{ 

    const User = mongoose.model('User', UserSchema);
    User.findOne({ username: req.body.username}).then((user) =>{
        if(user){
            return res.status(400).json({username:"alrady used"});
        } else {
            const user = new User({username:req.body.username,password:req.body.password});
            user.save();
            return res.redirect("/login");
        }
    });
      
        
    
          

   
})



app.listen(5000,err =>{
    if(err)
        console.log(err);
    console.log("Server Runing At Port 5000");
    console.log("Visit http://localhost:5000");    
})
