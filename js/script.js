document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos principais
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('.navbar'); 
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.nav-links li a');

    // ======================================================
    // 1. FUNCIONALIDADE DA NAVBAR E MENU HAMBÚRGUER
    // ======================================================

    const toggleNav = () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');

        navLinks.forEach((link, index) => {
            if (nav.classList.contains('nav-active')) {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            } else {
                link.style.animation = '';
            }
        });
    };

    burger.addEventListener('click', toggleNav);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                toggleNav(); 
            }
        });
    });

    // ======================================================
    // 2. SCROLL SPY E EFEITO DE FUNDO DA NAVBAR
    // ======================================================

    const activateScrollFeatures = () => {
        const scrollPos = window.scrollY;

        // Efeito de Fundo da Navbar
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Spy (Realça link ativo)
        let current = '';
        sections.forEach(section => {
            const headerHeight = header.offsetHeight || 80; 
            const sectionTop = section.offsetTop - headerHeight;

            if (scrollPos >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateScrollFeatures);
    activateScrollFeatures(); 

    // ======================================================
    // 3. EFEITO DE DIGITAÇÃO NO SLOGAN
    // * DESATIVADO: O visual SpaceX usa títulos fixos e grandes. *
    // ======================================================
    /* const sloganElement = document.querySelector('.hero-content h1');
    const originalSlogan = sloganElement ? sloganElement.textContent : ''; 
    const typingSpeed = 50;
    const delayBeforeStart = 500;

    if (sloganElement) {
        sloganElement.textContent = ''; // Limpa o texto para começar a digitar
        setTimeout(() => {
            let i = 0;
            function typeWriter() {
                if (i < originalSlogan.length) {
                    sloganElement.textContent += originalSlogan.charAt(i); 
                    i++;
                    setTimeout(typeWriter, typingSpeed);
                }
            }
            typeWriter();
        }, delayBeforeStart);
    }
    */


    // ======================================================
    // 4. SCROLL REVEAL
    // ======================================================

    const scrollElements = document.querySelectorAll('.service-card, .about-content, .contact-grid');
    
    const elementInView = (el, dividend = 1.25) => el.getBoundingClientRect().top <= (window.innerHeight || document.documentElement.clientHeight) / dividend;
    
    const displayScrollElement = el => el.classList.add('scrolled');
    
    const handleScrollAnimation = () => scrollElements.forEach(el => { 
        if (elementInView(el)) displayScrollElement(el); 
    });

    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); 


    // ======================================================
    // 5. LUA 3D COM THREE.JS (Posicionamento SpaceX)
    // ======================================================
    
    const canvas = document.getElementById('earth-canvas');

if (canvas && typeof THREE !== 'undefined') {

    /* ======================================================
       TAMANHO
    ====================================================== */
    let width = window.innerWidth;
    let height = window.innerHeight;

    /* ======================================================
       RENDERER (ALTA QUALIDADE, ESTÁVEL)
    ====================================================== */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // estável
    renderer.setClearColor(0x000000, 0);

    /* ======================================================
       CENA & CÂMERA (CONFIGURADA DESDE O INÍCIO)
    ====================================================== */
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        1000
    );

    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    /* ======================================================
       ESTRELAS
    ====================================================== */
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        transparent: true,
        opacity: 0.9
    });

    const starsVertices = [];
    for (let i = 0; i < 15000; i++) {
        starsVertices.push(
            THREE.MathUtils.randFloatSpread(3000),
            THREE.MathUtils.randFloatSpread(3000),
            THREE.MathUtils.randFloatSpread(3000)
        );
    }

    starsGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(starsVertices, 3)
    );

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    /* ======================================================
       TEXTURAS DA LUA (LEVE, CONFIÁVEL)
    ====================================================== */
    const loader = new THREE.TextureLoader();

    const moonMap = loader.load(
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg'
    );

    const moonBump = loader.load(
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg'
    );

    /* ======================================================
       LUA (GEOMETRIA + MATERIAL)
    ====================================================== */
    const moonGeometry = new THREE.SphereGeometry(1.9, 128, 128);

    const moonMaterial = new THREE.MeshPhongMaterial({
        map: moonMap,
        bumpMap: moonBump,
        bumpScale: 0.9,
        shininess: 4,
        color: 0xffffff
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(1.8, 0, 0); // VISÍVEL GARANTIDO
    scene.add(moon);

    /* ======================================================
       LUZES (EQUILIBRADAS)
    ====================================================== */
    const mainLight = new THREE.DirectionalLight(0xffffff, 4);
    mainLight.position.set(10, 6, 8);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xaaaaaa, 1.2);
    fillLight.position.set(-6, -4, -6);
    scene.add(fillLight);

    scene.add(new THREE.AmbientLight(0x404040, 0.8));

    /* ======================================================
       INTERAÇÃO
    ====================================================== */
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;
    const damping = 0.93;

    canvas.addEventListener('mousedown', e => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    canvas.addEventListener('mousemove', e => {
        if (!isDragging) return;
        velY = (e.clientX - prevX) * 0.002;
        velX = (e.clientY - prevY) * 0.002;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);

    /* ======================================================
       ANIMAÇÃO
    ====================================================== */
    function animate() {
        requestAnimationFrame(animate);

        if (!isDragging) {
            moon.rotation.y += 0.0012;
        }

        moon.rotation.x += velX;
        moon.rotation.y += velY;

        velX *= damping;
        velY *= damping;

        stars.rotation.y += 0.00004;

        renderer.render(scene, camera);
    }

    animate();

    /* ======================================================
       RESIZE (NÃO SOME)
    ====================================================== */
    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        if (width < 900) {
    moon.position.set(100, 0, 0);
    camera.position.z = 6.8;
} else {
            moon.position.set(4.4, 0.3, 0);
            camera.position.z = 6;
        }
    }

    window.addEventListener('resize', handleResize);
}
});

// Seleciona todos os botões de pergunta
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        // Pega o elemento pai (.faq-item)
        const faqItem = question.parentElement;

        // Apenas alterna a classe do item clicado, sem fechar os outros
        faqItem.classList.toggle('active');
    });
});