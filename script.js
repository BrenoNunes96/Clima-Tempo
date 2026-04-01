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
// Seleção de elementos
/**
 * @file script.js
 * Descrição: Sistema de busca de clima com integração Open-Meteo, 
 * suporte a umidade, vento, precipitação e testes unitários.
 */

const form = document.querySelector("#formulario");
const contentinput = document.querySelector('#content-inp');
const previsao = document.querySelector('#previsao');
const cloud = document.querySelector("#cloud");
const cidadeError = document.querySelector('#cidade-erro-container');

/**
 * Busca coordenadas e dados meteorológicos detalhados.
 * @async
 * @function buscarClimaPorCidade
 * @param {string} cidadeValor - Nome da cidade pesquisada.
 * @returns {Promise<Object>} Objeto com info da cidade, clima atual e nuvens.
 */
async function buscarClimaPorCidade(cidadeValor) {
    if (!cidadeValor || cidadeValor.trim() === "") {
        throw new Error("Entrada vazia");
    }

    // 1. Chamada Geocoding (Obter Lat/Log)
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidadeValor}&count=1&language=pt&format=json`);
    if (!res.ok) throw new Error("Erro na API de Geocoding");

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
        throw new Error("Cidade inexistente");
    }

    const { latitude, longitude, name, country } = data.results[0];

    // 2. Chamada Forecast (URL atualizada com parâmetros específicos)
   // Onde estava: ...&current=temperature_2m,...,time&...
// Mude para:
const urlForecast = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=America/Sao_Paulo&hourly=cloud_cover`;
    
    const res2 = await fetch(urlForecast);
    if (!res2.ok) throw new Error("Erro na API de Previsão");

    const data2 = await res2.json();

    // Importante: a API retorna os dados dentro da chave 'current'
    return {
        infoCidade: { name, country },
        clima: data2.current, 
        nuvens: data2.hourly.cloud_cover.slice(0, 5)
    };
}

// --- INTERFACE ---
if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const cidadeInput = document.querySelector("#input");
        if (!cidadeInput) return;

        try {
            const dados = await buscarClimaPorCidade(cidadeInput.value);
            
            // Extração baseada na nova estrutura da API (current)
            const temp = Math.round(dados.clima.temperature_2m);
            const umidade = dados.clima.relative_humidity_2m;
            const vento = dados.clima.wind_speed_10m;
            const chuva = dados.clima.precipitation;

            // Processamento de Tempo e Data
            // dados.clima.time vem no formato "2026-04-01T14:00"
            const partesTempo = dados.clima.time.split("T");
            const horario = parseInt(partesTempo[1]);
            const dataISO = partesTempo[0];
            const dataFormatada = new Date(dataISO + "T00:00:00").toLocaleDateString('pt-BR').split("/");

            // Lógica de Fundo (Noite/Dia)
            document.body.classList.remove("fundo-noite", "fundovoltar");
            if (horario >= 18 || horario < 6) {
                document.body.classList.add("fundo-noite");
            } else {
                document.body.classList.add("fundovoltar");
            }

            // Lógica de Nuvens
            const estaNublado = dados.nuvens.filter(n => n > 80).length > 0;
            const textoNuvens = estaNublado ? "Nublado" : "Céu Limpo";

            const meses = {
                "01": "janeiro", "02": "fevereiro", "03": "março", "04": "abril", 
                "05": "maio", "06": "junho", "07": "julho", "08": "agosto",
                "09": "setembro", "10": "outubro", "11": "novembro", "12": "dezembro"
            };
            const nomeDoMes = meses[dataFormatada[1]] || "Mês";

            // Atualização do DOM com Grid de Detalhes
            previsao.innerHTML = `
                <div class="label-container">
                    <label class='label2'>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                        </svg>${temp}° 
                    </label> 
                </div>`;

         contentinput.innerHTML = `
    <div id="content-input-overflow">
        <h2 class="cidade-res">${dados.infoCidade.name}, ${dados.infoCidade.country}</h2>
        <p class="status-nuvens">${textoNuvens}</p>
        
        <div class="detalhes-grid">
            <div class="item-detalhe">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
                <span>${umidade}%</span>
                <small>Umidade</small>
            </div>

            <div class="item-detalhe">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                </svg>
                <span>${vento} <small>km/h</small></span>
                <small>Vento</small>
            </div>

            <div class="item-detalhe">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 13v8m-4-7v9m-4-5v4m3-14a7 7 0 1 1 13.71-9h1.29a4.5 4.5 0 1 1 0 9Z"></path>
                </svg>
                <span>${chuva} <small>mm</small></span>
                <small>Chuva</small>
            </div>
        </div>

        <p class="data-clima">dia ${dataFormatada[0]} de ${nomeDoMes} de ${dataFormatada[2]}</p>
        
        <button id="btn-voltar" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        </button>
    </div>`;

            if (cidadeError) cidadeError.style.display = "none";

            // Evento para resetar a busca
            document.querySelector("#btn-voltar").addEventListener("click", () => {
                location.reload(); 
            });

        } catch (error) {
            console.error(error);
            if (cidadeError) {
                cidadeError.style.display = "block";
                cidadeError.innerHTML = `<div>${error.message === "Cidade inexistente" ? "Cidade não encontrada" : "Erro ao carregar dados"}</div>`;
            }
        }
    });
}

// Exportação para o Jest
if (typeof module !== 'undefined') {
    module.exports = { buscarClimaPorCidade };
}