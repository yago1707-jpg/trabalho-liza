let tarefas = [];
let filtroAtual = 'todas';

const form = document.getElementById('form-tarefa');
const input = document.getElementById('input-tarefa');
const erro = document.getElementById('mensagem-erro');
const lista = document.getElementById('lista');
const contador = document.getElementById('contador');
const botoesFiltro = document.querySelectorAll('.filtros button');

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const texto = input.value.trim();

  if (texto.length < 3) {
    erro.textContent = 'Digite pelo menos 3 caracteres.';
    erro.hidden = false;
    return;
  }

  erro.hidden = true;
  tarefas.push({ id: Date.now(), texto: texto, concluida: false });
  input.value = '';
  renderizar();
});

function alternarConclusao(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (tarefa) tarefa.concluida = !tarefa.concluida;
  renderizar();
}

function removerTarefa(id) {
  tarefas = tarefas.filter((t) => t.id !== id);
  renderizar();
}

botoesFiltro.forEach((botao) => {
  botao.addEventListener('click', () => {
    filtroAtual = botao.dataset.filtro;
    botoesFiltro.forEach((b) => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    renderizar();
  });
});

function tarefasFiltradas() {
  if (filtroAtual === 'pendentes') return tarefas.filter((t) => !t.concluida);
  if (filtroAtual === 'concluidas') return tarefas.filter((t) => t.concluida);
  return tarefas;
}

function renderizar() {
  lista.innerHTML = '';

  tarefasFiltradas().forEach((tarefa) => {
    const item = document.createElement('li');
    if (tarefa.concluida) item.classList.add('concluida');

    const caixa = document.createElement('input');
    caixa.type = 'checkbox';
    caixa.checked = tarefa.concluida;
    caixa.addEventListener('change', () => alternarConclusao(tarefa.id));

    const texto = document.createElement('span');
    texto.textContent = tarefa.texto;

    const remover = document.createElement('button');
    remover.textContent = 'Remover';
    remover.addEventListener('click', () => removerTarefa(tarefa.id));

    item.append(caixa, texto, remover);
    lista.appendChild(item);
  });

  const pendentes = tarefas.filter((t) => !t.concluida).length;
  contador.textContent = `${pendentes} pendente(s) de ${tarefas.length} tarefa(s)`;
}

renderizar();
