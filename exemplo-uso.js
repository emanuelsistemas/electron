/**
 * Exemplo de Uso das APIs do Electron no Nexo PDV
 * 
 * Este arquivo demonstra como usar as APIs expostas pelo Electron
 * para acessar impressoras e balanças a partir do webview do Nexo PDV.
 * 
 * Para usar estas funcionalidades, você pode incluir este script no seu
 * aplicativo web ou adaptar o código para suas necessidades.
 */

// Verificar se as APIs do Electron estão disponíveis
if (window.electronAPI) {
  console.log('APIs do Electron detectadas! O aplicativo está rodando no Electron.');
  
  // Exemplo de uso da API de impressora
  async function exemploImpressora() {
    try {
      // Listar impressoras disponíveis
      const impressoras = await window.electronAPI.printer.list();
      console.log('Impressoras disponíveis:', impressoras);
      
      // Imprimir texto simples
      await window.electronAPI.printer.print({
        text: 'Teste de Impressão - Nexo PDV',
        align: 'center',
        size: 'medium',
        bold: true,
        cut: true
      });
      
      console.log('Impressão de teste enviada com sucesso!');
      
      // Exemplo de impressão de recibo
      const recibo = {
        company: 'Nexo PDV Ltda.',
        address: 'Rua Exemplo, 123 - Centro',
        phone: '(11) 1234-5678',
        cnpj: '12.345.678/0001-90',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        items: [
          { quantity: 1, name: 'Produto A', price: 10.50 },
          { quantity: 2, name: 'Produto B', price: 15.75 },
          { quantity: 3, name: 'Produto C', price: 5.25 }
        ],
        total: 52.50,
        paymentMethod: 'Cartão de Crédito'
      };
      
      await window.electronAPI.printer.printReceipt(recibo);
      console.log('Recibo impresso com sucesso!');
      
      // Abrir gaveta de dinheiro
      await window.electronAPI.printer.openCashDrawer();
      console.log('Gaveta de dinheiro aberta!');
      
    } catch (error) {
      console.error('Erro ao usar a impressora:', error);
    }
  }
  
  // Exemplo de uso da API de balança
  async function exemploBalanca() {
    try {
      // Verificar se a balança está conectada
      const statusConexao = await window.electronAPI.scale.isConnected();
      console.log('Balança conectada?', statusConexao.connected);
      
      if (!statusConexao.connected) {
        // Conectar à balança
        const porta = 'COM1'; // Ajuste conforme necessário
        const resultado = await window.electronAPI.scale.connect(porta);
        console.log(`Balança conectada na porta ${resultado.port}`);
      }
      
      // Ler peso da balança
      const pesoInfo = await window.electronAPI.scale.readWeight();
      console.log(`Peso atual: ${pesoInfo.weight} kg`);
      
      // Atualizar campo de peso no formulário
      document.getElementById('campo-peso').value = pesoInfo.weight;
      
      // Desconectar da balança quando não for mais necessária
      await window.electronAPI.scale.disconnect();
      console.log('Balança desconectada');
      
    } catch (error) {
      console.error('Erro ao usar a balança:', error);
    }
  }
  
  // Exemplo de integração com o Nexo PDV
  function integrarComNexoPDV() {
    // Adicionar botão para ler peso da balança na tela de PDV
    const botaoLerPeso = document.createElement('button');
    botaoLerPeso.textContent = 'Ler Peso';
    botaoLerPeso.className = 'btn btn-primary';
    botaoLerPeso.onclick = exemploBalanca;
    
    // Adicionar botão para imprimir recibo na tela de PDV
    const botaoImprimir = document.createElement('button');
    botaoImprimir.textContent = 'Imprimir Recibo';
    botaoImprimir.className = 'btn btn-success';
    botaoImprimir.onclick = exemploImpressora;
    
    // Adicionar botões à interface
    const containerBotoes = document.querySelector('.acoes-pdv');
    if (containerBotoes) {
      containerBotoes.appendChild(botaoLerPeso);
      containerBotoes.appendChild(botaoImprimir);
    }
  }
  
  // Executar quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Integrando funcionalidades de hardware com o Nexo PDV...');
    
    // Verificar se estamos na página de PDV
    if (window.location.pathname.includes('/pdv')) {
      integrarComNexoPDV();
    }
    
    // Adicionar informações sobre o ambiente
    window.electronAPI.getConfig().then(config => {
      console.log('Configuração do aplicativo:', config);
      
      // Adicionar badge de ambiente
      const ambienteAtual = Object.keys(config.urls).find(
        key => config.urls[key] === window.location.origin + '/'
      );
      
      if (ambienteAtual && ambienteAtual !== 'production') {
        const badge = document.createElement('div');
        badge.textContent = ambienteAtual.toUpperCase();
        badge.style.position = 'fixed';
        badge.style.bottom = '10px';
        badge.style.right = '10px';
        badge.style.padding = '5px 10px';
        badge.style.backgroundColor = ambienteAtual === 'development' ? '#f59e0b' : '#3b82f6';
        badge.style.color = 'white';
        badge.style.borderRadius = '4px';
        badge.style.fontSize = '12px';
        badge.style.fontWeight = 'bold';
        badge.style.zIndex = '9999';
        
        document.body.appendChild(badge);
      }
    });
  });
  
} else {
  console.log('APIs do Electron não detectadas. O aplicativo está rodando em um navegador normal.');
}