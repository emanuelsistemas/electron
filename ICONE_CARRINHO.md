# Ícone de Carrinho de Compras para o Nexo PDV

Este documento fornece instruções sobre como obter e configurar um ícone de carrinho de compras para o aplicativo Nexo PDV Electron.

## Opção 1: Usar um Ícone Pronto

Você pode baixar um ícone de carrinho de compras de sites como:

1. [Flaticon](https://www.flaticon.com/search?word=shopping%20cart)
2. [Iconscout](https://iconscout.com/icons/shopping-cart)
3. [Icons8](https://icons8.com/icons/set/shopping-cart)

### Passos:

1. Baixe um ícone de carrinho de compras no formato PNG ou SVG
2. Converta para o formato ICO usando ferramentas online como:
   - [ConvertICO](https://convertico.com/)
   - [ICOConvert](https://icoconvert.com/)
   - [Favicon.io](https://favicon.io/favicon-converter/)
3. Salve o arquivo como `icon.ico` na pasta `assets` do projeto

## Opção 2: Criar um Ícone Personalizado

Se você preferir criar um ícone personalizado, pode usar ferramentas como:

1. [Adobe Illustrator](https://www.adobe.com/products/illustrator.html)
2. [Inkscape](https://inkscape.org/) (gratuito)
3. [GIMP](https://www.gimp.org/) (gratuito)

### Especificações Recomendadas:

- Tamanho: 256x256 pixels (mínimo)
- Formato final: ICO (com múltiplas resoluções: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
- Fundo transparente

## Opção 3: Código SVG de Carrinho de Compras

Você pode usar o seguinte código SVG para criar um ícone de carrinho de compras:

```svg
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Fundo circular -->
  <circle cx="256" cy="256" r="256" fill="#3b82f6"/>
  
  <!-- Carrinho de compras -->
  <g transform="translate(64, 96) scale(1.5)">
    <!-- Cesta do carrinho -->
    <path d="M24 164h220l14.29-92.84A16.51 16.51 0 0 0 241.86 56H35.18a16.51 16.51 0 0 0-16.43 15.16L4.77 144H24Z" fill="#ffffff"/>
    
    <!-- Rodas do carrinho -->
    <circle cx="76" cy="208" r="24" fill="#ffffff"/>
    <circle cx="184" cy="208" r="24" fill="#ffffff"/>
    
    <!-- Estrutura do carrinho -->
    <path d="M224 128h-16l-16 80H64l-16-80H32" stroke="#ffffff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    
    <!-- Alça do carrinho -->
    <path d="M224 128 256 40" stroke="#ffffff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  
  <!-- Produtos no carrinho (opcional) -->
  <rect x="180" y="180" width="30" height="30" rx="5" fill="#ffffff"/>
  <rect x="220" y="160" width="25" height="50" rx="5" fill="#ffffff"/>
  <rect x="255" y="170" width="35" height="40" rx="5" fill="#ffffff"/>
</svg>
```

### Passos para usar este SVG:

1. Copie o código acima e salve-o como `icon.svg` na pasta `assets` do projeto
2. Use uma ferramenta online para converter SVG para ICO:
   - [SVG to ICO Converter](https://www.aconvert.com/icon/svg-to-ico/)
   - [Online SVG Converter](https://image.online-convert.com/convert-to-ico)
3. Salve o arquivo ICO resultante como `icon.ico` na pasta `assets` do projeto

## Configuração no Electron Builder

Depois de obter o arquivo `icon.ico`, certifique-se de que as configurações no `package.json` e `electron-builder.yml` estão corretas:

```json
"win": {
  "icon": "assets/icon.ico"
},
"nsis": {
  "installerIcon": "assets/icon.ico",
  "uninstallerIcon": "assets/icon.ico",
  "installerHeaderIcon": "assets/icon.ico"
}
```

## Verificação

Para verificar se o ícone está configurado corretamente:

1. Execute `npm run build` para construir o aplicativo
2. Verifique se o ícone aparece no executável gerado
3. Se o ícone não aparecer, verifique se o caminho está correto e se o arquivo ICO é válido

## Solução de Problemas

Se o ícone não aparecer no executável:

1. Certifique-se de que o arquivo ICO está no formato correto (com múltiplas resoluções)
2. Verifique se o caminho no `package.json` e `electron-builder.yml` está correto
3. Tente limpar a pasta `dist` e reconstruir o aplicativo