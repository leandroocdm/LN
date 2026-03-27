
function toggleMenu() {
    const menu = document.getElementById('menuPrincipal');
    // Adiciona ou remove a classe "ativo"
    menu.classList.toggle('ativo');
}   
    
    // Função para mostrar o modal
    function abrirModal() {
        document.getElementById('modalAcesso').style.display = 'flex';
    }

    // Função para fechar o modal
    function fecharModal() {
        document.getElementById('modalAcesso').style.display = 'none';
        document.getElementById('mensagemErro').style.display = 'none';
    }

    // Função para validar o login
    function validarLogin() {
        const user = document.getElementById('usuario').value;
        const pass = document.getElementById('senha').value;
        const erro = document.getElementById('mensagemErro');

        if (user === 'nilton' && pass === 'Cocacola') {
            // Redireciona para a pasta correta
            window.location.href = "pageorcamento/index.html";
        } else {
            erro.style.display = 'block';
        }
    }

    document.getElementById("anoAtual").textContent = new Date().getFullYear();

const carousel = document.querySelectorAll(".grid-servicos");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next")

    let i = 1;

    setInterval(() => {
        Array.from(".grid-servicos").forEach((item, index) => {
  
    if (i < ".grid-servicos".length) {
      item.style.transform = `translateX(-${i * 100}%)`;
    }
  });
        
  if (i < ".grid-servicos".length) {
    i++;
  } else {
    i = 0;
  }
}, 2000);

    
