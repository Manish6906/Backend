const mongoose= require("mongoose");


mongoose.connect(`mongodb://127.0.0.1:27017/FullAuth`)

const usermodel= mongoose.Schema({
    name:String,
    email:String,
    password:String,
    number:Number,
    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
    }]
})

module.exports=mongoose.model("user",usermodel);