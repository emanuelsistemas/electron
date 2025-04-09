const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const { initPrinter } = require('./hardware/printer');
const { initScale } = require('./hardware/scale');

// Configuração do armazenamento local
const store = new Store();

// Carregar configuração
let config;
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
} catch (error) {
  console.error('Erro ao carregar configuração:', error);
  config = {
    urls: {
      production: 'https://nexopdv.emasoftware.io/',
      development: 'http://localhost:5173/',
      homologation: 'https://homolog.nexopdv.emasoftware.io/'
    },
    defaultEnvironment: 'production',
    app: {
      title: 'Nexo PDV',
      fullscreen: true,
      width: 1280,
      height: 800,
      autoHideMenuBar: true,
      kiosk: false
    }
  };
}

// Variáveis globais
let mainWindow;
let currentUrl = config.urls[config.defaultEnvironment];

// Verificar se já existe uma instância do aplicativo rodando
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  return;
}

// Função para criar a janela principal
function createWindow() {
  // Criar a janela do navegador
  mainWindow = new BrowserWindow({
    width: config.app.width,
    height: config.app.height,
    title: config.app.title,
    icon: path.join(__dirname, '../assets/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: config.app.autoHideMenuBar,
    fullscreen: config.app.fullscreen,
    kiosk: config.app.kiosk
  });

  // Carregar a URL
  mainWindow.loadURL(currentUrl);

  // Abrir DevTools em ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Evento quando a janela é fechada
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Configurar menu
  setupMenu();
  
  // Inicializar módulos de hardware
  initHardware();
}

// Configurar o menu da aplicação
function setupMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Ambiente',
          submenu: [
            {
              label: 'Produção',
              click: () => changeEnvironment('production')
            },
            {
              label: 'Desenvolvimento',
              click: () => changeEnvironment('development')
            },
            {
              label: 'Homologação',
              click: () => changeEnvironment('homologation')
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'Configurações de Impressora',
          click: () => showPrinterSettings()
        },
        {
          label: 'Configurações de Balança',
          click: () => showScaleSettings()
        },
        { type: 'separator' },
        { role: 'quit', label: 'Sair' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { role: 'forceReload', label: 'Forçar Recarga' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tela Cheia' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Função para mudar o ambiente
function changeEnvironment(env) {
  if (config.urls[env]) {
    currentUrl = config.urls[env];
    mainWindow.loadURL(currentUrl);
    store.set('lastEnvironment', env);
  }
}

// Função para mostrar configurações da impressora
function showPrinterSettings() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Configurações de Impressora',
    message: 'Esta funcionalidade será implementada em breve.',
    buttons: ['OK']
  });
}

// Função para mostrar configurações da balança
function showScaleSettings() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Configurações de Balança',
    message: 'Esta funcionalidade será implementada em breve.',
    buttons: ['OK']
  });
}

// Inicializar módulos de hardware
function initHardware() {
  // Inicializar impressora
  if (config.hardware && config.hardware.printer && config.hardware.printer.enabled) {
    initPrinter(config);
  }
  
  // Inicializar balança
  if (config.hardware && config.hardware.scale && config.hardware.scale.enabled) {
    initScale(config);
  }
}

// Quando o Electron terminar a inicialização
app.whenReady().then(() => {
  createWindow();

  // No macOS, é comum recriar uma janela quando o ícone do dock é clicado
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quando todas as janelas estiverem fechadas
app.on('window-all-closed', function () {
  // No macOS, é comum que aplicativos permaneçam ativos até que o usuário saia explicitamente
  if (process.platform !== 'darwin') app.quit();
});

// Lidar com segunda instância do aplicativo
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // Alguém tentou executar uma segunda instância, devemos focar nossa janela
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// Exportar funções e variáveis para o preload script
ipcMain.handle('get-url', () => currentUrl);
ipcMain.handle('get-config', () => config);