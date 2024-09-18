let ativos = [];
let chartAtivos = null;

// Carrega os ativos salvos no LocalStorage ao iniciar a página
window.onload = function() {
    const dadosSalvos = localStorage.getItem('carteiraInvestimentos');
    if (dadosSalvos) {
        ativos = JSON.parse(dadosSalvos);
        atualizarListaAtivos();
        atualizarGraficoAtivos();
    }
};

// Função para adicionar um ativo
function adicionarAtivo() {
    const nomeAtivo = document.getElementById("nomeAtivo").value.toUpperCase();
    const quantidade = parseFloat(document.getElementById("quantidade").value);
    const preco = parseFloat(document.getElementById("preco").value);
    const tipoAtivo = document.getElementById("tipoAtivo").value;

    if (nomeAtivo && quantidade > 0 && preco > 0) {
        const ativoExistente = ativos.find(ativo => ativo.nome === nomeAtivo);

        if (ativoExistente) {
            ativoExistente.quantidade += quantidade;
            ativoExistente.precoTotal += preco * quantidade;
            ativoExistente.precoMedio = ativoExistente.precoTotal / ativoExistente.quantidade;
        } else {
            const ativo = {
                nome: nomeAtivo,
                quantidade: quantidade,
                precoTotal: preco * quantidade,
                precoMedio: preco,
                tipo: tipoAtivo
            };

            ativos.push(ativo);
        }

        salvarDados();
        atualizarListaAtivos();
        atualizarGraficoAtivos();
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

// Função para remover um ativo
function removerAtivo() {
    const nomeAtivo = document.getElementById("nomeAtivoRemover").value.toUpperCase();
    const quantidade = parseFloat(document.getElementById("quantidadeRemover").value);

    if (nomeAtivo && quantidade > 0) {
        const ativoExistente = ativos.find(ativo => ativo.nome === nomeAtivo);

        if (ativoExistente) {
            if (ativoExistente.quantidade >= quantidade) {
                ativoExistente.quantidade -= quantidade;
                ativoExistente.precoTotal -= ativoExistente.precoMedio * quantidade;
                if (ativoExistente.quantidade === 0) {
                    // Remove o ativo se a quantidade for zero
                    ativos = ativos.filter(ativo => ativo.nome !== nomeAtivo);
                }
                salvarDados();
                atualizarListaAtivos();
                atualizarGraficoAtivos();
            } else {
                alert("Quantidade a remover é maior do que a disponível.");
            }
        } else {
            alert("Ativo não encontrado.");
        }
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

// Função para atualizar a lista de ativos exibida
function atualizarListaAtivos() {
    const listaAtivos = document.getElementById("listaAtivos");
    listaAtivos.innerHTML = '';

    ativos.forEach(ativo => {
        const divAtivo = document.createElement('div');
        divAtivo.innerHTML = `
            <div class="nomeAtivo">${ativo.nome}</div>
            <div class="info">Quantidade: ${ativo.quantidade}</div>
            <div class="info">Preço Médio: R$ ${ativo.precoMedio.toFixed(2)}</div>
            <div class="precos">
                <span>Preço Total: R$ ${ativo.precoTotal.toFixed(2)}</span>
            </div>
        `;
        listaAtivos.appendChild(divAtivo);
    });
}

// Função para atualizar o gráfico de ativos
function atualizarGraficoAtivos() {
    const ctx = document.getElementById('graficoAtivos').getContext('2d');

    const labels = ativos.map(ativo => ativo.nome);
    const data = ativos.map(ativo => ativo.quantidade);

    if (chartAtivos) {
        chartAtivos.destroy();
    }

    chartAtivos = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribuição de Ativos',
                data: data,
                backgroundColor: [
                    '#d32f2f', // Vermelho tricolor
                    '#E6E8FA', // Azul tricolor
                    '#000000', // Amarelo tricolor
                    '#D8D8BF', // Verde para outros ativos
                    '#F7464A'  // Cor adicional
                ],
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    color: '#fff',
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value / sum * 100).toFixed(2) + "%";
                        return percentage;
                    },
                    anchor: 'end',
                    align: 'start'
                }
            }
        }
    });
}

// Função para salvar os dados no LocalStorage
function salvarDados() {
    localStorage.setItem('carteiraInvestimentos', JSON.stringify(ativos));
}

// Adiciona um ouvinte de evento para o botão de dividendos
document.getElementById('btnDividendos').addEventListener('click', function() {
    window.location.href = 'dividendos.html'; // Altere o nome do arquivo se necessário
});

// Função para remover todos os ativos
function removerTodosAtivos() {
    if (confirm("Você tem certeza de que deseja remover todos os ativos?")) {
        ativos = [];
        salvarDados();
        atualizarListaAtivos();
        atualizarGraficoAtivos();
    }
}
