const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helper');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    helpers
});
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const session = { 
    seceret: process.env.DB_SECRET,
    cookie: {},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 1000 * 60 * 15, //checks every 15 mins
        expiration: 1000 * 60 * 45 // expires after 45 mins
    })
};

const app =express();
const PORT = process.env.PORT || 3001;
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(session(session));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(routes);
sequelize.sync ();

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}!`);
});