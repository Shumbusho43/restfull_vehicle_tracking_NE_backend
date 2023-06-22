const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swaggerDoc.json'
const endpointsFiles = ['./routes/user/user.routes', './routes/vehicle/vehicle.routes', './routes/owner/owner.routes']
const doc = {
  info: {
    version: "1.0.0",
    title: "My API",
    description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
  },
  host: "localhost:5000",
  basePath: "/",
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [{
    "name": "User",
    "description": "Endpoints"
  }],
  securityDefinitions: {
    api_key: {
      type: "apiKey",
      name: "api_key",
      in: "header"
    },
  },
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app.js')
})