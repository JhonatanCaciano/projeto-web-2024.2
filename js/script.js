document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
});

async function carregarDados() {
    try {
        // Carregar os dados do JSON
        const response = await fetch("js/detalhamentopessoal.json");
        const jsonData = await response.json();

        const tabela = document.getElementById("tabela-dados");
        const filtroCargo = document.getElementById("cargo");
        const filtroSetor = document.getElementById("setor");

        // Conjuntos para armazenar cargos e setores únicos
        const cargos = new Set();
        const setores = new Set();

        // Limpar a tabela antes de inserir novos dados
        tabela.innerHTML = "";

        jsonData.data.forEach(item => {
            // Função para converter valores corretamente para número
            function converterValor(valor) {
                if (typeof valor === "string") {
                    return parseFloat(valor.replace(",", "."));
                }
                return parseFloat(valor) || 0;
            }

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
                    <td>R$ ${proventos.toFixed(2)}</td>
                    <td>R$ ${descontos.toFixed(2)}</td>
                    <td>R$ ${liquido.toFixed(2)}</td>
                </tr>
            `;
            tabela.innerHTML += linha;
        });

        // Preencher os selects com os cargos e setores únicos
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

// Função para buscar e filtrar os dados
function buscarDados() {
    const nomeBusca = document.getElementById("searchBar").value.toLowerCase();
    const cargoSelecionado = document.getElementById("cargo").value;
    const setorSelecionado = document.getElementById("setor").value;

    fetch("js/detalhamentopessoal.json")
        .then(response => response.json())
        .then(jsonData => {
            const tabela = document.getElementById("tabela-dados");
            tabela.innerHTML = ""; // Limpa a tabela antes de inserir os novos resultados

            const dadosFiltrados = jsonData.data.filter(item => {
                return (
                    (nomeBusca === "" || item["Nome do funcionário"].toLowerCase().includes(nomeBusca)) &&
                    (cargoSelecionado === "" || item["Cargo"] === cargoSelecionado) &&
                    (setorSelecionado === "" || item["Setor"] === setorSelecionado)
                );
            });

            dadosFiltrados.forEach(item => {
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
                        <td>R$ ${proventos.toFixed(2)}</td>
                        <td>R$ ${descontos.toFixed(2)}</td>
                        <td>R$ ${liquido.toFixed(2)}</td>
                    </tr>
                `;
                tabela.innerHTML += linha;
            });
        })
        .catch(error => console.error("Erro ao buscar dados:", error));
}

// Função auxiliar para converter valores
function converterValor(valor) {
    if (typeof valor === "string") {
        return parseFloat(valor.replace(",", "."));
    }
    return parseFloat(valor) || 0;
}
