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
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-scroll').forEach(el => {
        observer.observe(el);
    });

    // Form Handling
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerText;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate sending
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
        submitBtn.style.opacity = '0.7';

        setTimeout(() => {
            // Success state
            submitBtn.innerText = 'Message Sent';
            submitBtn.style.backgroundColor = '#22c55e'; // Green
            submitBtn.style.color = '#ffffff';

            // Reset form
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                submitBtn.style.opacity = '1';
            }, 3000);
        }, 1500);
    });

    // Network Animation
    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    const maxNodes = 40; // Increased significantly
    const connectionDistance = 250;
    const nodeColor = 'rgba(220, 220, 220, 0.8)';
    const lineColor = 'rgba(220, 220, 220, 0.3)';

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8; // Slightly faster
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 3 + 4; // Larger nodes (4-7px)
            this.alpha = 0;
            this.targetAlpha = 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Fade in
            if (this.alpha < this.targetAlpha) {
                this.alpha += 0.02; // Faster fade in
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(143, 195, 215, ${this.alpha})`;
            ctx.fill();
        }
    }

    // Add nodes one by one
    function addNode() {
        if (nodes.length < maxNodes) {
            nodes.push(new Node());
            setTimeout(addNode, 300); // Faster addition
        }
    }

    // Start adding nodes
    setTimeout(addNode, 500);

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    // Use the minimum alpha of the two connected nodes to fade lines in with nodes
                    const lineAlpha = Math.min(nodes[i].alpha, nodes[j].alpha) * opacity * 0.5;

                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(220, 220, 220, ${lineAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
});
