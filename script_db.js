const DATABASE_URL ="postgresql://neondb_owner:npg_EYeoQ2kqzDh3@ep-rough-hat-ackqxtdm-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
// const API_KEY_ = "napi_otf765yja0u3avf951z6x4bqdydfx5uacamgz9us2qzgwt13gdf2t3s1xvwfi87i"
const host = new URL(DATABASE_URL).host;
const neonHttpEndpoint = `https://${host}/sql`;


async function executarQueryNeon(querySQL, parametros = []) {
    try {
        const resposta = await fetch(neonHttpEndpoint, {
            method: 'POST',
            headers: {
                // Passamos a URL de conexão completa neste cabeçalho específico do Neon
                'Neon-Connection-String': DATABASE_URL,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: querySQL,
                params: parametros // Passar parâmetros assim evita SQL Injection!
            })
        });

        // Se a requisição deu erro (ex: token errado, tabela não existe)
        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(`Erro HTTP ${resposta.status}: ${erroTexto}`);
        }

        // Se deu certo, transforma a resposta em JSON e pega as "linhas" (rows)
        const dados = await resposta.json();
        return dados.rows;

    } catch (erro) {
        console.error("Falha ao comunicar com o banco de dados:", erro);
        return null; // Retorna nulo para o arquivo script.js saber que deu erro
    }
}


/* ==========================================================================
   PASSO 3: FUNÇÕES CRUD (Create, Read, Update, Delete)
   Agora, graças ao nosso "Motor", só precisamos nos preocupar com o SQL!

   CORREÇÃO: todas as funções de escrita retornam true/false em vez do objeto,
   pois é isso que o script.js verifica com "if (sucesso)".
   ========================================================================== */

// --- R (READ / LER) ---
export async function consultarDiretoComFetch() {
    console.log("Buscando todos os usuários no banco...");
    const query = 'SELECT * FROM tarefas';

    const linhas = await executarQueryNeon(query);
    return linhas || []; // Se retornar null (erro), devolvemos array vazio para não quebrar a tela
}

// --- C (CREATE / CRIAR) ---
export async function insertTarefa(id, titulo, descricao) {
    
    console.log("Cadastrando tarefa no banco:", {id, titulo, descricao});
    const query = 'INSERT INTO tarefas (titulo, descricao) VALUES ($1, $2) RETURNING *';
    const params = [titulo, descricao];

    const linhas = await executarQueryNeon(query, params);
    return linhas !== null; // CORREÇÃO: retorna true (sucesso) ou false (erro)
}

// --- U (UPDATE / ATUALIZAR) ---
export async function sqlAtualizarTarefa(id, titulo, descricao) {
    console.log("Atualizando tarefa no banco. ID:", id);
    const query = 'UPDATE tarefas SET titulo = $1, descricao = $2  WHERE id = $3 RETURNING *';
    const params = [titulo, descricao, id]; // A ordem importa! O ID é o $4

    const linhas = await executarQueryNeon(query, params);
    return linhas !== null; // CORREÇÃO: retorna true (sucesso) ou false (erro)
}

// --- D (DELETE / DELETAR) ---
export async function sqlDeletarTarefa(id) {
    console.log("Deletando tarefas do banco. ID:", id);
    const query = 'DELETE FROM tarefas WHERE id = $3 RETURNING *';
    const params = [id];

    const linhas = await executarQueryNeon(query, params);
    return linhas !== null; // CORREÇÃO: retorna true (sucesso) ou false (erro)
}

