const mongoose =require('mongoose');

const productSchema= new mongoose.Schema({

    name:String, 
    category:String,
    amount:Number, 
    amountUnit:Number, 
    companyId:String
    
});

module.exports = mongoose.model("products",productSchema);