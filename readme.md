import os

readme_content = """# 🌦️ Projeto Clima - Previsão do Tempo em Tempo Real

Este projeto é uma aplicação web interativa desenvolvida para fornecer informações meteorológicas detalhadas de qualquer cidade do mundo. A aplicação consome dados das APIs **Open-Meteo**, tratando desde a geolocalização até a previsão atual, com uma interface que reage dinamicamente ao horário local e às condições de nebulosidade.

---

## 🚀 Funcionalidades Principais

* **Busca por Cidade:** Integração com a API de Geocoding para encontrar latitude e longitude através do nome da cidade.
* **Previsão Detalhada:** Exibição de temperatura atual (arredondada) e status do céu.
* **Interface Dinâmica:**
    * **Modo Noite/Dia:** O fundo da aplicação muda automaticamente (`fundo-noite` ou `fundovoltar`) baseado no horário retornado pela API.
    * **Status de Nuvens:** Identificação inteligente de céu nublado ou limpo através da análise das próximas 5 horas de cobertura de nuvens.
    * **Data Formatada:** Conversão de datas ISO para o padrão brasileiro (PT-BR) com tradução manual dos meses.
* **Tratamento de Erros:** Mensagens amigáveis para campos vazios, cidades não encontradas ou falhas de servidor.
* **Testes Unitários:** Cobertura de lógica de negócio utilizando Mocking de APIs.

---

## 🛠️ Tech Stack

| Tecnologia | Descrição |
| :--- | :--- |
| **JavaScript (ES6+)** | Lógica principal e manipulação de DOM. |
| **Node.js** | Ambiente de execução para ferramentas de desenvolvimento. |
| **Jest** | Framework de testes unitários e de integração. |
| **JSDOM** | Simulação de ambiente de navegador para testes no Node. |
| **Open-Meteo API** | Fonte de dados geográficos e meteorológicos (Gratuita). |

---

## 🧪 Testes Unitários

O projeto utiliza o **Jest** para garantir que a lógica de busca e tratamento de dados esteja sempre íntegra, sem depender de chamadas reais à rede (uso de `Mocks`).

### Casos de Teste Cobertos:
1.  **Sucesso na Busca:** Verifica se, ao fornecer uma cidade válida, o sistema retorna a temperatura correta e os dados formatados.
2.  **Cidade Inexistente:** Garante que o erro "Cidade inexistente" seja lançado se a API de Geocoding retornar resultados vazios.
3.  **Validação de Entrada:** Impede o processamento se o usuário enviar o campo de busca vazio.
4.  **Falha de API (500):** Simula uma queda no servidor da API e verifica se o sistema lida com a exceção adequadamente.

**Para rodar os testes:**
```bash
npm test