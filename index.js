import express from "express"
import session from "express-session"
const app=express()
app.set("view engine","ejs")
app.set("views","views")
app.use(express.urlencoded({extended:true}))
const users=[
    {id:1,name:"aryajeet",email:"aryajeet@gmail.com",password:"1234"},
    {id:2,name:"jane",email:"jane@gmail.com",password:"4567"}
]
app.use(
    session({
        secret:"secretkey",
        resave:false,
        saveUninitialized:false,
    })
)
app.get("/",(req,res)=>{
    if (req.session.user){
        res.render("dashboard",{users})
    }
    else{
        res.redirect("/login")
    }
})
app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",(req,res)=>{
    const {email,password}=req.body
    const user =users.find(user=>user.email===email&& user.password===password)
    if(user){
        req.session.user = user
        res.redirect("/")
    }
    else{
        res.render("login")
    }
})

app.listen(8080,()=>{
    console.log("server started")
})