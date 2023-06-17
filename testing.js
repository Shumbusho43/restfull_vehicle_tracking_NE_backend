// const { userRouter } = require('./routes/user/user.routes')

const swaggerAutogen = require('swagger-autogen')()

const outputFile = './testing.json'
const endpointsFiles = ['./routes/user/user.routes', './routes/vehicle/vehicle.routes', './routes/owner/owner.routes']
const doc = {
    info: {
      version: '1.0.0',
      title: 'Your API',
      description: 'API documentation',
    },
    host: 'localhost:2000', // Replace with your server host and port
    basePath: '/',
    schemes: ['http', 'https'],
  };
swaggerAutogen(outputFile, endpointsFiles,doc).then(() => {
    require('./app.js')
})