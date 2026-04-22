// Render Deploy Fix

import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { registerOAuthRoutes } from "./auth.js"; 
import { appRouter } from "./router.js";         
import { createContext } from "./context.js";       
import { createExpressMiddleware } from "@trpc/server/adapters/express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());

  // 1. API & OAuth Routes
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // 2. Static Files
  const publicPath = path.join(process.cwd(), 'dist', 'public');
  app.use(express.static(publicPath));

  // 3. Catch-all for Frontend
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  const port = process.env.PORT || 3000;
  server.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);
