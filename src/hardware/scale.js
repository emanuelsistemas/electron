const { SerialPort } = require('serialport');
const { ipcMain } = require('electron');

// Armazenar a instância da porta serial
let port = null;

// Configuração padrão da balança
let scaleConfig = {
  port: 'COM1',
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none'
};

// Buffer para armazenar dados recebidos
let dataBuffer = '';

// Inicializar o módulo de balança
function initScale(config) {
  try {
    // Atualizar configuração com base no arquivo config.json
    if (config && config.hardware && config.hardware.scale) {
      const cfg = config.hardware.scale;
      
      scaleConfig.port = cfg.port || 'COM1';
      scaleConfig.baudRate = cfg.baudRate || 9600;
      scaleConfig.dataBits = cfg.dataBits || 8;
      scaleConfig.stopBits = cfg.stopBits || 1;
      scaleConfig.parity = cfg.parity || 'none';
    }
    
    // Configurar manipuladores de eventos IPC
    setupIPCHandlers();
    
    console.log('Módulo de balança inicializado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar módulo de balança:', error);
    return false;
  }
}

// Configurar manipuladores de eventos IPC
function setupIPCHandlers() {
  // Conectar à balança
  ipcMain.handle('scale-connect', async (event, portName) => {
    try {
      // Se já existe uma conexão, fechar primeiro
      if (port && port.isOpen) {
        await new Promise((resolve) => {
          port.close(() => resolve());
        });
      }
      
      // Usar a porta especificada ou a configurada
      const portToUse = portName || scaleConfig.port;
      
      // Criar nova instância da porta serial
      port = new SerialPort({
        path: portToUse,
        baudRate: scaleConfig.baudRate,
        dataBits: scaleConfig.dataBits,
        stopBits: scaleConfig.stopBits,
        parity: scaleConfig.parity
      });
      
      // Configurar evento de recebimento de dados
      port.on('data', (data) => {
        dataBuffer += data.toString();
        
        // Processar dados recebidos (depende do protocolo da balança)
        processData();
      });
      
      // Configurar evento de erro
      port.on('error', (err) => {
        console.error('Erro na porta serial:', err);
      });
      
      return { success: true, port: portToUse };
    } catch (error) {
      console.error('Erro ao conectar à balança:', error);
      throw error;
    }
  });
  
  // Desconectar da balança
  ipcMain.handle('scale-disconnect', async () => {
    try {
      if (port && port.isOpen) {
        await new Promise((resolve) => {
          port.close(() => resolve());
        });
        port = null;
        return { success: true };
      }
      
      return { success: false, message: 'Balança não está conectada' };
    } catch (error) {
      console.error('Erro ao desconectar da balança:', error);
      throw error;
    }
  });
  
  // Ler peso atual
  ipcMain.handle('scale-read-weight', async () => {
    try {
      if (!port || !port.isOpen) {
        throw new Error('Balança não está conectada');
      }
      
      // Limpar buffer
      dataBuffer = '';
      
      // Enviar comando para ler peso (depende do protocolo da balança)
      // Este é um exemplo genérico, deve ser adaptado para o modelo específico da balança
      port.write('P\\r\\n');
      
      // Aguardar resposta
      const weight = await waitForWeight();
      return { success: true, weight };
    } catch (error) {
      console.error('Erro ao ler peso da balança:', error);
      throw error;
    }
  });
  
  // Verificar se a balança está conectada
  ipcMain.handle('scale-is-connected', () => {
    return { connected: port !== null && port.isOpen };
  });
}

// Processar dados recebidos da balança
function processData() {
  // Este é um exemplo genérico, deve ser adaptado para o protocolo específico da balança
  // Alguns protocolos comuns:
  // - Toledo: peso em formato "PPPPP" (5 dígitos)
  // - Filizola: peso em formato "WWWWW" (5 dígitos)
  
  // Verificar se temos um peso completo no buffer
  if (dataBuffer.includes('\\r\\n')) {
    // Extrair peso do buffer
    const lines = dataBuffer.split('\\r\\n');
    const weightLine = lines[0];
    
    // Atualizar buffer
    dataBuffer = lines.slice(1).join('\\r\\n');
    
    // Processar linha de peso
    // Exemplo: "P+00100" para 1.00 kg
    if (weightLine.startsWith('P')) {
      const weightStr = weightLine.substring(1);
      const weight = parseFloat(weightStr) / 100; // Converter para kg
      
      // Armazenar último peso lido
      lastWeight = weight;
    }
  }
}

// Aguardar leitura de peso
function waitForWeight() {
  return new Promise((resolve, reject) => {
    // Timeout para evitar espera infinita
    const timeout = setTimeout(() => {
      reject(new Error('Timeout ao aguardar resposta da balança'));
    }, 5000);
    
    // Função para verificar se temos um peso
    const checkWeight = () => {
      if (lastWeight !== null) {
        clearTimeout(timeout);
        resolve(lastWeight);
        lastWeight = null;
      } else {
        setTimeout(checkWeight, 100);
      }
    };
    
    // Iniciar verificação
    checkWeight();
  });
}

// Variável para armazenar último peso lido
let lastWeight = null;

module.exports = {
  initScale
};