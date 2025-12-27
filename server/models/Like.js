import { Schema, model } from 'mongoose';

const likeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artwork: {
    type: Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only like an artwork once
likeSchema.index({ user: 1, artwork: 1 }, { unique: true });

export default model('Like', likeSchema);