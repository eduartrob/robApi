import { Router } from 'express';
import mongoose from 'mongoose';

import { UserController } from '../controllers/userController';
import { verifyToken } from '../middlewares/authMiddleware';

const userController = new UserController();
const userRouter = Router();

userRouter.get('/all', async (req, res):Promise<void> => {
    try {
        const users = await userController.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'error getting users' });
    }
});
userRouter.get('/:id', async (req, res):Promise<void> => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id) ) {
        res.status(406).json({ message: "required fields or invalid ID" });
        return;
    }
    try {
        const user = await userController.getUserById(id);
        if (user) {
            res.status(200).json(user);
        }
    } catch (error: any) {
        if(error.message === 'error-get-user'){
            res.status(404).json({ message: "user-not-found" });
            return;
        } else {
            res.status(500).json({ message: "Internal server error"});
            return;
        }
    }
});
userRouter.post('/sign-up', async (req, res):Promise<void> => {
    const { name, email, password, phone } = req.body;
    if(!name || !email || !password || !phone){
        res.status(406).json({ message: "required fields" });
        return;
    }
    try {
        const existUser = await userController.getUserByName(name, email, phone);
        if (!existUser) {
            const newUser = await userController.createUser({ name, email, password, phone });
            res.status(201).json(newUser);
        }
    } catch (error: any) {
        if (error.message === 'get-user') {
            res.status(409).json({ error: 'name-email-phone already exists' });
        } else {
            res.status(500).json({ message: "Internal server error", error });
        }
    }
});
userRouter.post('/sign-in', async (req, res):Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(406).json({ message: "required fields" });
        return;
    }
    try {
        const userData = await userController.getUserByUsername(email, password);
        if (userData) {
            res.status(200).json({ token: userData });
            return;
        }
    } catch (error: any) {
        if (error.message === 'invalid-credentials') {
            res.status(404).json({ message: "email-password-incorrect" });
            return;
        } else {
            res.status(500).json({ message: "Internal server error", error });
            return;
        }
    }
});
userRouter.put('/:id', async (req, res):Promise<void> => {
    const { id } = req.params;
    const { name, email, password, phone } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)){
        res.status(406).json({ message: "required fields or invalid ID" });
        return;
    }
    if (!name && !email && !password && !phone) {
        res.status(400).json({ message: "No fields provided to update" });
        return;
    }
    try {
        const user = await userController.getUserById(id);
        if (!user) {
            res.status(404).json({ message: "user-not-found" });
            return;
        }
        const updatedUser = await userController.updateUser(id, { name, email, password, phone });
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error });
    }
}); 
userRouter.delete('/:id', async (req, res):Promise<void> => {
    const { id } = req.params;
    if(!id){
        res.status(406).json({message: "required fields"})
    }
    try {
        const userDelete = await userController.deleteUser(id)
        if(userDelete){
            res.status(200).json({message: "user delete sucellesfull"})
        }
    } catch (error: any) {
        if (error.message === 'user-not-found') {
            res.status(404).json({ message: "user-not-found" });
            return;
        } else {
            res.status(500).json({ message: "Internal server error", error });
            return;
        }
    }
})

userRouter.post('/validate-token', async (req, res): Promise<void> => {
  try {
    const { userId } = verifyToken(req);
    const user = await userController.getUserById(userId);
    if (user) {
      res.status(200).json({ message: 'token-valid' });
    }
  } catch (error: any) {
    console.error('Error validating token:', error);
    if (error.message === 'no-token') {
      res.status(401).json({ message: 'no-token' });
    } else if (error.message === 'invalid-token') {
      res.status(401).json({ message: 'token-expired' });
    } else {
      res.status(500).json({ message: 'internal-error' });
    }
  }
});


export default userRouter;