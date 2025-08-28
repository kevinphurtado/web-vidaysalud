document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica del Menú Hamburguesa ---
    const menuButton = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');

    if(menuButton && navList) {
        menuButton.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList && navList.classList.contains('active')) {
                navList.classList.remove('active');
            }
        });
    });

    // --- Lógica para la Ventana Emergente (Popup) con Minimizar ---
    const eventPopup = document.getElementById('event-popup');
    const reopenBtn = document.getElementById('reopen-popup-btn');

    if (eventPopup && reopenBtn) {
        const closePopupButton = eventPopup.querySelector('.popup-close');
        
        // --- MODIFICACIÓN 1: Mostrar popup solo si no se ha visto en la sesión ---
        if (!sessionStorage.getItem('popupShown')) {
            // Mostrar el popup después de un retraso si es la primera vez
            setTimeout(() => {
                eventPopup.style.display = 'flex';
                // Marcar que el popup ya se ha mostrado en esta sesión
                sessionStorage.setItem('popupShown', 'true'); 
            }, 2500);
        } else {
            // Si ya se mostró, dejar el botón de reabrir visible
            reopenBtn.style.display = 'flex';
        }

        const minimizePopup = () => {
            eventPopup.classList.add('closing');

            // Esperar a que termine la animación de salida
            setTimeout(() => {
                eventPopup.style.display = 'none';
                eventPopup.classList.remove('closing');
                reopenBtn.style.display = 'flex';
            }, 400); // Duración de la animación en CSS
        };

        const openPopup = () => {
            reopenBtn.style.display = 'none';
            eventPopup.style.display = 'flex';
        };

        // Eventos para minimizar
        if (closePopupButton) {
            closePopupButton.addEventListener('click', minimizePopup);
        }
        eventPopup.addEventListener('click', (e) => {
            if (e.target === eventPopup) {
                minimizePopup();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && eventPopup.style.display === 'flex') {
                minimizePopup();
            }
        });

        // Evento para reabrir
        reopenBtn.addEventListener('click', openPopup);
    }

    // --- Lógica para el deslizamiento de planes ---
    const toggleBtn = document.getElementById('toggle-plans-btn');
    const plansContainer = document.getElementById('planes-ocultos-container');
    const btnText = document.getElementById('toggle-plans-text');

    if (toggleBtn && plansContainer && btnText) {
        toggleBtn.addEventListener('click', () => {
            plansContainer.classList.toggle('expanded');
            toggleBtn.classList.toggle('expanded');
            if (plansContainer.classList.contains('expanded')) {
                btnText.textContent = 'Ver menos planes';
            } else {
                btnText.textContent = 'Ver más planes';
            }
        });
    }

    // --- Lógica para el Generador de Rutinas con Gemini API ---
    const generateBtn = document.getElementById('generate-routine-btn');
    if (generateBtn) {
        const resultDiv = document.getElementById('routine-result');
        const loader = document.getElementById('loader');
        const goalSelect = document.getElementById('goal');
        const levelSelect = document.getElementById('level');
        const daysSelect = document.getElementById('days');

        generateBtn.addEventListener('click', async () => {
            const goal = goalSelect.value;
            const level = levelSelect.value;
            const days = daysSelect.value;
            
            resultDiv.innerHTML = "";
            loader.style.display = 'block';

            // --- MODIFICACIÓN 2: Reparación del generador y validación de API Key ---
            // IMPORTANTE: Reemplaza "TU_API_KEY_DE_GEMINI_VA_AQUÍ" con tu clave real.
            const apiKey = "AIzaSyD-rhQq6coNvVd1ASq_G8WjmoJQiomXRVM"; 
            
            // Verificación: Si la API Key no está configurada, muestra un error.
            if (!apiKey || apiKey === "TU_API_KEY_DE_GEMINI_VA_AQUÍ") {
                resultDiv.innerHTML = "<p><strong>Error de configuración:</strong> La función de generación de rutinas no está activa. Por favor, contacta al administrador del sitio.</p>";
                loader.style.display = 'none';
                return; // Detiene la ejecución si no hay clave.
            }

            const systemPrompt = `Eres un entrenador personal experto y motivador en un gimnasio llamado "Vida & Salud" en Quibdó, Colombia. Tu tarea es crear un plan de entrenamiento semanal. Responde en español.
            - El tono debe ser alentador, claro y fácil de seguir.
            - Estructura la respuesta claramente, día por día.
            - Para cada día, lista los ejercicios con el formato: "Nombre del Ejercicio: X series de Y repeticiones".
            - Incluye un breve calentamiento y un enfriamiento.
            - Añade una nota final de motivación.
            - No uses formato markdown, solo texto plano con saltos de línea.`;

            const userQuery = `Crea un plan de entrenamiento para un usuario con nivel ${level} que quiere ${goal} y puede entrenar ${days} días a la semana.`;

            try {
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                
                const payload = {
                    contents: [{ parts: [{ text: userQuery }] }],
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                };

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`Error en la API: ${response.statusText}`);
                }

                const result = await response.json();
                const text = result.candidates[0].content.parts[0].text;
                
                resultDiv.innerHTML = text.replace(/\n/g, '<br>');

            } catch (error) {
                console.error("Error al generar la rutina:", error);
                resultDiv.innerHTML = "<p>Lo sentimos, ha ocurrido un error al generar tu rutina. Por favor, inténtalo de nuevo más tarde.</p>";
            } finally {
                loader.style.display = 'none';
            }
        });
    }
    
    // --- Lógica para Modales de Información (del código original) ---
    const modalData = {
        'cookies': {
            title: 'Política de Cookies',
            body: '<p>Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. Una cookie es un pequeño archivo de texto que se almacena en tu navegador. Al continuar usando nuestro sitio, aceptas nuestro uso de cookies para análisis y personalización.</p>'
        },
        'informe': {
            title: 'Informe y Transparencia',
            body: '<p>En Vida & Salud, nos comprometemos con la transparencia. Este informe detalla nuestras prácticas operativas, el uso de datos de clientes para mejorar nuestros servicios y nuestro compromiso con un ambiente seguro y respetuoso.</p>'
        },
        'privacidad': {
            title: 'Política de Privacidad',
            body: '<p>Tu privacidad es nuestra prioridad. La información personal que recopilamos se utiliza exclusivamente para personalizar tu plan de entrenamiento, comunicarnos contigo y procesar pagos. No compartimos tu información con terceros sin tu consentimiento.</p>'
        }
    };

    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalOverlay = document.getElementById('info-modal');

    if (modalTriggers.length > 0 && modalOverlay) {
        const modalCloseButton = modalOverlay.querySelector('.modal-close');
        const modalTitle = modalOverlay.querySelector('#modal-title');
        const modalBody = modalOverlay.querySelector('#modal-body');

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

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }
});