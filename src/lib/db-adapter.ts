import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Builds the mariadb driver adapter from a MySQL/TiDB connection URL.
// TLS is enabled automatically for any non-local host — managed databases
// like TiDB Cloud and PlanetScale require it. Local dev (localhost) stays plain.
export function makeMariaAdapter(databaseUrl: string): PrismaMariaDb {
  const url = new URL(databaseUrl);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";

  // Diagnostic (no password) — shows up in Vercel function logs so we can
  // confirm which host/db the deployed app is actually using.
  console.info("[db] adapter target", {
    host: url.hostname,
    port: url.port || "3306",
    database: url.pathname.replace(/^\//, "") || "(none)",
    user: decodeURIComponent(url.username),
    ssl: !isLocal,
    nodeEnv: process.env.NODE_ENV,
    hasDbUrl: Boolean(process.env.DATABASE_URL),
  });

  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, "") || undefined,
    // `true` enables TLS with the system CA store + SNI (works with TiDB Cloud).
    ssl: isLocal ? undefined : true,
    // The driver default connectTimeout is only 1s — too short to open a TLS
    // socket to a managed DB from a distant serverless region (Vercel). Raise it.
    connectTimeout: isLocal ? undefined : 30_000,
    acquireTimeout: isLocal ? undefined : 30_000,
    // Keep the per-instance pool small on serverless to avoid exhausting the
    // managed DB's connection limit across many concurrent lambdas.
    connectionLimit: isLocal ? undefined : 5,
  });
}
