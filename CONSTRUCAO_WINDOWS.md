# Construindo o Executável do Nexo PDV para Windows

Este documento explica como construir o executável do Nexo PDV para Windows, considerando que estamos enfrentando problemas ao tentar construir em um ambiente Linux.

## Problema Encontrado

Ao tentar construir o executável para Windows em um ambiente Linux, encontramos o seguinte erro:

```
⨯ cannot execute  cause=exit status 53
                  errorOut=0080:err:winediag:nodrv_CreateWindow Application tried to create a window, but no driver could be loaded.
  0080:err:winediag:nodrv_CreateWindow L"The explorer process failed to start."
  0080:err:systray:initialize_systray Could not create tray window
  wine: could not load kernel32.dll, status c0000135
```

Este erro ocorre porque o processo de construção tenta usar o Wine (uma camada de compatibilidade para executar aplicativos Windows no Linux) para executar ferramentas específicas do Windows, como o `rcedit.exe`, que é usado para definir metadados do executável Windows.

## Solução: Construir em um Ambiente Windows

A solução mais confiável é construir o executável em um ambiente Windows nativo. Aqui estão as opções:

### Opção 1: Usar um Computador com Windows

1. Instale o Node.js e pnpm em um computador com Windows
2. Clone ou copie o projeto para o computador Windows
3. Execute os comandos de construção:

```bash
cd nexo-electron
pnpm install
pnpm run build
```

### Opção 2: Usar uma Máquina Virtual Windows

1. Configure uma máquina virtual com Windows (usando VirtualBox, VMware, etc.)
2. Instale o Node.js e pnpm na máquina virtual
3. Compartilhe a pasta do projeto com a máquina virtual
4. Execute os comandos de construção na máquina virtual

### Opção 3: Usar o WSL2 (Windows Subsystem for Linux) no Windows

Se você estiver usando o WSL2 no Windows, pode construir o aplicativo no Windows host:

1. No WSL2, navegue até a pasta do projeto
2. Instale o Node.js e pnpm no Windows host
3. Execute os comandos de construção no Windows host, apontando para a pasta do projeto

## Alternativa: Construir Apenas para Linux

Se você não precisa de um executável Windows, pode construir apenas para Linux:

```bash
pnpm run build-linux
```

Isso criará um arquivo AppImage que pode ser executado em distribuições Linux modernas.

## Usando GitHub Actions para Automatizar a Construção

Uma solução elegante é usar o GitHub Actions para automatizar a construção em diferentes plataformas:

1. Crie um repositório GitHub para o projeto
2. Configure um workflow do GitHub Actions que constrói o aplicativo em diferentes plataformas
3. Os artefatos de construção (executáveis) serão disponibilizados para download

Exemplo de arquivo de workflow (`.github/workflows/build.yml`):

```yaml
name: Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, ubuntu-latest, macos-latest]

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 16
        
    - name: Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 7
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: |
        if [ "${{ matrix.os }}" = "windows-latest" ]; then
          pnpm run build
        elif [ "${{ matrix.os }}" = "ubuntu-latest" ]; then
          pnpm run build-linux
        elif [ "${{ matrix.os }}" = "macos-latest" ]; then
          pnpm run build-mac
        fi
      shell: bash
      
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: ${{ matrix.os }}-build
        path: |
          dist/*.exe
          dist/*.AppImage
          dist/*.dmg
```

## Conclusão

Para construir um executável Windows confiável, é recomendado usar um ambiente Windows nativo. As alternativas incluem usar uma máquina virtual Windows, o WSL2 no Windows, ou automatizar a construção usando GitHub Actions.

## Criando um Único Arquivo Executável com InnoSetup

Uma solução eficaz para distribuição é criar um único arquivo executável usando o InnoSetup. Este método foi implementado e testado com sucesso.

### Pré-requisitos:

1. Instalar o InnoSetup: [Download InnoSetup](https://jrsoftware.org/isdl.php)
2. Certifique-se de que o InnoSetup está no PATH do sistema ou em um dos locais padrão

### Passos:

1. Execute o comando:
```bash
npm run build-single-exe
```

2. Este comando:
   - Verifica se o InnoSetup está instalado
   - Cria os diretórios necessários
   - Executa o InnoSetup para criar o arquivo executável único
   - Copia o arquivo resultante para a pasta `dist`

Para mais detalhes sobre como criar um arquivo único executável, consulte o arquivo [SINGLE_EXE_README.md](SINGLE_EXE_README.md).

Para um guia detalhado de todo o processo, desde a clonagem do repositório até a criação do arquivo executável único, consulte o arquivo [PROCESSO_COMPLETO.md](PROCESSO_COMPLETO.md).