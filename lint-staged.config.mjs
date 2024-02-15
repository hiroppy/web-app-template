export default {
  "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
    "biome check --apply --no-errors-on-unmatched",
  ],
  "*.{md,yml}": ["prettier --write"],
};
