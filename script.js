document.addEventListener("DOMContentLoaded", () => {
  // Menu Hamburger simples e eficiente
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const body = document.body;

  // Função para abrir/fechar menu
  function toggleMenu() {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");

    // Bloquear scroll quando menu está aberto
    if (navLinks.classList.contains("active")) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
  }

  // Abrir/fechar menu quando clica no ícone
  menuToggle.addEventListener("click", toggleMenu);

  // Fechar menu quando clicar em um link
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        toggleMenu();
      }

      // Marcar link como ativo
      navItems.forEach((link) => link.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // Fechar menu ao pressionar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      toggleMenu();
    }
  });

  // Marcar link ativo conforme a seção visível
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;

    // Identificar qual seção está visível
    document.querySelectorAll("section[id]").forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navItems.forEach((item) => {
          item.classList.remove("active");
          if (item.getAttribute("href") === `#${sectionId}`) {
            item.classList.add("active");
          }
        });
      }
    });
  });

  // Carrossel de Depoimentos - Enhanced with touch and swipe support
  const carousel = document.querySelector(".testimonial-carousel");
  const prevBtn = document.querySelector(".testimonial-prev");
  const nextBtn = document.querySelector(".testimonial-next");
  const carouselContainer = document.querySelector(
    ".testimonial-carousel-container"
  );

  // Verificar se o carrossel existe na página
  if (carousel && prevBtn && nextBtn) {
    let cardWidth, visibleWidth;
    let autoScrollInterval;
    let autoScrollPaused = false;

    // Function to calculate dimensions
    function calculateDimensions() {
      const card = document.querySelector(".testimonial-card");
      if (!card) return;

      // Calculate the full width including gap
      const cardStyle = window.getComputedStyle(card);
      const cardMarginRight = parseFloat(cardStyle.marginRight) || 0;
      cardWidth = card.offsetWidth + cardMarginRight + 32; // Width + gap
      visibleWidth = carousel.clientWidth;
    }

    // Ajustar altura do carrossel para o card mais alto
    function adjustCarouselHeight() {
      const cards = document.querySelectorAll(".testimonial-card");
      let maxHeight = 0;

      cards.forEach((card) => {
        const height = card.offsetHeight;
        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      // Definir uma altura mínima para o carrossel
      carousel.style.minHeight = maxHeight + 20 + "px";
    }

    // Run once on load and also when window is resized
    function initCarousel() {
      calculateDimensions();
      adjustCarouselHeight();

      // Reset to start position
      carousel.scrollTo({ left: 0, behavior: "auto" });

      // Check if we need to clone more cards for smaller screens
      const testimonialCards = document.querySelectorAll(
        ".testimonial-card:not(.clone)"
      );
      const existingClones = document.querySelectorAll(
        ".testimonial-card.clone"
      );

      // Remove existing clones before adding new ones
      existingClones.forEach((clone) => clone.remove());

      // Calculate how many cards we need to clone for infinite scrolling
      const numVisibleCards = Math.ceil(visibleWidth / cardWidth);
      const cardsToClone = Math.min(
        numVisibleCards + 1,
        testimonialCards.length
      );

      for (let i = 0; i < cardsToClone; i++) {
        const clone = testimonialCards[i].cloneNode(true);
        clone.classList.add("clone");
        carousel.appendChild(clone);
      }

      // Clone some cards at the beginning too for smooth backward looping
      for (
        let i = testimonialCards.length - cardsToClone;
        i < testimonialCards.length;
        i++
      ) {
        const clone = testimonialCards[i].cloneNode(true);
        clone.classList.add("clone");
        clone.classList.add("prepend");
        carousel.prepend(clone);
      }

      // Adjust scroll position to hide the prepended clones
      const offset = cardsToClone * cardWidth;
      carousel.scrollTo({ left: offset, behavior: "auto" });
      carousel._initialScrollPosition = offset;
    }

    // Função para rolar o carrossel
    function scrollCarousel(direction, autoScroll = false) {
      if (!cardWidth) calculateDimensions();

      const currentScroll = carousel.scrollLeft;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const scrollAmount = cardWidth;

      let targetScroll =
        direction === "next"
          ? currentScroll + scrollAmount
          : currentScroll - scrollAmount;

      // Progress indicator update
      updateProgressIndicator(targetScroll);

      // Enhanced infinite carousel logic
      if (
        direction === "prev" &&
        currentScroll <= carousel._initialScrollPosition
      ) {
        // If scrolling back past the initial position
        const jumpPosition =
          currentScroll +
          carousel.querySelectorAll(".testimonial-card:not(.prepend)").length *
            cardWidth;
        carousel.scrollTo({ left: jumpPosition, behavior: "auto" });

        // Then scroll smoothly to show the transition
        setTimeout(() => {
          carousel.scrollTo({
            left: jumpPosition - scrollAmount,
            behavior: "smooth",
          });
        }, 10);
        return;
      } else if (
        direction === "next" &&
        currentScroll >= maxScroll - cardWidth
      ) {
        // If scrolling forward past the end
        const jumpPosition = carousel._initialScrollPosition;
        carousel.scrollTo({ left: jumpPosition, behavior: "auto" });

        // Then scroll smoothly to show the transition
        setTimeout(() => {
          carousel.scrollTo({
            left: jumpPosition + scrollAmount,
            behavior: "smooth",
          });
        }, 10);
        return;
      }

      // Normal smooth scrolling
      carousel.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }

    // Create progress indicator
    function createProgressIndicator() {
      const progressContainer = document.createElement("div");
      progressContainer.className = "testimonial-progress";

      const testimonialCards = document.querySelectorAll(
        ".testimonial-card:not(.clone)"
      );
      const numDots = Math.ceil(testimonialCards.length);

      for (let i = 0; i < numDots; i++) {
        const dot = document.createElement("span");
        dot.className = "progress-dot";
        if (i === 0) dot.classList.add("active");

        dot.addEventListener("click", () => {
          const targetScroll = carousel._initialScrollPosition + i * cardWidth;
          carousel.scrollTo({
            left: targetScroll,
            behavior: "smooth",
          });
        });

        progressContainer.appendChild(dot);
      }

      carouselContainer.appendChild(progressContainer);
    }

    // Update progress indicator
    function updateProgressIndicator(currentScroll) {
      const dots = document.querySelectorAll(".progress-dot");
      if (!dots.length) return;

      const activeIndex = Math.round(
        (currentScroll - carousel._initialScrollPosition) / cardWidth
      );
      if (activeIndex < 0 || activeIndex >= dots.length) return;

      dots.forEach((dot) => dot.classList.remove("active"));
      dots[Math.min(activeIndex, dots.length - 1)].classList.add("active");
    }

    // Auto scroll control functions
    function startAutoScroll() {
      if (autoScrollPaused) return;

      clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(() => {
        scrollCarousel("next", true);
      }, 5000); // Rola automaticamente a cada 5 segundos
    }

    function stopAutoScroll() {
      clearInterval(autoScrollInterval);
    }

    function pauseAutoScroll() {
      autoScrollPaused = true;
      stopAutoScroll();
    }

    function resumeAutoScroll() {
      autoScrollPaused = false;
      startAutoScroll();
    }

    // Touch and swipe support
    let startX, startY, startTime, endX, endY, endTime;
    let isScrolling = false;

    carousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = new Date().getTime();
        isScrolling = false;

        stopAutoScroll();
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchmove",
      (e) => {
        if (!isScrolling) {
          const diffY = Math.abs(e.touches[0].clientY - startY);
          const diffX = Math.abs(e.touches[0].clientX - startX);
          isScrolling = diffY > diffX;
        }

        if (!isScrolling && e.cancelable) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        if (isScrolling) return;

        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        endTime = new Date().getTime();

        const distanceX = endX - startX;
        const distanceY = endY - startY;
        const duration = endTime - startTime;

        if (
          duration < 300 &&
          Math.abs(distanceX) > 30 &&
          Math.abs(distanceY) < 75
        ) {
          if (distanceX > 0) {
            scrollCarousel("prev");
          } else {
            scrollCarousel("next");
          }
        }

        setTimeout(startAutoScroll, 3000);
      },
      { passive: true }
    );

    // Mouse drag support
    let isDragging = false;
    let dragStartX = 0;
    let scrollStartPosition = 0;

    carousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      scrollStartPosition = carousel.scrollLeft;
      carousel.style.cursor = "grabbing";
      e.preventDefault();

      stopAutoScroll();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const dx = e.clientX - dragStartX;
      carousel.scrollLeft = scrollStartPosition - dx;
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;

      isDragging = false;
      carousel.style.cursor = "";

      // Snap to nearest card
      const currentPosition = carousel.scrollLeft;
      const cardPosition = Math.round(currentPosition / cardWidth) * cardWidth;

      carousel.scrollTo({
        left: cardPosition,
        behavior: "smooth",
      });

      setTimeout(startAutoScroll, 3000);
    });

    // Event listeners para os botões
    prevBtn.addEventListener("click", () => scrollCarousel("prev"));
    nextBtn.addEventListener("click", () => scrollCarousel("next"));

    // Parar auto scroll quando o mouse está sobre o carrossel ou nos controles
    carousel.addEventListener("mouseenter", pauseAutoScroll);
    carousel.addEventListener("mouseleave", resumeAutoScroll);
    prevBtn.addEventListener("mouseenter", pauseAutoScroll);
    prevBtn.addEventListener("mouseleave", resumeAutoScroll);
    nextBtn.addEventListener("mouseenter", pauseAutoScroll);
    nextBtn.addEventListener("mouseleave", resumeAutoScroll);

    // Pause auto scroll when page is not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        pauseAutoScroll();
      } else {
        resumeAutoScroll();
      }
    });

    // Initialize
    window.addEventListener("load", () => {
      initCarousel();
      setTimeout(createProgressIndicator, 100);
      setTimeout(startAutoScroll, 1000);
    });

    window.addEventListener("resize", initCarousel);
  }

  // Modal de Serviços
  const serviceModalOverlay = document.querySelector(".service-modal-overlay");
  const modalCloseBtn = document.querySelector(".modal-close-btn");
  const serviceDetailsButtons = document.querySelectorAll(
    ".service-details-btn"
  );
  const footerServiceLinks = document.querySelectorAll(
    ".footer-links a[data-service]"
  );
  const modalContents = document.querySelectorAll(".modal-content");
  const modal = document.querySelector(".service-modal");

  // Verificar se os elementos do modal existem
  if (
    serviceModalOverlay &&
    modalCloseBtn &&
    (serviceDetailsButtons.length || footerServiceLinks.length) &&
    modal
  ) {
    let lastFocusedElement = null;

    // Função para abrir modal
    function openServiceModal(serviceId) {
      // Ocultar todos os conteúdos modais
      modalContents.forEach((content) => {
        content.classList.remove("active");
      });

      // Mostrar o conteúdo modal correspondente
      const targetContent = document.getElementById(serviceId);
      if (targetContent) {
        setTimeout(() => {
          targetContent.classList.add("active");
        }, 100);
      }

      // Mostrar o overlay com efeito de fade
      serviceModalOverlay.classList.add("active");

      // Evitar scroll da página quando o modal estiver aberto
      document.body.style.overflow = "hidden";

      // Focus trap for accessibility
      setTimeout(() => {
        const focusableElements = modal.querySelectorAll(
          'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length) {
          focusableElements[0].focus();
        }
      }, 300);
    }

    // Enhanced modal open function with animation timing
    serviceDetailsButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const serviceCard = button.closest(".service-card");
        const serviceId = serviceCard.getAttribute("data-service");

        openServiceModal(serviceId);

        // Add a subtle entrance effect to the button
        button.classList.add("clicked");
        setTimeout(() => {
          button.classList.remove("clicked");
        }, 300);

        lastFocusedElement = button;
      });
    });

    // Adicionar evento para links de serviços no footer
    footerServiceLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const serviceId = link.getAttribute("data-service");

        openServiceModal(serviceId);

        lastFocusedElement = link;
      });
    });

    // Enhanced close modal function with animation timing
    function closeModal() {
      // Add closing class for potential exit animations
      serviceModalOverlay.classList.add("closing");

      // Delay removing the active class to allow for exit animations
      setTimeout(() => {
        serviceModalOverlay.classList.remove("active");
        serviceModalOverlay.classList.remove("closing");

        // Reset all modal contents after closing animation
        setTimeout(() => {
          modalContents.forEach((content) => {
            content.classList.remove("active");
          });
        }, 300);

        // Restaurar scroll da página
        document.body.style.overflow = "";

        // Return focus
        if (lastFocusedElement) {
          lastFocusedElement.focus();
        }
      }, 200);
    }

    modalCloseBtn.addEventListener("click", closeModal);

    // Fechar modal ao clicar fora dele
    serviceModalOverlay.addEventListener("click", (e) => {
      if (e.target === serviceModalOverlay) {
        closeModal();
      }
    });

    // Enhanced keyboard navigation for modals
    document.addEventListener("keydown", (e) => {
      if (!serviceModalOverlay.classList.contains("active")) return;

      if (e.key === "Escape") {
        closeModal();
      }

      // Tab key handling for focus trap inside modal
      if (e.key === "Tab") {
        const focusableElements = modal.querySelectorAll(
          'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab on first element focuses last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // Tab on last element focuses first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  // Animação de números com Intersection Observer
  const stats = document.querySelector(".stats");
  if (stats) {
    const observerOptions = {
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll(".stat-number");
          statNumbers.forEach((number) => {
            const target = parseInt(number.textContent);
            let count = 0;
            const duration = 2000;
            const increment = target / (duration / 16);

            const updateCount = () => {
              count += increment;
              if (count < target) {
                number.textContent = Math.ceil(count) + "+";
                requestAnimationFrame(updateCount);
              } else {
                number.textContent = target + "+";
              }
            };

            updateCount();
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    observer.observe(stats);
  }

  // Formulário de contato
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Aqui você pode adicionar a lógica para enviar o formulário
      const formData = new FormData(form);

      // Simulação de envio
      const submitButton = form.querySelector(".submit-button");
      const originalText = submitButton.textContent;

      submitButton.textContent = "Enviando...";
      submitButton.disabled = true;

      setTimeout(() => {
        alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 1500);
    });
  }

  // Rolagem suave para links internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 60; // Ajuste conforme necessário para o seu cabeçalho
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Animação de fade-in
  const fadeInSections = document.querySelectorAll("section, footer");
  fadeInSections.forEach((section) => {
    section.classList.add("fade-hidden");
  });

  const fadeInObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  fadeInSections.forEach((section) => {
    fadeInObserver.observe(section);
  });
});
