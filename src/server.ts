import mongoose from 'mongoose';
import app from './app';
import config from './config';

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    // eslint-disable-next-line no-console
    console.log('✅ Database connected successfully');

    if (process.env.NODE_ENV !== 'production') {
      app.listen(config.port, () => {
        // eslint-disable-next-line no-console
        console.log(`✅ RideX server is running on port ${config.port}`);
      });
    }

  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to connect to database', err);
  }
}

main();

export default app;