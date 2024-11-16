const mongoose= require("mongoose");

const postModel= mongoose.Schema({
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    date:{
        type:Date,
        default:Date.now
    },
    content:String,
    Like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }]
})

module.exports=mongoose.model("post",postModel);