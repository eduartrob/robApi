"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('no-token');
    }
    const token = authHeader.split(' ')[1]; // "Bearer TOKEN_AQUI"
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return payload;
    }
    catch (err) {
        throw new Error('invalid-token');
    }
}
