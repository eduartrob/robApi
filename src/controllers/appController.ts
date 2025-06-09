import { AppDocument, App } from "../models/appModel";

export class AppController {
    async getApps(): Promise<AppDocument[]> {
        return await App.find().exec();
    }

    async getAppById(id: string): Promise<AppDocument | null> {
        const app = await App.findById(id).exec();
        if (!app) {
            throw new Error('error-get-app');
        }
        return app;
    }

    async createApp(data: { name: string, description: string, size: number, version: string, developerId: string, releaseDate: Date, imageUrl: string }): Promise<AppDocument> {
        const newApp = new App(data);
        return await newApp.save();
    }

    async updateApp(id: string, data: { name?: string, description?: string, size?: number, version?: string, developerId?: string, releaseDate?: Date, imageUrl?: string }): Promise<AppDocument | null> {
        const app = await App.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!app) {
            throw new Error('error-get-app');
        }
        return app;
    }

    async deleteApp(id: string): Promise<{ message: string }> {
        const app = await App.findById(id).exec();
        if (!app) {
            throw new Error('app-not-found');
        }
        await App.findByIdAndDelete(id).exec();
        return { message: 'App deleted successfully' };
    }
}