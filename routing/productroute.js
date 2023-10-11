const express=require("express");
const router=express.Router();
const client=require("mongodb").MongoClient;
let dbinstance;
client.connect("mongodb://127.0.0.1:27017").then((server)=>{
dbinstance=server.db("EcommD");

})

router.get("/",(req,res)=>{

    dbinstance.collection("products").find({}).toArray().then((response)=>{

        res.render("products/ShowAllProducts",{products:response});


    })

})
router.get("/create",(req,res)=>{
res.render("products/Create",{msg:''});

});
router.post("/create",(req,res)=>{

    let obj={};
    obj.name=req.body.name;
    obj.price=req.body.price;
    obj.description=req.body.description;
    dbinstance.collection("products").insertOne(obj).then((response)=>{
        res.redirect("/products");
        
    })

//let obj=req.body;




})



module.exports=router;