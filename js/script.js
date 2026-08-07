document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Welcome Loader
       ========================================================================== */
    const loader = document.getElementById('welcome-loader');
    setTimeout(() => {
        loader.classList.add('loaded');
        // Start background effects after loader finishes
        startAmbientEffects();
    }, 3000);

    /* ==========================================================================
       2. Custom Cursor & Hover Effects
       ========================================================================== */
    const cursor = document.getElementById('custom-cursor');
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const hoverElements = document.querySelectorAll('a, button, .gallery-item, .wish-card, input[type="range"]');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    /* ==========================================================================
       3. Scroll Progress Bar
       ========================================================================== */
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    /* ==========================================================================
       4. Scroll Down Indicator & Page Interactions
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollDownIndicator = document.getElementById('scroll-down');

    if (scrollDownIndicator) {
        scrollDownIndicator.addEventListener('click', () => {
            const nextSection = document.getElementById('countdown') || document.getElementById('cake');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('show', window.scrollY > 500);
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ==========================================================================
       5. Advanced Music Controller
       ========================================================================== */
    const bgMusic = document.getElementById('bg-music');
    const btnPlay = document.getElementById('mc-play');
    const btnMute = document.getElementById('mc-mute');
    const btnLoop = document.getElementById('mc-loop');
    const progressSlider = document.getElementById('mc-progress');
    const volumeSlider = document.getElementById('mc-volume');
    const currentTimeEl = document.getElementById('mc-current-time');
    const durationEl = document.getElementById('mc-duration');
    const equalizer = document.querySelector('.equalizer');
    const pulseIcon = document.querySelector('.pulse-icon');
    
    let isPlaying = false;
    let isMuted = false;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    bgMusic.addEventListener('loadedmetadata', () => {
        progressSlider.max = bgMusic.duration;
        durationEl.textContent = formatTime(bgMusic.duration);
    });

    const togglePlay = () => {
        if (isPlaying) {
            bgMusic.pause();
            btnPlay.innerHTML = '<i class="fas fa-play"></i>';
            equalizer.classList.remove('playing');
            pulseIcon.classList.remove('playing');
        } else {
            bgMusic.play().catch(e => console.warn("Autoplay prevented", e));
            btnPlay.innerHTML = '<i class="fas fa-pause"></i>';
            equalizer.classList.add('playing');
            pulseIcon.classList.add('playing');
        }
        isPlaying = !isPlaying;
    };

    btnPlay.addEventListener('click', togglePlay);

    btnMute.addEventListener('click', () => {
        isMuted = !isMuted;
        bgMusic.muted = isMuted;
        btnMute.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    });

    btnLoop.addEventListener('click', () => {
        bgMusic.loop = !bgMusic.loop;
        btnLoop.classList.toggle('active', bgMusic.loop);
    });

    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
        if(bgMusic.volume === 0) {
            isMuted = true;
            btnMute.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            isMuted = false;
            btnMute.innerHTML = '<i class="fas fa-volume-up"></i>';
            bgMusic.muted = false;
        }
    });

    bgMusic.addEventListener('timeupdate', () => {
        progressSlider.value = bgMusic.currentTime;
        currentTimeEl.textContent = formatTime(bgMusic.currentTime);
    });

    progressSlider.addEventListener('input', (e) => {
        bgMusic.currentTime = e.target.value;
    });


    /* ==========================================================================
       6. Countdown Timer
       ========================================================================== */
    // Set birthday to tomorrow for demo purposes so user can see it ticking
    let birthdayDate = new Date();
    birthdayDate.setDate(birthdayDate.getDate() + 1);
    birthdayDate.setHours(0, 0, 0, 0);

    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-minutes');
    const elSecs = document.getElementById('cd-seconds');
    const cdMessage = document.getElementById('countdown-message');
    const cdContainer = document.querySelector('.countdown-container');

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = birthdayDate.getTime() - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            cdContainer.classList.add('hidden');
            cdMessage.classList.remove('hidden');
            triggerCelebration();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        elDays.textContent = days < 10 ? '0' + days : days;
        elHours.textContent = hours < 10 ? '0' + hours : hours;
        elMins.textContent = minutes < 10 ? '0' + minutes : minutes;
        elSecs.textContent = seconds < 10 ? '0' + seconds : seconds;
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();


    /* ==========================================================================
       7. Interactive Cake Section
       ========================================================================== */
    const btnLight = document.getElementById('btn-light');
    const btnBlow = document.getElementById('btn-blow');
    const btnReset = document.getElementById('btn-reset');
    const flames = document.querySelectorAll('.flame');
    const cakeMessage = document.getElementById('cake-message');

    btnLight.addEventListener('click', () => {
        flames.forEach(f => f.classList.add('lit'));
        btnLight.disabled = true;
        btnBlow.disabled = false;
        // Subtle ambient effect
        startAmbientEffects();
    });

    btnBlow.addEventListener('click', () => {
        flames.forEach(f => f.classList.remove('lit'));
        btnBlow.disabled = true;
        cakeMessage.classList.remove('hidden');
        triggerCelebration(); // Fireworks & Confetti
    });

    btnReset.addEventListener('click', () => {
        flames.forEach(f => f.classList.remove('lit'));
        btnLight.disabled = false;
        btnBlow.disabled = true;
        cakeMessage.classList.add('hidden');
    });


    /* ==========================================================================
       8. Animated Gift Box
       ========================================================================== */
    const btnOpenGift = document.getElementById('btn-open-gift');
    const giftBox = document.getElementById('gift-box');
    const giftMessage = document.getElementById('gift-message');
    
    // Add shake effect periodically
    setInterval(() => {
        if(!giftBox.classList.contains('open')){
            giftBox.classList.add('shake');
            setTimeout(() => giftBox.classList.remove('shake'), 500);
        }
    }, 3000);

    btnOpenGift.addEventListener('click', () => {
        btnOpenGift.disabled = true;
        giftBox.classList.remove('shake');
        giftBox.classList.add('open');
        
        setTimeout(() => {
            giftMessage.classList.remove('hidden');
            launchConfetti();
        }, 800);
    });


    /* ==========================================================================
       9. Letter Envelope & Typewriter
       ========================================================================== */
    const btnOpenLetter = document.getElementById('btn-open-letter');
    const envelopeContainer = document.getElementById('envelope-container');
    const envelopeBox = document.querySelector('.envelope-box');
    const openedLetterPaper = document.getElementById('opened-letter-paper');
    const typewriterContainer = document.getElementById('typewriter-container');
    const sourceText = document.getElementById('letter-source-text').textContent.trim();
    let isTypingStarted = false;

    const typeWriter = (text, i, fnCallback) => {
        if (i < text.length) {
            typewriterContainer.innerHTML = text.substring(0, i+1) + '<span class="cursor"></span>';
            setTimeout(() => typeWriter(text, i + 1, fnCallback), 30); 
        } else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 500);
        }
    };

    if (btnOpenLetter) {
        btnOpenLetter.addEventListener('click', () => {
            btnOpenLetter.disabled = true;
            if (envelopeBox) envelopeBox.classList.add('shake');
            startHeartFloat();

            setTimeout(() => {
                if (envelopeContainer) envelopeContainer.style.display = 'none';
                if (openedLetterPaper) {
                    openedLetterPaper.classList.remove('hidden');
                }

                if (!isTypingStarted) {
                    isTypingStarted = true;
                    typeWriter(sourceText, 0, () => {
                        const cursor = document.querySelector('.typewriter-text .cursor');
                        if (cursor) cursor.style.display = 'none';
                    });
                }
            }, 600);
        });
    }


    /* ==========================================================================
       10. Scroll Reveal Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    
    revealElements.forEach(el => revealObserver.observe(el));


    /* ==========================================================================
       11. Button Ripple Effect
       ========================================================================== */
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if(this.disabled) return;
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            const ripple = document.createElement('span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });


    /* ==========================================================================
       12. Enhanced Lightbox Gallery
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentImgIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    const galleryData = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt,
        caption: item.querySelector('.caption').textContent
    }));

    const updateLightbox = () => {
        const data = galleryData[currentImgIndex];
        lightboxImg.src = data.src;
        lightboxImg.alt = data.alt;
        lightboxCaption.textContent = data.caption;
        lightboxCounter.textContent = `${currentImgIndex + 1} / ${galleryData.length}`;
    };

    const openLightbox = (idx) => {
        currentImgIndex = idx;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const navLightbox = (dir) => {
        currentImgIndex = (currentImgIndex + dir + galleryData.length) % galleryData.length;
        updateLightbox();
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navLightbox(1); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navLightbox(-1); });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navLightbox(1);
        if (e.key === 'ArrowLeft') navLightbox(-1);
    });

    // Touch Swipe Support
    lightbox.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) navLightbox(1); // Swipe Left -> Next
        if (touchEndX > touchStartX + swipeThreshold) navLightbox(-1); // Swipe Right -> Prev
    };



    /* ==========================================================================
       13. HIGH PERFORMANCE CANVAS ENGINE (Confetti, Fireworks, Hearts)
       ========================================================================== */
    const canvas = document.getElementById('canvas-effects');
    const ctx = canvas.getContext('2d');
    
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    window.addEventListener('resize', () => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    });

    let particles = [];
    const colors = ['#FF4F81', '#A855F7', '#FFD166', '#4F8EF7', '#FFFFFF', '#FF9A9E', '#FECFEF'];

    // --- Particle Classes ---

    class Confetti {
        constructor() {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * -canvasHeight;
            this.size = Math.random() * 8 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 4 - 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            this.type = 'confetti';
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            if (this.y > canvasHeight) this.y = Math.random() * -100;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size*1.5);
            ctx.restore();
        }
    }

    class Firework {
        constructor() {
            this.x = Math.random() * canvasWidth;
            this.y = canvasHeight;
            this.targetY = Math.random() * (canvasHeight * 0.5) + canvasHeight * 0.1;
            this.speed = Math.random() * 4 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.exploded = false;
            this.type = 'firework';
        }
        update(particleArray, index) {
            this.y -= this.speed;
            if (this.y <= this.targetY && !this.exploded) {
                this.explode(particleArray);
                particleArray.splice(index, 1);
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        explode(particleArray) {
            for(let i=0; i<30; i++) {
                particleArray.push(new FireworkParticle(this.x, this.y, this.color));
            }
        }
    }

    class FireworkParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = Math.random() * 3 + 1;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 1;
            this.speedX = Math.cos(angle) * velocity;
            this.speedY = Math.sin(angle) * velocity;
            this.gravity = 0.05;
            this.life = 100;
            this.type = 'firework-particle';
        }
        update(particleArray, index) {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 1;
            if(this.life <= 0) particleArray.splice(index, 1);
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life / 100;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    class Heart {
        constructor() {
            this.x = Math.random() * canvasWidth;
            this.y = canvasHeight + 50;
            this.size = Math.random() * 15 + 10;
            this.speedY = Math.random() * 2 + 1;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = Math.random() * 0.05;
            this.color = '#FF4F81';
            this.type = 'heart';
        }
        update(particleArray, index) {
            this.y -= this.speedY;
            this.x += Math.sin(this.angle) * 1;
            this.angle += this.spin;
            if(this.y < -50) particleArray.splice(index, 1);
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(this.size / 20, this.size / 20); // Normalize size mapping
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            // Draw SVG-like path for heart on canvas
            ctx.moveTo(0, 5);
            ctx.bezierCurveTo(-10, -10, -25, 5, 0, 20);
            ctx.bezierCurveTo(25, 5, 10, -10, 0, 5);
            ctx.fill();
            ctx.restore();
        }
    }


    class Petal {
        constructor() {
            this.x = Math.random() * canvasWidth;
            this.y = -20;
            this.size = Math.random() * 10 + 8;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.color = Math.random() > 0.5 ? '#FF4F81' : '#FF9A9E';
            this.type = 'petal';
        }
        update(particleArray, index) {
            this.y += this.speedY;
            this.x += Math.sin(this.y / 30) + this.speedX;
            this.rotation += this.rotationSpeed;
            if (this.y > canvasHeight + 20) particleArray.splice(index, 1);
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Star {
        constructor() {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
            this.size = Math.random() * 2 + 1;
            this.alpha = Math.random();
            this.alphaSpeed = Math.random() * 0.02 + 0.005;
            this.type = 'star';
        }
        update() {
            this.alpha += this.alphaSpeed;
            if (this.alpha > 1 || this.alpha < 0.2) this.alphaSpeed = -this.alphaSpeed;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.abs(this.alpha);
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }


    // --- Engine Loop ---
    const animateCanvas = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update(particles, i);
            if(particles[i]) particles[i].draw();
        }
        requestAnimationFrame(animateCanvas);
    };
    animateCanvas();


    // --- Triggers & Auto-Throttling for Performance ---
    const isLowPowerDevice = window.innerWidth < 768 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    let effectIntervals = [];

    window.launchConfetti = () => {
        const count = isLowPowerDevice ? 50 : 120;
        for(let i = 0; i < count; i++) particles.push(new Confetti());
    };

    window.launchFireworks = () => {
        const intervalTime = isLowPowerDevice ? 500 : 300;
        const fwInterval = setInterval(() => {
            if (particles.length < 150) {
                particles.push(new Firework());
            }
        }, intervalTime);
        effectIntervals.push(fwInterval);
        
        setTimeout(() => {
            clearInterval(fwInterval);
        }, 5000);
    };

    window.startHeartFloat = () => {
        const intervalTime = isLowPowerDevice ? 350 : 200;
        const htInterval = setInterval(() => {
            if (particles.length < 150) {
                particles.push(new Heart());
            }
        }, intervalTime);
        effectIntervals.push(htInterval);
        setTimeout(() => clearInterval(htInterval), 4500);
    };

    window.startFlowerRain = () => {
        const intervalTime = isLowPowerDevice ? 250 : 150;
        const flInterval = setInterval(() => {
            if (particles.length < 150) {
                particles.push(new Petal());
            }
        }, intervalTime);
        effectIntervals.push(flInterval);
        setTimeout(() => clearInterval(flInterval), 6000);
    };

    window.enableNightSky = () => {
        document.body.classList.add('night-sky');
        const starCount = isLowPowerDevice ? 30 : 60;
        if(!particles.some(p => p.type === 'star')) {
            for(let i = 0; i < starCount; i++) particles.push(new Star());
        }
    };

    window.startAmbientEffects = () => {
        setInterval(() => {
            if(particles.length < 50) particles.push(new Confetti());
        }, 1000);
    };

    const triggerCelebration = () => {
        launchConfetti();
        launchFireworks();
        startHeartFloat();
        startFlowerRain();
        enableNightSky();
    };

    // Replay celebration button
    const btnReplay = document.getElementById('btn-replay-celebration');
    if (btnReplay) {
        btnReplay.addEventListener('click', () => {
            triggerCelebration();
        });
    }

    // Auto-enable night sky when scrolling to final celebration
    const finalSection = document.getElementById('final-celebration');
    if (finalSection) {
        const finalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    enableNightSky();
                    startFlowerRain();
                }
            });
        }, { threshold: 0.3 });
        finalObserver.observe(finalSection);
    }

    /* ==========================================================================
       14. Floating Quotes Feature
       ========================================================================== */
    const quotes = [
        "Keep Smiling ❤️",
        "You Are Amazing ✨",
        "Happy Birthday 🎂",
        "Dhalasho Wacan 🌹"
    ];

    const showRandomQuote = () => {
        const quoteText = quotes[Math.floor(Math.random() * quotes.length)];
        const quoteEl = document.createElement('div');
        quoteEl.className = 'floating-quote';
        quoteEl.textContent = quoteText;

        const randomX = Math.floor(Math.random() * (window.innerWidth - 220));
        const randomY = Math.floor(Math.random() * (window.innerHeight - 150)) + 60;
        quoteEl.style.left = `${Math.max(20, randomX)}px`;
        quoteEl.style.top = `${Math.max(80, randomY)}px`;

        document.body.appendChild(quoteEl);

        setTimeout(() => quoteEl.classList.add('show'), 100);

        setTimeout(() => {
            quoteEl.classList.remove('show');
            setTimeout(() => quoteEl.remove(), 800);
        }, 4000);
    };

    setTimeout(() => {
        showRandomQuote();
        setInterval(showRandomQuote, 7000);
    }, 4000);

});
