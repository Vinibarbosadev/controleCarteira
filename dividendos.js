let dividendos = [];
let chartDividendos = null;

// Carrega os dividendos salvos no LocalStorage ao iniciar a página
window.onload = function() {
    const dadosSalvos = localStorage.getItem('dividendosInvestimentos');
    if (dadosSalvos) {
        dividendos = JSON.parse(dadosSalvos);
        atualizarListaDividendos();
        atualizarGraficoDividendos();
    }
};

// Função para adicionar dividendos
function adicionarDividendo() {
    const nomeAtivo = document.getElementById("nomeAtivoDividendo").value.toUpperCase();
    const quantidade = parseFloat(document.getElementById("quantidadeDividendo").value);

    if (nomeAtivo && quantidade >= 0) {
        const dividendoExistente = dividendos.find(dividendo => dividendo.nome === nomeAtivo);

        if (dividendoExistente) {
            dividendoExistente.quantidade += quantidade;
        } else {
            const dividendo = {
                nome: nomeAtivo,
                quantidade: quantidade
            };

            dividendos.push(dividendo);
        }

        salvarDados();
        atualizarListaDividendos();
        atualizarGraficoDividendos();
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

// Função para remover dividendos
function removerDividendo() {
    const nomeAtivo = document.getElementById("nomeAtivoRemoverDividendo").value.toUpperCase();
    const quantidade = parseFloat(document.getElementById("quantidadeRemoverDividendo").value);

    if (nomeAtivo && quantidade >= 0) {
        const dividendoExistente = dividendos.find(dividendo => dividendo.nome === nomeAtivo);

        if (dividendoExistente) {
            if (dividendoExistente.quantidade >= quantidade) {
                dividendoExistente.quantidade -= quantidade;
                if (dividendoExistente.quantidade === 0) {
                    dividendos = dividendos.filter(dividendo => dividendo.nome !== nomeAtivo);
                }
                salvarDados();
                atualizarListaDividendos();
                atualizarGraficoDividendos();
            } else {
                alert("A quantidade a ser removida é maior que a quantidade atual.");
            }
        } else {
            alert("Ativo não encontrado.");
        }
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

// Função para salvar os dados no LocalStorage
function salvarDados() {
    localStorage.setItem('dividendosInvestimentos', JSON.stringify(dividendos));
}

// Função para atualizar a lista de dividendos exibida
function atualizarListaDividendos() {
    const listaDividendosDiv = document.getElementById('listaDividendos');
    listaDividendosDiv.innerHTML = '';

    dividendos.forEach(dividendo => {
        const divDividendo = document.createElement('div');
        divDividendo.innerHTML = `
            <div class="nomeAtivo">${dividendo.nome}</div>
            <div class="info">Quantidade: R$${dividendo.quantidade.toFixed(2)}</div>
        `;
        listaDividendosDiv.appendChild(divDividendo);
    });
}

// Função para atualizar o gráfico de colunas com a distribuição de dividendos
function atualizarGraficoDividendos() {
    const labels = [];
    const data = [];

    dividendos.forEach(dividendo => {
        labels.push(dividendo.nome);
        data.push(dividendo.quantidade);
    });

    if (chartDividendos) {
        chartDividendos.destroy();
    }

    const ctx = document.getElementById('graficoDividendos').getContext('2d');
    chartDividendos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Dividendos por Ativo (R$)',
                data: data,
                backgroundColor: '#d32f2f', // Tom de vermelho
                borderColor: '#c62828', // Tom de vermelho mais escuro para a borda
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    color: '#fff',
                    display: true,
                    anchor: 'end',
                    align: 'top'
                }
            }
        }
    });
}


// Função para voltar para a página principal
function voltarParaPaginaPrincipal() {
    window.location.href = 'index_carteira.html';
}

// Função para remover todos os dividendos
function removerTodosDividendos() {
    dividendos = [];
    salvarDados();
    atualizarListaDividendos();
    atualizarGraficoDividendos();
}
