// ======================================================================
// =================== DOMContentLoaded Event Listener ==================
// ============== مستمع حدث اكتمال تحميل محتوى الصفحة (DOM) =============
// Ensures that the script runs only after the entire HTML document has been fully loaded and parsed.
// يضمن أن السكربت يعمل فقط بعد تحميل وتحليل مستند HTML بالكامل.
// ======================================================================
document.addEventListener('DOMContentLoaded', function() {

    // ======================================================================
    // ==================== Element Selections / تحديد العناصر ===============
    // ======================================================================
    // Selecting commonly used elements from the DOM to be used by various functions.
    // تحديد العناصر المستخدمة بشكل متكرر من الـ DOM لاستخدامها في دوال مختلفة.
    // ======================================================================
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    // ======================================================================
    // ==================== Header Scroll Effect / تأثير الترويسة عند التمرير =
    // ======================================================================
    // Adds a 'scrolled' class to the header when the user scrolls down a certain threshold.
    // يضيف كلاس 'scrolled' إلى الترويسة عندما يقوم المستخدم بالتمرير لأسفل لمسافة معينة.
    // ======================================================================
    const scrollThreshold = 50; // Pixels to scroll before effect triggers / عدد البكسلات للتمرير قبل تفعيل التأثير
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ======================================================================
    // ==================== Mobile Menu Toggle / تبديل قائمة الموبايل ========
    // ======================================================================
    // Handles the opening and closing of the mobile navigation menu.
    // يتعامل مع فتح وإغلاق قائمة التنقل الخاصة بالهواتف المحمولة.
    // ======================================================================
    if (menuToggle && header && mainNav) {
        menuToggle.addEventListener('click', function() {
            header.classList.toggle('nav-open'); // Toggles class on header for styling nav
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded); // ARIA for accessibility / للوصولية
        });

        // Close mobile menu when a navigation link is clicked
        // إغلاق قائمة الموبايل عند النقر على أحد الروابط
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (header.classList.contains('nav-open')) {
                    header.classList.remove('nav-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ======================================================================
    // ============ Smooth Scrolling for Navigation Links / التمرير الناعم لروابط التنقل
    // ======================================================================
    // Implements smooth scrolling to sections when internal navigation links are clicked.
    // ينفذ التمرير الناعم للأقسام عند النقر على روابط التنقل الداخلية.
    // ======================================================================
    const smoothScrollLinks = document.querySelectorAll('.main-nav a[href^="#"], .logo[href^="#"]');
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) { // Ensure it's a valid internal link
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ======================================================================
    // ======== Intersection Observer for Fade-in Effect / مراقب التقاطع لتأثير الظهور التدريجي
    // ======================================================================
    // Adds 'is-visible' class to elements when they enter the viewport, triggering CSS animations.
    // يضيف كلاس 'is-visible' للعناصر عندما تدخل في منفذ العرض، مما يؤدي إلى تشغيل أنيميشن CSS.
    // ======================================================================
    const elementsToAnimate = document.querySelectorAll(
        '.fade-in-element,' +
        '.reveal,' +
        '.hero-text, .hero-image-container,' + // Note: hero-image was changed to hero-image-container
        '.about-section > .container > h2, .about-section .slider-quote, .about-section .cards-wrapper,' +
        '.thinking-box-section > .container > h2, .thinking-box-content, .stats-container .stat-box,' +
        '.portfolio-slider-section > .container > h2, .portfolio-slider-section .section-subtitle, .portfolio-slider-container,' +
        '.testimonials-section .testimonial-content, .testimonials-section .testimonial-slider,' +
        '.my-toolkit-section .toolkit-category, .my-toolkit-section .tool-card,' + // Updated for My Toolkit section
        '.contact-footer-section .contact-info, .contact-footer-section .contact-form, .contact-footer-section .footer-text'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible / تفعيل عند ظهور 10% من العنصر
    };

    const fadeInObserver = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observerInstance.unobserve(entry.target); // Stop observing once visible / إيقاف المراقبة بعد الظهور
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(element => {
        if(element) { // Check if element exists before observing
            fadeInObserver.observe(element);
        }
    });

    // ======================================================================
    // =========== About Section Slider Functionality / وظائف سلايدر قسم "عني"
    // ======================================================================
    // Handles card selection in the "About Me" section using dots.
    // يتعامل مع اختيار البطاقات في قسم "عني" باستخدام النقاط.
    // ======================================================================
    const aboutCards = document.querySelectorAll('.about-section .card');
    const aboutDots = document.querySelectorAll('.about-section .dot');

    if (aboutCards.length > 0 && aboutDots.length === aboutCards.length) {
        // Make selectCard function globally accessible if it's called via onclick in HTML
        // جعل دالة selectCard متاحة بشكل عام إذا تم استدعاؤها عبر onclick في HTML
        window.selectCard = function(index) {
            aboutCards.forEach(card => card.classList.remove('active'));
            aboutDots.forEach(dot => dot.classList.remove('active'));

            if (aboutCards[index]) aboutCards[index].classList.add('active');
            if (aboutDots[index]) aboutDots[index].classList.add('active');
        };

        // Ensure the first card/dot is active on load if none are explicitly set
        // التأكد من أن البطاقة/النقطة الأولى نشطة عند التحميل إذا لم يتم تعيين أي منها
        let initialActiveIndex = -1;
        aboutCards.forEach((card, index) => {
            if (card.classList.contains('active')) {
                initialActiveIndex = index;
            }
        });
        if (initialActiveIndex === -1 && aboutCards.length > 0) {
             window.selectCard(0); // Activate the first card by default / تفعيل البطاقة الأولى افتراضيًا
        }
    }

    // ======================================================================
    // ============ Portfolio Slider Logic / منطق سلايدر المشاريع ===========
    // ======================================================================
    // Manages the navigation and display of portfolio items in a 3D-like slider.
    // يدير التنقل وعرض عناصر المشاريع في سلايدر يشبه ثلاثي الأبعاد.
    // ======================================================================
    const portfolioItems = document.querySelectorAll('.portfolio-slider-section .slider-item');
    const portfolioLeftArrow = document.querySelector('.portfolio-slider-section .left-arrow');
    const portfolioRightArrow = document.querySelector('.portfolio-slider-section .right-arrow');
    let currentPortfolioIndex = 0;

    function updatePortfolioSlider() {
        if (portfolioItems.length === 0) return;
        portfolioItems.forEach((item, index) => {
            item.classList.remove('center', 'left-side', 'right-side', 'hidden');
            if (index === currentPortfolioIndex) {
                item.classList.add('center');
            } else if (index === (currentPortfolioIndex - 1 + portfolioItems.length) % portfolioItems.length) {
                item.classList.add('left-side');
            } else if (index === (currentPortfolioIndex + 1) % portfolioItems.length) {
                item.classList.add('right-side');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    if (portfolioItems.length > 0 && portfolioLeftArrow && portfolioRightArrow) {
        portfolioLeftArrow.addEventListener('click', () => {
            currentPortfolioIndex = (currentPortfolioIndex - 1 + portfolioItems.length) % portfolioItems.length;
            updatePortfolioSlider();
        });
        portfolioRightArrow.addEventListener('click', () => {
            currentPortfolioIndex = (currentPortfolioIndex + 1) % portfolioItems.length;
            updatePortfolioSlider();
        });
        updatePortfolioSlider(); // Initial setup / الإعداد الأولي
    }

    // ======================================================================
    // =========== Testimonials Slider Logic / منطق سلايدر آراء العملاء ======
    // ======================================================================
    // Controls the display of testimonials with text, name, and avatar changes, including a fade effect.
    // يتحكم في عرض آراء العملاء مع تغيير النص والاسم والصورة الرمزية، بما في ذلك تأثير التلاشي.
    // ======================================================================
    const testimonialTextEl = document.getElementById("testimonialText");
    const clientNameEl = document.getElementById("clientName");
    const mainAvatarImgEl = document.getElementById("mainAvatar"); // Assuming mainAvatar is the <img> tag
    const smallAvatars = document.querySelectorAll('.testimonials-section .small-avatars img');

    const testimonialsData = [
        {
          name: "JOHN SMITH",
          text: "\"Rahaf is a highly skilled developer who delivered exceptional results on our project. Her attention to detail and problem-solving abilities were invaluable.\"",
          img: "img/person 1.png"
        },
        {
          name: "JANE DOE",
          text: "\"Working with Rahaf was a pleasure. She is professional, responsive, and truly understands client needs. Highly recommended!\"",
          img: "img/person 4.png"
        },
        {
          name: "ROBERT BROWN",
          text: "\"Robert is impressed with the support and quality provided by Rahaf. The project exceeded expectations.\"",
          img: "img/person 2.png"
        },
        {
          name: "EMILY CLARK",
          text: "\"Emily's project was delivered on time and she is very satisfied with the outcome. Great communication!\"",
          img: "img/person 3.png"
        }
    ];
    let currentTestimonialIndex = 0;

    function updateTestimonial(index) {
        if (index >= 0 && index < testimonialsData.length) {
            const testimonial = testimonialsData[index];

            // Elements to fade
            const elementsToFade = [testimonialTextEl, clientNameEl, mainAvatarImgEl];

            elementsToFade.forEach(el => {
                if (el) el.classList.add("fade");
            });

            setTimeout(() => {
                if (testimonialTextEl && testimonial) testimonialTextEl.textContent = testimonial.text;
                if (clientNameEl && testimonial) clientNameEl.textContent = testimonial.name;
                if (mainAvatarImgEl && testimonial) mainAvatarImgEl.src = testimonial.img;

                elementsToFade.forEach(el => {
                    if (el) el.classList.remove("fade");
                });

                smallAvatars.forEach((img, i) => {
                    if (img) { // Check if img element exists
                        if (i === index) {
                            img.classList.add('active');
                        } else {
                            img.classList.remove('active');
                        }
                    }
                });
                currentTestimonialIndex = index;
            }, 400); // Match CSS transition duration / مطابقة مدة انتقال CSS
        }
    }

    // Make functions global if called by HTML onclick
    // جعل الدوال عامة إذا تم استدعاؤها بواسطة onclick في HTML
    window.prevTestimonial = function() {
        const newIndex = (currentTestimonialIndex - 1 + testimonialsData.length) % testimonialsData.length;
        updateTestimonial(newIndex);
    };
    window.nextTestimonial = function() {
        const newIndex = (currentTestimonialIndex + 1) % testimonialsData.length;
        updateTestimonial(newIndex);
    };

    // Initial setup for testimonials
    // الإعداد الأولي لآراء العملاء
    if (testimonialsData.length > 0 && testimonialTextEl && clientNameEl && mainAvatarImgEl && smallAvatars.length > 0) {
        updateTestimonial(currentTestimonialIndex);
        smallAvatars.forEach((avatar, index) => {
            if (avatar) { // Check if avatar element exists
                avatar.addEventListener('click', () => {
                    updateTestimonial(index);
                });
            }
        });
    }
}); // End of DOMContentLoaded listener / نهاية مستمع اكتمال تحميل الصفحة

// ======================================================================
// ================= Starfall Effect / تأثير تساقط النجوم ===============
// ======================================================================
// Creates a starfall animation in the background of the page.
// ينشئ أنيميشن تساقط النجوم في خلفية الصفحة.
// This part of the script is outside DOMContentLoaded as it can run independently.
// هذا الجزء من السكربت خارج DOMContentLoaded لأنه يمكن أن يعمل بشكل مستقل.
// ======================================================================
const starCount = 150; // Number of stars / عدد النجوم
const bodyForStars = document.body;

if (bodyForStars) { // Check if body element exists
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Random horizontal start position / موضع بداية أفقي عشوائي
        star.style.left = `${Math.random() * 100}vw`;
        // Start above the viewport / البدء فوق منفذ العرض
        star.style.top = `${Math.random() * -70 - 30}vh`; // Adjusted to ensure they start well above

        // Random animation duration and delay for a more natural effect
        // مدة وتأخير عشوائي للأنيميشن لتأثير أكثر طبيعية
        const duration = Math.random() * 20 + 15; // Duration between 15 and 35 seconds (slower) / مدة بين 15 و 35 ثانية (أبطأ)
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${Math.random() * duration}s`; // Delay up to the full duration for varied entry / تأخير حتى المدة الكاملة لدخول متنوع

        bodyForStars.appendChild(star);
    }
}