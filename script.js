/* Изолированная область видимости, без зависимостей и глобального состояния. */
(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");
  function closeMenu() {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Открыть меню");
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    navigation.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Закрыть меню" : "Открыть меню",
    );
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header")) closeMenu();
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);

  // Панель подбора фильтрует карточки, а не имитирует поиск по несуществующей базе.
  const grid = document.querySelector(".feature-grid");
  const features = [...grid.querySelectorAll(".feature-card")];
  document
    .querySelector("#discovery-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const interest = document.querySelector("#interest").value;
      features.forEach((card) => {
        card.hidden = interest !== "all" && card.dataset.category !== interest;
      });
      grid.classList.toggle("is-filtered", interest !== "all");
      document.querySelector("#filter-status").textContent =
        `Найдено материалов: ${features.filter((card) => !card.hidden).length}.`;
      document
        .querySelector("#discover")
        .scrollIntoView({
          behavior: reduceMotion.matches ? "instant" : "smooth",
        });
    });

  const stories = {
    amphitheatre: {
      image: "main2",
      kicker: "СЕРДЦЕ ФЕСТИВАЛЯ",
      title: "Летний амфитеатр",
      text: "Летний амфитеатр — главная концертная площадка «Славянского базара». Здесь проходят церемонии открытия и закрытия, выступления артистов и конкурсные концерты. Необычный свод и открытое пространство делают эту сцену одним из узнаваемых символов Витебска.",
    },
    concert: {
      image: "main6",
      kicker: "МУЗЫКА БЕЗ ГРАНИЦ",
      title: "Большая сцена",
      text: "Фестивальный концерт — встреча жанров, поколений и культур. Музыка сопровождается хореографией, сценографией и светом. В этой многоголосой картине каждый зритель может найти что-то своё.",
    },
    city: {
      image: "main7",
      kicker: "ОТКРЫТЬ ВИТЕБСК",
      title: "Город вдохновения",
      text: "У фестиваля есть ещё одна сцена — сам Витебск. Прогулка по историческому центру, набережным Западной Двины и небольшим улицам помогает увидеть город вне концертного зала. Фестивальные события вплетаются в его повседневную жизнь.",
    },
    voices: {
      image: "main5",
      kicker: "ТАЛАНТЫ И ОТКРЫТИЯ",
      title: "Новые голоса",
      text: "Международный конкурс исполнителей эстрадной песни «Витебск» и детский музыкальный конкурс знакомят публику с новыми артистами. Это не только соревнование, но и опыт выступления на большой сцене, общения и творческого обмена.",
    },
    symbols: {
      image: "main8",
      kicker: "ПАМЯТЬ В ДЕТАЛЯХ",
      title: "Детали с характером",
      text: "Василёк, фестивальные афиши и сувениры становятся маленькими напоминаниями о большой встрече. Синий цвет василька лёг и в основу оформления этого учебного сайта. Символы помогают сохранить настроение, когда концерт уже закончился.",
    },
  };
  const photos = [...document.querySelectorAll(".gallery-card")].map(
    (card) => ({
      src: card.querySelector("img").getAttribute("src"),
      alt: card.querySelector("img").alt,
      title: card.querySelector("strong").textContent,
      caption: card.querySelector("small").textContent,
    }),
  );
  const dialog = document.querySelector("#detail-dialog");
  const dialogImage = document.querySelector("#dialog-image");
  const photoControls = document.querySelector(".dialog-photo-controls");
  let photoIndex = null;
  let lastTrigger = null;
  function showDialog(trigger) {
    lastTrigger = trigger;
    dialog.showModal();
    document.body.classList.add("dialog-open");
  }
  function showPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    const photo = photos[photoIndex];
    dialogImage.src = photo.src;
    dialogImage.alt = photo.alt;
    document.querySelector("#dialog-kicker").textContent =
      "ФОТОДНЕВНИК ФЕСТИВАЛЯ";
    document.querySelector("#dialog-title").textContent = photo.title;
    document.querySelector("#dialog-text").textContent = photo.caption;
    document.querySelector("#photo-count").textContent =
      `${photoIndex + 1} / ${photos.length}`;
    photoControls.hidden = false;
  }
  features.forEach((card) =>
    card.addEventListener("click", () => {
      const story = stories[card.dataset.story];
      photoIndex = null;
      photoControls.hidden = true;
      dialogImage.src = `img/${story.image}.webp`;
      dialogImage.alt = card.querySelector("img").alt;
      document.querySelector("#dialog-kicker").textContent = story.kicker;
      document.querySelector("#dialog-title").textContent = story.title;
      document.querySelector("#dialog-text").textContent = story.text;
      showDialog(card);
    }),
  );
  document.querySelectorAll("[data-photo]").forEach((card) =>
    card.addEventListener("click", () => {
      showPhoto(Number(card.dataset.photo));
      showDialog(card);
    }),
  );
  document
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    lastTrigger?.focus({ preventScroll: true });
  });
  document
    .querySelector("#photo-prev")
    .addEventListener("click", () => showPhoto(photoIndex - 1));
  document
    .querySelector("#photo-next")
    .addEventListener("click", () => showPhoto(photoIndex + 1));
  dialog.addEventListener("keydown", (event) => {
    if (photoIndex === null || event.target.matches("input, textarea, select"))
      return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(photoIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  let touchStart = null;
  dialogImage.addEventListener(
    "touchstart",
    (event) => {
      touchStart = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
    },
    { passive: true },
  );
  dialogImage.addEventListener(
    "touchend",
    (event) => {
      if (photoIndex === null || !touchStart) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
        showPhoto(photoIndex + (dx < 0 ? 1 : -1));
      touchStart = null;
    },
    { passive: true },
  );
  const track = document.querySelector("#gallery-track");
  function moveTrack(direction) {
    const card = track.querySelector(".gallery-card");
    track.scrollBy({
      left:
        direction *
        (card.getBoundingClientRect().width +
          parseFloat(getComputedStyle(track).gap)),
      behavior: reduceMotion.matches ? "instant" : "smooth",
    });
  }
  document
    .querySelector("#gallery-prev")
    .addEventListener("click", () => moveTrack(-1));
  document
    .querySelector("#gallery-next")
    .addEventListener("click", () => moveTrack(1));
  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveTrack(event.key === "ArrowRight" ? 1 : -1);
    }
  });

  // Пользовательская валидация. Никакой скрытой передачи персональных данных.
  const form = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  const fields = [...form.querySelectorAll("input, textarea")];
  function validate(field) {
    let error = "";
    const value = field.value.trim();
    if (field.id === "name" && value.length < 2)
      error = "Введите имя: не менее 2 символов.";
    if (
      field.id === "email" &&
      (!value ||
        !field.validity.valid ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    )
      error = "Введите корректный адрес электронной почты.";
    if (field.id === "message" && value.length < 10)
      error = "Добавьте сообщение: не менее 10 символов.";
    if (field.id === "consent" && !field.checked)
      error = "Подтвердите, что ознакомились с условиями.";
    document.querySelector(`#${field.id}-error`).textContent = error;
    field.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  }
  fields.forEach((field) => {
    field.addEventListener("input", () => {
      formStatus.textContent = "";
      if (field.hasAttribute("aria-invalid")) validate(field);
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = fields.map(validate).every(Boolean);
    if (!valid) {
      formStatus.textContent =
        "Проверьте отмеченные поля. Сообщение не отправлено.";
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    formStatus.textContent =
      "Все поля заполнены корректно. Это демонстрация: сообщение не отправлено, данные не сохранены.";
  });

  const audio = document.querySelector("audio");
  const soundSection = document.querySelector(".sound-section");
  audio.addEventListener("play", () =>
    soundSection.classList.add("is-playing"),
  );
  ["pause", "ended", "error"].forEach((name) =>
    audio.addEventListener(name, () =>
      soundSection.classList.remove("is-playing"),
    ),
  );

  // Появление элементов и активный пункт навигации без обработчика каждого scroll.
  if ("IntersectionObserver" in window) {
    if (!reduceMotion.matches) {
      const revealObserver = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          }),
        { threshold: 0.08 },
      );
      document
        .querySelectorAll(
          ".section-heading, .history-layout, .sound-section, .contact-section",
        )
        .forEach((element) => {
          element.classList.add("reveal-ready");
          revealObserver.observe(element);
        });
    }
    const links = [...navigation.querySelectorAll('a[href^="#"]')];
    const sectionObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            const active = link.hash === `#${entry.target.id}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }),
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    links.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) sectionObserver.observe(section);
    });
  }
})();
