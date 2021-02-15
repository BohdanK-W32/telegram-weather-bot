import dotenv from 'dotenv';
import path from 'path';
import pkg from '../package.json';

// Load .env file or for tests the .env.test file.
dotenv.config({ path: path.join(process.cwd(), `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`) });

type AppType = {
  version: string;
  description: string;
  name: string;
  port: string | number;
};

type DatabaseType = {
  url: string;
  cluster?: string;
  username?: string;
  password?: string;
  name?: string;
};

type TelegramType = {
  botToken: string;
};

type WeatherApiType = {
  url: string;
  key?: string;
};

interface EnvInterface {
  nodeEnvoirment: string;
  isProduction: boolean;
  isTest: boolean;
  isDevelopment: boolean;
  app: AppType;
  database: DatabaseType;
  telegram: TelegramType;
  weatherApi: WeatherApiType;
}

// Envoirment variables
const env: EnvInterface = {
  nodeEnvoirment: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    version: (pkg as any).version,
    description: (pkg as any).description,
    name: (pkg as any).name,
    port: process.env.PORT || 5000
  },
  database: {
    // eslint-disable-next-line
    url: `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    cluster: process.env.DB_CLUSTER_URL,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_USER_PASSWORD,
    name: process.env.DB_NAME
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || ''
  },
  weatherApi: {
    url: `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/`,
    key: process.env.DARK_SKY_API_KEY
  }
};

export default env;
