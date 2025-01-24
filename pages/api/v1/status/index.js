import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  // const result = await database.query("SELECT 1 + 1 as sum;");
  // console.log(result.rows);

  const updatedAt = new Date().toISOString();
  // retorna '2024-12-05T20:09:27.426Z' => ISO 8601

  // const updatedAt = Date.now();
  // retorna 1733422612203 => Unix timestamp (milliseconds que se passaram desde 01/01/1970 00:00:00)

  const databaseVersionResult = await database.query("SHOW server_version;");
  // const databaseVersionResult = await database.query("SELECT version();");
  // const databaseVersionValue = databaseVersionResult.rows[0].version;
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  // const databaseOpenedConnectionsResult = await database.query(
  //   "SELECT * FROM pg_stat_activity WHERE datname = 'local_db';",
  // );
  const databaseName = process.env.POSTGRES_DB;
  // const databaseOpenedConnectionsResult = await database.query(
  //   "SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';",
  // );
  // const databaseOpenedConnectionsResult = await database.query(
  //   "SELECT count(*)::int FROM pg_stat_activity WHERE datname = '" +
  //     databaseName +
  //     "';",
  // );

  // const databaseOpenedConnectionsResult = await database.query(
  //   `SELECT count(*)::int FROM pg_stat_activity WHERE datname = '${databaseName}';`,
  // );

  // ! SEM SQL INJECTION
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });

  // const databaseOpenedConnectionsValue =
  //   databaseOpenedConnectionsResult.rows.length;
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  // SEM charset=utf-8
  // response
  //  .status(200)
  //  .send("alunos do curso.dev são pessoas acima da média");

  // COM charset=utf-8
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}
