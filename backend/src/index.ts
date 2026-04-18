import { serve } from "@hono/node-server";
import app from "./app";

if (!process.env.VERCEL) {
  const port = Number(process.env.PORT ?? 3001);
  console.log(`Quran API is running on http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}

export default app;
