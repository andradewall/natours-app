require('dotenv').config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[app.js] App running on port ${port}`);
});
