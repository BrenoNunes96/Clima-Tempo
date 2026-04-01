// script.test.js
const { buscarClimaPorCidade } = require('./script');

// Mock do fetch global
global.fetch = jest.fn();

describe('Testes Unitários - App de Clima', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('1. Nome de cidade válido retorna dados meteorológicos completos', async () => {
    // Mock Geocoding
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
            results: [{ latitude: -22.9, longitude: -43.1, name: 'Rio', country: 'BR' }] 
        }),
    });

    // Mock Forecast (Nova estrutura 'current')
 // Exemplo de como deve ser o mock no Teste 1 agora:
fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ 
    current: { 
      temperature_2m: 25, 
      relative_humidity_2m: 50, 
      wind_speed_10m: 10, 
      precipitation: 0, 
      time: "2026-04-01T14:00" 
    },
    hourly: { cloud_cover: [0,0,0,0,0] }
  }),
});
    const resultado = await buscarClimaPorCidade('Rio de Janeiro');

    // Verificações
    expect(resultado.clima.temperature_2m).toBe(25);
    expect(resultado.clima.relative_humidity_2m).toBe(65);
    expect(resultado.clima.wind_speed_10m).toBe(12);
    expect(resultado.clima.precipitation).toBe(0);
    expect(resultado.nuvens).toHaveLength(5);
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