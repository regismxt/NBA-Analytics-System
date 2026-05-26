import { app } from "./app";
import { env } from "./config/env";

app.listen(env.BACKEND_PORT, () => {
  console.log(`NBA Live Analytics API running on http://localhost:${env.BACKEND_PORT}/api`);
});
