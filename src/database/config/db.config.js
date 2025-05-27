import dotenv from "dotenv";

dotenv.config();

// configuration for the database connection based on the environment (development, test, production)
export default {
  development: {
    use_env_variable: "DEV_DATABASE_URL",
  },
  test: {
    use_env_variable: "TEST_DATABASE_URL",
    // dialect: "postgres",
    dialectOptions: {
      ssl: process.env.NODE_ENV === "production", // set this value based on your environment
    },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialectOptions: {
      ssl: {
        // enable this for production environment only if using a secure connection
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
