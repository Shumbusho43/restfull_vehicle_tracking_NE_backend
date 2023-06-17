//setting up server
const express = require('express');
const swaggerAutogen = require('swagger-autogen')();
const swaggerFile = require('./testing.json')
const cors = require("cors");
const fileUpload = require("express-fileupload")
const swaggerUi = require("swagger-ui-express");
const cookieParser = require('cookie-parser');
const swaggerDocs = require("./swagger.json")
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {
    dbConnection
} = require('./models/db');
const {
    userRouter
} = require('./routes/user/user.routes');
const {
    vehicleRouter
} = require('./routes/vehicle/vehicle.routes');
const {
    ownerRoutes
} = require('./routes/owner/owner.routes');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'))
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
const helmet = require('helmet');
app.use(helmet());
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
const xss = require('xss-clean');
app.use(xss());
const hpp = require('hpp');
app.use(hpp());
//documentation
// app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs, false, {
//     docExpansion: "none"
// }))
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerFile, false, {
    docExpansion: "none"
}))
app.use("/", userRouter)
app.use("/", vehicleRouter)
app.use("/", ownerRoutes)

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
//connecting to database
dbConnection();