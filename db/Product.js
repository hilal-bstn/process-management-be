const mongoose =require('mongoose');

const productSchema= new mongoose.Schema({

    name:String, 
    category:String,
    amount:Number, 
    amountUnit:Number, 
    companyId:{ type: mongoose.Schema.Types.ObjectId, ref: "companies" }
    
});

module.exports = mongoose.model("products",productSchema);