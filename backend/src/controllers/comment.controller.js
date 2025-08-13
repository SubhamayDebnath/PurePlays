import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import ApiResponse from "../utils/apiResponse.js";
import Video from "../models/video.model.js";
import Like from "../models/like.model.js";

// add comment on video
const addComment = asyncHandler(async (req, res) => {
  const { comment, parentCommentId = null } = req.body;
  const videoID = req.params.id;
  const userID = req.user._id;

  if (!comment || comment.trim() === "") {
    throw new AppError(400, "Comment is required");
  }
  const video = await Video.findById(videoID);
  if (!video) {
    throw new AppError(404, "Video not found");
  }
  // check if parent comment exists
  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new AppError(404, "Parent comment not found");
    }
  }
  const newComment = await Comment.create({
    comment,
    video: videoID,
    owner: userID,
    parentComment: parentCommentId || null,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", newComment));
});

//update comment
const editComment = asyncHandler(async (req, res) => {
  const commentID = req.params.id;
  const userID = req.user._id;
  const { comment } = req.body;
  const commentToUpdate = await Comment.findById(commentID);
  if (!commentToUpdate) {
    throw new AppError(404, "Comment not found");
  }
  if (commentToUpdate.owner.toString() !== userID.toString()) {
    throw new AppError(403, "You are not authorized to update this comment");
  }
  commentToUpdate.comment = comment;
  await commentToUpdate.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Comment updated successfully", commentToUpdate)
    );
});

// delete comment
const deleteComment = asyncHandler(async (req, res) => {
  const commentID = req.params.id;
  const userID = req.user._id;
  const comment = await Comment.findById(commentID);
  if (!comment) {
    throw new AppError(404, "Comment not found");
  }
  if (comment.owner.toString() !== userID.toString()) {
    throw new AppError(403, "You are not authorized to delete this comment");
  }
  await comment.findByIdAndDelete(commentID);
  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully"));
});

const toggleLikeOnComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError(404, "Comment not found");
  }
  const existingLike = await Like.findOne({
    comment: commentId,
    owner: userId,
  });
  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, "Comment unliked successfully"));
  } else {
    const like = await Like.create({
      comment: commentId,
      owner: userId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "Comment liked successfully", like));
  }
});
export { addComment, editComment, deleteComment, toggleLikeOnComment };
