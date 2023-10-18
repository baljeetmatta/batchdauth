const express=require("express");
const router=express.Router();
const client=require("mongodb").MongoClient;
const ObjectId=require("mongodb").ObjectId;

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


router.get("/ShowProduct/:id",(req,res)=>{

    dbinstance.collection("products").find({'_id':new ObjectId(req.params.id)}).toArray().then((data)=>{

       // console.log(data);
       // res.end();
       res.render("products/ShowProduct",{products:data});


    })
})

router.get("/EditProduct/:id",(req,res)=>{

    dbinstance.collection("products").find({'_id':new ObjectId(req.params.id)}).toArray().then((data)=>{

       // console.log(data);
       // res.end();
       res.render("products/EditProduct",{products:data});
       

    })
})
router.post("/edit",(req,res)=>{
    console.log(req.body);
dbinstance.collection("products").updateOne({'_id':new ObjectId(req.body._id)},{$set:{'name':req.body.name,'price':parseInt(req.body.price),description:req.body.description}}).then((data)=>{
    console.log(data);
    res.redirect("/products/");
})
});


router.get("/delete/:id",(req,res)=>{

    dbinstance.collection("products").find({'_id':new ObjectId(req.params.id)}).toArray().then((data)=>{

       // console.log(data);
       // res.end();
       res.render("products/DeleteProduct",{products:data});
       

    })
})
router.post("/delete",(req,res)=>{
    console.log(req.body);
dbinstance.collection("products").deleteOne({'_id':new ObjectId(req.body._id)}).then((data)=>{
    console.log(data);
    res.redirect("/products/");
})
});





module.exports=router;