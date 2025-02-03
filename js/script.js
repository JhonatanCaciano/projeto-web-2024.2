document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
});

async function carregarDados() {
    try {
        const response = await fetch("js/detalhamentopessoal.json");
        const jsonData = await response.json();

        const tabela = document.getElementById("tabela-dados");
        const filtroCargo = document.getElementById("cargo");
        const filtroSetor = document.getElementById("setor");

        const cargos = new Set();
        const setores = new Set();

        tabela.innerHTML = "";

        jsonData.data.forEach(item => {
            const proventos = converterValor(item["Proventos"]);
            const descontos = converterValor(item["Descontos"]);
            const liquido = converterValor(item["Líquido"]);

            cargos.add(item["Cargo"]);
            setores.add(item["Setor"]);

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

        filtroCargo.innerHTML = `<option value="">Todos</option>`;
        filtroSetor.innerHTML = `<option value="">Todos</option>`;

        cargos.forEach(cargo => {
            filtroCargo.innerHTML += `<option value="${cargo}">${cargo}</option>`;
        });

        setores.forEach(setor => {
            filtroSetor.innerHTML += `<option value="${setor}">${setor}</option>`;
        });

    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

function buscarDados() {
    const nomeBusca = document.getElementById("searchBar").value.toLowerCase();
    const cargoSelecionado = document.getElementById("cargo").value;
    const setorSelecionado = document.getElementById("setor").value;

    fetch("js/detalhamentopessoal.json")
        .then(response => response.json())
        .then(jsonData => {
            const tabela = document.getElementById("tabela-dados");
            tabela.innerHTML = "";

            const dadosFiltrados = jsonData.data.filter(item => {
                return (
                    (nomeBusca === "" || item["Nome do funcionário"].toLowerCase().includes(nomeBusca)) &&
                    (cargoSelecionado === "" || item["Cargo"] === cargoSelecionado) &&
                    (setorSelecionado === "" || item["Setor"] === setorSelecionado)
                );
            });

            let salarios = [];

            dadosFiltrados.forEach(item => {
                const proventos = converterValor(item["Proventos"]);
                const descontos = converterValor(item["Descontos"]);
                const liquido = converterValor(item["Líquido"]);

                salarios.push(liquido);

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

            calcularEstatisticas(salarios);
        })
        .catch(error => console.error("Erro ao buscar dados:", error));
}

// Converter valores
function converterValor(valor) {
    let numero = parseFloat(valor);
    
    // Se for um número > 1000
    if (numero > 1000 && Number.isInteger(numero)) {
        return numero / 100;
    }
    
    return numero;
}


// Calcular estatísticas
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
