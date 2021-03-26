"use strict";

const outDir = "public";
const argv = process.argv.slice(2);
const isProduction = argv.indexOf("--production") !== -1;

process.env.NODE_ENV = isProduction?"production":"development";

require("esbuild")
  .build({
    entryPoints: ["src/index.js"],
    bundle: true,
    loader: { ".js": "jsx" },
    outdir: outDir,
    minify: isProduction,
    metafile: true,
    define: {
      "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
    },
  })
  .then((result) => {
    if (isProduction) {
      require("fs").writeFileSync(
        `${outDir}/bundleMeta.json`,
        JSON.stringify(result.metafile)
      );
    }
  })
  .catch(() => process.exit(1));