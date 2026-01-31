import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express server is running');
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
