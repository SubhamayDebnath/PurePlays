import mongoose from "mongoose";

const likeSchema = mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      default: null,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
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
