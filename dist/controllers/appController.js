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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const appModel_1 = require("../models/appModel");
class AppController {
    getApps() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield appModel_1.App.find().exec();
        });
    }
    getAppById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield appModel_1.App.findById(id).exec();
            if (!app) {
                throw new Error('error-get-app');
            }
            return app;
        });
    }
    createApp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newApp = new appModel_1.App(data);
            return yield newApp.save();
        });
    }
    updateApp(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield appModel_1.App.findByIdAndUpdate(id, data, { new: true }).exec();
            if (!app) {
                throw new Error('error-get-app');
            }
            return app;
        });
    }
    deleteApp(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield appModel_1.App.findById(id).exec();
            if (!app) {
                throw new Error('app-not-found');
            }
            yield appModel_1.App.findByIdAndDelete(id).exec();
            return { message: 'App deleted successfully' };
        });
    }
}
exports.AppController = AppController;
