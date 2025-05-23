import {DB} from '../database/index.js';
import sequelize from '../database/config/sequelize.js';

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the database');

    await DB.sequelize.sync({
      force: false
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

export default connectDB;
