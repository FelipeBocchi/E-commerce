gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
fetch("./layout/header.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;
    });
});

// animação do hero (fade + slide up)
gsap.from(".div_content_one_section h2", {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
});

gsap.from(".div_content_one_section p", {
    y: 50,
    opacity: 0,
    duration: 1.2,
    delay: 0.2,
    ease: "power3.out",
});

gsap.from(".slideshow_button", {
    y: 40,
    opacity: 0,
    duration: 1.2,
    delay: 0.4,
    ease: "power3.out",
});

// animação do marquee ao scroll (já tinha te passado)
gsap.to(".marquee", {
    y: -200,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".hero_section",
        start: "top top",
        end: "bottom top",
        scrub: true,
    }
});


// timeline master
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".product_trending_section",
        start: "top bottom",
        end: "+=750",
        scrub: true,
    }
});

//  Hero text e marquee sobem e desaparecem
tl.to(".div_content_one_section h2", { y: -100, opacity: 0, ease: "power1.out" }, 0);
tl.to(".div_content_one_section p", { y: -100, opacity: 0, ease: "power1.out" }, 0.1);
tl.to(".slideshow_button", { y: -100, opacity: 0, ease: "power1.out" }, 0.2);
tl.to(".marquee", { y: -200, opacity: 0, ease: "power1.out" }, 0);

//  Títulos TRENDING / PRODUCTS se separam
tl.fromTo(".trending_title h3.left",
    { x: 0, opacity: 0 },
    { x: -150, opacity: 1, ease: "power3.out" }, 0.3
);
tl.fromTo(".trending_title h3.right",
    { x: 0, opacity: 0 },
    { x: 150, opacity: 1, ease: "power3.out" }, 0.3
);

//  Cards aparecem “virando / deslizando”
tl.to(".div_product_trending .card_product_trending", {
    y: 0,
    rotateX: 0,
    opacity: 1,
    stagger: 0.15,
    ease: "power3.out",
}, 0.6);

// ELEMENTOS
const gallery = document.querySelector(".seasons_gallery");
const wrapper = document.querySelector(".seasons_gallery_wrapper");

// PEGA A LARGURA TOTAL DA GALERIA
const totalWidth = gallery.scrollWidth;
const wrapperWidth = wrapper.offsetWidth;

// DISTÂNCIA REAL QUE A GALERIA PRECISA ANDAR
const moveDistance = totalWidth - wrapperWidth;

gsap.to(".seasons_gallery", {
    x: -moveDistance,
    ease: "none",
    scrollTrigger: {
        trigger: "#seasons",
        start: "top top",
        end: `+=${moveDistance}`, 
        scrub: true,
        pin: true,
    }
});

// = barra de progresso
const track = document.querySelector(".seasons_gallery");
const progressBar = document.querySelector(".bar_on_gallery");

ScrollTrigger.create({
    trigger: track,
    start: "left left",
    end: `+=${moveDistance}`,
    scrub: 1,
    onUpdate: (self) => {
        progressBar.style.width = (self.progress * 100) + "%";
    }
});

// - Opacidade do texto da galeria
gsap.to(".seasons_text", {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: ".season_card", // primeiro card
        start: "left 10%", 
        end: "right",
        scrub: true
    }
});


// commets

const slider = document.querySelector(".div_content_commets");

let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

window.addEventListener("mouseup", () => {
    isDown = false;
});

slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.3;
    slider.scrollLeft = scrollLeft - walk;
});

gsap.utils.toArray(".div_content_commet").forEach(card => {
    gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
        }
    });
});


const container = document.querySelector('.div_content_commets');
const cards = document.querySelectorAll('.div_content_commet');
const dots = document.querySelectorAll('.swiper_commits');

// Função para trocar o ponto ativo
const updateDots = () => {
    let index = Math.round(container.scrollLeft / (cards[0].offsetWidth + 30));

    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
};

// Atualiza no scroll
container.addEventListener('scroll', updateDots);

// Clicar no ponto leva ao card
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        container.scrollTo({
            left: (cards[0].offsetWidth + 30) * i,
            behavior: 'smooth'
        });
    });
});

// Ativo inicial
dots[0].classList.add('active');


