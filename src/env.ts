import dotenv from 'dotenv';
import path from 'path';
import pkg from '../package.json';

// Load .env file or for tests the .env.test file.
dotenv.config({ path: path.join(process.cwd(), `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`) });

type TApp = {
  version: string;
  description: string;
  name: string;
  port: string | number;
};

type TDatabase = {
  url: string;
};

type TTelegram = {
  botToken: string;
};

interface IEnv {
  nodeEnvoirment: string;
  isProduction: boolean;
  isTest: boolean;
  isDevelopment: boolean;
  app: TApp;
  database: TDatabase;
  telegram: TTelegram;
}

// Envoirment variables
const env: IEnv = {
  nodeEnvoirment: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    version: (pkg as any).version,
    description: (pkg as any).description,
    name: (pkg as any).name,
    port: process.env.PORT || 5000,
  },
  database: {
    url:
      process.env.DB_URL || 'mongodb+srv://<user>:<password>@<cluster_url>/<database_name>?retryWrites=true&w=majority',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  },
};

export default env;
