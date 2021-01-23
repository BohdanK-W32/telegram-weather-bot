import mongoose from 'mongoose';
import env from 'env';

const database = mongoose.connection;

const connectDatabase = () => {
  mongoose.connect(env.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  database.on('error', console.error.bind(console, 'Database connection error:'));
  database.once('open', () => console.info('Database connected successfully'));
};

export default connectDatabase;
