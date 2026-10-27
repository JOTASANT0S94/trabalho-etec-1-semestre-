//este arquivo croda no Navegador (cliente)
//ele não fala com o NEON: Chama as rotas /api do nosso server



const lista = document.getElementById('lista-categoria');
const formulario = document.getElementById('form-categoria');
const campoDescricao = document.getElementById('descricao');
const mensagem = document.getElementById('mensagem');

let categorias = []
let itemEmEdicao = null

async function carregarCategorias() {


    try {
        const resposta = await fetch('/api/categorias')
        categorias = await resposta.json()

        if (!resposta.ok) throw new Error (categorias.error)
            renderizarLista(categoriasResposta)
    } catch (error) {
        mensagem.textContent = `Erro ${error.menssage}`
    }
} 


function renderizarLista(){
    lista.innerHTML = ''
    if(categorias.length===0){
        lista.innerHTML='<li class="lista-vazia">Nenhuma categoria cadastra</li>'
        return
    }
    for(const categoria of categorias)
    {
        lista.appendChild(
            categoria.id_categoria === idEmEdicao? criarItemEdicao(categoria):criarItemVisualizacao(categoria)
        )
    }
}


function criarItemVisualizacao(categoria){
    const item = document.createElement('li')
    item.className='categoria-item'

    const info = document.createElement('span')
    info.className='categoria-info'
    info.innerHTML = `<span class="categoria-id>"#${categoria.descricao}</span> ${categoria.descricao}`

    const btnEditar = document.createElement('button')
    btnEditar.textContent='Editar'
    btnEditar.className='btn btn-editar'
    btnEditar.addEventListener('click',()=>{
        idEmEdicao= categoria.id_categoria
        renderizarLista
    })

    const btnExcluir = document.createElement('button')
    btnExcluir.textContent='Excluir'
    btnExcluir.className='btn btn-excluir'
    btnExcluir.addEventListener('click',()=>{
        excluirCategoria(categoria)
    })

    const acoes = document.createElement('div')
    acoes.className='categoria-acoes'

    acoes.append(btnEditar,btnExcluir)
    item.append(info,acoes)
    return item
}

function montarLista(dados)
{
    lista.innerHTML = '<li>carregando........</li>';
    if (dados.length === 0)
    {
        lista.innerHTML = '<li>Nenhuma categoria cadastrada......'
        return
    }
    lista.innerHTML = ''
    for(const categoria of dados){
        const item = document.createElement('li')
        item.textContent = `${categoria.id_categoria} - ${categoria.descricao}`
        lista.appendChild(item)
    }
}


formulario.addEventListener('submit', async(evento) => {
    evento.preventDefault();

    const resposta = await fetch('api/categorias', {
        method: 'POST',
        headers: {'Content-Type': 'Aplication/json'},
        body: JSON.stringify({descricao: campoDescricao.value})
    })
    const dados = await resposta.json()

    if (resposta.ok){
        mostrarMensagem(`Categoria "${dados.descricao} cadastrada!"`)
        campoDescricao.value = ''
        carregarCategorias()
    }
    else{
        mostrarMensagem(`Erro ${dados.erro}`, 'erro')
    }

})

function criarItemEdicao(categoria){

    const item = document.createElement('li')

    item.className = 'categoria-item categoria-item-edicao'

    const input = document.createElement('input')

    input.type = 'text'
    input.value = categoria.descricao
    input.className = 'input-edicao'

    const btnSalvar = document.createElement('button')
    btnSalvar.textContent = 'Salvar'
    btnSalvar.className = 'btn btn-salvar'
    btnSalvar.addEventListener('click',() => salvarEdicao(categoria,input.value))


    const btnCancelar = document.createElement('button')
    btnCancelar.textContent = 'Cancelar'
    btnCancelar.className = 'btn btn-scancelar'
    btnCancelar.addEventListener('click',() => {
        idEmEdicao = null
        renderizarLista()
    })

    const acoes = document.createElement('div')
    acoes.className = 'categorias-acoes'
    acoes.append(btnSalvar,btnCancelar)
    item.append(input,acoes)
    input.focus()
    return item

}


function mostrarMensagem(texto, tipo = 'sucesso'){
mensagem.textContent = texto
mensagem.className = `mensagem mensagem -${tipo}`
}


carregarCategorias();