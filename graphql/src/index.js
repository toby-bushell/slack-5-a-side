const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const db = require('./db');
const { decrypt } = require('./encryption');
const createServer = require('./createServer');
const bodyParser = require('body-parser');
const server = createServer();
server.express.use(cookieParser());

server.express.use(bodyParser.json());
server.express.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Handle if from slack api endpoints
server.express.use((req, res, next) => {
  const auth = req.headers.authorization;
  // If auth headers sent
  if (auth && decrypt(auth) === process.env.SLACK_TO_GRAPHQL_PASSWORD) {
    req.userId = 'SLACK';
  }
  next();
});

// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }
  console.log('\x1b[31m', 'user id:', req.userId, '\x1b[0m');

  next();
});

server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions, email, name }'
  );
  req.user = user;

  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: [process.env.FRONTEND_URL]
    }
  },
  details => {
    console.log(`server is running on port http://localhost:${details.port}`);
  }
);
