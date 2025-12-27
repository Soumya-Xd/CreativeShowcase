import { Schema, model } from 'mongoose';

const artworkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      default: '',
      maxlength: 1000
    },
    image_url: {
      type: String,
      required: true
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Like'
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// ===============================
// INDEXES
// ===============================
artworkSchema.index({ artist: 1, createdAt: -1 });
artworkSchema.index({ createdAt: -1 });

// ===============================
// JSON WITH LIKES + FOLLOW STATUS
// ===============================
artworkSchema.methods.toJSONWithLikes = async function (userId = null) {
  const Like = model('Like');
  const User = model('User');

  // ---------- Likes ----------
  const likesCount = await Like.countDocuments({ artwork: this._id });
  let isLiked = false;

  if (userId) {
    const userLike = await Like.findOne({
      artwork: this._id,
      user: userId
    });
    isLiked = !!userLike;
  }

  // ---------- Follow ----------
  let isFollowing = false;

  if (userId && this.artist?.followers) {
    isFollowing = this.artist.followers.some(
      (f) => f.toString() === userId.toString()
    );
  }

  // ---------- FINAL RESPONSE ----------
  return {
    ...this.toObject(),
    likes_count: likesCount,
    is_liked: isLiked,
    artist: {
      id: this.artist._id,
      username: this.artist.username,
      email: this.artist.email,
      avatar_url: this.artist.avatar_url,
      bio: this.artist.bio,
      isFollowing
    }
  };
};

export default model('Artwork', artworkSchema);
