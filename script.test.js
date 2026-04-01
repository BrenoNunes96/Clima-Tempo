// script.test.js
const { buscarClimaPorCidade } = require('./script');

// Mock do fetch global
global.fetch = jest.fn();

describe('Testes Unitários - App de Clima', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('1. Nome de cidade válido retorna dados meteorológicos', async () => {
    // 1ª Chamada (Geocoding) - OK
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        results: [{ latitude: -22.9, longitude: -43.1, name: 'Rio', country: 'BR' }] 
      }),
    });

    // 2ª Chamada (Previsão) - ADICIONE O HOURLY AQUI
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        current_weather: { 
            temperature: 25,
            time: "2026-04-01T12:00" // Adicionei o time para evitar erros de split
        },
        hourly: { 
            cloud_cover: [10, 10, 10, 10, 10] // Simula céu limpo (poucas nuvens)
        } 
      }),
    });

    const resultado = await buscarClimaPorCidade('Rio de Janeiro');

    expect(resultado.clima.temperature).toBe(25);
    expect(resultado.nuvens).toHaveLength(5); // Verifica se o slice(0,5) funcionou
    expect(fetch).toHaveBeenCalledTimes(2); 
  });
  test('2. Nome de cidade inexistente lança exceção tratada', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }), 
    });

    await expect(buscarClimaPorCidade('CidadeFantasma'))
      .rejects.toThrow("Cidade inexistente");
  });

  test('3. Entrada vazia retorna erro de validação', async () => {
    await expect(buscarClimaPorCidade(''))
      .rejects.toThrow("Entrada vazia");
  });

  test('4. Falha da API gera resposta adequada (Erro 500)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(buscarClimaPorCidade('Rio'))
      .rejects.toThrow("Erro na API de Geocoding");
  });
});