const sections = document.querySelectorAll('.section');

function animateSection(section) {
  const children = section.children;

  // Başlık (h2) slide-in-left
  const heading = section.querySelector('h2');
  if (heading) {
    heading.style.opacity = '1';
    heading.classList.add('slide-in-left');
  }

  // Paragraflar fade-in ve zoom-in dönüşümlü
  const paragraphs = section.querySelectorAll('p');
  paragraphs.forEach((p, i) => {
    setTimeout(() => {
      p.style.opacity = '1';
      p.classList.add(i % 2 === 0 ? 'fade-in' : 'zoom-in');
    }, 300 * (i + 1));
  });

  // Liste varsa, elemanları slide-in-right ile sırayla göster
  const listItems = section.querySelectorAll('li');
  listItems.forEach((li, i) => {
    setTimeout(() => {
      li.style.opacity = '1';
      li.classList.add('slide-in-right');
    }, 300 * (i + 1));
  });
}

function checkVisibility() {
  const triggerBottom = window.innerHeight * 1;

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;

    if (sectionTop < triggerBottom && !section.classList.contains('visible')) {
      section.classList.add('visible');
      animateSection(section);
    }
  });
}

window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);

document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuToggle.classList.toggle('open');
});

// Sayfadaki boş bir yere tıklanınca menüyü kapat
document.addEventListener('click', function (e) {
  const isClickInsideNav = nav.contains(e.target);
  const isClickOnToggle = menuToggle.contains(e.target);

  if (!isClickInsideNav && !isClickOnToggle) {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');

    // Alt menü varsa, onu da kapat
    document.querySelectorAll('.submenu').forEach(menu => {
      menu.classList.remove('open');
    });
  }
});

// Menüyü kapatmak için bağlantıya tıklanırsa
const navLinks = nav.querySelectorAll('a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
  });
});

// Hizmetler menüsüne hover veya tık ile alt menü gösterme
const hizmetlerItem = document.querySelector('.has-submenu');
if (hizmetlerItem) {
  hizmetlerItem.addEventListener('click', () => {
    const submenu = hizmetlerItem.querySelector('.submenu');
    if (submenu) {
      submenu.classList.toggle('open');
    }
  });
}
const hero = document.getElementById("hero");

if (hero) {
  const images = [
    "images/hero1.jpg",
    "images/hero2.jpg",
    "images/hero3.jpg"
  ];

  let currentIndex = 0;

  function changeBackground() {
    currentIndex = (currentIndex + 1) % images.length;
    hero.style.backgroundImage = `url(${images[currentIndex]})`;
  }

  // İlk görseli ayarla
  hero.style.backgroundImage = `url(${images[currentIndex]})`;

  // Tıklanınca arka plan değiştir
  hero.addEventListener("click", changeBackground);
}

