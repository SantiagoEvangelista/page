document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-scroll').forEach(el => {
        observer.observe(el);
    });

    // Form Handling (only on pages with the contact form)
    const form = document.getElementById('contactForm');
    if (form) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerText;

        const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfQfUsfEh8feGumwTAU2pby9ZBuJSI1ijVr0_Ue5-MOHNaxeQ/formResponse';
        const ENTRY_IDS = {
            name: 'entry.606404527',
            email: 'entry.70364591',
            message: 'entry.1391374769'
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';
            submitBtn.style.opacity = '0.7';

            const formData = new FormData();
            formData.append(ENTRY_IDS.name, document.getElementById('name').value);
            formData.append(ENTRY_IDS.email, document.getElementById('email').value);
            formData.append(ENTRY_IDS.message, document.getElementById('message').value);

            try {
                await fetch(GOOGLE_FORM_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                submitBtn.innerText = 'Message Sent';
                submitBtn.style.backgroundColor = '#22c55e';
                submitBtn.style.color = '#ffffff';
                form.reset();

            } catch (error) {
                console.error('Error submitting form:', error);
                submitBtn.innerText = 'Error';
                submitBtn.style.backgroundColor = '#ef4444';
            } finally {
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.opacity = '1';
                }, 3000);
            }
        });
    }

    // Apply form handling (joinus page)
    const applyForm = document.getElementById('applyForm');
    if (applyForm) {
        const applyBtn = applyForm.querySelector('.submit-btn');
        const originalApplyText = applyBtn.innerText;

        // Pre-select role when clicking Apply on a position card
        document.querySelectorAll('.position-apply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const role = btn.dataset.role;
                const roleSelect = document.getElementById('role');
                if (role && roleSelect) {
                    roleSelect.value = role;
                }
            });
        });

        applyForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            applyBtn.disabled = true;
            applyBtn.innerText = 'Sending...';
            applyBtn.style.opacity = '0.7';

            const formData = new FormData();
            formData.append('entry.606404527', document.getElementById('applyName').value);
            formData.append('entry.70364591', document.getElementById('applyEmail').value);
            formData.append('entry.1391374769',
                '[' + document.getElementById('role').value + '] ' +
                document.getElementById('applyMessage').value
            );

            try {
                await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSfQfUsfEh8feGumwTAU2pby9ZBuJSI1ijVr0_Ue5-MOHNaxeQ/formResponse', {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                applyBtn.innerText = 'Application Sent';
                applyBtn.style.backgroundColor = '#22c55e';
                applyBtn.style.color = '#ffffff';
                applyForm.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                applyBtn.innerText = 'Error';
                applyBtn.style.backgroundColor = '#ef4444';
            } finally {
                setTimeout(() => {
                    applyBtn.disabled = false;
                    applyBtn.innerText = originalApplyText;
                    applyBtn.style.backgroundColor = '';
                    applyBtn.style.color = '';
                    applyBtn.style.opacity = '1';
                }, 3000);
            }
        });
    }

    // Hero parallax on scroll
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const opacity = Math.max(0, 1 - scrollY / 400);
            const translateY = scrollY * 0.3;
            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translateY(${translateY}px)`;
        });
    }

    // ─── Triangulation Canvas Animation ─────────────────────────────
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const isJoinPage = window.location.pathname.includes('joinus');

    // Mouse tracking
    let mouseX = -1, mouseY = -1;
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    canvas.addEventListener('mouseleave', () => {
        mouseX = -1;
        mouseY = -1;
    });

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        if (gridCanvas) {
            gridCanvas.width = width;
            gridCanvas.height = height;
            drawGrid();
        }
    }

    // Transmitter color types
    const TX_TYPES = [
        { r: 56, g: 189, b: 248 },   // cyan — WiFi-like
        { r: 168, g: 85, b: 247 },    // violet — cellular-like
        { r: 251, g: 191, b: 36 },    // amber — broadcast-like
        { r: 56, g: 189, b: 248 },    // cyan
        { r: 168, g: 85, b: 247 },    // violet
        { r: 251, g: 191, b: 36 },    // amber
    ];

    // ─── Grid (drawn once to offscreen canvas) ─────────────────────
    let gridCanvas = document.createElement('canvas');
    let gridCtx = gridCanvas.getContext('2d');

    function drawGrid() {
        gridCtx.clearRect(0, 0, width, height);
        gridCtx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        gridCtx.lineWidth = 0.5;
        const spacing = 80;

        for (let x = 0; x < width; x += spacing) {
            gridCtx.beginPath();
            gridCtx.moveTo(x, 0);
            gridCtx.lineTo(x, height);
            gridCtx.stroke();
        }
        for (let y = 0; y < height; y += spacing) {
            gridCtx.beginPath();
            gridCtx.moveTo(0, y);
            gridCtx.lineTo(width, y);
            gridCtx.stroke();
        }
    }

    // ─── Transmitter ────────────────────────────────────────────────
    class Transmitter {
        constructor(x, y, colorIndex, pulseInterval) {
            this.x = x;
            this.y = y;
            this.color = TX_TYPES[colorIndex % TX_TYPES.length];
            this.pulseInterval = pulseInterval; // ms between new rings
            this.rings = [];
            this.lastPulse = 0;
            this.alpha = 0; // fade in
            // Slow drift
            this.vx = (Math.random() - 0.5) * 0.15;
            this.vy = (Math.random() - 0.5) * 0.15;
        }

        update(time) {
            // Fade in
            if (this.alpha < 1) this.alpha = Math.min(1, this.alpha + 0.008);

            // Drift slowly
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 50 || this.x > width - 50) this.vx *= -1;
            if (this.y < 50 || this.y > height - 50) this.vy *= -1;

            // Spawn rings
            if (time - this.lastPulse > this.pulseInterval) {
                this.rings.push({ radius: 0, born: time });
                this.lastPulse = time;
            }

            // Update rings
            const maxRadius = Math.min(width, height) * 0.2;
            this.rings = this.rings.filter(r => {
                r.radius += 1.2;
                return r.radius < maxRadius;
            });
        }

        draw() {
            const { r, g, b } = this.color;
            const a = this.alpha;

            // Draw rings
            for (const ring of this.rings) {
                const maxRadius = Math.min(width, height) * 0.2;
                const life = ring.radius / maxRadius;
                const ringAlpha = (1 - life) * 0.15 * a;
                ctx.beginPath();
                ctx.arc(this.x, this.y, ring.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${ringAlpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Center glow
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 12);
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.6 * a})`);
            grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.15 * a})`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.9 * a})`;
            ctx.fill();
        }
    }

    // ─── Receiver ───────────────────────────────────────────────────
    class Receiver {
        constructor() {
            this.x = width * 0.5;
            this.y = height * 0.5;
            this.targetX = width * 0.5;
            this.targetY = height * 0.5;
            this.alpha = 0;
            this.trail = [];
            this.waypointTimer = 0;
            this.pickNewTarget();
        }

        pickNewTarget() {
            this.targetX = width * 0.15 + Math.random() * width * 0.7;
            this.targetY = height * 0.15 + Math.random() * height * 0.7;
        }

        update(time) {
            if (this.alpha < 1) this.alpha = Math.min(1, this.alpha + 0.005);

            // Move toward target
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 20) {
                this.waypointTimer++;
                if (this.waypointTimer > 120) { // pause briefly at waypoint
                    this.pickNewTarget();
                    this.waypointTimer = 0;
                }
            }

            // Gentle mouse attraction
            let attractX = this.targetX;
            let attractY = this.targetY;
            if (mouseX > 0 && mouseY > 0) {
                attractX = this.targetX * 0.7 + mouseX * 0.3;
                attractY = this.targetY * 0.7 + mouseY * 0.3;
            }

            this.x += (attractX - this.x) * 0.008;
            this.y += (attractY - this.y) * 0.008;

            // Trail
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 150) this.trail.shift();
        }

        draw() {
            const a = this.alpha;

            // Trail
            for (let i = 0; i < this.trail.length; i++) {
                const t = this.trail[i];
                const trailAlpha = (i / this.trail.length) * 0.15 * a;
                ctx.beginPath();
                ctx.arc(t.x, t.y, 1, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${trailAlpha})`;
                ctx.fill();
            }

            // Outer ring
            ctx.beginPath();
            ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * a})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Inner dot
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * a})`;
            ctx.fill();
        }
    }

    // ─── Position Fix ───────────────────────────────────────────────
    class PositionFix {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.born = performance.now();
            this.life = 3000; // 3 seconds
            this.size = 8;
        }

        get age() {
            return performance.now() - this.born;
        }

        get alive() {
            return this.age < this.life;
        }

        draw() {
            const age = this.age;
            let alpha;

            if (age < 200) {
                alpha = age / 200; // fade in
            } else if (age > this.life - 800) {
                alpha = (this.life - age) / 800; // fade out
            } else {
                alpha = 1;
            }
            alpha *= 0.6;

            const s = this.size;

            // Crosshair
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - s);
            ctx.lineTo(this.x, this.y + s);
            ctx.stroke();

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(this.x - s, this.y);
            ctx.lineTo(this.x + s, this.y);
            ctx.stroke();

            // Tiny circle
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.7})`;
            ctx.stroke();
        }
    }

    // ─── Setup ──────────────────────────────────────────────────────
    window.addEventListener('resize', resize);
    resize();

    // Place transmitters using distributed sectors
    const transmitters = [];
    const txCount = isJoinPage ? 4 : 6;

    function placeTransmitters() {
        transmitters.length = 0;
        const cols = 3;
        const rows = 2;
        const cellW = width / cols;
        const cellH = height / rows;

        for (let i = 0; i < txCount; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = cellW * col + cellW * (0.2 + Math.random() * 0.6);
            const y = cellH * row + cellH * (0.2 + Math.random() * 0.6);
            const interval = 2000 + Math.random() * 2000; // 2-4s between pulses
            transmitters.push(new Transmitter(x, y, i, interval));
        }
    }
    placeTransmitters();

    const receiver = isJoinPage ? null : new Receiver();
    let fixes = [];
    let lastFixTime = 0;

    // ─── Draw Bearing Lines ─────────────────────────────────────────
    function drawBearingLines() {
        if (!receiver || receiver.alpha < 0.1) return;

        // Find 3 nearest transmitters
        const sorted = [...transmitters].sort((a, b) => {
            const da = Math.hypot(a.x - receiver.x, a.y - receiver.y);
            const db = Math.hypot(b.x - receiver.x, b.y - receiver.y);
            return da - db;
        });
        const nearest = sorted.slice(0, 3);

        // Draw bearing lines
        ctx.setLineDash([4, 8]);
        for (const tx of nearest) {
            const alpha = receiver.alpha * 0.1;
            ctx.beginPath();
            ctx.moveTo(receiver.x, receiver.y);
            ctx.lineTo(tx.x, tx.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Draw triangle fill between nearest 3
        if (nearest.length >= 3) {
            ctx.beginPath();
            ctx.moveTo(nearest[0].x, nearest[0].y);
            ctx.lineTo(nearest[1].x, nearest[1].y);
            ctx.lineTo(nearest[2].x, nearest[2].y);
            ctx.closePath();
            ctx.fillStyle = `rgba(56, 189, 248, ${0.02 * receiver.alpha})`;
            ctx.fill();
        }
    }

    // ─── Animate ────────────────────────────────────────────────────
    function animate(time) {
        ctx.clearRect(0, 0, width, height);

        // Grid
        ctx.drawImage(gridCanvas, 0, 0);

        // Transmitters
        for (const tx of transmitters) {
            tx.update(time);
            tx.draw();
        }

        // Receiver + bearing lines (not on join page)
        if (receiver) {
            receiver.update(time);
            drawBearingLines();
            receiver.draw();

            // Spawn position fix every ~4 seconds
            if (time - lastFixTime > 4000 && receiver.alpha > 0.3) {
                fixes.push(new PositionFix(receiver.x, receiver.y));
                lastFixTime = time;
            }
        }

        // Draw fixes
        fixes = fixes.filter(f => f.alive);
        for (const fix of fixes) {
            fix.draw();
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});
