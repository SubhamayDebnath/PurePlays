import mongoose from "mongoose";

const likeSchema = mongoose.Schema(
  {
    video: {
      types: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      default: null,
    },
    comment: {
      types: mongoose.Schema.types.ObjectId,
      ref: "Comment",
      default: null,
    },
    owner: {
      types: mongoose.Schema.types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);
// Prevent duplicate likes for the same item by the same user
likeSchema.index(
  { video: 1, owner: 1 },
  { unique: true, partialFilterExpression: { video: { $exists: true } } }
);
likeSchema.index(
  { comment: 1, owner: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
);
const Like = mongoose.model("Like", likeSchema);
export default Like;
