import mongoose, {Schema, Document} from "mongoose";

export interface AppDocument extends Document {
    name: string;
    description: string;
    size: number;
    version: string;
    developerId: string;
    releaseDate: Date;
    imageUrl: string; 
}

const AppSchema: Schema<AppDocument> = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    size: { type: Number, required: true },
    version: { type: String, required: true },
    developerId: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    imageUrl: { type: String, required: true }
});

export const App = mongoose.model<AppDocument>('App', AppSchema);