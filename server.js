const app = require('./app');

const port = 3000;
app.listen(port, () => {
    console.log(`[app.js] App running on port ${port}`);
});