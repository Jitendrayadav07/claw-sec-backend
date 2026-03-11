const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend Workflow API",
      version: "1.0.0",
      description: "Registration, Login, and API key usage",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}/api`,
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
