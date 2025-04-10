# Instruções Detalhadas para o Nexo PDV Electron

Este documento fornece instruções detalhadas para instalar, testar e construir o aplicativo Electron portátil para o Nexo PDV.

## 1. Instalar Dependências

Antes de começar, certifique-se de ter o Node.js (versão 14 ou superior) e o pnpm instalados em seu sistema.

Para verificar se o Node.js está instalado:
```bash
node --version
```

Para verificar se o pnpm está instalado:
```bash
pnpm --version
```

Se não estiverem instalados, você pode baixá-los em [nodejs.org](https://nodejs.org/).

### Instalando as Dependências do Projeto

Navegue até o diretório do projeto e execute o comando pnpm install:

```bash
cd nexo-electron
pnpm install
```

Este comando instalará todas as dependências listadas no arquivo package.json, incluindo:
- electron
- electron-builder
- electron-store
- node-thermal-printer
- serialport

A instalação pode levar alguns minutos, dependendo da velocidade da sua conexão com a internet.

## 2. Testar em Desenvolvimento

Após a instalação das dependências, você pode iniciar o aplicativo em modo de desenvolvimento:

```bash
pnpm start
```

Este comando executará o script definido no package.json, que inicia o Electron com o seu aplicativo.

### O que esperar durante o teste:

1. Uma janela do Electron será aberta
2. O Nexo PDV será carregado no webview
3. Você poderá interagir com o aplicativo
4. O menu do aplicativo permitirá alternar entre ambientes (produção, desenvolvimento, homologação)
5. As ferramentas de desenvolvedor estarão disponíveis se você definir a variável de ambiente NODE_ENV como "development"

### Depuração:

Se encontrar problemas, você pode habilitar as ferramentas de desenvolvedor:

```bash
# No Windows
set NODE_ENV=development
pnpm start

# No Linux/macOS
NODE_ENV=development pnpm start
```

Isso permitirá que você inspecione o console, depure JavaScript e analise a rede.

## 3. Construir Executável Portátil

Quando estiver satisfeito com o aplicativo em modo de desenvolvimento, você pode construir o executável portátil:

```bash
pnpm run build
```

Este comando utilizará o electron-builder para criar um executável portátil para Windows (.exe).

### O que acontece durante o build:

1. O electron-builder compila seu código
2. Ele empacota todas as dependências necessárias
3. Ele cria um executável portátil que não requer instalação
4. O executável é colocado na pasta `dist/`

### Localização do Executável:

Após a conclusão do build, você encontrará o executável em:
```
nexo-electron/dist/NexoPDV-Portable.exe
```

Este é o arquivo que você distribuirá para seus clientes.

## 4. Construir Arquivo Único Executável

Para criar um único arquivo executável que não requer instalação e não deixa arquivos no sistema:

### Pré-requisitos:

1. Instalar o InnoSetup: [Download InnoSetup](https://jrsoftware.org/isdl.php)
2. Certifique-se de que o InnoSetup está no PATH do sistema ou em um dos locais padrão

### Passos:

1. Execute o comando:
```bash
pnpm run build-single-exe
```

2. Este comando:
   - Verifica se o InnoSetup está instalado
   - Cria os diretórios necessários
   - Executa o InnoSetup para criar o arquivo executável único
   - Copia o arquivo resultante para a pasta `dist`

### Localização do Executável:

Após a conclusão do build, você encontrará o executável em:
```
nexo-electron/dist/NexoPDV-SingleFile.exe
```

Para mais detalhes sobre como criar um arquivo único executável, consulte o arquivo [SINGLE_EXE_README.md](SINGLE_EXE_README.md).

Para um guia detalhado de todo o processo, consulte o arquivo [PROCESSO_COMPLETO.md](PROCESSO_COMPLETO.md).

## 4. Personalização Antes do Build

Antes de construir o executável final, você pode personalizar:

### Configurações do Aplicativo:

Edite o arquivo `config.json` para:
- Alterar as URLs dos ambientes
- Configurar as opções de hardware
- Ajustar as configurações da janela

### Ícone do Aplicativo:

Para personalizar o ícone:
1. Substitua o arquivo `assets/icon.svg` pelo seu próprio ícone
2. Certifique-se de que o ícone está no formato correto (SVG ou ICO)
3. Atualize a referência no arquivo `package.json` se necessário

## 5. Distribuição para Clientes

Para distribuir o aplicativo para seus clientes:

1. Copie o arquivo `NexoPDV-Portable.exe` para um pendrive ou compartilhe via download
2. Instrua os clientes a simplesmente executar o arquivo, sem necessidade de instalação
3. Se necessário, forneça instruções sobre como configurar impressoras e balanças

### Requisitos para os Clientes:

- Windows 7 ou superior
- Não é necessário instalar Node.js ou qualquer outra dependência
- Para usar impressoras e balanças, os drivers apropriados devem estar instalados

## 6. Solução de Problemas Comuns

### Problema: O aplicativo não inicia
**Solução**: Verifique se o cliente tem permissões de administrador ou se há bloqueios de antivírus.

### Problema: Não consegue acessar impressoras
**Solução**: Verifique se os drivers da impressora estão instalados e se o aplicativo tem permissões para acessá-los.

### Problema: Não consegue acessar balanças
**Solução**: Verifique se a porta COM está correta no arquivo de configuração e se os drivers da balança estão instalados.

### Problema: Tela em branco
**Solução**: Verifique se a URL do Nexo PDV está correta e acessível.

## 7. Atualizações Futuras

Para atualizar o aplicativo no futuro:

1. Faça as alterações necessárias no código
2. Teste em modo de desenvolvimento
3. Construa um novo executável
4. Distribua o novo executável para os clientes

Não é necessário desinstalar a versão anterior, pois o aplicativo é portátil.