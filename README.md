# Nexo PDV Electron

Aplicativo Electron portátil para o Nexo PDV com acesso a impressoras e balanças.

## Características

- **Portabilidade**: Executável (.exe) que não requer instalação
- **Webview**: Carrega o Nexo PDV em um webview sem barra de URL
- **Acesso a Hardware**: Comunica-se com impressoras e balanças
- **Ícone Personalizado**: Usa um ícone de carrinho de compras
- **Proteção de Código**: Código-fonte não visível para o usuário final

## Pré-requisitos para Desenvolvimento

- Node.js (versão 14 ou superior)
- npm ou yarn

## Estrutura do Projeto

```
nexo-electron/
├── src/
│   ├── main.js           # Processo principal do Electron
│   ├── preload.js        # Script de pré-carregamento para o webview
│   ├── hardware/
│   │   ├── printer.js    # Módulo para comunicação com impressoras
│   │   └── scale.js      # Módulo para comunicação com balanças
├── assets/
│   └── icon.svg          # Ícone do aplicativo
├── package.json          # Dependências e scripts
└── config.json           # Configurações do aplicativo
```

## Como Usar

### Desenvolvimento

1. Instalar dependências:
   ```
   npm install
   ```

2. Iniciar aplicativo em modo de desenvolvimento:
   ```
   npm start
   ```

### Construir Executável Portátil

Para construir o executável portátil para Windows:

```
npm run build
```

O executável será gerado na pasta `dist/` com o nome `NexoPDV-Portable.exe`.

## Configuração

O arquivo `config.json` contém as configurações do aplicativo:

- **urls**: URLs para diferentes ambientes (produção, desenvolvimento, homologação)
- **defaultEnvironment**: Ambiente padrão a ser carregado
- **hardware**: Configurações para impressoras e balanças
- **app**: Configurações da janela do aplicativo

## Acesso a Hardware

### Impressoras

O aplicativo pode se comunicar com impressoras térmicas para imprimir recibos e abrir gavetas de dinheiro. Suporta impressoras Epson e Star.

Exemplo de uso no webview:

```javascript
// Imprimir texto
window.electronAPI.printer.print({
  text: 'Olá, mundo!',
  align: 'center',
  size: 'medium',
  bold: true,
  cut: true
});

// Imprimir recibo
window.electronAPI.printer.printReceipt({
  company: 'Minha Empresa',
  address: 'Rua Exemplo, 123',
  items: [
    { quantity: 1, name: 'Produto 1', price: 10.00 },
    { quantity: 2, name: 'Produto 2', price: 15.00 }
  ],
  total: 40.00,
  paymentMethod: 'Cartão de Crédito'
});

// Abrir gaveta de dinheiro
window.electronAPI.printer.openCashDrawer();
```

### Balanças

O aplicativo pode se comunicar com balanças conectadas via porta serial (COM).

Exemplo de uso no webview:

```javascript
// Conectar à balança
window.electronAPI.scale.connect('COM1');

// Ler peso
const weightData = await window.electronAPI.scale.readWeight();
console.log(`Peso: ${weightData.weight} kg`);

// Desconectar da balança
window.electronAPI.scale.disconnect();
```

## Distribuição

Para distribuir o aplicativo para os clientes:

1. Construa o executável portátil com `npm run build`
2. Copie o arquivo `NexoPDV-Portable.exe` da pasta `dist/` para um pendrive ou compartilhe via download
3. O cliente pode executar o aplicativo diretamente, sem necessidade de instalação

## Notas Importantes

- O aplicativo deve ser executado com privilégios suficientes para acessar impressoras e portas COM
- Algumas configurações podem precisar ser ajustadas dependendo do hardware específico do cliente
- Para impressoras não suportadas nativamente, pode ser necessário instalar drivers específicos