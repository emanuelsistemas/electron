# Criando um Único Arquivo Executável para o Nexo PDV

Este documento explica como criar um único arquivo executável (.exe) para o Nexo PDV, sem a necessidade de arquivos DLL ou outros arquivos de suporte.

## Problema

Por padrão, o Electron Builder gera um executável portátil que vem acompanhado de vários arquivos de suporte (DLLs, recursos, etc.) em uma pasta. Isso pode ser inconveniente para distribuição, pois requer que todos os arquivos sejam mantidos juntos.

## Solução

Implementamos duas abordagens para criar um único arquivo executável:

1. **Usando NSIS (Nullsoft Scriptable Install System)** - Cria um instalador que contém todos os arquivos necessários
2. **Usando InnoSetup** - Cria um executável único com alta compressão

## Método 1: Usando NSIS (Mais Simples)

Este método cria um instalador que, quando executado, instala o aplicativo no computador do usuário.

### Como usar:

```bash
pnpm run build
```

Este comando criará um arquivo `NexoPDV-Setup.exe` na pasta `dist`. Este é um instalador que contém todos os arquivos necessários em um único executável.

### Vantagens:
- Processo de build mais simples
- Melhor integração com o sistema (atalhos, desinstalação, etc.)
- Mais confiável em diferentes versões do Windows

### Desvantagens:
- Requer instalação (não é completamente portátil)
- Deixa arquivos no sistema após a execução

## Método 2: Usando InnoSetup (Arquivo Único Verdadeiro)

Este método cria um único arquivo executável que extrai temporariamente os arquivos necessários e os remove após a execução.

### Pré-requisitos:

1. Instalar o InnoSetup: [Download InnoSetup](https://jrsoftware.org/isdl.php)
2. Certifique-se de que o InnoSetup está no PATH do sistema ou em um dos locais padrão

### Como usar:

```bash
pnpm run build-single-exe
```

Este comando:
1. Constrói o aplicativo Electron
2. Usa o InnoSetup para criar um único arquivo executável
3. Coloca o arquivo resultante `NexoPDV-SingleFile.exe` na pasta `dist`

### Vantagens:
- Arquivo único verdadeiro
- Não requer instalação formal
- Não deixa arquivos permanentes no sistema

### Desvantagens:
- Processo de build mais complexo
- Requer InnoSetup instalado para o build
- Tempo de inicialização ligeiramente maior (devido à extração)

## Notas Importantes

1. **Tamanho do Arquivo**: O arquivo único será maior que o executável portátil original, pois contém todos os arquivos necessários com compressão.

2. **Compatibilidade**: O arquivo único foi testado no Windows 10 e 11. Pode haver problemas de compatibilidade em versões mais antigas do Windows.

3. **Antivírus**: Alguns antivírus podem alertar sobre o arquivo único, pois ele usa técnicas de empacotamento e extração que são semelhantes às usadas por alguns malwares. Isso é um falso positivo.

4. **Requisitos do Sistema**: O arquivo único ainda requer as mesmas dependências do sistema que o aplicativo Electron original (como Visual C++ Redistributable).

## Solução de Problemas

### Erro ao criar o arquivo único

Se você encontrar erros ao executar `pnpm run build-single-exe`, verifique:

1. Se o InnoSetup está instalado corretamente
2. Se o build do Electron foi bem-sucedido
3. Se você tem permissões para escrever na pasta `dist`

### O arquivo único não executa

Se o arquivo único não executar:

1. Verifique se o Visual C++ Redistributable está instalado
2. Execute como administrador
3. Desative temporariamente o antivírus

## Conclusão

Com estas abordagens, você pode distribuir o Nexo PDV como um único arquivo executável, tornando a distribuição e o uso muito mais simples para os usuários finais.