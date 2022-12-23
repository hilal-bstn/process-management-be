const mongoose =require('mongoose');

const companySchema= new mongoose.Schema({

    companyName:String,
    companyLegalNumber:String,
    incorporationCountry:String,
    website:String
    
});

module.exports = mongoose.model("companies",companySchema);
