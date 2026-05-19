import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm, mkdir, writeFile } from "node:fs/promises";

// Plugins (e.g. 'esbuild-plugin-pino') may use `require` to resolve dependencies
globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

const EXTERNAL = [
  "*.node",
  "sharp",
  "better-sqlite3",
  "sqlite3",
  "canvas",
  "bcrypt",
  "argon2",
  "fsevents",
  "re2",
  "farmhash",
  "xxhash-addon",
  "bufferutil",
  "utf-8-validate",
  "ssh2",
  "cpu-features",
  "dtrace-provider",
  "isolated-vm",
  "lightningcss",
  "pg-native",
  "oracledb",
  "mongodb-client-encryption",
  "nodemailer",
  "handlebars",
  "knex",
  "typeorm",
  "protobufjs",
  "onnxruntime-node",
  "@tensorflow/*",
  "@prisma/client",
  "@mikro-orm/*",
  "@grpc/*",
  "@swc/*",
  "@aws-sdk/*",
  "@azure/*",
  "@opentelemetry/*",
  "@google-cloud/*",
  "@google/*",
  "googleapis",
  "firebase-admin",
  "@parcel/watcher",
  "@sentry/profiling-node",
  "@tree-sitter/*",
  "aws-sdk",
  "classic-level",
  "dd-trace",
  "ffi-napi",
  "grpc",
  "hiredis",
  "kerberos",
  "leveldown",
  "miniflare",
  "mysql2",
  "newrelic",
  "odbc",
  "piscina",
  "realm",
  "ref-napi",
  "rocksdb",
  "sass-embedded",
  "sequelize",
  "serialport",
  "snappy",
  "tinypool",
  "usb",
  "workerd",
  "wrangler",
  "zeromq",
  "zeromq-prebuilt",
  "playwright",
  "puppeteer",
  "puppeteer-core",
  "electron",
];

const CJS_BANNER = {
  js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
  `,
};

const SHARED = {
  platform: "node",
  bundle: true,
  format: "esm",
  external: EXTERNAL,
  banner: CJS_BANNER,
};

async function buildAll() {
  const distDir = path.resolve(artifactDir, "dist");
  // .vercel/output is the Vercel Build Output API directory — Vercel reads this
  // instead of scanning the project for functions heuristically.
  const vercelOutputDir = path.resolve(artifactDir, ".vercel/output");

  await rm(distDir, { recursive: true, force: true });
  await rm(vercelOutputDir, { recursive: true, force: true });

  // 1. Main server bundle — used for local dev / self-hosted deployments
  await esbuild({
    ...SHARED,
    entryPoints: [path.resolve(artifactDir, "src/index.ts")],
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    sourcemap: "linked",
    plugins: [
      esbuildPluginPino({ transports: ["pino-pretty"] }),
    ],
  });

  // 2. Vercel serverless handler — compiled by esbuild (no @vercel/node TypeScript step)
  //    Placed in the Build Output API structure so Vercel knows exactly what to deploy.
  const funcDir = path.resolve(vercelOutputDir, "functions/api/index.func");
  await mkdir(funcDir, { recursive: true });

  await esbuild({
    ...SHARED,
    entryPoints: [path.resolve(artifactDir, "src/app.ts")],
    outfile: path.resolve(funcDir, "index.mjs"),
    logLevel: "info",
    sourcemap: false,
  });

  // Tell Vercel how to launch the function
  await writeFile(
    path.resolve(funcDir, ".vc-config.json"),
    JSON.stringify(
      {
        runtime: "nodejs20.x",
        handler: "index.mjs",
        launcherType: "Nodejs",
        shouldAddHelpers: false,
        shouldAddSourcemapSupport: false,
      },
      null,
      2,
    ),
  );

  // Vercel Build Output API routing config — all requests go to the function
  await writeFile(
    path.resolve(vercelOutputDir, "config.json"),
    JSON.stringify(
      {
        version: 3,
        routes: [{ src: "/(.*)", dest: "/api/index" }],
      },
      null,
      2,
    ),
  );
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
