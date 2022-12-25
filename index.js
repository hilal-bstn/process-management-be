const express=require('express');
const cors=require("cors");
require('./db/config');
const User = require("./db/User");
const Product=require("./db/Product")
const Company=require("./db/Company")

const Jwt = require('jsonwebtoken');
const jwtKey = "process-management";

const app=express();

app.use(express.json());
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.post("/register",async (req,resp)=>{
    let user=new User(req.body.register);
    let result=await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({ result },jwtKey,{ expiresIn: "2h" },(err,token)=>{
        if(err){
           return resp.send("Something went wrong, please trg after sometime")
        }
  return  resp.send({ result,auth : token})
})
});

app.post("/login",async (req,resp)=>{
   const request = req.body.login;

if(request.password && request.email)
{
   let user=await User.findOne(request).select("-password");
    if(user)
    {
        Jwt.sign({ user },jwtKey,{ expiresIn: "2h" },(err,token)=>{
                if(err){
                   return resp.send("Something went wrong, please trg after sometime")
                }
          return  resp.send({ user,auth : token})
        })
    }
    else{
      return  resp.send({result:'No user found'})
    }
}
else
{
    return resp.send({result:'No user found'})
}
})

app.post("/add-product",verifyToken,async (req,resp)=>{
    let product = new Product(req.body);
    let result=await product.save();
    return resp.send(result);
})

app.get("/products",verifyToken,async (req,resp)=>{
    let products=await Product.find();
    if(products.length>0)
    {
      return  resp.send(products)
    }
    else{
      return  resp.send({result:"No product found"})
    }
})

app.get("/newproducts",verifyToken,async (req,resp)=>{
    let products=await Product.find().sort({"_id": -1}).limit(5);
    if(products.length>0)
    {
      return  resp.send(products)
    }
    else{
      return  resp.send({result:"No product found"})
    }
})

app.delete("/product/:id",verifyToken, async (req,resp)=>{
    const result = await Product.deleteOne({_id:req.params.id})
   return resp.send(result);
})

app.put("/product/:id", verifyToken,async (req, resp) => {
    console.log(req)
    let result = await Product.updateOne(
        {
             _id : req.params.id 
        },
        {
            $set : req.body
        }
    )
    if(result)
    {
      return resp.send(result);
    }
    else{
       return resp.send({result:"No record found."});
    }
});


app.post("/add-company",verifyToken,async (req,resp)=>{
    let company=new Company(req.body);
    let result=await company.save();
    return resp.send(result);
})

app.get("/companies",verifyToken,async (req,resp)=>{
    let companies=await Company.find();
    if(companies.length>0)
    {
      return  resp.send(companies)
    }
    else{
      return  resp.send({result:"No product found"})
    }
})

app.get("/newcompanies",verifyToken,async (req,resp)=>{
    let companies=await Company.find().sort({"_id": -1}).limit(5);
    if(companies.length>0)
    {
      return  resp.send(companies)
    }
    else{
      return  resp.send({result:"No product found"})
    }
})


app.delete("/company/:id",verifyToken, async (req,resp)=>{
    const result = await Company.deleteOne({_id:req.params.id})
   return resp.send(result);
})

app.put("/company/:id", verifyToken,async (req, resp) => {
    let result = await Company.updateOne(
        {
             _id : req.params.id 
        },
        {
            $set : req.body
        }
    )
    if(result)
    {
      return resp.send(result);
    }
    else{
       return resp.send({result:"No record found."});
    }
});

function verifyToken(req,resp,next){
    let token = req.headers['authorization'];
    if(token)
    { 
        token = token.split(' ')[1];
        Jwt.verify(token, jwtKey,(err,valid)=>{
                if(err)
                {
                    return resp.status(401).send({result:"please privade valid token"})
                }
                else
                {
                    next();
                }
        }); 
    }
    else
    {
        return resp.status(200).send({result:"please add token with header"})
    }
}

app.listen(5000);
