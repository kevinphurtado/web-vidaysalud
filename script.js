// --- LÓGICA DEL MENÚ HAMBURGUESA ---
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');

    // Función para mostrar/ocultar el menú
    if(menuButton) {
        menuButton.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    // Función para cerrar el menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
            }
        });
    });

    // --- Script para desplazamiento suave de la navegación ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Solo previene el comportamiento por defecto si es un enlace de ancla en la misma página
            if (href.startsWith('/#')) {
                e.preventDefault();
                const targetId = href.substring(2); // Quita el '/#'
                const targetElement = document.getElementById(targetId);
                
                // Se asegura que el elemento exista antes de intentar desplazarse
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                } else {
                    // Si el elemento no está en la página actual, nos lleva a la página principal
                    // y el navegador intentará ir al ancla después de cargar.
                    window.location.href = href; 
                }
            }
            // Si es un enlace a otra página (como href="/"), no hace nada y deja que el navegador cargue la página.
        });
    });

    // --- LÓGICA PARA LA VENTANA EMERGENTE (MODAL) ---
    const modalData = {
        'cookies': {
            title: 'Política de Cookies',
            body: '<p>Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. Una cookie es un pequeño archivo de texto que se almacena en tu navegador. Al continuar usando nuestro sitio, aceptas nuestro uso de cookies para análisis y personalización. No utilizamos cookies para rastrear información personal identificable sin tu consentimiento explícito.</p>'
        },
        'informe': {
            title: 'Informe y Transparencia',
            body: '<p>En Vida & Salud, nos comprometemos con la transparencia. Este informe detalla nuestras prácticas operativas, el uso de datos de clientes para mejorar nuestros servicios y nuestro compromiso con un ambiente seguro y respetuoso. Todos los datos son agregados y anonimizados para proteger la privacidad de nuestros miembros.</p>'
        },
        'privacidad': {
            title: 'Política de Privacidad',
            body: '<p>Tu privacidad es nuestra prioridad. La información personal que recopilamos, como nombre, contacto y datos de progreso físico, se utiliza exclusivamente para personalizar tu plan de entrenamiento, comunicarnos contigo y procesar pagos. No compartimos tu información con terceros sin tu consentimiento. Todos los datos están protegidos con medidas de seguridad estándar de la industria.</p>'
        }
    };

    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalOverlay = document.getElementById('info-modal');
    const modalCloseButton = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const openModal = (targetId) => {
        const data = modalData[targetId];
        if (data) {
            modalTitle.textContent = data.title;
            modalBody.innerHTML = data.body;
            modalOverlay.classList.add('active');
        }
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
    };

    if (modalTriggers.length > 0 && modalOverlay) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-modal-target');
                openModal(targetId);
            });
        });

        if(modalCloseButton) {
            modalCloseButton.addEventListener('click', closeModal);
        }

        if(modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }
});