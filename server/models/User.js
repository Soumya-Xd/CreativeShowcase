import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    avatar_url: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    artworks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Artwork'
      }
    ]
  },
  { timestamps: true }
);

/* ================================
   HASH PASSWORD BEFORE SAVE
================================ */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/* ================================
   COMPARE PASSWORD
================================ */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ================================
   USER STATS
================================ */
userSchema.methods.getStats = async function () {
  const Artwork = model('Artwork');
  const Like = model('Like');

  const artworkCount = await Artwork.countDocuments({ artist: this._id });
  const totalLikes = await Like.countDocuments({
    artwork: { $in: this.artworks }
  });

  return {
    artworkCount,
    followersCount: this.followers.length,
    followingCount: this.following.length,
    totalLikes
  };
};

export default model('User', userSchema);
