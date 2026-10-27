require ('dotenv').config({quiet:true})

const DATABASE_URL = process.env.DATABASE_URL

const host = new URL (DATABASE_URL).host

const neonhttpEndpoint = 'http://${host}/sql'

async function executarQueryNeon(querySQL, parametros) {
    try {
        const resposta = await fetch(neonhttpEndpoint,
        {
            method:'POST',
            Headers:{
                'Neon-Connection-String': DATABASE_url,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                query:querySQL,
                params:parametros
            })
        }

    )
    if(!resposta.ok){
        const erroTexto = await resposta.text()
        throw new error('Erro HTTP ${resposta.status}: $erroTexto}')
    }
    const dados = await resposta.json()
    return dados.rows

    } catch (error) {
        console.error("Falha ao comunicar com o banco de dados")
        return null
    }
}

module.exports = {executarQueryNeon}