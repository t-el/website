const exprese= require("express");
const server = require("http");
const path = require("path");

var sessionStorage = require('sessionstorage');
 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;
const bodyParser = require("body-parser");
const { url } = require("inspector");
const { timeStamp } = require("console");

mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true);


const UserSchema = new Schema({
    username:  String, // String is shorthand for {type: String}
    password: String,
  }); 

  

  const answerSchema = new Schema({
    body:  String, // String is shorthand for {type: String}
    time: String,
    user:String,
    
  }); 
  const questionSchema = new Schema({
    body:  String, // String is shorthand for {type: String}
    time: String,
    user:String,
   answer:[answerSchema]
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
    // mongoose.connection.close()
    res.render("index.ejs",{username:username});
    
    // we're connected! 
    console.log("connected ");
})

app.get("/login",(req,res) =>{
    mongoose.connect("mongodb+srv://taha:taha12345678@space.mvokz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err =>{console.log("Can Not Connect To MongoDb")}) ;
    // mongoose.connection.close()
    res.render("login.ejs");
})

app.get("/logout",(req,res) =>{
    
   sessionStorage.setItem("currentloggedin","");
   res.redirect("/");
})
app.post("/login",(req,res) =>{
    const User = mongoose.model('User', UserSchema);
      User.findOne({ username: req.body.username})
     .then((user) =>{
        if(user){
            if(user.password == req.body.password){
                sessionStorage.setItem("currentloggedin",req.body.username);
                // mongoose.connection.close()
                res.redirect("/");
            }else{
                return res.status(400).json({password:"Incorrect"});
            }
            
        } else {
            return res.status(400).json({username:"Count Not Found"});
        }
    }
    )
    .catch(err =>{
        console.log(err);
    });
 
   
})

app.get("/register",(req,res) =>{    
      mongoose.connect("mongodb+srv://taha:taha12345678@space.mvokz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
    .catch(() =>{console.log("Can Not Connect To MongoDb")}) ;
    // mongoose.connection.close()
    res.render("register.ejs");
})
app.post("/register",(req,res) =>{ 

    const User = mongoose.model('User', UserSchema);
     User.findOne({ username: req.body.username})
    .then((user) =>{
        if(user){
            return res.status(400).json({username:"alrady used"});
        } else {
            const user = new User({username:req.body.username,password:req.body.password});
            user.save();
            // mongoose.connection.close()
            return res.redirect("/login");
        }
    }
    ).catch(err => console.log(err))  ;
})

app.get("/qa",(req,res) =>{
     mongoose.connect("mongodb+srv://taha:taha12345678@space.mvokz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
    .catch(() =>{console.log("Can Not Connect To MongoDb")}) ;
    const Question = mongoose.model('Question', questionSchema);
    var resault = [];
    Question.find({}).exec().then(data => res.render("qa.ejs",{q:data})).catch(err =>console.log(err));
   
 });

 app.post("/qa",(req,res) =>{
     mongoose.connect("mongodb+srv://taha:taha12345678@space.mvokz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
    .catch(() =>{console.log("Can Not Connect To MongoDb")}) ;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    const Question = mongoose.model('Question', questionSchema);
    var username = sessionStorage.getItem("currentloggedin");
    if(!username){
        username = "Anonymose User?"
    }
    q = new Question({body:req.body.qbody,time:today,user:username});
     q.save();
    // mongoose.connection.close()
    res.redirect("/qa");

 });

 app.post("/an",(req,res) =>{
    mongoose.connect("mongodb+srv://taha:taha12345678@space.mvokz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
   .catch(() =>{console.log("Can Not Connect To MongoDb")}) ;
   var today = new Date();
   var dd = String(today.getDate()).padStart(2, '0');
   var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
   var yyyy = today.getFullYear();
   today = mm + '/' + dd + '/' + yyyy;
//    const Answer = mongoose.model('Answer', answerSchema);
   var username = sessionStorage.getItem("currentloggedin");
   if(!username){
       username = "Anonymose User?"
   }
  
   const Question = mongoose.model('Question', questionSchema);
   const Answer = mongoose.model('Answer', answerSchema);
   var an = {body:req.body.answer,time:today,user:username};
   var answ = new Answer(an);
   answ.save();
   Question.findById(req.body.qid).exec().then(question=> {
       question.answer.push(Answer.findById(answ._id).exec().then().catch(err => console.log("")));
       question.save();
    }).catch(err =>console.log(err));
   
   // mongoose.connection.close()
   res.redirect("/qa");

});


app.listen(5000,err =>{
    if(err)
        console.log(err);
    console.log("Server Runing At Port 5000");
    console.log("Visit http://localhost:5000");    
})
