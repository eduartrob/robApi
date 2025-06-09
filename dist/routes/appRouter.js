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
const appController_1 = require("../controllers/appController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const appController = new appController_1.AppController();
const appRouter = (0, express_1.Router)();
appRouter.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apps = yield appController.getApps();
        res.status(200).json(apps);
    }
    catch (error) {
        res.status(500).json({ error: 'error getting apps' });
    }
}));
appRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(406).json({ message: "required fields or invalid ID" });
        return;
    }
    try {
        const app = yield appController.getAppById(id);
        if (app) {
            res.status(200).json(app);
        }
    }
    catch (error) {
        if (error.message === 'error-get-app') {
            res.status(404).json({ message: "app-not-found" });
            return;
        }
        else {
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    }
}));
appRouter.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, size, version, releaseDate, imageUrl } = req.body;
    if (!name || !description || !size || !version || !releaseDate || !imageUrl) {
        res.status(406).json({ message: "required fields" });
        return;
    }
    let userId;
    try {
        const tokenData = (0, authMiddleware_1.verifyToken)(req); // misma función que ya vimos
        userId = tokenData.userId;
    }
    catch (error) {
        let message;
        if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
            message = error.message === 'no-token' ? 'Token not provided' : 'Invalid or expired token';
        }
        else {
            message = 'Invalid or expired token';
        }
        res.status(401).json({ message });
        return;
    }
    try {
        const newApp = yield appController.createApp({
            name,
            description,
            size,
            version,
            releaseDate,
            imageUrl,
            developerId: userId
        });
        res.status(201).json(newApp);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}));
appRouter.put('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, size, version, releaseDate, imageUrl } = req.body;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(406).json({ message: "required fields or invalid ID" });
        return;
    }
    let userId;
    try {
        const tokenData = (0, authMiddleware_1.verifyToken)(req); // función que extrae userId del token
        userId = tokenData.userId;
    }
    catch (error) {
        let message;
        if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
            message = error.message === 'no-token' ? 'Token not provided' : 'Invalid or expired token';
        }
        else {
            message = 'Invalid or expired token';
        }
        res.status(401).json({ message });
        return;
    }
    try {
        // Paso 1: obtener la app
        const app = yield appController.getAppById(id); // debe retornar la app con userId incluido
        if (!app) {
            res.status(404).json({ message: "app-not-found" });
            return;
        }
        // Paso 2: verificar que la app le pertenece al usuario autenticado
        if (app.developerId !== userId) {
            res.status(403).json({ message: "No tienes permiso para editar esta app" });
            return;
        }
        // Paso 3: actualizar si todo está OK
        const updatedApp = yield appController.updateApp(id, {
            name,
            description,
            size,
            version,
            releaseDate,
            imageUrl
        });
        res.status(200).json(updatedApp);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}));
appRouter.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(406).json({ message: "required fields or invalid ID" });
        return;
    }
    let userId;
    try {
        const tokenData = (0, authMiddleware_1.verifyToken)(req); // extrae userId del token
        userId = tokenData.userId;
    }
    catch (error) {
        let message;
        if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
            message = error.message === 'no-token' ? 'Token not provided' : 'Invalid or expired token';
        }
        else {
            message = 'Invalid or expired token';
        }
        res.status(401).json({ message });
        return;
    }
    try {
        const app = yield appController.getAppById(id); // debe incluir userId
        if (!app) {
            res.status(404).json({ message: "app-not-found" });
            return;
        }
        if (app.developerId !== userId) {
            res.status(403).json({ message: "No tienes permiso para eliminar esta app" });
            return;
        }
        yield appController.deleteApp(id); // debes implementar esto en tu controlador
        res.status(200).json({ message: "App eliminada correctamente" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}));
exports.default = appRouter;
