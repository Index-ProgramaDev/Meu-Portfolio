
const bg = document.getElementById("bgvideo");
const bgdois = document.getElementById("bgvideodois");
bg.playbackRate = 0.8;
bgdois.playbackRate = 1;



(function () {
    const targets = [
        { section: document.querySelector('.About'), speed: 0.25 },
        { section: document.querySelector('.tecnology'), speed: 0.18 },
    ];

    function onParallax() {
        targets.forEach(({ section, speed }) => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const center = rect.top + rect.height / 2 - window.innerHeight / 2;
            const offset = center * speed;
            const bg = section.querySelector(':scope::before') || section;

            section.style.setProperty('--parallax-y', offset + 'px');
        });
    }

    window.addEventListener('scroll', onParallax, { passive: true });
    onParallax();
})();



(function () {
    const section = document.getElementById('features');
    const cards = section.querySelectorAll('.feature');
    const counter = document.getElementById('feature-counter');
    const dotsNav = document.getElementById('features-dots');
    const N = cards.length;


    section.style.height = N * 100 + 'vh';


    cards.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'dot';
        d.addEventListener('click', () => goToCard(i));
        dotsNav.appendChild(d);
    });
    const dots = dotsNav.querySelectorAll('.dot');

    function pad(n) { return String(n + 1).padStart(2, '0'); }

    let current = -1;

    function activate(index) {
        if (index === current) return;

        cards.forEach((card, i) => {
            card.classList.remove('active', 'leaving');
            if (i < index) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(-70px) scale(1.02)';
            } else if (i === index) {
                card.style.opacity = '';
                card.style.transform = '';
                card.classList.add('active');
            } else {
                card.style.opacity = '';
                card.style.transform = '';
            }
        });

        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        counter.textContent = pad(index) + ' / ' + pad(N - 1);
        current = index;
    }

    function goToCard(index) {
        const top = section.getBoundingClientRect().top + window.scrollY;
        const pageH = section.offsetHeight / N;
        window.scrollTo({ top: top + pageH * index, behavior: 'smooth' });
    }

    function onScroll() {
        const top = section.getBoundingClientRect().top + window.scrollY;
        const h = section.offsetHeight;
        const scrolled = window.scrollY - top;


        const inSection = scrolled >= 0 && scrolled <= h;
        dotsNav.classList.toggle('visible', inSection);

        if (!inSection) return;

        const index = Math.min(Math.floor((scrolled / h) * N), N - 1);
        activate(index);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();



(function () {
    const servicesSection = document.querySelector(".Services");
    const video = document.getElementById("VideoChess");

    if (!servicesSection || !video) return;

    video.pause();

    let scrollRequested = false;

    const onVideoScroll = () => {
        const distance = window.scrollY - servicesSection.offsetTop;
        const totalScrollableArea = servicesSection.clientHeight - window.innerHeight;

        let percentage = distance / totalScrollableArea;
        percentage = Math.max(0, Math.min(percentage, 1));

        if (video.duration && !isNaN(video.duration)) {
            video.currentTime = video.duration * percentage;
        }
        scrollRequested = false;
    };

    window.addEventListener("scroll", () => {
        if (!scrollRequested) {
            window.requestAnimationFrame(onVideoScroll);
            scrollRequested = true;
        }
    }, { passive: true });

    video.addEventListener('loadedmetadata', onVideoScroll);
    onVideoScroll();
})();



(function () {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
            }
        });
    }, observerOptions);

    document.addEventListener('DOMContentLoaded', () => {
        const animatableElements = document.querySelectorAll('.animate-scroll');

        animatableElements.forEach(el => {
            sectionObserver.observe(el);
        });
    });




    const API_URL = '/api/admin';


    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        fetch(`${API_URL}/projects`)
            .then(res => res.json())
            .then(projects => {
                if(!projects || projects.length === 0) return;
                
                let html = "";
                projects.forEach((proj, index) => {
                    const delay = index === 0 ? "" : `delay-${index}`;
                    html += `
                        <div class="project-card animate-scroll ${delay}">
                            <div class="project-img-wrapper">
                                <img src="${proj.image.startsWith('.') ? proj.image : proj.image}" alt="${proj.title}" class="project-img" style="width: 100%; height: 100%; object-fit: cover;">
                                <div class="project-overlay">
                                    <a href="${proj.link}" target="_blank" style="text-decoration: none;">
                                        <span>Ver Projeto <i class="fa-solid fa-arrow-right"></i></span>
                                    </a>
                                </div>
                            </div>
                            <div class="project-info">
                                <h3 class="project-title">${proj.title}</h3>
                                <p class="project-desc">${proj.description}</p>
                            </div>
                        </div>
                    `;
                });
                projectsGrid.innerHTML = html;
                
                setTimeout(() => {
                    const loadedCards = projectsGrid.querySelectorAll('.animate-scroll');
                    loadedCards.forEach(c => sectionObserver.observe(c));
                }, 100);
            })
            .catch(err => console.log('Erro ao carregar banco de projetos:', err));
    }


    const ctaSection = document.getElementById('cta-final');
    if (ctaSection) {
        fetch(`${API_URL}/cta`)
            .then(res => res.json())
            .then(cta => {
                if(!cta) return;
                const p = ctaSection.querySelector('p');
                const btn = ctaSection.querySelector('.cta-button');
                
                if(p) p.textContent = cta.helpText;
                if(btn) btn.textContent = cta.buttonText;
            })
            .catch(err => console.log('Erro ao carregar banco CTA:', err));
    }


    const createProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-amber, #cca044), var(--accent-blue, #2a6bcc));
            z-index: 9999;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px rgba(204, 160, 68, 0.5);
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    };

    createProgressBar();
})();
