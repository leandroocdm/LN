document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orcamentoForm');
    const gerarPdfBtn = document.getElementById('gerarPdfBtn');
    const pdfTemplateElement = document.getElementById('pdf-template');
    const cpfCnpjInputContainer = document.getElementById('cpfCnpjInputContainer');
    const cpfCnpjInput = document.getElementById('cpfCnpjCliente');
    const docTypeRadios = document.querySelectorAll('input[name="docType"]');

    // Taxas configuradas
    const PIX_DISCOUNT_RATE = 0.05;
    const CARD_MARKUP_RATE = 0.10;

    // --- 1. Lógica de Ocultar/Exibir CPF ---
    docTypeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.value === 'na') {
                cpfCnpjInputContainer.classList.add('hidden');
                cpfCnpjInput.removeAttribute('required');
                cpfCnpjInput.value = '';
            } else {
                cpfCnpjInputContainer.classList.remove('hidden');
                cpfCnpjInput.setAttribute('required', 'required');
            }
        });
    });

    // Filtro de máscara em tempo real
    cpfCnpjInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número

        if (value.length <= 11) {
            // Máscara CPF: 000.000.000-00
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            // Máscara CNPJ: 00.000.000/0001-00
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }

        e.target.value = value;
    });

    // --- 2. Funções de Formatação ---
    const formatarDoc = (valor) => {
        const d = valor.replace(/\D/g, '');
        if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        return valor;
    };

    const valorInput = document.getElementById('valorTotal');

    valorInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número

        // Transforma em centavos (ex: 125 vira 1.25)
        value = (value / 100).toFixed(2) + '';
        value = value.replace(".", ",");

        // Adiciona o ponto de milhar (ex: 1250,00 vira 1.250,00)
        value = value.replace(/(\d)(\d{3}),/g, "$1.$2,");

        e.target.value = value ? 'R$ ' + value : '';
    });

    // --- 3. Evento Principal ---
    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        gerarPdfBtn.disabled = true;
        gerarPdfBtn.textContent = 'Gerando...';

        try {
            const { jsPDF } = window.jspdf;
            const nome = document.getElementById('nomeCliente').value;
            const desc = document.getElementById('descricaoServico').value;
            const obs = document.getElementById('observacoes').value || 'Nenhuma.';

            const valorPuro = parseFloat(document.getElementById('valorTotal').value
                .replace('R$ ', '')
                .replace(/\./g, '')
                .replace(',', '.')
            );

            if (isNaN(valorPuro)) {
                alert("Por favor, insira um valor válido.");
                gerarPdfBtn.disabled = false;
                gerarPdfBtn.textContent = 'Gerar PDF';
                return;
            }

            const docSelecionado = document.querySelector('input[name="docType"]:checked').value;
            const docFinal = docSelecionado === 'na' ? 'Não informado' : formatarDoc(cpfCnpjInput.value);

            const valorPix = (valorPuro * (1 - PIX_DISCOUNT_RATE)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const valorCartao = (valorPuro * (1 + CARD_MARKUP_RATE)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const valorOriginal = valorPuro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const dataHoje = new Date().toLocaleDateString('pt-BR');


            const today = new Date().toLocaleDateString('pt-BR');


            // 1. Montar o Template
            pdfTemplateElement.innerHTML = `
                 <div><style>
                    .pdf-box { 
                        width: 100%; 
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        font-family: Arial, sans-serif; 
                        color: #333; 
                        background: white; 
                        box-sizing: border-box;
                    }
                    .header { display: flex; justify-content: space-between; align-items: center; background-color: #f0f0f0; padding: 15px; border-radius: 5px; }
                    .header-left { display: flex; align-items: center; }
                    .header-left img { width: 100px; margin-right: 10px; }
                    .company-name { font-size: 24px; font-weight: bold; }
                    .company-details { font-size: 18px; font-weight: 700; }
                    .header-right { text-align: right; font-size: 24px;}
                    .social-icons { display: flex; justify-content: flex-end; margin-top: 10px; margin-bottom: 10px; gap: 15px; }
                    .social-icons img { width: 60px; height: 60px; }
                    .section-title { font-size: 14px; font-weight: bold; margin-top: 25px; text-transform: uppercase; border-bottom: 1px solid #ccc; }
                    .budget-table { margin-top: 10px; background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap; min-height: 80px; }
                    .payment-options { display: flex; justify-content: space-between; margin-top: 20px; gap: 10px; }
                    .payment-option { flex: 1; border: 1px solid #ddd; padding: 10px; text-align: center; }
                    .payment-value { background-color: #eee; padding: 5px; font-weight: bold; margin-top: 5px; display: block; }
                    .pix-info { text-align: center; margin-top: 30px; font-size: 16px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; }
                    .pix-logo { width: 50px; height: 50px; }
                </style>
                <div class="pdf-box">
                        <div class="header">
                            <div class="header-left">
                                <img src="../img/logo.png" alt="Logo">
                                <div>
                                    <div class="company-name">LN</div>
                                    <div class="company-details">Climatização e elétrica</div>
                                    <div class="company-details">CNPJ: 13.744.549/0001-32</div>
                                    <div class="company-details">Salvador Pratta, 460</div>
                                </div>
                            </div>
                            <div class="header-right">
                                <div style="font-size: 12px;">Data: ${today}</div>
                                <div class="social-icons">
                                    <img src="static/img/ic_whatsapp.png">
                                    <img src="static/img/ic_instagram.png">
                                </div>
                                <div style="font-size: 12px;">Oferta valida por 7 dias.</div>
                            </div>
                        </div>
                    <div class="section-title">Cliente</div>
                    <p><strong>NOME:</strong> ${nome} <br> <strong>CPF/CNPJ:</strong> ${docFinal}</p>
                    <div class="section-title">Orçamento</div>
                    <div class="budget-table">${desc}</div>
                    <div class="section-title">Observações</div>
                    <p>${obs}</p>
                    <div class="section-title">Formas de Pagamento</div>
                    <div class="payment-options">
                        <div class="payment-option"><strong>À Vista</strong><span class="payment-value">R$ ${valorOriginal}</span></div>
                        <div class="payment-option"><strong>Cartão (12x)</strong><span class="payment-value">R$ ${valorCartao}</span></div>
                    </div>
                    <div class="pix-info">
                        <img src="static/img/ic_pix.png" class="pix-logo">
                        Chave pix: 13.744.549/0001-32
                    </div>
                </div>
                </div>`;

            // 2. O PULO DO GATO: Forçar visibilidade para o print
            pdfTemplateElement.style.visibility = 'visible';
            pdfTemplateElement.style.display = 'block';

            // 3. Pequena pausa para o navegador renderizar o HTML acima
            await new Promise(resolve => setTimeout(resolve, 150));


            // 2. Pegar a DIV do Pix que acabamos de criar no innerHTML
            const pixDiv = pdfTemplateElement.querySelector('.pix-info');
            const templateRect = pdfTemplateElement.getBoundingClientRect();
            const pixRect = pixDiv.getBoundingClientRect();

            // 3. Calcular a posição relativa (Onde a div está dentro do template)
            // Multiplicamos pela proporção do A4 (210mm / largura do template em px)
            const escalaPxParaMm = 190 / templateRect.width;

            const pixX = (pixRect.left - templateRect.left) * escalaPxParaMm + 10; // +10 da margem xPos
            const pixY = (pixRect.top - templateRect.top) * escalaPxParaMm + 10; // +10 da margem superior
            const pixW = pixRect.width * escalaPxParaMm;
            const pixH = pixRect.height * escalaPxParaMm;


            const canvas = await html2canvas(pdfTemplateElement, {
                scale: 2,
                backgroundColor: "#ffffff",
                windowWidth: 800,
                useCORS: true,
                logging: false
            });

            // 4. Esconder de novo
            pdfTemplateElement.style.visibility = 'hidden';
            pdfTemplateElement.style.display = 'none';

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const w = 210; // Largura total da página A4
            const imgWidthMm = 190; // Largura do conteúdo (deixa 10mm de margem em cada lado)
            const xPos = (w - imgWidthMm) / 2;
            pdf.addImage(imgData, 'JPEG', xPos, 10, imgWidthMm, 0);





            pdf.link(w - 51, 24, 15, 15, { url: 'https://wa.me/55199998629120' });
            pdf.link(w - 32, 24, 15, 15, { url: 'https://instagram.com/lnclimatizacaoeletrica' });

            pdf.save(`Orcamento_${nome.replace(/\s+/g, '_')}.pdf`);

            alert('PDF gerado com sucesso!');

        } catch (err) {
            console.error("Erro detalhado:", err);
            alert('Erro ao gerar PDF.');
        } finally {
            gerarPdfBtn.disabled = false;
            gerarPdfBtn.textContent = 'Gerar PDF';
            pdfTemplateElement.innerHTML = '';
        }
    });

});
