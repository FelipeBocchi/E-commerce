document.addEventListener('DOMContentLoaded', () => {
    
    // ===========================================
    // 1. ELEMENTOS DOM
    // ===========================================
    const productTitleEl = document.getElementById('product-title');
    const productPriceEl = document.getElementById('product-price');
    const productQuantityEl = document.getElementById('product-quantity');
    const btnIncrease = document.getElementById('btn-increase-quantity');
    const btnDecrease = document.getElementById('btn-decrease-quantity');
    const colorOptionsEl = document.getElementById('color-options');
    const sizeOptionsEl = document.getElementById('size-options');
    const mainImageEl = document.getElementById('main-product-image'); // Imagem principal (Desktop)
    const scrollableCarouselEl = document.getElementById('scrollable-carousel'); // Carrossel Vertical (Desktop)
    const scrollableWrapper = scrollableCarouselEl ? scrollableCarouselEl.querySelector('.scrollable-content-wrapper') : null;
    const productDescriptionTextEl = document.getElementById('product-description-text');
    const productColorNameEl = document.getElementById('product-color-name');
    const productSizeNameEl = document.getElementById('product-size-name');
    const cartCounterEl = document.getElementById('cart-counter');
    
    // Elementos NOVOS para o Carrossel Mobile
    const mobileCarouselContentEl = document.getElementById('mobile-carousel-content'); 
    const navLeft = document.getElementById('nav-left');
    const navRight = document.getElementById('nav-right');
    const FIXED_CAROUSEL_CONTAINER = document.getElementById('fixed-carousel'); // Contêiner pai para botões

    // ===========================================
    // 2. ESTADO E DADOS
    // ===========================================
    let currentProduct = null;
    let selectedColor = null;
    let selectedSize = null;
    let cartItems = 0;
    const MOBILE_BREAKPOINT = 1024; // Ponto de corte para responsividade

    // Função para buscar os dados (Simulação de fetch)
    const fetchProductData = async () => {
        try {
            const response = await fetch('../assets/Produtos-db/productData.json'); 
            if (!response.ok) throw new Error('Erro ao carregar productData.json');
            const data = await response.json();
            return data.products[0]; 
        } catch (error) {
            console.error("Falha na busca de dados:", error);
            throw error;
        }
    };

    // ===========================================
    // 3. FUNÇÕES DE RENDERIZAÇÃO E ATUALIZAÇÃO
    // ===========================================

    const renderProduct = (product) => {
        currentProduct = product;
        
        // Renderiza informações básicas
        productTitleEl.textContent = product.name;
        productPriceEl.textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
        productDescriptionTextEl.textContent = product.description;

        // Define e Renderiza Cor Inicial
        selectedColor = product.colors[0].name;
        productColorNameEl.textContent = selectedColor;
        renderColorOptions(product.colors);
        
        // Define e Renderiza Tamanho Inicial
        selectedSize = product.sizes[0];
        productSizeNameEl.textContent = selectedSize;
        renderSizeOptions(product.sizes);

        // Renderiza as imagens para a cor inicial e configura a responsividade
        updateImages(selectedColor);
    };

    const renderColorOptions = (colors) => {
        colorOptionsEl.innerHTML = '';
        colors.forEach((color, index) => {
            const imgEl = document.createElement('img');
            imgEl.src = color.swatchImage; 
            imgEl.classList.add('color-swatch');
            imgEl.dataset.color = color.name;
            imgEl.alt = `Opção de cor: ${color.name}`;
            
            if (index === 0) imgEl.classList.add('active'); 
            imgEl.addEventListener('click', handleColorClick);

            colorOptionsEl.appendChild(imgEl);
        });
    };

    const renderSizeOptions = (sizes) => {
        sizeOptionsEl.innerHTML = '';
        sizes.forEach((size, index) => {
            const buttonEl = document.createElement('button');
            buttonEl.classList.add('size-button');
            buttonEl.dataset.size = size;
            buttonEl.textContent = size;

            if (index === 0) buttonEl.classList.add('active'); 
            buttonEl.addEventListener('click', handleSizeClick);

            sizeOptionsEl.appendChild(buttonEl);
        });
    };
    
    // Função principal de atualização de imagens (CHAVE DA RESPONSIVIDADE)
    const updateImages = (colorName) => {
        if (!currentProduct) return;

        const colorData = currentProduct.colors.find(c => c.name === colorName);
        if (!colorData || colorData.images.length === 0) return;

        // Limpa ambos os containers antes de injetar
        if (scrollableWrapper) scrollableWrapper.innerHTML = '';
        if (mobileCarouselContentEl) mobileCarouselContentEl.innerHTML = '';

        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            setupMobileCarousel(colorData.images);
        } else {
            setupDesktopCarousel(colorData.images, colorName);
        }
    };
    
    // ===========================================
    // 4. LÓGICA DO CARROSSEL
    // ===========================================
    
    /* --- Carrossel Desktop (Vertical Infinito) --- */
    const setupDesktopCarousel = (images, colorName) => {
        // Mostra a imagem principal estática
        mainImageEl.src = images[0];
        mainImageEl.style.display = 'block';
        mainImageEl.classList.add('desktop-main-image'); // Garante que a classe de CSS seja aplicada
        
        // Esconde elementos do mobile
        if (mobileCarouselContentEl) mobileCarouselContentEl.style.display = 'none';
        if (navLeft) navLeft.style.display = 'none';
        if (navRight) navRight.style.display = 'none';
        if (scrollableCarouselEl) scrollableCarouselEl.style.display = 'flex'; // Mostra o vertical

        // Preenche o carrossel vertical
        if (scrollableWrapper) {
            const imagesToScroll = images.slice(1);
            const content = [...imagesToScroll, ...imagesToScroll]; // Duplica para loop

            content.forEach((imgUrl, index) => {
                const imgEl = document.createElement('img');
                imgEl.src = imgUrl;
                imgEl.alt = `Detalhe ${index + 2} da roupa na cor ${colorName}`;
                scrollableWrapper.appendChild(imgEl);
            });
        }
    };

    /* --- Carrossel Mobile (Horizontal Fixo com Botões) --- */
    const setupMobileCarousel = (images) => {
        // Esconde imagem principal do desktop e carrossel vertical
        mainImageEl.style.display = 'none';
        if (scrollableCarouselEl) scrollableCarouselEl.style.display = 'none';

        // Mostra elementos do mobile e preenche o carrossel horizontal
        if (mobileCarouselContentEl) {
            mobileCarouselContentEl.style.display = 'flex';
            images.forEach((imgUrl, index) => {
                const imgEl = document.createElement('img');
                imgEl.src = imgUrl;
                imgEl.alt = `Imagem ${index + 1} do produto`;
                imgEl.dataset.index = index;
                mobileCarouselContentEl.appendChild(imgEl);
            });
        }
        
        // Mostra botões de navegação
        if (navLeft) navLeft.style.display = 'block';
        if (navRight) navRight.style.display = 'block';
    };

    /* --- Navegação Mobile (Botões) --- */
    const handleCarouselNav = (direction) => {
        if (window.innerWidth <= MOBILE_BREAKPOINT && mobileCarouselContentEl) {
            const container = mobileCarouselContentEl;
            const scrollAmount = container.clientWidth;
            let targetScroll = container.scrollLeft;

            if (direction === 'right') {
                targetScroll += scrollAmount;
            } else if (direction === 'left') {
                targetScroll -= scrollAmount;
            }

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };


    // ===========================================
    // 5. LISTENERS E CONTROLES
    // ===========================================

    // --- Handlers de Opções ---
    const handleColorClick = (event) => {
        const clickedEl = event.target;
        selectedColor = clickedEl.dataset.color;
        
        document.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('active'));
        clickedEl.classList.add('active');
        productColorNameEl.textContent = selectedColor;

        updateImages(selectedColor);
    };

    const handleSizeClick = (event) => {
        const clickedEl = event.target;
        selectedSize = clickedEl.dataset.size;
        
        document.querySelectorAll('.size-button').forEach(el => el.classList.remove('active'));
        clickedEl.classList.add('active');
        productSizeNameEl.textContent = selectedSize;
    };

    // --- Controle de Quantidade ---
    btnIncrease.addEventListener('click', () => {
        let currentQuantity = parseInt(productQuantityEl.textContent);
        productQuantityEl.textContent = currentQuantity + 1;
    });

    btnDecrease.addEventListener('click', () => {
        let currentQuantity = parseInt(productQuantityEl.textContent);
        if (currentQuantity > 1) {
            productQuantityEl.textContent = currentQuantity - 1;
        }
    });

    // --- Carrinho ---
    function updateCartCounter() {
        if (cartItems > 0) {
            cartCounterEl.textContent = cartItems;
            cartCounterEl.style.display = 'block';
        } else {
            cartCounterEl.textContent = '0';
            cartCounterEl.style.display = 'none';
        }
    }
    document.getElementById('add-cart-btn').addEventListener('click', () => {
        const currentQuantity = parseInt(productQuantityEl.textContent);
        cartItems += currentQuantity;
        updateCartCounter();
        alert(`${currentQuantity} item(s) adicionados ao carrinho!`);
    });

    // --- Navegação e Responsividade ---
    navRight.addEventListener('click', () => handleCarouselNav('right'));
    navLeft.addEventListener('click', () => handleCarouselNav('left'));

    // Atualiza o carrossel ao redimensionar a tela
    window.addEventListener('resize', () => {
        const activeColorEl = document.querySelector('.color-swatch.active');
        const activeColorName = activeColorEl ? activeColorEl.dataset.color : (currentProduct ? currentProduct.colors[0].name : null);
        
        if (activeColorName) {
            updateImages(activeColorName);
        }
    });
    
    // --- INICIALIZAÇÃO ---
    fetchProductData()
        .then(renderProduct)
        .catch(error => {
            console.error("Erro fatal ao carregar o produto:", error);
            productTitleEl.textContent = "Erro ao Carregar Produto";
        });
});