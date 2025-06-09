import * as authService from '../services/authService'
import { UserDocument, User } from '../models/userModel'

export class UserController {
    async getUsers() {
        return await User.find().exec();    
    }
    async getUserById(id: string): Promise<UserDocument | null> {
        const user = await User.findById(id).exec();
        if (!user) {
            throw new Error('error-get-user');
        }
        return user;
    }
    async getUserByName(name: string, email: string, phone: string): Promise<UserDocument | null> {
        const user = await User.findOne({ name, email, phone }).exec();
        if (user) {
            throw new Error('get-user');
        }
        return user;
    }

    async createUser(data:{name: string, email: string, password: string, phone: string}): Promise<UserDocument> {
        const hashPassword = await authService.hashPassword(data.password);
        const newUser = new User({ ...data, password: hashPassword });
        return await newUser.save();
    }

    async getUserByUsername(email: string, password: string): Promise<string> {
        const user = await User.findOne({ email }).exec();
        if (!user || !(await authService.comparePassword(password, user.password))) {
            throw new Error('invalid-credentials');
        }
        const token = authService.generateToken({ id: user._id, email: user.email });
        return token;
    }

    async updateUser(id: string, data: { name?: string, email?: string, password?: string, phone?: string }): Promise<UserDocument | null> {
        const user = await User.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!user) {
            throw new Error('error-get-user');
        }
        return user;
    }

    async deleteUser(id: string): Promise<{ message: string }> {
        const user = await User.findById(id).exec();
        if (!user) {
            throw new Error('user-not-found');
        }
        await User.findByIdAndDelete(id).exec();
        return { message: 'User deleted successfully' };
    }
}