const databaseUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodekb';

module.exports = {
  database: databaseUrl,
  secret: 'yoursecret'
}
