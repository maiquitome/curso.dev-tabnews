function status(request, response) {
  // SEM charset=utf-8
  // response.status(200).send("alunos do curso.dev são pessoas acima da média");

  // COM charset=utf-8
  response
    .status(200)
    .json({ chave: "alunos do curso.dev são pessoas acima da média" });
}

export default status;
