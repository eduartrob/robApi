"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateToken = generateToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pepper = process.env.HASH_SALT;
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!pepper)
            throw new Error('HASH_SALT not defined in environment variables');
        const combined = password + pepper;
        return bcrypt_1.default.hash(combined, 10);
    });
}
function comparePassword(password, hashed) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!pepper)
            throw new Error('HASH_SALT not defined in environment variables');
        return bcrypt_1.default.compare(password + pepper, hashed);
    });
}
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}
