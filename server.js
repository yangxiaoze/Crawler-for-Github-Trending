const expresshbs = require('express-handlebars');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const { errorHandler } = require('./middleware');

const app = express();

app.use(bodyParser.json());
app.use(errorHandler);

app.engine('handlebars', expresshbs({
                            defaultView: 'home',
                            defaultLayout: 'main',
                         }),
);
app.set('view engine', 'handlebars');

app.use('/', routes);

// Server Main
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.listen(3000, () => console.log('Listening on port 3000!'))
