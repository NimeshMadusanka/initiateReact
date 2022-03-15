/* eslint-disable */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
// swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LWL APIs',
      version: '1.0.0',
      description: 'LWL Service Endpoints',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
      // add other production url here
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/controllers/*.js'],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use('/lwl-api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
const routes = require('./src/controllers/index');

routes.forEach(([name, handler]) => app.use(`/${name}`, handler));

const port = process.env.PORT;
const connectionURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4ymuz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
/*eslint-disable */
console.log('connectionURI', connectionURI);
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('process.env.PORT', process.env.PORT);
console.log('process.env.JWT_KEY', process.env.JWT_KEY);
console.log('process.env.DB_USER', process.env.DB_USER);
console.log('process.env.DB_PASSWORD', process.env.DB_PASSWORD);
console.log('process.env.DB_NAME', process.env.DB_NAME);
console.log('process.env.CLIENT_ID', process.env.CLIENT_ID);
console.log('process.env.REFRESH_KEY', process.env.CLIENT_SECRET);
console.log('process.env.CLIENT_URL', process.env.CLIENT_URL);
console.log('process.env.SENDGRID_API_KEY', process.env.SENDGRID_API_KEY);
console.log('process.env.TWILIO_ACCOUNT_SID', process.env.TWILIO_ACCOUNT_SID);
console.log('process.env.TWILIO_AUTH_TOKEN', process.env.TWILIO_AUTH_TOKEN);
/* eslint-enable */
mongoose.connect(connectionURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // eslint-disable-next-line
  console.log('LWL DB Connected!');
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Process ${process.pid}, ${port} ${process.env.NODE_ENV}`);
});
