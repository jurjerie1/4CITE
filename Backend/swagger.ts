import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "4CITE API Documentation",
      version: "1.0.0",
      description: "Documentation de l'API 4CITE",
      contact: {
        name: "Équipe de développement 4CITE"
      }
    },
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: "Utilisateurs",
        description: "Opérations liées aux utilisateurs"
      }
      // Ajoutez d'autres tags pour d'autres groupes d'API ici
    ]
  },
  // Spécifiez les fichiers à analyser pour la documentation Swagger
  apis: [
    path.join(__dirname, "./routes/*.ts"), 
    path.join(__dirname, "./routes/*.js"),
    path.join(__dirname, "./middlewares/*.ts"),
    path.join(__dirname, "./middlewares/*.js")
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  // Interface de documentation Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API 4CITE - Documentation"
  }));

  // Endpoint pour récupérer la spécification Swagger en JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("Documentation Swagger disponible sur /api-docs");
}