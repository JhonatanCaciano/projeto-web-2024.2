let dadosFuncionarios = [];

const URL_CSV = "https://raw.githubusercontent.com/JhonatanCaciano/projeto-web-2024.2/refs/heads/main/js/detalhamentopessoal.csv";

document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
});

async function carregarDados() {
    try {
        const response = await fetch(URL_CSV, { mode: 'cors' });
        if (!response.ok) throw new Error("Erro ao carregar o CSV.");

        const csvText = await response.text();
        dadosFuncionarios = csvParaArray(csvText);

        preencherTabela(dadosFuncionarios);
        preencherFiltros(dadosFuncionarios);

    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        alert("Não foi possível carregar os dados do CSV. Verifique a URL.");
    }
}

function csvParaArray(csv) {
    const linhas = csv.trim().split("\n");
    const cabecalhos = linhas[0].split(",").map(header => header.trim().replace(/^"|"$/g, ""));

    return linhas.slice(1).map(linha => {
        const valores = linha.match(/("[^"]*"|[^,]+)/g).map(valor => valor.trim().replace(/^"|"$/g, ""));
        const obj = {};

        cabecalhos.forEach((chave, index) => {
            obj[chave] = valores[index] || "";
        });

        return obj;
    });
}

function preencherTabela(dados) {
    const tabela = document.getElementById("tabela-dados");
    tabela.innerHTML = "";

    dados.forEach(item => {
        const proventos = converterValor(item["Proventos"]);
        const descontos = converterValor(item["Descontos"]);
        const liquido = converterValor(item["Líquido"]);

        const linha = `
            <tr>
                <td>${item["Nome do funcionário"]}</td>
                <td>${item["Competência"]}</td>
                <td>${item["Folha"]}</td>
                <td>${item["Vínculo"]}</td>
                <td>${item["Cargo"]}</td>
                <td>${item["Setor"]}</td>
                <td>${item["Matricula"]}</td>
                <td>R$ ${proventos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td>R$ ${descontos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td>R$ ${liquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            </tr>
        `;
        tabela.innerHTML += linha;
    });

    calcularEstatisticas(dados.map(item => converterValor(item["Líquido"])));
}

function preencherFiltros(dados) {
    const filtroCargo = document.getElementById("cargo");
    const filtroSetor = document.getElementById("setor");

    const cargos = [...new Set(dados.map(item => item["Cargo"]))];
    const setores = [...new Set(dados.map(item => item["Setor"]))];

    filtroCargo.innerHTML = `<option value="">Todos</option>`;
    filtroSetor.innerHTML = `<option value="">Todos</option>`;

    cargos.forEach(cargo => {
        filtroCargo.innerHTML += `<option value="${cargo}">${cargo}</option>`;
    });

    setores.forEach(setor => {
        filtroSetor.innerHTML += `<option value="${setor}">${setor}</option>`;
    });
}

function buscarDados() {
    const nomeBusca = document.getElementById("searchBar").value.toLowerCase();
    const cargoSelecionado = document.getElementById("cargo").value;
    const setorSelecionado = document.getElementById("setor").value;

    const dadosFiltrados = dadosFuncionarios.filter(item => {
        return (
            (nomeBusca === "" || item["Nome do funcionário"].toLowerCase().includes(nomeBusca)) &&
            (cargoSelecionado === "" || item["Cargo"] === cargoSelecionado) &&
            (setorSelecionado === "" || item["Setor"] === setorSelecionado)
        );
    });

    preencherTabela(dadosFiltrados);
}

function converterValor(valor) {
    if (!valor) return 0;

    const numeroCorrigido = valor.replace(/\.(?=\d{3}(,|$))/g, "").replace(",", ".");
    const numero = parseFloat(numeroCorrigido);

    return isNaN(numero) ? 0 : numero;
}

function calcularEstatisticas(salarios) {
    if (salarios.length === 0) {
        document.getElementById("salario-medio").textContent = "R$ 0,00";
        document.getElementById("salario-maximo").textContent = "R$ 0,00";
        document.getElementById("salario-minimo").textContent = "R$ 0,00";
        return;
    }

    const salarioMedio = salarios.reduce((acc, val) => acc + val, 0) / salarios.length;
    const salarioMaximo = Math.max(...salarios);
    const salarioMinimo = Math.min(...salarios);

    document.getElementById("salario-medio").textContent = `R$ ${salarioMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    document.getElementById("salario-maximo").textContent = `R$ ${salarioMaximo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    document.getElementById("salario-minimo").textContent = `R$ ${salarioMinimo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}
