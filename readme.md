# 🌦️ Projeto Clima - Previsão do Tempo em Tempo Real

Aplicação web interativa para consulta meteorológica utilizando JavaScript Vanilla. O sistema consome as APIs públicas do Open-Meteo para entregar dados precisos de localização e clima, com uma interface que reage dinamicamente ao horário e às condições climáticas.

## 🚀 Funcionalidades

* **Busca Global:** Encontre o clima de qualquer cidade do mundo através da API de Geocoding.
* **Dashboard Completo:** Exibição de Temperatura, Umidade, Velocidade do Vento e Precipitação.
* **Interface Dinâmica (UX):**
  * Transição automática de fundo (Modo Dia / Modo Noite) baseada no fuso horário retornado.
  * Status em texto ("Céu Limpo" ou "Nublado") baseado na cobertura de nuvens das próximas 5 horas.
  * Ícones SVG escaláveis e interativos.
* **Tratamento de Exceções:** Validação de entradas vazias, tratamento amigável para cidades não encontradas e falhas de rede.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (ES6+).
* **APIs Externas:** [Open-Meteo API](https://open-meteo.com/) (Geocoding e Forecast).
* **Testes e Ambiente:** Node.js, Jest, JSDOM (Testes Unitários e Mocking).
* **Ícones:** Lucide/Feather Icons (SVG).

## 🔒 Segurança e Privacidade

Este projeto foi auditado e desenhado com foco em Privacy by Design:
* **Coleta de Dados:** O sistema não utiliza a API de Geolocalização do navegador (HTML5 Geolocation). Nenhuma coordenada do usuário é rastreada ou armazenada. Apenas o nome da cidade digitada de forma ativa e voluntária pelo usuário é processada.
* **Armazenamento:** Não utilizamos cookies, LocalStorage ou banco de dados. Os dados existem apenas na memória temporária da sessão atual.
* **Comunicação Segura:** Todas as requisições para a API Open-Meteo são forçadas via protocolo HTTPS, garantindo a criptografia dos dados em trânsito e prevenindo ataques *Man-in-the-Middle* (MitM).
* **Sanitização de Input:** As entradas do usuário são tratadas e codificadas (URL Encoding) antes de serem enviadas à API, prevenindo injeções de caracteres maliciosos em URLs.

## ⚖️ Licenciamento e Atribuição

Este projeto é distribuído sob a licença **MIT**, o que permite uso comercial, modificação e distribuição, desde que mantidos os avisos de direitos autorais. 
Os dados meteorológicos são providos pela Open-Meteo, que exige atribuição para uso não-comercial. Consulte o arquivo `NOTICE.md` para detalhes sobre os créditos de terceiros e o arquivo `LICENSE` para os termos legais completos.

## 📦 Instalação e Execução

1. Clone o repositório:
   ```bash
   git clone [https://github.com/SEU_USUARIO/projeto_clima.git](https://github.com/BrenoNunes96/projeto_clima.git)
