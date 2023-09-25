const express=require("express");
const app=express();
const fs=require("fs");
const path=require("path");
app.set("view engine","ejs");
const authRoutes=require("./routing/authroutes");

const cookieparser=require("cookie-parser");
app.use(cookieparser());
const session=require("express-session");
const oneday=1000*60*60*24;
app.use(session({
    saveUninitialized:true,
    resave:false,
    secret:'asd3454#$%$@#324',
    cookie:{maxAge:oneday}
}));
app.use("/users",auth,authRoutes);
function auth(req,res,next)
{
    if(req.session.username)
    next();
else
res.redirect("/");

}
app.get("/",(req,res,next)=>{
    if(req.session.username)
    res.redirect("/dashboard");
else
    next();
  
    
})
app.use(express.static("public"));
app.use(express.urlencoded());
// app.get("/dashboard",(req,res)=>{
//     if(req.session.username)
//     res.sendFile(path.join(__dirname,"./public/dashboard.html"));
// else
//     res.redirect("/");

// })
app.get("/profile",(req,res)=>{
    if(req.session.username)
    res.send("Profile")
else
    res.redirect("/");
})
app.get("/login",(req,res)=>{
    res.render("login",{msg:""});

})
app.post("/changepassword",(req,res)=>{
    //1. Old Password
    fs.readFile("users.txt","utf-8",(err,data)=>{
        let records=JSON.parse(data);
        let results=records.filter((item)=>{
            if(item.username==req.session.username && item.password==req.body.oldpassword)
            return true;
        })
        if(results==0)
        res.render("changepassword",{msg:"Old password not matched"});
    else 
    res.end();
    });
})
app.post("/login",(req,res)=>{

    fs.readFile("users.txt","utf-8",(err,data)=>{
        let records=JSON.parse(data);
        let results=records.filter((item)=>{
            if(item.username==req.body.username && item.password==req.body.password)
            return true;
        })
        if(results.length==0)
       // res.send("Invalid user/password");
    res.render("login",{msg:"Invalid user/password"})
    else
    {
        req.session.username=req.body.username;
        req.session.name=results[0].Name;
    res.redirect("/users/dashboard");
    }
    })
})



app.listen(3000,(err)=>{
    console.log("Server started...")
})
