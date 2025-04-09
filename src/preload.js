const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o processo de renderização
contextBridge.exposeInMainWorld('electronAPI', {
  // Obter a URL atual
  getUrl: () => ipcRenderer.invoke('get-url'),
  
  // Obter a configuração
  getConfig: () => ipcRenderer.invoke('get-config'),
  
  // API para impressoras
  printer: {
    // Listar impressoras disponíveis
    list: () => ipcRenderer.invoke('printer-list'),
    
    // Imprimir texto
    print: (options) => ipcRenderer.invoke('printer-print', options),
    
    // Imprimir recibo
    printReceipt: (data) => ipcRenderer.invoke('printer-print-receipt', data),
    
    // Abrir gaveta de dinheiro
    openCashDrawer: () => ipcRenderer.invoke('printer-open-cash-drawer')
  },
  
  // API para balanças
  scale: {
    // Conectar à balança
    connect: (port) => ipcRenderer.invoke('scale-connect', port),
    
    // Desconectar da balança
    disconnect: () => ipcRenderer.invoke('scale-disconnect'),
    
    // Ler peso atual
    readWeight: () => ipcRenderer.invoke('scale-read-weight'),
    
    // Verificar se a balança está conectada
    isConnected: () => ipcRenderer.invoke('scale-is-connected')
  }
});

// Notificar quando o preload script terminar de carregar
console.log('Preload script carregado com sucesso!');