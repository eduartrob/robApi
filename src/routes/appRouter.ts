import { Router } from 'express';
import mongoose from 'mongoose';

import { AppController } from '../controllers/appController';
import { verifyToken } from '../middlewares/authMiddleware';

 const appController = new AppController();
 const appRouter = Router()

 appRouter.get('/all', async (req, res):Promise<void> => {
    try {
        const apps = await appController.getApps();
        res.status(200).json(apps);
    } catch (error) {
        res.status(500).json({ error: 'error getting apps' });
    }
 })

appRouter.get('/:id', async (req, res):Promise<void> => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(406).json({ message: "required fields or invalid ID" });
        return;
    }
    try {
        const app = await appController.getAppById(id);
        if (app) {
            res.status(200).json(app);
        }
    } catch (error: any) {
        if (error.message === 'error-get-app') {
            res.status(404).json({ message: "app-not-found" });
            return;
        } else {
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    }
});

appRouter.post('/create', async (req, res): Promise<void> => {
    const { name, description, size, version, releaseDate, imageUrl } = req.body;

    if (!name || !description || !size || !version || !releaseDate || !imageUrl) {
        res.status(406).json({ message: "required fields" });
        return;
    }

    let userId: string;
    try {
        const tokenData = verifyToken(req); // misma función que ya vimos
        userId = tokenData.userId;
    } catch (error) {
        let message: string;
        if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
            message = (error as any).message === 'no-token' ? 'Token not provided' : 'Invalid or expired token';
        } else {
            message = 'Invalid or expired token';
        }
        res.status(401).json({ message });
        return;
    }

    try {
        const newApp = await appController.createApp({
        name,
        description,
        size,
        version,
        releaseDate,
        imageUrl,
        developerId: userId
        });

        res.status(201).json(newApp);
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

appRouter.put('/update/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const { name, description, size, version, releaseDate, imageUrl } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(406).json({ message: "required fields or invalid ID" });
    return;
  }

  let userId: string;

  try {
    const tokenData = verifyToken(req); // función que extrae userId del token
    userId = tokenData.userId;
  } catch (error) {
    let message: string;
    if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
      message = (error as any).message === 'no-token' ? 'Token not provided' : 'Invalid or expired token';
    } else {
      message = 'Invalid or expired token';
    }
    res.status(401).json({ message });
    return;
  }

  try {
    // Paso 1: obtener la app
    const app = await appController.getAppById(id); // debe retornar la app con userId incluido

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
    const updatedApp = await appController.updateApp(id, {
      name,
      description,
      size,
      version,
      releaseDate,
      imageUrl
    });

    res.status(200).json(updatedApp);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

appRouter.delete('/delete/:id', async (req, res): Promise<void> => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(406).json({ message: "required fields or invalid ID" });
    return;
  }

  let userId: string;

  try {
    const tokenData = verifyToken(req); // extrae userId del token
    userId = tokenData.userId;
  } catch (error) {
    let message: string;
    if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
      message = (error as any).message === 'no-token' ? 'Token not provided' : 'Invalid or expired token';
    } else {
      message = 'Invalid or expired token';
    }
    res.status(401).json({ message });
    return;
  }

  try {
    const app = await appController.getAppById(id); // debe incluir userId

    if (!app) {
      res.status(404).json({ message: "app-not-found" });
      return;
    }

    if (app.developerId !== userId) {
      res.status(403).json({ message: "No tienes permiso para eliminar esta app" });
      return;
    }

    await appController.deleteApp(id); // debes implementar esto en tu controlador

    res.status(200).json({ message: "App eliminada correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

export default appRouter;

