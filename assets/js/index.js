// LOADER
window.addEventListener('load', () => {
    setTimeout(() => {
        const l = document.getElementById('loader');
        l.classList.add('gone');
        setTimeout(() => l.style.display = 'none', 900);
    }, 2600);
});

// CURSOR
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // console.log("X: " + e.clientX + " Y: " + e.clientY);
});

(function animC() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animC);
})();
document.querySelectorAll('a,button,.frag-card,.exp-card,.note-pill').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cur.style.transform = 'translate(-50%,-50%) scale(2.5)';
        ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
        ring.style.borderColor = 'rgba(201,168,76,0.7)';
    });
    el.addEventListener('mouseleave', () => {
        cur.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.borderColor = 'rgba(201,168,76,0.45)';
    });
});

// NAVBAR
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('s', window.scrollY > 60));

// HERO PARTICLES
const pc = document.getElementById('particle-canvas');
const pctx = pc.getContext('2d');

function resPC() {
    pc.width = window.innerWidth;
    pc.height = window.innerHeight;
}

resPC();
window.addEventListener('resize', resPC);
let mouse = {x: window.innerWidth / 2, y: window.innerHeight / 2};
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * pc.width;
        this.y = Math.random() * pc.height;
        this.size = Math.random() * 1.8 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.7 + 0.1;
        const r = Math.random();
        if (r < 0.4) this.color = `rgba(201,168,76,${this.opacity})`;
        else if (r < 0.7) this.color = `rgba(176,96,128,${this.opacity})`;
        else this.color = `rgba(245,237,224,${this.opacity * 0.4})`;
    }

    update() {
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
            this.vx -= dx / dist * 0.04;
            this.vy -= dy / dist * 0.04;
        }
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > pc.width || this.y < 0 || this.y > pc.height) this.reset();
    }

    draw() {
        pctx.beginPath();
        pctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pctx.fillStyle = this.color;
        pctx.fill();
    }
}

const particles = Array.from({length: 180}, () => new Particle());

// connect nearby particles
function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 90) {
                pctx.beginPath();
                pctx.strokeStyle = `rgba(201,168,76,${0.12 * (1 - d / 90)})`;
                pctx.lineWidth = 0.5;
                pctx.moveTo(particles[i].x, particles[i].y);
                pctx.lineTo(particles[j].x, particles[j].y);
                pctx.stroke();
            }
        }
    }
}

(function animP() {
    pctx.clearRect(0, 0, pc.width, pc.height);
    drawLines();
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animP);
})();

// MIST CANVAS (cursor-interactive)
const mc = document.getElementById('mist-canvas');
const mctx = mc.getContext('2d');

function resMC() {
    mc.width = window.innerWidth;
    mc.height = window.innerHeight;
}

resMC();
window.addEventListener('resize', resMC);
let mists = [];

class Mist {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 80 + 30;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -Math.random() * 0.8 - 0.3;
        this.life = 0;
        this.maxLife = Math.random() * 100 + 80;
        this.opacity = Math.random() * 0.08 + 0.03;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        this.size += 0.5;
    }

    draw() {
        const a = this.opacity * (1 - this.life / this.maxLife);
        mctx.beginPath();
        mctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const g = mctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        g.addColorStop(0, `rgba(176,96,128,${a})`);
        g.addColorStop(1, `rgba(45, 22, 80, 0)`);
        mctx.fillStyle = g;
        mctx.fill();
    }
}

let lastMist = 0;
document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastMist > 40) {
        mists.push(new Mist(e.clientX, e.clientY));
        lastMist = now;
    }
});
(function animM() {
    mctx.clearRect(0, 0, mc.width, mc.height);
    mists = mists.filter(m => m.life < m.maxLife);
    mists.forEach(m => {
        m.update();
        m.draw();
    });
    requestAnimationFrame(animM);
})();

// SCROLL REVEAL
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('v');
            obs.unobserve(e.target);
        }
    });
}, {threshold: 0.1});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// COUNTER
const cobs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.snum').forEach(n => {
                const target = +n.dataset.target, suf = n.dataset.suffix || '';
                let c = 0;
                const inc = target / 60;
                const t = setInterval(() => {
                    c += inc;
                    if (c >= target) {
                        c = target;
                        clearInterval(t);
                    }
                    n.textContent = Math.floor(c) + suf;
                }, 20);
            });
            cobs.unobserve(e.target);
        }
    });
}, {threshold: 0.5});
document.querySelectorAll('.i-stats').forEach(el => cobs.observe(el));

// PARALLAX HERO
window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const hc = document.querySelector('.hero-content');
    if (hc && s < window.innerHeight) {
        hc.style.transform = `translateY(${s * 0.28}px)`;
        hc.style.opacity = 1 - s / (window.innerHeight * 0.75);
    }
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) {
            e.preventDefault();
            t.scrollIntoView({behavior: 'smooth'});
        }
    });
});

// NEWSLETTER
document.getElementById('nl-btn').addEventListener('click', function () {
    const inp = document.querySelector('.nl-form input');
    if (inp.value.includes('@')) {
        this.textContent = 'Merci ✓';
        inp.value = '';
        setTimeout(() => this.textContent = "S'inscrire", 3000);
    }
});