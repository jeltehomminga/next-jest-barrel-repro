import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Opt-in workaround: MUI_MODULARIZE=1 rewrites every named import from
  // '@mui/material' to '@mui/material/<Name>'. next/jest does pass this on.
  ...(process.env.MUI_MODULARIZE === "1" && {
    modularizeImports: {
      "@mui/material": { transform: "@mui/material/{{member}}" },
    },
  }),
};

export default nextConfig;
