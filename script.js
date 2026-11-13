// =============================================================================
// CONFIGURACIÓN DE LA BODA
// =============================================================================
// Introduce aquí el año, mes (0 = Enero, 5 = Junio, 11 = Diciembre), día, hora y minutos
// Ejemplo: 19 de Junio de 2027 a las 12:30 h
const WEDDING_DATE = new Date(2027,3, 24, 12,0, 0).getTime();

// =============================================================================
// FUNCIONALIDAD: CUENTA ATRÁS
// =============================================================================
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownContainer = document.getElementById('countdown');

function updateCountdown() {
  const now = new Date().getTime();
  const timeDifference = WEDDING_DATE - now;

  // Si la fecha ya ha llegado o ha pasado
  if (timeDifference <= 0) {
    if (countdownContainer) {
      countdownContainer.innerHTML = `
        <div style="padding: 15px 25px; background: rgba(255,255,255,0.9); border-radius: 12px; box-shadow: var(--shadow-soft);">
          <span style="font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: var(--primary); font-weight: 600;">
            ✨ ¡Hoy es nuestro gran día! ✨
          </span>
        </div>
      `;
    }
    return;
  }

  // Cálculos de tiempo (en milisegundos)
  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;

  const days = Math.floor(timeDifference / msInDay);
  const hours = Math.floor((timeDifference % msInDay) / msInHour);
  const minutes = Math.floor((timeDifference % msInHour) / msInMinute);
  const seconds = Math.floor((timeDifference % msInMinute) / msInSecond);

  // Inyectar en el HTML formateando con dos dígitos (01, 02, etc.)
  if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Ejecutar inmediatamente para que no empiece mostrando "00"
updateCountdown();

// Actualizar cada segundo (1000 ms)
const timerInterval = setInterval(updateCountdown, 1000);



// =============================================================================
// FUNCIONALIDAD: CARRUSEL DE FOTOS
// =============================================================================
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const container = document.querySelector('.carousel-container');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  const INTERVAL_TIME = 2500; // 2.5 segundos

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoPlayTimer = setInterval(nextSlide, INTERVAL_TIME);
  }

  function stopAutoplay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  // Eventos de botones y dots
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.dataset.index, 10);
      goToSlide(targetIndex);
      startAutoplay();
    });
  });

  // Pausar al pasar el ratón por encima
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

initCarousel();



// =============================================================================
// FUNCIONALIDAD: COPIAR IBAN
// =============================================================================

const boton = document.getElementById('copy-btn');

boton.addEventListener('click', () => {
  const ibanText = document.getElementById('iban-text');
  const copyMessage = document.getElementById('copy-message');

  // Copiar al portapapeles
  navigator.clipboard.writeText(ibanText.textContent)
    .then(() => {
      // Mostrar mensaje de confirmación
      copyMessage.classList.remove('hidden');
      setTimeout(() => {
        copyMessage.classList.add('hidden');
      }, 2000);
    })
    .catch(err => {
      console.error('Error al copiar el IBAN: ', err);
    });
});


// =============================================================================
// FUNCIONALIDAD: ENLACE A GOOGLE CALENDAR
// =============================================================================
function setupCalendarLink() {
  const calendarBtn = document.getElementById('btn-calendar');
  if (!calendarBtn) return;

  // Datos del evento
  const event = {
    title: 'Boda de Alicia & Pedro',
    // Formato: Año, Mes (0-11), Día, Hora, Minutos
    // Inicio: 24 de Abril de 2027 a las 12:00
    start: new Date(Date.UTC(2027, 3, 24, 12, 0, 0)), // Ajustado a UTC (España verano es UTC+2)
    // Fin: 25 de Abril de 2027 a las 04:00 (por ejemplo, fin de fiesta)
    end: new Date(Date.UTC(2027, 3, 25, 0, 0, 0)),
    location: 'Iglesia de Santa María / Finca El Paraíso, Madrid',
    details: '¡Nos casamos! Ceremonia en la Iglesia de Santa Marina de Aguas Santas a las 12:00 h y posterior celebración en el Hotel DWO Finca los Abetos.'
  };

  // Convertir fecha a formato requerido por Google: YYYYMMDDTHHmmssZ
  const formatDateToUTC = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const startUTC = formatDateToUTC(event.start);
  const endUTC = formatDateToUTC(event.end);

  // Construir URL con parámetros codificados
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(event.title)}` +
    `&dates=${startUTC}/${endUTC}` +
    `&details=${encodeURIComponent(event.details)}` +
    `&location=${encodeURIComponent(event.location)}`;

  calendarBtn.setAttribute('href', googleCalendarUrl);
}

setupCalendarLink();