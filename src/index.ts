/* eslint-disable no-console */
import cors from 'cors';
import express from 'express';
import { config } from './config/index';
import routes from './routes/routes';

const app = express();

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }))

routes(app);

app.listen(config.port, () => {
  console.log(`\nListening http://localhost:${config.port}\n`);
});