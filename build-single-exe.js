const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para saída no console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

/**
 * Função para imprimir mensagens formatadas no console
 */
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  let formattedMessage = '';
  
  switch (type) {
    case 'info':
      formattedMessage = `${colors.fg.blue}[INFO]${colors.reset} ${message}`;
      break;
    case 'success':
      formattedMessage = `${colors.fg.green}[SUCCESS]${colors.reset} ${message}`;
      break;
    case 'warning':
      formattedMessage = `${colors.fg.yellow}[WARNING]${colors.reset} ${message}`;
      break;
    case 'error':
      formattedMessage = `${colors.fg.red}[ERROR]${colors.reset} ${message}`;
      break;
    default:
      formattedMessage = message;
  }
  
  console.log(`[${timestamp}] ${formattedMessage}`);
}

/**
 * Função para executar comandos e exibir a saída
 */
function runCommand(command, options = {}) {
  log(`Executando: ${command}`);
  try {
    const output = execSync(command, {
      stdio: 'inherit',
      ...options
    });
    return output;
  } catch (error) {
    log(`Erro ao executar comando: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Função principal para construir o executável único
 */
async function buildSingleExe() {
  try {
    // Passo 1: Limpar diretório dist
    log('Limpando diretório dist...');
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    
    // Passo 2: Construir o aplicativo Electron
    log('Construindo aplicativo Electron...');
    runCommand('pnpm run build');
    
    // Passo 3: Verificar se o InnoSetup está instalado
    log('Verificando se o InnoSetup está instalado...');
    const isWindows = process.platform === 'win32';
    
    if (!isWindows) {
      log('Este script precisa ser executado no Windows para usar o InnoSetup.', 'warning');
      log('Você pode copiar os arquivos para um sistema Windows e executar o InnoSetup manualmente.', 'info');
      return;
    }
    
    // Caminhos comuns para o InnoSetup
    const innoSetupPaths = [
      'C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe',
      'C:\\Program Files\\Inno Setup 6\\ISCC.exe',
      'C:\\Program Files (x86)\\Inno Setup 5\\ISCC.exe',
      'C:\\Program Files\\Inno Setup 5\\ISCC.exe'
    ];
    
    let innoSetupPath = null;
    for (const path of innoSetupPaths) {
      if (fs.existsSync(path)) {
        innoSetupPath = path;
        break;
      }
    }
    
    if (!innoSetupPath) {
      log('InnoSetup não encontrado. Por favor, instale-o e tente novamente.', 'error');
      log('Você pode baixar o InnoSetup em: https://jrsoftware.org/isdl.php', 'info');
      return;
    }
    
    // Passo 4: Construir o instalador com InnoSetup
    log('Construindo instalador com InnoSetup...');
    runCommand(`"${innoSetupPath}" innosetup.iss`);
    
    // Passo 5: Verificar se o arquivo foi criado
    const outputFile = path.join('Output', 'NexoPDV-SingleFile.exe');
    if (fs.existsSync(outputFile)) {
      // Mover para a pasta dist
      fs.copyFileSync(outputFile, path.join('dist', 'NexoPDV-SingleFile.exe'));
      log(`Arquivo único criado com sucesso: ${path.join('dist', 'NexoPDV-SingleFile.exe')}`, 'success');
    } else {
      log(`Arquivo não encontrado: ${outputFile}`, 'error');
    }
    
  } catch (error) {
    log(`Erro durante o processo de build: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Executar a função principal
buildSingleExe();