require('dotenv').config({ path: 'variables.env' });

const cookieParser = require('cookie-parser'),
  jwt = require('jsonwebtoken'),
  createServer = require('./createServer'),
  db = require('./db'),
  server = createServer();

// TODO Use express middlware to handle cookies (JWT)
server.express.use(cookieParser());
// TODO Use express middlware to populate current user ( userId )
server.express.use((req, res, next) => {
  // decode the JWT so we can get the user Id on each request
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // use APP_SECRET in verify to further prove tempering
    // put the userId onto the req for future requests to access
    // ctx.request.userId
    req.userId = userId;
  }
  next();
});
// middle ware: for accessing current user on each request
server.express.use(async (req, res, next) => {
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
      // only specific url can access the app
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
