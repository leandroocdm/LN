
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

const carousel = document.querySelector(".grid-servicos");

    let scrollAmount = 0;
    const cardWidth = (carousel.clientWidth+20); 
    const delay = 3000;

    function autoScroll(){

        scrollAmount += cardWidth;

        if(scrollAmount >= carousel.scrollWidth - carousel.clientWidth){
            scrollAmount = 0;
        }

        carousel.scrollTo({
            left: scrollAmount,
            behavior: "smooth"
        });

    }

    setInterval(autoScroll, delay);
