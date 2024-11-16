const express= require("express");
const app= express();
const path= require("path");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken")
const userModel= require("./model/user");
const postModel= require("./model/post");
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req, res)=>
{
    res.render("index")
})

app.post("/create", async (req,res)=>
{
    try{
        let {name, email, password, number}= req. body;
        
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                let userFind= await userModel.findOne({email})
                if(userFind){
                    return res.redirect("/");
                }

                const creatUser= await userModel.create({
                    name, 
                    email,
                    password:hash,
                    number,
                })
                let token = jwt.sign({ email: email }, 'secret');
                res.cookie("token", token);
                res.redirect("login");
                
            });
        });
    }catch(error){
        console.log(error);
        res.status(500).send("server error")
    }
   
})

app.get("/login", (req, res)=>
{
    res.render("login")
})
app.post("/login", async (req, res)=>
{
    try{
        let {email, password}= req.body;
        let userFind= await userModel.findOne({email})
       if(!userFind) {
        // return res.send("something went wrong");
       return res.redirect("login");
       } 
        bcrypt.compare(password, userFind.password, function(err, result) {
          if(result) {
            let token = jwt.sign({ email }, 'secret');
                res.cookie("token", token);
                res.redirect("profile")
          }  else {
            return res.redirect("login")
                 } 
        });
    }catch(error){
        console.log(error);
        res.status(500).send("server.errors");
    }
   
    
})

app.get("/profile",isLoggedIn,async (req, res)=>
{
    let user=await userModel.findOne({email: req.user.email}).populate("post")
    // console.log(req.user);s
    res.render("profile" ,{user})
})
app.post("/post",isLoggedIn,async (req, res)=>
    {
        let {content} = req. body;
        let user=await userModel.findOne({email: req.user.email})
       let post = await postModel.create({
            user: user._id,
            content,
        })
        user.post.push(post._id);
        await user.save();
        res.redirect("profile")
    })

app.get("/logout",(req, res)=>
{
    res.cookie("token", "");
    res.redirect("/login")
})

function isLoggedIn(req, res, next){
    if(req.cookies.token === ""){
        return res.redirect("/login")
    }
    else{
        let data= jwt.verify(req.cookies.token, "secret");
        req.user= data
        next()
    }
}
app.listen(3000,()=>
{
    console.log("server is running");
    
})