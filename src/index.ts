import express from 'express';
import env from 'env';
import database from 'config/database';
import bot from 'bot';
import 'i18n';

const app = express();

database();

bot.launch();

app.all('*', (req, res) => res.status(200).end());
app.listen(env.app.port, () => console.info(`Server started on ${env.app.port} port`));
