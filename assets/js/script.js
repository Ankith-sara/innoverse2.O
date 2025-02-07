document.addEventListener("DOMContentLoaded", () => {
    // Loading screen logic
    let percentage = 0;
    const loadingPercentage = document.querySelector(".loading-percentage");
    const loadingScreen = document.getElementById("loading-screen");
    const mainContent = document.getElementById("main-content");

    if (localStorage.getItem("hasVisited")) {
        loadingScreen.style.display = "none";
        mainContent.style.transform = "translateY(0)";
        mainContent.style.opacity = "1";
    } else {
        function updateLoading() {
            if (percentage <= 100) {
                loadingPercentage.textContent = `${percentage}%`;
                percentage++;
                setTimeout(updateLoading, 18);
            } else {
                loadingScreen.style.display = "none";
                mainContent.style.transform = "translateY(0)";
                mainContent.style.opacity = "1";
                localStorage.setItem("hasVisited", "true");
            }
        }
        updateLoading();
    }

    // Mobile menu toggle
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', function () {
        document.querySelector('.nav-links').classList.toggle('active');
        this.classList.toggle('active');
    });

    // Intersection Observer logic
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(section => {
        observer.observe(section);
    });

    // Parallax Effect
    document.addEventListener('mousemove', (e) => {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            heroImage.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
    });

    // Countdown Timer
    const targetDate = new Date("February 15, 2025 00:00:00 GMT+0530");
    const countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            document.getElementById("days").innerHTML = "00";
            document.getElementById("hours").innerHTML = "00";
            document.getElementById("minutes").innerHTML = "00";
            document.getElementById("seconds").innerHTML = "00";
            alert("The event has started!");
        } else {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
            document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
            document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
            document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;
        }
    }, 1000);

    // Modal functionality
    const modal = document.getElementById('qrModal');
    const closeButton = document.querySelector('.close-button');
    const registerLink = document.querySelector('a.cta');

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    // Canvas grid animation
    const canvas = document.getElementById('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let mouse = { x: undefined, y: undefined };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Cell {
            constructor(x, y, size, isOffset) {
                this.x = x;
                this.y = y + (isOffset ? size / 2 : 0);
                this.size = size;
                this.baseX = x;
                this.baseY = y + (isOffset ? size / 2 : 0);
                this.isOffset = isOffset;
                this.color = isOffset ? 'rgba(138, 127, 199, 0.1)' : 'rgba(75, 59, 150, 0.1)';
            }

            update() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 100;
                const force = (maxDistance - distance) / maxDistance;
                const movement = force * 5;

                if (distance < maxDistance) {
                    this.x -= dx * movement * 0.05;
                    this.y -= dy * movement * 0.05;
                } else {
                    this.x += (this.baseX - this.x) * 0.1;
                    this.y += (this.baseY - this.y) * 0.1;
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.roundRect(this.x, this.y, this.size, this.size, 20);
                ctx.fill();
            }
        }

        const gridSize = 100;
        let cells = [];

        function initGrid() {
            cells = [];
            for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
                for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
                    const isOffset = Math.random() > 0.5;
                    cells.push(new Cell(x, y, gridSize * 0.9, isOffset));
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(138, 127, 199, 0.2)';

            cells.forEach(cell => {
                cell.update();
                cell.draw();
            });

            requestAnimationFrame(animate);
        }

        initGrid();
        animate();
        window.addEventListener('resize', initGrid);
    }

    // Update copyright year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Schedule button alert
    const scheduleButton = document.querySelector('a[href="#schedule"]');
    if (scheduleButton) {
        scheduleButton.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Schedule is not yet updated. Please check back later.");
        });
    }

    // Scroll to top button
    let scrollTopBtn = document.getElementById("scroll-top-btn");
    if (scrollTopBtn) {
        window.onscroll = function () {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollTopBtn.classList.add("show");
            } else {
                scrollTopBtn.classList.remove("show");
            }
        };

        scrollTopBtn.onclick = function () {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        };
    }
});