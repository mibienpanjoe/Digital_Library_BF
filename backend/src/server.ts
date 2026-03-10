import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📚 Digital Library BF — Backend API`);
  console.log(`🌍 Environnement : ${env.NODE_ENV}`);
  console.log(`❤️  Health check : http://localhost:${PORT}/health`);
});
