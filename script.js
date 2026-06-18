import {
consultarDiretoComFetch,
insertTarefa,
sqlAtualizarTarefa,
sqlDeletarTarefa
} from './script_db.js'
const formTarefa = document.getElementById('form-tarefa');
const tabelaTarefa = document.getElementById('tabela-corpo');
const btnCancelar = document.getElementById('btn-cancelar');
const formTitulo = document.getElementById('form-titulo');
const btnSalvarText = document.getElementById('btn-salvar-text');



function limparFormulario() {
formTarefa.reset();
document.getElementById('tarefa-id').value = '';

formTitulo.textContent = "Salvar Tarefa";
btnSalvarText.textContent = "Salvar Tarefa";
btnCancelar.classList.add('hidden');

}

function mostrarToast(mensagem, tipo = 'success') {
const container = document.getElementById('toast-container');
const toast = document.createElement('div');

const cores = {
    success: 'bg-green-600',
    error: 'bg-rose-600',
    info: 'bg-blue-600'
};

const icones = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
};

toast.className = `toast-enter ${cores[tipo]} toast-message`;
toast.innerHTML = `
    <i class="fas ${icones[tipo]} text-lg"></i>
    <span>${mensagem}</span>
`;

container.appendChild(toast);

setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';

    setTimeout(() => toast.remove(), 300);
}, 3000);

}



async function criarTabelaTarefas() {
const dados = await consultarDiretoComFetch();

tabelaTarefa.innerHTML = '';

if (!dados || dados.length === 0) {
    tabelaTarefa.innerHTML = `
        <tr>
            <td colspan="4" class="empty-state">
                Nenhuma tarefa encontrada
            </td>
        </tr>
    `;
    return;
}

dados.forEach(tarefa => {
    const linha = document.createElement('tr');

    const criado_em = tarefa.criado_em
        ? new Date(tarefa.criado_em).toLocaleString('pt-BR')
        : '-';

    linha.innerHTML = `
        <td class="cell-id">#${tarefa.id}</td>

        <td>
            <p class="cell-titulo">${tarefa.titulo}</p>
            <p class="cell-descricao">${tarefa.descricao}</p>
        </td>

        <td>${criado_em}</td>

        <td>
            <div class="action-container">
                <button
                    onclick="prepararEdicao(${tarefa.id}, '${tarefa.titulo}', '${tarefa.descricao}', '${tarefa.criado_em}')"
                    class="btn-action btn-edit"
                    title="Editar">
                    <i class="fas fa-pen"></i>
                </button>

                <button
                    onclick="deletarTarefa(${tarefa.id})"
                    class="btn-action btn-delete"
                    title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    tabelaTarefa.appendChild(linha);
});

}

window.criarTabelaTarefas = criarTabelaTarefas;

criarTabelaTarefas();

window.prepararEdicao = function (id, titulo, descricao) {
document.getElementById('tarefa-id').value = id;
document.getElementById('tarefa-titulo').value = titulo;
document.getElementById('tarefa-descricao').value = descricao;


const campoData = document.getElementById('tarefa-criado_em');
if (campoData) {
    campoData.value = criado_em;
}

formTitulo.textContent = "Editar Tarefas";
btnSalvarText.textContent = "Atualizar Tarefas";
btnCancelar.classList.remove('hidden');

};

async function lidarComEnvioDoFormulario(event) {
event.preventDefault();

const id = document.getElementById('tarefa-id').value;
const titulo = document.getElementById('tarefa-titulo').value;
const descricao = document.getElementById('tarefa-descricao').value;

let sucesso = false;

if (id) {
    sucesso = await sqlAtualizarTarefa(id, titulo, descricao);

    if (sucesso) {
        mostrarToast("Tarefa atualizada com sucesso!", "success");
    }
} else {
    sucesso = await insertTarefa(id, titulo, descricao);

    if (sucesso) {
        mostrarToast("Tarefa cadastrada com sucesso!", "success");
    }
}

if (sucesso) {
    limparFormulario();
    criarTabelaTarefas();
}

}

window.deletarTarefa = async function(id) {
if (confirm("Tem certeza que deseja excluir essa tarefa?")) {
const sucesso = await sqlDeletarTarefa(id);

    if (sucesso) {
        mostrarToast("Tarefa excluída com sucesso!", "success");
        criarTabelaTarefas();
    } else {
        mostrarToast("Erro ao excluir tarefa!", "error");
    }
}

};



// Atrela a função unificada ao envio (submit) do formulário
formTarefa.addEventListener('submit', lidarComEnvioDoFormulario);

// Atrela a limpeza do formulário ao botão de cancelar
btnCancelar.addEventListener('click', limparFormulario);

// Quando o ficheiro JS é carregado, chama a tabela pela primeira vez
criarTabelaTarefas();


