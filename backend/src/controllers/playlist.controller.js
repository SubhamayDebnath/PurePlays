import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import PlayList from "../models/playlist.model.js";
import Video from "../models/video.model.js";

// get all playlist only can see by owner
const getPlaylists = asyncHandler(async (req, res) => {
    const userID = req.user._id;
    const user = await User.findById(userID);
    if (!user) {
        throw new AppError(404, "User not found");
    }
    const playlists = await PlayList.find({ owner: user._id });
    if (!playlists || playlists.length === 0) {
        return res.status(200).json(new AppError(404, "Playlists not found", []));
    } else {
        return res.status(200).json(new ApiResponse(200, "Playlists fetched successfully", playlists));
    }
});

// if playlist is public then anyone can see the playlist other than owner
const getPlaylistsByUsername = asyncHandler(async (req, res) => {
    const username = req.params.username;
    if (!username) {
        throw new AppError(404, "User not found");
    }
    const isUser = await User.findOne({ username: username });
    if (!isUser) {
        throw new AppError(404, "User not found");
    }

    const playlists = await PlayList.find({ owner: isUser._id, isPublic: true });
    if (!playlists || playlists.length === 0) {
        return res.status(200).json(new AppError(404, "Playlists not found", []));
    } else {
        return res.status(200).json(new ApiResponse(200, "Playlists fetched successfully", playlists));
    }
});

// create playlist
const createPlayList = asyncHandler(async (req, res) => {
    const { playListName, description, isPublic = false, videos = [] } = req.body;
    if (!playListName || !description) {
        throw new AppError(404, "All fields are required");
    }
    const isExistingPlaylist = await PlayList.findOne({ playListName });
    if (isExistingPlaylist) {
        throw new AppError(404, "Playlist already exists");
    }
    const playlist = await PlayList.create({
        playListName,
        description,
        isPublic,
        videos,
        owner: req.user._id
    });
    if (!playlist) {
        throw new AppError(500, "Something went wrong while creating playlist");
    }
    return res.status(201).json(new ApiResponse(201, "Playlist created successfully", playlist));
});

// edit playlist
const editPlaylist = asyncHandler(async (req, res) => {
    const playlistId = req.params.id;
    const { playListName, description, isPublic = false, videos = [] } = req.body;
    if (!playListName || !description) {
        throw new AppError(404, "All fields are required");
    }
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new AppError(404, "Playlist not found");
    }
    playlist.playListName = playListName;
    playlist.description = description;
    playlist.isPublic = isPublic;
    playlist.videos = videos;
    await playlist.save();
    return res.status(200).json(new ApiResponse(200, "Playlist updated successfully", playlist));
});
// delete playlist
const deletePlayList = asyncHandler(async (req, res) => {
    const playlistId = req.params.id;
    const playlist = await PlayList.findByIdAndDelete(playlistId);
    if (!playlist) {
        throw new AppError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, "Playlist deleted successfully", playlist));
});

// get all videos by playlist
const getVideosByPlaylist = asyncHandler(async (req, res) => {
    const playlistId = req.params.id;
    const playlist = await PlayList.findById(playlistId).populate("videos");
    if (!playlist) {
        throw new AppError(404, "Playlist not found");
    }
    const videos = playlist.videos
    if (!videos || videos.length === 0) {
        return res.status(200).json(new AppError(404, "Videos not found", []));
    } else {
        return res.status(200).json(new ApiResponse(200, "Videos fetched successfully", videos));
    }
});

// add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { getVideoId, playlistId } = req.body;
    if (!getVideoId || !playlistId) {
        throw new AppError(404, "All fields are required");
    }
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new AppError(404, "Playlist not found");
    }
    playlist.videos.push(getVideoId);
    await playlist.save();
    return res.status(200).json(new ApiResponse(200, "Video added to playlist successfully", playlist));

});

// remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { getVideoId, playlistId } = req.body;
    if (!getVideoId || !playlistId) {
        throw new AppError(404, "All fields are required");
    }
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new AppError(404, "Playlist not found");
    }
    playlist.videos.pull(getVideoId);
    await playlist.save();
    return res.status(200).json(new ApiResponse(200, "Video removed from playlist successfully", playlist));
})

export { getPlaylists, getPlaylistsByUsername, createPlayList, editPlaylist, deletePlayList, getVideosByPlaylist, addVideoToPlaylist, removeVideoFromPlaylist };