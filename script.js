console.log("TEST")
// Function to initialize data flow visualization
function initDataFlowVisualization() {
    const canvas = document.getElementById('dataflow-visualization');
    console.log(canvas);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const particles = [];
    const particleCount = 100;
    const colors = ['#00ffff', '#ff00ff', '#ffff00'];
    const maxSpeed = 2;
    const connectionDistance = 100;
    const particleSize = 2;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * maxSpeed,
            vy: (Math.random() - 0.5) * maxSpeed,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
    
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];
            
            // Move particles
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Connect particles
            for (let j = i + 1; j < particleCount; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = 1 - (distance / connectionDistance);
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', function() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// Function to initialize project filters
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const categories = card.getAttribute('data-categories').split(',');
                    if (categories.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Function to handle contact form submission
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would normally send the data to a server
            // For this demo, just log it
            console.log('Form submitted:', { name, email, message });
            
            // Reset form
            contactForm.reset();
            
            // Show success message (you can implement this differently)
            alert('Thanks for your message! I\'ll get back to you soon.');
        });
    }
}

// Function to initialize scroll animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // If it's the skills section, start the animation
                if (entry.target.id === 'about') {
                    document.querySelectorAll('.orbit-path').forEach(orbit => {
                        orbit.style.animationPlayState = 'running';
                    });
                }
            }
        });
    }, options);
    
    sections.forEach(section => {
        section.classList.add('hidden');
        observer.observe(section);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        section.hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        section.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .orbit-path {
            animation-play-state: paused;
        }
    `;
    document.head.appendChild(style);
}

console.log("TEST")

// Set up the particle animation for data flow visualization
initDataFlowVisualization();
    
// Set up project filtering
initProjectFilters();

// Set up form submission
initContactForm();

// Initialize scroll animations
initScrollAnimations();

// Preserve console logs
const originalConsoleLog = console.log;
console.log = function() {
    originalConsoleLog.apply(console, arguments);
    // Store logs in localStorage for persistence
    const logs = JSON.parse(localStorage.getItem('debug_logs') || '[]');
    logs.push({time: new Date().toISOString(), message: Array.from(arguments).join(' ')});
    localStorage.setItem('debug_logs', JSON.stringify(logs));
};

// Show stored logs
setTimeout(() => {
    const logs = JSON.parse(localStorage.getItem('debug_logs') || '[]');
    originalConsoleLog('Stored logs:', logs);
}, 1000);