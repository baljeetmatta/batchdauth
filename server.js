const express=require("express");
const app=express();
const fs=require("fs");
const path=require("path");
app.set("view engine","ejs");
const authRoutes=require("./routing/authroutes");
const client=require("mongodb").MongoClient;
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
app.use(express.urlencoded());
const productRoutes=require("./routing/productroute");
app.use("/products",auth,productRoutes);
function auth(req,res,next)
{
    if(req.session.role=="admin")
    next();
else
res.render("auth");
}
let dbinstance;
client.connect("mongodb://127.0.0.1:27017").then((server)=>{
dbinstance=server.db("EcommD");

})
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
    res.redirect("/users/dashboard");
else
    next();
  
    
})
app.use(express.static("public"));

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

    dbinstance.collection("users").find({$and:[{'username':req.body.username},{'password':req.body.password}]}).toArray().then((response)=>
    {
        if(response.length==0)
        res.render("login",{msg:"Invalid user/password"});
    else
    {
        req.session.username=req.body.username;
             req.session.name=response[0].Name;
         res.redirect("/users/dashboard");
    }
    })
    // fs.readFile("users.txt","utf-8",(err,data)=>{
    //     let records=JSON.parse(data);
    //     let results=records.filter((item)=>{
    //         if(item.username==req.body.username && item.password==req.body.password)
    //         return true;
    //     })
    //     if(results.length==0)
    //    // res.send("Invalid user/password");
    // res.render("login",{msg:"Invalid user/password"})
    // else
    // {
    //     req.session.username=req.body.username;
    //     req.session.name=results[0].Name;
    // res.redirect("/users/dashboard");
    // }
    // })
})

app.get("/",(req,res)=>{
    // fs.readFile("products.json","utf-8",(err,data)=>{
    //     let productsData=JSON.parse(data);
    //     res.render("index",{products:productsData,username:req.session.username});

    // })
    dbinstance.collection("products").find({}).toArray().then((response)=>
    {
        res.render("index",{products:response,username:req.session.username});
    }
    );
    

})
app.get("/productdetails/:id",(req,res)=>{
    // fs.readFile("products.json","utf-8",(err,data)=>{
    //     let productsData=JSON.parse(data);
    //     let results=productsData.filter((item)=>{
    //         if(item.id==req.params.id)
    //         return true;
    //     })
    //     res.render("productdetails",{products:results});

    // })
    // console.log(req.params.id);
    // res.end();

    dbinstance.collection("products").find({id:parseInt(req.params.id)}).toArray().then((response)=>{
       console.log(response, req.params.id);    ;
        res.render("productdetails",{products:response});
    })
})

app.listen(3000,(err)=>{
    console.log("Server started...")
})
