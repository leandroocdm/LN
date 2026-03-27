
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



function getCardWidth() {
    const card = document.querySelector('.card');
    const style = window.getComputedStyle(card);

    const marginRight = parseInt(style.marginRight) || 0;

    return card.offsetWidth + marginRight;
}

let currentIndex = 0;

function moveCarousel(direction) {
    const carousel = document.querySelector('.carousel');
    const cardWidth = getCardWidth();

    currentIndex += direction;

    const totalCards = document.querySelectorAll('.card').length;

    // impedir sair dos limites
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > totalCards - 1) currentIndex = totalCards - 1;

    carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}
