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
});
