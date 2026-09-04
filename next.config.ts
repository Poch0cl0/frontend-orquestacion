import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // El indicador flotante de desarrollo tapa el estado de conexión de la barra lateral.
  devIndicators: false,
  // El proyecto vive dentro del perfil de usuario; fija la raíz para que Turbopack
  // no intente resolver lockfiles fuera del directorio del proyecto.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
