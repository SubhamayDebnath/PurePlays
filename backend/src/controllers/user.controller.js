import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import Subscription from "../models/subscription.model.js";

// user details
const user = asyncHandler(async (req, res) => {
    const userID = req.user._id;
    const user = await User.findById(userID);
    if (!user) {
        throw new AppError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});

// user watchlist

const userWatchList = asyncHandler(async (req, res) => {
    const userID = req.user._id;
    const user = await User.findById(userID);
    if (!user) {
        throw new AppError(404, "User not found");
    }
    const userWatchList = user.watchHistory;
    const videos = [];
    for (const videoID of userWatchList) {
        const video = await Video.findById(videoID);
        if (video) {
            videos.push(video);
        }
    }
    return res.status(200).json(new ApiResponse(200, "User fetched successfully", videos));
});

// todo delete full watchlist or single video from watch list 

// subscribe to channel
const toggleSubscription = asyncHandler(async (req, res) => {
    const channelID = req.params.id;
    const userID= req.user._id;
    if(userID.toString() === channelID){
        throw new AppError(404, "You cannot subscribe to your own channel");
    }
    const user = await User.findById(userID);
    if(!user){
        throw new AppError(404, "User not found");
    }
    const existingSubscribedChannel = await Subscription.create({
        subscriber: userID,
        channel: channelID
    });
    if(existingSubscribedChannel){
        await existingSubscribedChannel.deleteOne();
         return res.status(200).json(
            new ApiResponse(200, "Unsubscribed successfully", { subscribed: false })
        );
    }else{
        const subscription = await Subscription.create({
            subscriber: userID,
            channel:channelID
        });
        return res.status(201).json(
            new ApiResponse(201, "Subscribed successfully", { subscribed: true, subscription })
        );
    }
});

export { user, userWatchList , toggleSubscription};