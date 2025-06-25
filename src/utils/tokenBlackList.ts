import { BlacklistedToken } from "../models/blackListToken";

export async function addTokenToBlacklist(token: string, expiresAt?: Date) {
  await BlacklistedToken.create({ token, expiresAt });
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const entry = await BlacklistedToken.findOne({ token }).exec();
  return !!entry;
}




