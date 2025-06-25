// models/BlacklistedToken.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface BlacklistedTokenDocument extends Document {
  token: string;
  revokedAt: Date;
  expiresAt?: Date;
}

const BlacklistedTokenSchema = new Schema<BlacklistedTokenDocument>({
  token: { type: String, required: true, unique: true },
  revokedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // opcional: para eliminar tokens caducados automáticamente
});

export const BlacklistedToken = mongoose.model<BlacklistedTokenDocument>(
  "BlacklistedToken",
  BlacklistedTokenSchema
);
