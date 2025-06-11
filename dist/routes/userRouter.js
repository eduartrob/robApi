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
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userController = new userController_1.UserController();
const userRouter = (0, express_1.Router)();
userRouter.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userController.getUsers();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'error getting users' });
    }
}));
userRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(406).json({ message: "required fields or invalid ID" });
        return;
    }
    try {
        const user = yield userController.getUserById(id);
        if (user) {
            res.status(200).json(user);
        }
    }
    catch (error) {
        if (error.message === 'error-get-user') {
            res.status(404).json({ message: "user-not-found" });
            return;
        }
        else {
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    }
}));
userRouter.post('/sign-up', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
        res.status(406).json({ message: "required fields" });
        return;
    }
    try {
        const existUser = yield userController.getUserByName(name, email, phone);
        if (!existUser) {
            const newUser = yield userController.createUser({ name, email, password, phone });
            res.status(201).json(newUser);
        }
    }
    catch (error) {
        if (error.message === 'get-user') {
            res.status(409).json({ error: 'name-email-phone already exists' });
        }
        else {
            res.status(500).json({ message: "Internal server error", error });
        }
    }
}));
userRouter.post('/sign-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(406).json({ message: "required fields" });
        return;
    }
    try {
        const userData = yield userController.getUserByUsername(email, password);
        if (userData) {
            res.status(200).json({ token: userData });
            return;
        }
    }
    catch (error) {
        if (error.message === 'invalid-credentials') {
            res.status(404).json({ message: "email-password-incorrect" });
            return;
        }
        else {
            res.status(500).json({ message: "Internal server error", error });
            return;
        }
    }
}));
userRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, password, phone } = req.body;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(406).json({ message: "required fields or invalid ID" });
        return;
    }
    if (!name && !email && !password && !phone) {
        res.status(400).json({ message: "No fields provided to update" });
        return;
    }
    try {
        const user = yield userController.getUserById(id);
        if (!user) {
            res.status(404).json({ message: "user-not-found" });
            return;
        }
        const updatedUser = yield userController.updateUser(id, { name, email, password, phone });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}));
userRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(406).json({ message: "required fields" });
    }
    try {
        const userDelete = yield userController.deleteUser(id);
        if (userDelete) {
            res.status(200).json({ message: "user delete sucellesfull" });
        }
    }
    catch (error) {
        if (error.message === 'user-not-found') {
            res.status(404).json({ message: "user-not-found" });
            return;
        }
        else {
            res.status(500).json({ message: "Internal server error", error });
            return;
        }
    }
}));
userRouter.post('/validate-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = (0, authMiddleware_1.verifyToken)(req);
        const user = yield userController.getUserById(userId);
        if (user) {
            res.status(200).json({ message: 'token-valid' });
        }
    }
    catch (error) {
        console.error('Error validating token:', error);
        if (error.message === 'no-token') {
            res.status(401).json({ message: 'no-token' });
        }
        else if (error.message === 'invalid-token') {
            res.status(401).json({ message: 'token-expired' });
        }
        else {
            res.status(500).json({ message: 'internal-error' });
        }
    }
}));
exports.default = userRouter;
