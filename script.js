const technicians = [
  {
    name: "Carlos Méndez",
    initials: "CM",
    category: "Electricidad",
    zone: "Zona 10",
    rating: "4.9",
    reviews: 48,
    experience: "8 años de experiencia",
    tags: ["Instalaciones", "Cortocircuitos", "Tableros"],
    color: "#c9e9ed",
    ink: "#175a65",
    available: true,
  },
  {
    name: "Ana Lucía Pérez",
    initials: "AP",
    category: "Plomería",
    zone: "Zona 14",
    rating: "4.8",
    reviews: 35,
    experience: "6 años de experiencia",
    tags: ["Fugas", "Drenajes", "Grifería"],
    color: "#f8d7c2",
    ink: "#7e4328",
    available: true,
  },
  {
    name: "Luis Fernando Soto",
    initials: "LS",
    category: "Carpintería",
    zone: "Zona 15",
    rating: "4.9",
    reviews: 27,
    experience: "11 años de experiencia",
    tags: ["Muebles", "Puertas", "Restauración"],
    color: "#f4e2b5",
    ink: "#684e16",
    available: false,
  },
  {
    name: "Sofía Morales",
    initials: "SM",
    category: "Electrodomésticos",
    zone: "Zona 11",
    rating: "4.7",
    reviews: 31,
    experience: "7 años de experiencia",
    tags: ["Lavadoras", "Secadoras", "Refrigeración"],
    color: "#ddd7f4",
    ink: "#574d7c",
    available: true,
  },
  {
    name: "Ricardo Alvarado",
    initials: "RA",
    category: "Electricidad",
    zone: "Zona 1",
    rating: "4.8",
    reviews: 42,
    experience: "9 años de experiencia",
    tags: ["Iluminación", "Cableado", "Diagnóstico"],
    color: "#d3eddb",
    ink: "#326342",
    available: true,
  },
  {
    name: "María Fernanda Gil",
    initials: "MG",
    category: "Plomería",
    zone: "Zona 10",
    rating: "4.9",
    reviews: 39,
    experience: "5 años de experiencia",
    tags: ["Tuberías", "Baños", "Calentadores"],
    color: "#f4d3dc",
    ink: "#754051",
    available: false,
  },
];

const technicianGrid = document.querySelector("#technicianGrid");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const modal = document.querySelector("#requestModal");
const progressBar = document.querySelector("#progressBar");
const menuButton = document.querySelector("#menuButton");
const mobileNav = document.querySelector("#mobileNav");
const toast = document.querySelector("#toast");
let selectedService = "";
let activeStep = 1;
let toastTimer;

function renderTechnicians(category = "Todos") {
  const filtered = category === "Todos"
    ? technicians.slice(0, 3)
    : technicians.filter((technician) => technician.category === category);

  technicianGrid.innerHTML = filtered.length
    ? filtered.map((technician) => `
      <article class="technician-card reveal visible">
        <div class="technician-cover" style="--card-bg:${technician.color};--avatar-ink:${technician.ink}">
          ${technician.available ? '<span class="available-pill"><i></i> Disponible hoy</span>' : ""}
          <span class="profile-avatar">${technician.initials}</span>
        </div>
        <div class="technician-body">
          <div class="technician-title">
            <h3>${technician.name} <span class="verified-dot" title="Perfil demostrativo verificado">✓</span></h3>
            <span class="rating">★ ${technician.rating} <span>(${technician.reviews})</span></span>
          </div>
          <p class="technician-role">${technician.category} · ${technician.zone}</p>
          <div class="tech-tags">${technician.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
          <div class="tech-meta"><span>⌁ ${technician.zone}</span><span>◷ ${technician.experience}</span></div>
          <div class="tech-actions">
            <button class="button button-outline" data-profile="${technician.name}">Ver perfil</button>
            <button class="button button-primary" data-request-tech="${technician.name}" data-service="${technician.category}">Solicitar</button>
          </div>
        </div>
      </article>
    `).join("")
    : '<p class="empty-state">No hay perfiles demostrativos para este filtro.</p>';
}

function setFilter(category) {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === category);
  });
  renderTechnicians(category);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

document.querySelectorAll("[data-category]").forEach((card) => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    setFilter(category);
    document.querySelector("#tecnicos").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("#heroSearch").addEventListener("click", () => {
  const category = document.querySelector("#heroService").value;
  setFilter(category);
  document.querySelector("#tecnicos").scrollIntoView({ behavior: "smooth" });
  showToast(category === "Todos" ? "Mostrando técnicos destacados" : `Mostrando especialistas en ${category.toLowerCase()}`);
});

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function showStep(step) {
  activeStep = step;
  document.querySelectorAll(".modal-step").forEach((section) => {
    section.classList.toggle("active", Number(section.dataset.step) === step);
  });
  progressBar.style.width = `${step * 33.333}%`;

  if (step === 3) {
    document.querySelector("#summaryService").textContent = selectedService;
    document.querySelector("#summaryZone").textContent = document.querySelector("#requestZone").value || "Por confirmar";
  }
}

function openModal(service = "") {
  selectedService = service;
  showStep(1);
  document.querySelectorAll("[data-modal-service]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.modalService === service);
  });
  document.querySelector('.modal-step[data-step="1"] [data-next]').disabled = !service;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.querySelector(".modal-close").focus(), 50);
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (activeStep === 3) showToast("Demostración finalizada. Ninguna solicitud fue enviada.");
}

document.querySelectorAll("[data-open-request]").forEach((button) => {
  button.addEventListener("click", () => openModal());
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.querySelectorAll("[data-modal-service]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedService = button.dataset.modalService;
    document.querySelectorAll("[data-modal-service]").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    document.querySelector('.modal-step[data-step="1"] [data-next]').disabled = false;
  });
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showStep(Math.min(activeStep + 1, 3)));
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => showStep(Math.max(activeStep - 1, 1)));
});

technicianGrid.addEventListener("click", (event) => {
  const requestButton = event.target.closest("[data-request-tech]");
  const profileButton = event.target.closest("[data-profile]");
  if (requestButton) openModal(requestButton.dataset.service);
  if (profileButton) showToast(`${profileButton.dataset.profile}: perfil demostrativo verificado`);
});

document.querySelector("#technicianSignup").addEventListener("click", () => {
  showToast("Registro de técnicos: funcionalidad prevista para una siguiente fase");
});

document.querySelector("#loginDemo").addEventListener("click", () => {
  showToast("Inicio de sesión: disponible en una siguiente fase del prototipo");
});

menuButton.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.querySelectorAll("a, button").forEach((item) => {
  item.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (detail.open) {
      document.querySelectorAll(".faq-list details").forEach((other) => {
        if (other !== detail) other.open = false;
      });
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

renderTechnicians();
