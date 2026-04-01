// Seleção de elementos (Mantenha no topo)

/**
 * Busca coordenadas geográficas e dados meteorológicos de uma cidade 
 * utilizando as APIs Open-Meteo (Geocoding e Forecast).
 *
 * @async
 * @function buscarClimaPorCidade
 * @param {string} cidadeValor - O nome da cidade a ser pesquisada (ex: "Rio de Janeiro").
 * * @returns {Promise<{
 * infoCidade: { name: string, country: string },
 * clima: { temperature: number, time: string, [key: string]: any },
 * nuvens: number[]
 * }>} Retorna um objeto contendo as informações da cidade, dados do clima atual 
 * e um array com a cobertura de nuvens das próximas 5 horas.
 * * @throws {Error} Lança um erro se a entrada estiver vazia ("Entrada vazia").
 * @throws {Error} Lança um erro se a cidade não for encontrada ("Cidade inexistente").
 * @throws {Error} Lança um erro se houver falha na comunicação com as APIs ("Erro na API de Geocoding" ou "Erro na API de Previsão").
 * * @example
 * try {
 * const dados = await buscarClimaPorCidade("Niterói");
 * console.log(`Temperatura em ${dados.infoCidade.name}: ${dados.clima.temperature}°C`);
 * } catch (error) {
 * console.error("Falha ao buscar clima:", error.message);
 * }
 */
async function buscarClimaPorCidade(cidadeValor) {
  // ... seu código original ...
}






const form = document.querySelector("#formulario");
const contentinput = document.querySelector('#content-inp');
const previsao = document.querySelector('#previsao');
const cloud = document.querySelector("#cloud");
const cidadeError = document.querySelector('#cidade-erro-container');

// --- LÓGICA (A função que o Jest vai testar) ---
async function buscarClimaPorCidade(cidadeValor) {
    if (!cidadeValor || cidadeValor.trim() === "") {
        throw new Error("Entrada vazia");
    }

    // 1. Chamada Geocoding
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidadeValor}&count=1&language=pt&format=json`);
    if (!res.ok) throw new Error("Erro na API de Geocoding");

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
        throw new Error("Cidade inexistente");
    }

    const { latitude, longitude, name, country } = data.results[0];

    // 2. Chamada Forecast
    const res2 = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=America/Sao_Paulo&hourly=cloud_cover`);
    if (!res2.ok) throw new Error("Erro na API de Previsão");

    const data2 = await res2.json();

    // Retornamos um objeto organizado com tudo o que a tela precisa
    return {
        infoCidade: { name, country },
        clima: data2.current_weather,
        nuvens: data2.hourly.cloud_cover.slice(0, 5)
    };
}

// --- INTERFACE (O que acontece no navegador) ---
if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const cidadeInput = document.querySelector("#input");
        if (!cidadeInput) return;

        try {
            const dados = await buscarClimaPorCidade(cidadeInput.value);
            
            // 1. Processamento de Dados (Temperatura e Horário)
            const temp = Math.round(dados.clima.temperature);
            const horario = parseInt(dados.clima.time.split("T")[1]);
            const dataISO = dados.clima.time.split("T")[0];
            const dataFormatada = new Date(dataISO + "T00:00:00").toLocaleDateString('pt-BR').split("/");

            // 2. Lógica de Fundo (Noite/Dia)
            document.body.classList.remove("fundo-noite", "fundovoltar");
            if (horario > 17 || horario < 6) {
                document.body.classList.add("fundo-noite");
            } else {
                document.body.classList.add("fundovoltar");
            }

            // 3. Lógica de Nuvens
            const estaNublado = dados.nuvens.filter(n => n > 90).length > 0;
            const textoNuvens = estaNublado ? "Nublado" : "Limpo";

            // 4. Nome do Mês (Switch)
            const meses = {
                "01": "janeiro", "02": "fevereiro", "03": "março", "04": "abril",
                "05": "maio", "06": "junho", "07": "julho", "08": "agosto",
                "09": "setembro", "10": "outubro", "11": "novembro", "12": "dezembro"
            };
            const nomeDoMes = meses[dataFormatada[1]] || "Mês inválido";

            // 5. Atualização do DOM
            previsao.innerHTML = `
                <div class="label-container">
                    <label class='label2'>
                        <svg width="82" height="82" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                        </svg>${temp}° 
                    </label> 
                </div>`;

            contentinput.innerHTML = `
                <div id="content-input-overflow">
                    <span>${dados.infoCidade.name}, ${dados.infoCidade.country}</span>     
                    <span><h1 id='cloud'>${textoNuvens}</h1></span>
                    <p class="data-clima">dia ${dataFormatada[0]} de ${nomeDoMes} de ${dataFormatada[2]}</p>
                    <button id="btn-voltar" type="button">Voltar</button>
                </div>`;

            cidadeError.style.display = "none";

            // Botão Voltar (Adicionado após renderizar)
            document.querySelector("#btn-voltar").addEventListener("click", () => {
                location.reload(); // Forma mais simples de resetar tudo
            });

        } catch (error) {
            console.error(error);
            cidadeError.style.display = "block";
            cidadeError.innerHTML = `<div>${error.message === "Cidade inexistente" ? "Cidade não encontrada" : "Erro ao buscar dados"}</div>`;
        }
    });
}

// EXPORTAÇÃO PARA O JEST
if (typeof module !== 'undefined') {
    module.exports = { buscarClimaPorCidade };
}