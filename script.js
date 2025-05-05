document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  // Header com scroll
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.classList.remove("scroll-up");
      return;
    }

    if (
      currentScroll > lastScroll &&
      !header.classList.contains("scroll-down")
    ) {
      header.classList.remove("scroll-up");
      header.classList.add("scroll-down");
    } else if (
      currentScroll < lastScroll &&
      header.classList.contains("scroll-down")
    ) {
      header.classList.remove("scroll-down");
      header.classList.add("scroll-up");
    }
    lastScroll = currentScroll;
  });

  // Animação de números
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

  const stats = document.querySelector(".stats");
  if (stats) {
    observer.observe(stats);
  }

  // Formulário de contato
  const form = document.getElementById("contact-form");

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

  // Smooth scroll para links internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const servicesSection = document.getElementById("services");
  const serviceCards = document.querySelectorAll(".service-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");

          // Anima cada card com um pequeno atraso
          serviceCards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = "0";
              card.style.transform = "translateY(20px)";
              card.style.transition =
                "opacity 0.5s ease-out, transform 0.5s ease-out";
              card.style.transitionDelay = `${index * 0.15}s`;

              // Força o reflow para garantir que a animação ocorra
              void card.offsetWidth;

              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 100);
          });

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  if (servicesSection) {
    observer.observe(servicesSection);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Seleciona todas as seções principais
  const sections = document.querySelectorAll("section");

  // Configura o Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");

          // Opcional: Para melhor performance, para de observar após a animação
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // Dispara quando 10% da seção estiver visível
      rootMargin: "0px 0px -100px 0px", // Ajusta a área de detecção
    }
  );

  // Observa cada seção
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Efeito especial para os cards de serviços (aparecimento em cascata)
  const serviceCards = document.querySelectorAll(".service-card");
  const servicesObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          serviceCards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = "0";
              card.style.transform = "translateY(20px)";
              card.style.transition =
                "opacity 0.6s ease-out, transform 0.6s ease-out";
              card.style.transitionDelay = `${index * 0.15}s`;

              // Força o reflow para garantir que a animação ocorra
              void card.offsetWidth;

              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 100);
          });

          servicesObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  const servicesSection = document.getElementById("servicos");
  if (servicesSection) {
    servicesObserver.observe(servicesSection);
  }
});

// Dados completos dos serviços
const servicesData = {
  "Contabilidade Fiscal": {
    icon: "fa-calculator",
    description:
      "Gestão completa de todas as obrigações fiscais da sua empresa, garantindo conformidade com a legislação e evitando multas.",
    benefits: [
      "Elaboração e entrega de obrigações acessórias (DCTF, EFD, ECD, etc.)",
      "Apuração de impostos federais, estaduais e municipais",
      "Envio de documentos fiscais digitais",
      "Monitoramento de prazos e obrigações",
      "Relatórios personalizados para tomada de decisão",
    ],
  },
  "Consultoria Financeira": {
    icon: "fa-chart-line",
    description:
      "Análise e planejamento financeiro estratégico para otimizar os resultados do seu negócio.",
    benefits: [
      "Análise de viabilidade econômica",
      "Projeções financeiras",
      "Gestão de fluxo de caixa",
      "Indicadores de desempenho",
      "Otimização de custos e despesas",
    ],
  },
  // Adicione os outros serviços seguindo o mesmo padrão
  "Folha de Pagamento": {
    icon: "fa-file-invoice",
    description:
      "Gestão completa da folha de pagamento, incluindo cálculos, impostos e benefícios dos colaboradores.",
    benefits: [
      "Cálculo de holerites",
      "Recolhimento de INSS e FGTS",
      "Gestão de benefícios (VR, VT, plano de saúde)",
      "Relatórios gerenciais",
      "Integração com sistemas de ponto",
    ],
  },
  "Assessoria Tributária": {
    icon: "fa-balance-scale",
    description:
      "Orientação especializada para minimizar a carga tributária dentro da legalidade.",
    benefits: [
      "Análise do regime tributário ideal",
      "Planejamento tributário estratégico",
      "Defesa em processos fiscais",
      "Recuperação de créditos tributários",
      "Atualização sobre mudanças na legislação",
    ],
  },
  "Abertura de Empresa": {
    icon: "fa-building",
    description:
      "Auxílio completo desde o planejamento até a legalização da sua empresa.",
    benefits: [
      "Análise da melhor natureza jurídica",
      "Registro nos órgãos competentes",
      "Obtenção de CNPJ",
      "Licenças e alvarás",
      "Orientações pós-abertura",
    ],
  },
  "Gestão Patrimonial": {
    icon: "fa-building",
    description:
      "Auxílio completo desde o planejamento até a legalização da sua empresa.",
    benefits: [
      "Análise da melhor natureza jurídica",
      "Registro nos órgãos competentes",
      "Obtenção de CNPJ",
      "Licenças e alvarás",
      "Orientações pós-abertura",
    ],
  },
  "Consultoria MEI": {
    icon: "fa-building",
    description:
      "Auxílio completo desde o planejamento até a legalização da sua empresa.",
    benefits: [
      "Análise da melhor natureza jurídica",
      "Registro nos órgãos competentes",
      "Obtenção de CNPJ",
      "Licenças e alvarás",
      "Orientações pós-abertura",
    ],
  },
  "Planejamento Tributário": {
    icon: "fa-building",
    description:
      "Auxílio completo desde o planejamento até a legalização da sua empresa.",
    benefits: [
      "Análise da melhor natureza jurídica",
      "Registro nos órgãos competentes",
      "Obtenção de CNPJ",
      "Licenças e alvarás",
      "Orientações pós-abertura",
    ],
  },
};

// Configuração do modal
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("serviceModal");
  const serviceCards = document.querySelectorAll(".service-card");

  // Abrir modal ao clicar em um card
  serviceCards.forEach((card) => {
    card.addEventListener("click", function () {
      const serviceTitle = this.querySelector("h3").textContent;
      openServiceModal(serviceTitle);
    });
  });

  // Fechar modal
  document.querySelector(".close-modal").addEventListener("click", closeModal);
  document
    .getElementById("contactButton")
    .addEventListener("click", function () {
      closeModal();
      document.getElementById("contato").scrollIntoView({ behavior: "smooth" });
    });

  // Fechar ao clicar fora do conteúdo
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fechar com ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });
});

function openServiceModal(serviceTitle) {
  const service = servicesData[serviceTitle];
  if (!service) return;

  // Preencher modal com os dados

  document.getElementById("modalTitle").textContent = serviceTitle;
  document.getElementById("modalDescription").textContent = service.description;

  const benefitsList = document.getElementById("modalBenefits");
  benefitsList.innerHTML = "";
  service.benefits.forEach((benefit) => {
    const li = document.createElement("li");
    li.textContent = benefit;
    benefitsList.appendChild(li);
  });

  // Configurar o botão do WhatsApp
  const whatsappButton = document.getElementById("contactButton");
  const message = `Olá Mori Contábil! Gostaria de saber mais sobre o serviço: ${serviceTitle}`;
  const encodedMessage = encodeURIComponent(message);
  whatsappButton.onclick = function () {
    window.open(`https://wa.me/5592984779632?text=${encodedMessage}`, "_blank");
    closeModal();
  };

  // Mostrar modal
  const modal = document.getElementById("serviceModal");
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("serviceModal");
  modal.classList.remove("show");
  document.body.style.overflow = "auto"; // Restaura scroll
}
