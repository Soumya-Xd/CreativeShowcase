import { Router } from "express";
import multer from "multer";
import { join, extname, dirname } from "path";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { fileURLToPath } from "url";

import Artwork from "../models/Artwork.js";
import Like from "../models/Like.js";
import User from "../models/User.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

/* ================================
   FIX __dirname (ES MODULE)
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ================================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, "../uploads");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `art-${unique}${extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extOk = allowed.test(extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

/* ================================
   GET ALL ARTWORKS (PUBLIC)
================================ */
router.get("/", optionalAuth, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const artworks = await Artwork.find()
      .populate("artist", "username email avatar_url bio followers")

      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const withLikes = await Promise.all(
      artworks.map((a) => a.toJSONWithLikes(req.userId))
    );

    res.json({
      artworks: withLikes.sort(() => Math.random() - 0.5),
      pagination: {
        page,
        limit,
        total: await Artwork.countDocuments(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   GET SINGLE ARTWORK (PUBLIC)
================================ */
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate(
      "artist",
      "username email avatar_url bio followers"
    );

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.json({
      artwork: await artwork.toJSONWithLikes(req.userId),
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   CREATE ARTWORK (PROTECTED)
================================ */
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.body.title) {
      return res.status(400).json({ message: "Title and image required" });
    }

    const artwork = new Artwork({
      title: req.body.title,
      description: req.body.description || "",
      image_url: `/uploads/${req.file.filename}`,
      artist: req.userId,
      tags: req.body.tags
        ? req.body.tags.split(",").map((t) => t.trim())
        : [],
    });

    await artwork.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { artworks: artwork._id },
    });

    await artwork.populate("artist", "username email avatar_url bio followers");

    res.status(201).json({
      message: "Artwork uploaded",
      artwork: await artwork.toJSONWithLikes(req.userId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   UPDATE ARTWORK (PROTECTED)
================================ */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const artwork = await Artwork.findOne({
      _id: req.params.id,
      artist: req.userId,
    });

    if (!artwork) {
      return res.status(404).json({ message: "Not authorized" });
    }

    artwork.title = req.body.title || artwork.title;
    artwork.description = req.body.description ?? artwork.description;
    artwork.tags = req.body.tags
      ? req.body.tags.split(",").map((t) => t.trim())
      : artwork.tags;

    await artwork.save();
    await artwork.populate("artist", "username email avatar_url bio followers");

    res.json({
      message: "Artwork updated",
      artwork: await artwork.toJSONWithLikes(req.userId),
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   DELETE ARTWORK (PROTECTED)
================================ */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const artwork = await Artwork.findOne({
      _id: req.params.id,
      artist: req.userId,
    });

    if (!artwork) {
      return res.status(404).json({ message: "Not authorized" });
    }

    const imagePath = join(__dirname, "..", artwork.image_url);
    if (existsSync(imagePath)) unlinkSync(imagePath);

    await Like.deleteMany({ artwork: artwork._id });

    await User.findByIdAndUpdate(req.userId, {
      $pull: { artworks: artwork._id },
    });

    await Artwork.findByIdAndDelete(artwork._id);

    res.json({ message: "Artwork deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   LIKE / UNLIKE (PROTECTED)
================================ */
router.post("/:id/like", requireAuth, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const existing = await Like.findOne({
      user: req.userId,
      artwork: artwork._id,
    });

    if (existing) {
      await Like.findByIdAndDelete(existing._id);
      await Artwork.findByIdAndUpdate(artwork._id, {
        $pull: { likes: existing._id },
      });
      return res.json({ liked: false });
    }

    const like = new Like({
      user: req.userId,
      artwork: artwork._id,
    });

    await like.save();
    await Artwork.findByIdAndUpdate(artwork._id, {
      $push: { likes: like._id },
    });

    res.json({ liked: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   GET USER ARTWORKS (PUBLIC)
================================ */
router.get("/user/:userId", optionalAuth, async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.params.userId })
      .populate("artist", "username email avatar_url bio followers")

      .sort({ createdAt: -1 });

    const result = await Promise.all(
      artworks.map((a) => a.toJSONWithLikes(req.userId))
    );

    res.json({ artworks: result });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
