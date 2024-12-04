import database from "infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 as sum;");
  console.log(result.rows);

  // SEM charset=utf-8
  // response
  //  .status(200)
  //  .send("alunos do curso.dev são pessoas acima da média");

  // COM charset=utf-8
  response
    .status(200)
    .json({ chave: "alunos do curso.dev são pessoas acima da média" });
}

export default status;
