const { ThermalPrinter, PrinterTypes, CharacterSet } = require('node-thermal-printer');
const { ipcMain } = require('electron');

// Armazenar a instância da impressora
let printer = null;

// Configuração padrão da impressora
let printerConfig = {
  type: PrinterTypes.EPSON,
  interface: 'printer:',
  driver: {},
  options: {
    timeout: 5000
  }
};

// Inicializar o módulo de impressora
function initPrinter(config) {
  try {
    // Atualizar configuração com base no arquivo config.json
    if (config && config.hardware && config.hardware.printer) {
      const cfg = config.hardware.printer;
      
      printerConfig.type = cfg.type === 'epson' ? PrinterTypes.EPSON : 
                          cfg.type === 'star' ? PrinterTypes.STAR : 
                          PrinterTypes.EPSON;
      
      printerConfig.interface = cfg.defaultPrinter ? 
                               `printer:${cfg.defaultPrinter}` : 
                               'printer:';
    }
    
    // Criar instância da impressora
    printer = new ThermalPrinter(printerConfig);
    
    // Configurar manipuladores de eventos IPC
    setupIPCHandlers();
    
    console.log('Módulo de impressora inicializado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar módulo de impressora:', error);
    return false;
  }
}

// Configurar manipuladores de eventos IPC
function setupIPCHandlers() {
  // Listar impressoras disponíveis
  ipcMain.handle('printer-list', async () => {
    try {
      // Esta é uma função fictícia, pois node-thermal-printer não tem um método nativo para listar impressoras
      // Em uma implementação real, você usaria outro módulo como 'printer' para listar impressoras
      return [
        { name: 'Impressora Padrão', isDefault: true },
        { name: 'Microsoft Print to PDF', isDefault: false }
      ];
    } catch (error) {
      console.error('Erro ao listar impressoras:', error);
      throw error;
    }
  });
  
  // Imprimir texto
  ipcMain.handle('printer-print', async (event, options) => {
    try {
      if (!printer) {
        throw new Error('Impressora não inicializada');
      }
      
      // Limpar buffer
      printer.clear();
      
      // Configurar alinhamento
      if (options.align) {
        switch (options.align) {
          case 'center':
            printer.alignCenter();
            break;
          case 'right':
            printer.alignRight();
            break;
          default:
            printer.alignLeft();
        }
      }
      
      // Configurar tamanho da fonte
      if (options.size) {
        switch (options.size) {
          case 'small':
            printer.setTextSize(0, 0);
            break;
          case 'medium':
            printer.setTextSize(1, 1);
            break;
          case 'large':
            printer.setTextSize(2, 2);
            break;
          default:
            printer.setTextSize(0, 0);
        }
      }
      
      // Configurar estilo da fonte
      if (options.bold) printer.bold(true);
      if (options.underline) printer.underline(true);
      if (options.italic) printer.italic(true);
      
      // Imprimir texto
      printer.println(options.text || '');
      
      // Resetar estilos
      printer.bold(false);
      printer.underline(false);
      printer.italic(false);
      
      // Cortar papel se solicitado
      if (options.cut) {
        printer.cut();
      }
      
      // Executar impressão
      const result = await printer.execute();
      return { success: true, result };
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      throw error;
    }
  });
  
  // Imprimir recibo
  ipcMain.handle('printer-print-receipt', async (event, data) => {
    try {
      if (!printer) {
        throw new Error('Impressora não inicializada');
      }
      
      // Limpar buffer
      printer.clear();
      
      // Cabeçalho
      printer.alignCenter();
      printer.setTextSize(1, 1);
      printer.bold(true);
      printer.println(data.company || 'NEXO PDV');
      printer.bold(false);
      printer.setTextSize(0, 0);
      printer.println(data.address || '');
      printer.println(data.phone || '');
      printer.println('CNPJ: ' + (data.cnpj || ''));
      printer.println('--------------------------------');
      
      // Data e hora
      printer.alignLeft();
      printer.println('Data: ' + (data.date || new Date().toLocaleDateString()));
      printer.println('Hora: ' + (data.time || new Date().toLocaleTimeString()));
      printer.println('--------------------------------');
      
      // Itens
      printer.bold(true);
      printer.println('ITENS');
      printer.bold(false);
      
      if (data.items && Array.isArray(data.items)) {
        data.items.forEach(item => {
          printer.tableCustom([
            { text: item.quantity + 'x', align: 'LEFT', width: 0.1 },
            { text: item.name, align: 'LEFT', width: 0.6 },
            { text: item.price.toFixed(2), align: 'RIGHT', width: 0.3 }
          ]);
        });
      }
      
      printer.println('--------------------------------');
      
      // Total
      printer.alignRight();
      printer.bold(true);
      printer.println('TOTAL: R$ ' + (data.total || '0.00'));
      printer.bold(false);
      
      // Forma de pagamento
      printer.println('Forma de Pagamento: ' + (data.paymentMethod || 'Dinheiro'));
      printer.println('--------------------------------');
      
      // Rodapé
      printer.alignCenter();
      printer.println('Obrigado pela preferência!');
      printer.println('Volte sempre!');
      
      // Cortar papel
      printer.cut();
      
      // Executar impressão
      const result = await printer.execute();
      return { success: true, result };
    } catch (error) {
      console.error('Erro ao imprimir recibo:', error);
      throw error;
    }
  });
  
  // Abrir gaveta de dinheiro
  ipcMain.handle('printer-open-cash-drawer', async () => {
    try {
      if (!printer) {
        throw new Error('Impressora não inicializada');
      }
      
      // Abrir gaveta
      printer.openCashDrawer();
      
      // Executar comando
      const result = await printer.execute();
      return { success: true, result };
    } catch (error) {
      console.error('Erro ao abrir gaveta de dinheiro:', error);
      throw error;
    }
  });
}

module.exports = {
  initPrinter
};