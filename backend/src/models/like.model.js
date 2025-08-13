import mongoose from "mongoose";

const LikeSchema = mongoose.Schema({
    video:{
        types:mongoose.Schema.Types.ObjectId,
        ref:"Video",
        default: null
    },
    comment:{
        types:mongoose.Schema.types.ObjectId,
        ref:"Comment",
        default: null
    },
    owner:{
        types:mongoose.Schema.types.ObjectId,
        ref:"User",
        default: null
    }
},{timestamps:true});
const Like = mongoose.model("Like",LikeSchema);
export default Like;