const mongoose= require('mongoose', {useNewUrlParser: true});
mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1/processManagement',{useNewUrlParser: true});