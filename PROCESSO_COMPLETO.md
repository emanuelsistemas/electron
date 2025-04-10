# Processo Completo: Da Clonagem à Criação do Executável Único

Este documento descreve detalhadamente todo o processo realizado para clonar o repositório do Nexo PDV Electron e criar um único arquivo executável que funcione corretamente.

## 1. Clonagem do Repositório

O primeiro passo foi clonar o repositório do GitHub:

```bash
git clone https://github.com/emanuelsistemas/electron.git
```

Este comando baixa todos os arquivos do repositório para a pasta atual.

## 2. Instalação das Dependências

Após a clonagem, instalamos todas as dependências necessárias:

```bash
cd electron
npm install
```

Este comando instala todas as bibliotecas e ferramentas necessárias listadas no arquivo `package.json`, incluindo:
- electron
- electron-builder
- electron-store
- node-thermal-printer
- serialport

## 3. Teste Inicial do Aplicativo

Executamos o aplicativo em modo de desenvolvimento para verificar seu funcionamento:

```bash
npm start
```

O aplicativo foi iniciado com sucesso, mostrando a interface do Electron com o webview carregando a URL configurada.

## 4. Análise dos Arquivos do Projeto

Analisamos os principais arquivos do projeto para entender sua estrutura e funcionamento:

- **src/main.js**: Processo principal do Electron que cria a janela e gerencia a comunicação com o hardware
- **src/preload.js**: Script que expõe as APIs do Electron para o webview
- **src/hardware/printer.js**: Módulo para comunicação com impressoras térmicas
- **src/hardware/scale.js**: Módulo para comunicação com balanças
- **config.json**: Configurações do aplicativo (URLs, hardware, etc.)
- **package.json**: Dependências e scripts de build

## 5. Instalação do InnoSetup

Para criar um único arquivo executável, instalamos o InnoSetup:

```bash
# Baixamos o instalador do InnoSetup
Invoke-WebRequest -Uri "https://files.jrsoftware.org/is/6/innosetup-6.4.2.exe" -OutFile "innosetup-6.4.2.exe"

# Executamos o instalador
Start-Process -FilePath ".\innosetup-6.4.2.exe" -Wait
```

O InnoSetup é uma ferramenta que permite criar instaladores e executáveis únicos para Windows.

## 6. Modificação do Arquivo build-single-exe.js

Modificamos o arquivo `build-single-exe.js` para usar o comando correto para construir o aplicativo:

```javascript
// Antes
runCommand('pnpm run build');

// Depois
runCommand('npx electron-builder --win portable');
```

Isso foi necessário porque o comando original estava causando problemas com o pnpm.

## 7. Criação do Arquivo start-app.bat

Criamos um arquivo `start-app.bat` para iniciar o aplicativo corretamente:

```batch
@echo off
cd /d "%~dp0"
"Nexo PDV.exe" .
```

Este arquivo é necessário porque o Electron precisa saber o caminho para o aplicativo, e o parâmetro "." indica que o aplicativo está na pasta atual.

## 8. Modificação do Arquivo innosetup.iss

Modificamos o arquivo `innosetup.iss` para:

1. Incluir todos os arquivos necessários:
```
; Todos os arquivos do Electron
Source: "node_modules\electron\dist\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
```

2. Incluir o arquivo start-app.bat:
```
; Arquivo de inicialização
Source: "start-app.bat"; DestDir: "{app}"; Flags: ignoreversion
```

3. Configurar os ícones para apontar para o arquivo start-app.bat:
```
[Icons]
Name: "{commonprograms}\{#MyAppName}"; Filename: "{app}\start-app.bat"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\start-app.bat"; Tasks: desktopicon
```

4. Configurar o comando de execução para usar o arquivo start-app.bat:
```
[Run]
Filename: "{app}\start-app.bat"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
```

## 9. Criação do Executável Único

Executamos o script modificado para criar o executável único:

```bash
node build-single-exe.js
```

Este comando:
1. Verifica se o InnoSetup está instalado
2. Cria os diretórios necessários
3. Executa o InnoSetup para criar o arquivo executável único
4. Copia o arquivo resultante para a pasta `dist`

## 10. Teste do Executável Único

Testamos o executável único para verificar se ele funciona corretamente:

```bash
Start-Process -FilePath "dist\NexoPDV-SingleFile.exe" -Wait
```

Inicialmente, encontramos um erro relacionado ao arquivo `ffmpeg.dll`, que não estava sendo incluído corretamente no pacote.

## 11. Correção do Problema do ffmpeg.dll

Modificamos novamente o arquivo `innosetup.iss` para incluir explicitamente o arquivo `ffmpeg.dll` e outras DLLs necessárias:

```
; Arquivo executável do Electron e DLLs necessárias
Source: "node_modules\electron\dist\electron.exe"; DestDir: "{app}"; DestName: "{#MyAppExeName}"; Flags: ignoreversion
Source: "node_modules\electron\dist\ffmpeg.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "node_modules\electron\dist\d3dcompiler_47.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "node_modules\electron\dist\libEGL.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "node_modules\electron\dist\libGLESv2.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "node_modules\electron\dist\vk_swiftshader.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "node_modules\electron\dist\vulkan-1.dll"; DestDir: "{app}"; Flags: ignoreversion
```

## 12. Criação Final do Executável Único

Executamos novamente o script para criar o executável único com as correções:

```bash
node build-single-exe.js
```

O arquivo executável único foi criado com sucesso na pasta `dist` com o nome `NexoPDV-SingleFile.exe`.

## 13. Teste Final do Executável Único

Testamos o executável único final e confirmamos que ele funciona corretamente, sem erros relacionados ao `ffmpeg.dll` ou outros problemas.

## 14. Tamanho do Arquivo Final

O arquivo executável único final tem aproximadamente 105 MB, o que é esperado considerando que ele contém todos os arquivos necessários para o aplicativo Electron, incluindo o Node.js, o Chromium e todas as dependências.

## Conclusão

Conseguimos criar com sucesso um único arquivo executável para o aplicativo Nexo PDV Electron. Este arquivo pode ser distribuído facilmente para os clientes, que podem executá-lo sem necessidade de instalação ou configuração adicional.

O processo envolveu várias etapas e algumas correções para resolver problemas específicos, mas o resultado final é um aplicativo portátil e funcional que atende aos requisitos do projeto.