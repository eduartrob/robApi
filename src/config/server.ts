import http from 'http';
import { app } from '../app';

const startServer = () => {
  const server = http.createServer(app);
  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};

export { startServer };