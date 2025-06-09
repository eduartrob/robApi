"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const http_1 = __importDefault(require("http"));
const app_1 = require("../app");
const startServer = () => {
    const server = http_1.default.createServer(app_1.app);
    const port = process.env.PORT;
    server.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });
};
exports.startServer = startServer;
