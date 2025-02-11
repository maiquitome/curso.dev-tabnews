import { Client } from "pg";
import { ServiceError } from "./errors.js";

async function query(queryObject) {
  // console.log("process.env.POSTGRES_DATABASE", process.env.POSTGRES_DATABASE);
  // resultado do console.log é undefined

  // Porque POSTGRES_DATABASE mesmo não existindo mais no arquivo .env não quebrou os testes?

  // Quando a variável POSTGRES_DB não é fornecida para a imagem,
  // ela usa o valor da variável POSTGRES_USER, que por padrão é postgres.
  // Todavia, o comportamento ao qual o Filipe se refere na aula, responsável
  // por não quebrar os testes, é atribuído ao módulo pg,
  // que percebe que a propriedade database está com o valor undefined e
  // que recorre então ao valor fornecido na propriedade user.

  // https://curso.dev/alunos/HenriqueNas/b907f191-6823-495b-84b3-bb9494c525c4
  // https://curso.dev/alunos/Andrei/86e5c64f-d0a7-4ecf-8803-4f406402826c
  // https://curso.dev/alunos/Andrei/dd95f5bd-457c-4eed-921c-2cdc2de48bce

  // const client = new Client({
  //   host: process.env.POSTGRES_HOST,
  //   port: process.env.POSTGRES_PORT,
  //   user: process.env.POSTGRES_USER,
  //   database: process.env.POSTGRES_DB,
  //   // database: process.env.POSTGRES_DATABASE,
  //   password: process.env.POSTGRES_PASSWORD,
  //   ssl: getSSLValues(),
  // });

  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    // só fazer o log, causa outro problema, que é engolir o erro, sem tratar esse erro, por exemplo mostrar uma mensagem de erro para o usuário
    // console.error(error);
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com Banco ou na Query.",
      cause: error,
    });

    throw serviceErrorObject; // para esse erro ser lançado de novo, continuar borbulhando até o Next.js e devolver um erro 500 na requisição
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    // database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

// export default {
//   query: query,
//   getNewClient: getNewClient
// };

export default database;

function getSSLValues() {
  const isThereCertificateAuthority = process.env.POSTGRES_CA;

  if (isThereCertificateAuthority)
    return {
      ca: process.env.POSTGRES_CA,
    };

  return process.env.NODE_ENV === "production";
}
