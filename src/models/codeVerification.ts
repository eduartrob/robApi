import mongoose, { Schema, Document } from 'mongoose';


export interface VerificationCodeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code: Number;
  expiresAt: Date;
  createdAt: Date;
  used: boolean;
}


const VerificationCodeSchema: Schema<VerificationCodeDocument> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
  },
  code: {
    type: Number,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
    required: true,
  }
});

VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const VerificationCode = mongoose.model<VerificationCodeDocument>('VerificationCode', VerificationCodeSchema);