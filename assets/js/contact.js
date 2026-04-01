// CURSOR
const cur = document.getElementById('cur'), ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
});
(function aC() {
    rx += (mx - rx) * .13;
    ry += (my - ry) * .13;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(aC);
})();
document.querySelectorAll('a,button,.hc,.bout-card,.ext-card,.faq-q').forEach(el => {
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
window.addEventListener('scroll', () => document.getElementById('nav').classList.toggle('s', window.scrollY > 60));

// MIST
const mc = document.getElementById('mist-canvas'), mctx = mc.getContext('2d');

function rMC() {
    mc.width = window.innerWidth;
    mc.height = window.innerHeight;
}

rMC();
window.addEventListener('resize', rMC);
let mists = [];

class Mist {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 80 + 30;
        this.vx = (Math.random() - .5) * .5;
        this.vy = -Math.random() * .8 - .3;
        this.life = 0;
        this.maxLife = Math.random() * 100 + 80;
        this.opacity = Math.random() * .08 + .03;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        this.size += .5;
    }

    draw() {
        const a = this.opacity * (1 - this.life / this.maxLife);
        mctx.beginPath();
        mctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const g = mctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        g.addColorStop(0, `rgba(176,96,128,${a})`);
        g.addColorStop(1, 'rgba(45,22,80,0)');
        mctx.fillStyle = g;
        mctx.fill();
    }
}

let lm = 0;
document.addEventListener('mousemove', e => {
    const n = Date.now();
    if (n - lm > 40) {
        mists.push(new Mist(e.clientX, e.clientY));
        lm = n;
    }
});
(function aM() {
    mctx.clearRect(0, 0, mc.width, mc.height);
    mists = mists.filter(m => m.life < m.maxLife);
    mists.forEach(m => {
        m.update();
        m.draw();
    });
    requestAnimationFrame(aM);
})();

// REVEAL
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('v');
            obs.unobserve(e.target);
        }
    });
}, {threshold: 0.06});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// NEWSLETTER
document.getElementById('nl-btn').addEventListener('click', function () {
    const i = document.querySelector('.nl-form input');
    if (i.value.includes('@')) {
        this.textContent = 'Merci ✓';
        i.value = '';
        setTimeout(() => this.textContent = "S'inscrire", 3000);
    }
});

// FORM
document.getElementById('sbtn').addEventListener('click', function () {
    const n = document.getElementById('fname').value, e = document.getElementById('femail').value;
    if (n && e.includes('@')) {
        this.textContent = 'Message Sent ✓';
        this.style.borderColor = 'rgba(201,168,76,0.5)';
        setTimeout(() => {
            this.textContent = 'Send Message';
            this.style.borderColor = '';
        }, 3000);
    }
});

// FAQ
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});