require('dotenv').config();
module.exports = {
  database: `mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`,
  secret: "itsmyverysecretthing"
};
