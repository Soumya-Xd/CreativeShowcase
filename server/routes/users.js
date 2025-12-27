import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

/* =========================================
   GET USER PROFILE (PUBLIC)
========================================= */
router.get("/profile/:username", optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate("artworks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stats = await user.getStats();

    let isFollowing = false;
    if (req.userId) {
      const currentUser = await User.findById(req.userId);
      if (currentUser) {
        isFollowing = currentUser.following.includes(user._id);
      }
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
        createdAt: user.createdAt,
        isFollowing,
        ...stats,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================
   FOLLOW / UNFOLLOW USER (PROTECTED)
========================================= */
router.post("/:userId/follow", requireAuth, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId },
      });

      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId },
      });

      return res.json({ following: false });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $push: { following: targetUserId },
    });

    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUserId },
    });

    res.json({ following: true });
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================
   UPDATE PROFILE (PROTECTED)
========================================= */
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { username, bio, avatar_url } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.userId },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stats = await user.getStats();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
        ...stats,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================
   GET FOLLOWERS (PROTECTED)
========================================= */
router.get("/followers", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "followers",
      "username email avatar_url bio"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================
   GET FOLLOWING (PROTECTED)
========================================= */
router.get("/following", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "following",
      "username email avatar_url bio"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ following: user.following });
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
