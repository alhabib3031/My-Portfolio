// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Language Toggle Logic
let currentLang = localStorage.getItem('lang') || 'en';

function applyTranslations(lang) {
    if (typeof translations === 'undefined') return;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // Update document direction and language
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Apply specific styles for RTL if needed
    if (lang === 'ar') {
        document.body.classList.add('font-arabic');
    } else {
        document.body.classList.remove('font-arabic');
    }

    // Update the toggle button text to show the *other* language
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
        toggleBtn.innerText = lang === 'en' ? 'العربية' : 'English';
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('lang', currentLang);
    applyTranslations(currentLang);
}

document.addEventListener('DOMContentLoaded', () => {
    // Apply initial translations
    applyTranslations(currentLang);

    // Event listener for toggle button
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleLanguage);
    }

    // Certificate Filtering Logic
    const filterCheckboxes = document.querySelectorAll('.cert-filter');
    const certificates = document.querySelectorAll('.certificate-card');

    if (filterCheckboxes.length > 0) {
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const allCheckbox = document.querySelector('input[value="all"]');

                // If "all" is checked
                if (e.target.value === 'all') {
                    if (e.target.checked) {
                        filterCheckboxes.forEach(cb => { if (cb.value !== 'all') cb.checked = false; });
                        certificates.forEach(cert => cert.style.display = 'block');
                        setTimeout(() => AOS.refresh(), 100);
                    } else {
                        // Prevent unchecking "all" if nothing else is checked
                        e.target.checked = true;
                    }
                    return;
                }

                // If a specific category is checked/unchecked
                if (e.target.value !== 'all') {
                    allCheckbox.checked = false;

                    const checkedCategories = Array.from(filterCheckboxes)
                        .filter(cb => cb.checked && cb.value !== 'all')
                        .map(cb => cb.value);

                    if (checkedCategories.length === 0) {
                        allCheckbox.checked = true;
                        certificates.forEach(cert => cert.style.display = 'block');
                    } else {
                        certificates.forEach(cert => {
                            const category = cert.getAttribute('data-category');
                            if (checkedCategories.includes(category)) {
                                cert.style.display = 'block';
                            } else {
                                cert.style.display = 'none';
                            }
                        });
                    }
                    setTimeout(() => AOS.refresh(), 100);
                }
            });
        });
    }

    // PDF Thumbnail Renderer
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

        document.querySelectorAll('.certificate-card').forEach(card => {
            const link = card.querySelector('a');
            const icon = card.querySelector('.fa-file-pdf');

            if (link && icon) {
                const pdfUrl = link.getAttribute('href');
                if (pdfUrl.toLowerCase().endsWith('.pdf')) {
                    // Create canvas element
                    const canvas = document.createElement('canvas');
                    canvas.className = 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 absolute top-0 left-0 z-0';

                    const container = icon.parentElement;
                    container.insertBefore(canvas, container.firstChild);

                    // Render PDF to canvas
                    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
                        return pdf.getPage(1);
                    }).then(page => {
                        const viewport = page.getViewport({ scale: 1.5 });
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        const renderContext = {
                            canvasContext: canvas.getContext('2d'),
                            viewport: viewport
                        };
                        return page.render(renderContext).promise;
                    }).then(() => {
                        icon.style.display = 'none'; // Hide icon on success
                    }).catch(err => {
                        console.error('Error rendering PDF thumbnail:', err);
                    });
                }
            }
        });
    }
});
