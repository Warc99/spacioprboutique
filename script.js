// Solo una vez al inicio
//let productos = []; // o tu array real de productos

// Configuración de idioma - Solo español
const translations = {
  es: {
    inicio: "Inicio",
    productos: "Productos",
    sobre: "Sobre Nosotros",
    bienvenida: "En Spacio PR Boutique, disponemos de joyas únicas hechas a mano con flores reales. Nuestros productos están diseñados para amantes de la bijouterie y las manualidades, fusionando la elegancia floral con la creatividad artesanal. Descubre piezas exclusivas que reflejan la belleza natural de las flores.",
    descripcion: "Cada pieza es única, creada a mano con flores reales.",
    carrito: "Carrito",
    pedido: "Enviar pedido por WhatsApp",
    buscar: "Buscar...",
    yaEnCarrito: "Este producto ya está en el carrito."
  }
};

// --- Arrays de productos en español y francés deben estar definidos en productos.js ---
// const productos = [...]; // Español
// const produits = [...];  // Francés

// --- Guardar referencias globales ---
let currentLang = "es";
let currentCurrency = "gs";
let cart = [];
let productosFiltrados = [];









// Traducción dinámica
function previewLanguage(lang) {
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang][key]) {
      if ('placeholder' in el) {
        el.placeholder = translations[lang][key];
      } else {
        el.innerText = translations[lang][key];
      }
    }
  });
  // Traducir placeholder del buscador si existe
  const searchBar = document.getElementById('search-bar');
  if (searchBar && translations[lang].buscar) {
    searchBar.placeholder = translations[lang].buscar;
  }
  // Hero y secciones estáticas
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    heroTitle.textContent = lang === 'fr'
      ? "Boutique de bijoux avec fleurs naturelles"
      : "Tienda de Joyas con Flores Naturales";
  }
  const heroP = document.querySelector('.hero p');
  if (heroP) {
    heroP.textContent = translations[lang].bienvenida;
  }
  const productosH2 = document.querySelector('#productos h2');
  if (productosH2) {
    productosH2.textContent = translations[lang].productos;
  }
  const sobreH2 = document.querySelector('#sobre h2');
  if (sobreH2) {
    sobreH2.textContent = lang === 'fr' ? "À propos de moi" : "Sobre Mí";
  }
  const sobreP = document.querySelector('#sobre p');
  if (sobreP) {
    sobreP.textContent = lang === 'fr'
      ? "Je m'appelle Lina et je souhaite partager avec vous l'une de mes plus grandes passions : la création de bijoux inspirés par la beauté des fleurs. J'aime les orchidées et la nature sous toutes ses formes, et de cette admiration est née l'envie de leur donner une seconde vie à travers mes créations. Chaque pièce que je conçois est unique et spéciale, à l'image de chaque fleur qui l'inspire. Aucune n'est identique, et c'est là tout leur charme. Mes accessoires reflètent l'élégance, la délicatesse et la polyvalence, parfaits pour toutes les occasions -d'un dîner formel à une journée décontractée- et accompagnent celle qui les porte d'une touche naturelle et authentique."
      : "Mi nombre es Lina y quiero compartir contigo una de mis mayores pasiones: la creación de bijouterie inspirada en la belleza de las flores. Amo las orquídeas y la naturaleza en todas sus formas, y de esa admiración nació el deseo de darles una segunda vida a través de mis creaciones. Cada pieza que diseño es única y especial, como cada flor que la inspira. No existen dos iguales, y en esa singularidad reside su encanto. Mis accesorios reflejan elegancia, delicadeza y versatilidad, ideales para cualquier ocasión -desde una cena formal hasta un día casual-, acompañando a quien los luce con un toque natural y auténtico.";
  }
  // Footer
  const footer = document.querySelector('footer p');
  if (footer) {
    footer.textContent = lang === 'fr'
      ? "Spacio PR Boutique © 2026. Tous droits réservés."
      : "Spacio PR Boutique © 2026. Todos los derechos reservados.";
  }
  // Botón WhatsApp en modal
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.textContent = translations[lang].pedido;
  }
  // Botón añadir al carrito en popup
  const popupAddCart = document.getElementById('popup-add-cart');
  if (popupAddCart) {
    popupAddCart.textContent = lang === 'fr' ? "Ajouter au panier" : "Añadir al carrito";
  }
  // --- NUEVO: Traducir textos del header ---
  const headerLinks = document.querySelectorAll('.nav-links > li > a');
  if (headerLinks.length >= 4) {
    headerLinks[0].textContent = translations[lang].inicio;
    headerLinks[1].textContent = translations[lang].productos;
    headerLinks[2].textContent = lang === 'fr' ? "À propos de moi" : "Sobre Mí";
    headerLinks[3].textContent = lang === 'fr' ? "Réseaux" : "Redes";
  }
}

// --- Actualiza botones dinámicos tras cambio de idioma ---
function updateDynamicButtons() {
  // Botones "Añadir al carrito" en tarjetas
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.textContent = currentLang === 'fr' ? "Ajouter au panier" : "Añadir al carrito";
  });
  // Botón WhatsApp en modal
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.textContent = translations[currentLang].pedido;
  }
}

// Guardar y cargar carrito en localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function loadCart() {
  const saved = localStorage.getItem('cart');
  cart = saved ? JSON.parse(saved) : [];
}

// Carrito de compras con imagen y contador animado
function updateCart() {
  const cartElement = document.getElementById('cartItems');
  const totalElement = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cart-count');
  if (!cartElement || !totalElement || !cartCount) return;
  cartElement.innerHTML = '';
  let total = 0;
  let count = 0;
  cart.forEach(item => {
    // Busca el producto para obtener la imagen principal y nombre traducido
    const prod = productos.find(p => p.id === item.id);
    let nombre = prod ? (currentLang === 'fr' ? (prod.nom || prod.nombre) : prod.nombre) : item.name;
    const imgSrc = prod && prod.imagenes.length > 0 ? prod.imagenes[0] : '';
    // Usar el precio del array directamente, sin conversión
    let price = item.basePrice;
    let priceText = currentLang === 'fr'
      ? `${price.toLocaleString()} €`
      : `Gs. ${price.toLocaleString()}`;
    let div = document.createElement('div');
    div.className = 'cart-item-modal';
    div.innerHTML = `
      <img src="${imgSrc}" alt="${nombre}" class="cart-item-thumb"/>
      <div class="cart-item-info">
        <span>${nombre} (${item.qty})</span>
        <small>${priceText} c/u</small>
      </div>
      <button class="remove-cart" onclick="removeFromCart('${item.id}')">✕</button>
    `;
    cartElement.appendChild(div);
    total += item.basePrice * item.qty;
    count += item.qty;
  });
  totalElement.innerText = currentLang === 'fr'
    ? `Total: ${total.toLocaleString()} €`
    : `Total: Gs. ${total.toLocaleString()}`;
  cartCount.textContent = count;
  cartCount.style.animation = 'none';
  void cartCount.offsetWidth;
  cartCount.style.animation = null;
  saveCart();
  // Actualizar título y botón del carrito
  document.querySelector('.cart-modal-content h3').textContent = currentLang === 'fr' ? 'Panier' : 'Carrito';
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) whatsappBtn.textContent = translations[currentLang].pedido;
}

function addToCart(id, name, basePrice) {
  const found = cart.find(item => item.id === id);
  if (found) {
    alert(translations[currentLang]?.yaEnCarrito || "Este producto ya está en el carrito.");
    return;
  }

  const productoOriginal = productos.find(p => p.id === id);
  const image = productoOriginal?.imagenes?.[0] || '';

  cart.push({ id, name, basePrice, image, qty: 1 });
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}
// WhatsApp pedido
function sendWhatsAppOrder() {
  if (cart.length === 0) return;

  const siteURL = "https://spacioprboutique.vercel.app";
  let msg = currentLang === 'fr'
    ? "Bonjour ! Je souhaite commander :\n"
    : "¡Hola! Quiero pedir:\n";

  cart.forEach(item => {
    const imageURL = `${siteURL}/${item.image}`;
    msg += `- ${item.name} x${item.qty}\n${currentLang === 'fr' ? 'Image' : 'Imagen'}: ${imageURL}\n\n`;
  });

  const total = document.getElementById('cartTotal').innerText;
  msg += `${total}\n${currentLang === 'fr' ? 'Est-ce disponible ?' : '¿Está disponible?'}\n`;

  const phone = "595984404597";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  console.log("Mensaje WhatsApp:", msg);
  window.open(url, '_blank');
}

// Modal: abrir/cerrar y cerrar al hacer clic fuera
function toggleCart() {
  const cartDiv = document.getElementById('cart');
  if (!cartDiv) return;
  cartDiv.classList.toggle('hidden');
  updateCart();
}
document.addEventListener('mousedown', function(e) {
  const cartDiv = document.getElementById('cart');
  const modalContent = document.getElementById('cart-modal-content');
  if (cartDiv && !cartDiv.classList.contains('hidden')) {
    if (!modalContent.contains(e.target) && !e.target.closest('.cart-icon')) {
      cartDiv.classList.add('hidden');
    }
  }
});

// Mostrar vista previa del carrito al pasar el mouse (desktop) o tocar (móvil)
const cartIcon = document.querySelector('.cart-icon');
const cartPreview = document.getElementById('cart-preview');

if (cartIcon && cartPreview) {
  // --- Desktop: hover ---
  cartIcon.addEventListener('mouseenter', (e) => {
    if (window.innerWidth > 900) {
      renderCartPreview();
      cartPreview.classList.remove('hidden');
    }
  });
  cartIcon.addEventListener('mousemove', (e) => {
    // Posiciona el preview cerca del cursor
  });
  cartIcon.addEventListener('mouseleave', () => {
    if (window.innerWidth > 900) {
      setTimeout(() => {
        if (!cartPreview.matches(':hover')) cartPreview.classList.add('hidden');
      }, 200);
    }
  });
  cartPreview.addEventListener('mouseleave', () => {
    if (window.innerWidth > 900) {
      cartPreview.classList.add('hidden');
    }
  });
  cartPreview.addEventListener('mouseenter', () => {
    if (window.innerWidth > 900) {
      cartPreview.classList.remove('hidden');
    }
  });

  // --- Móvil: tap para mostrar/ocultar preview ---
  cartIcon.addEventListener('click', function(e) {
    if (window.innerWidth <= 900) {
      e.stopPropagation();
      if (cartPreview.classList.contains('hidden')) {
        renderCartPreview();
        cartPreview.classList.remove('hidden');
      } else {
        cartPreview.classList.add('hidden');
      }
    }
  });

  // Mantener visible si se toca dentro del preview en móvil
  cartPreview.addEventListener('touchstart', function(e) {
    if (window.innerWidth <= 900) {
      e.stopPropagation();
      // No ocultar el preview
    }
  });

  // Ocultar preview al tocar fuera en móvil
  document.addEventListener('touchstart', function(e) {
    if (
      window.innerWidth <= 900 &&
      cartPreview &&
      !cartPreview.classList.contains('hidden') &&
      !cartPreview.contains(e.target) &&
      !e.target.closest('.cart-icon')
    ) {
      cartPreview.classList.add('hidden');
    }
  });
}

// Renderiza la vista previa del carrito
function renderCartPreview() {
  if (!cartPreview) return;
  if (!cart || cart.length === 0) {
    cartPreview.innerHTML = `<div style="text-align:center;color:#888;">${currentLang === 'fr' ? 'Le panier est vide.' : 'El carrito está vacío.'}</div>`;
    return;
  }
  let total = 0;
  cartPreview.innerHTML = cart.map(item => {
    const prod = productos.find(p => p.id === item.id);
    let nombre = prod ? (currentLang === 'fr' ? (prod.nom || prod.nombre) : prod.nombre) : item.name;
    const imgSrc = prod && prod.imagenes.length > 0 ? prod.imagenes[0] : '';
    // Usar el precio del array directamente, sin conversión
    let price = item.basePrice;
    let priceText = currentLang === 'fr'
      ? `${price.toLocaleString()} €`
      : `Gs. ${price.toLocaleString()}`;
    total += item.basePrice * item.qty;
    return `
      <div class="cart-item-modal">
        <img src="${imgSrc}" alt="${nombre}" class="cart-item-thumb"/>
        <div class="cart-item-info">
          <span>${nombre} (${item.qty})</span>
          <small>${priceText} c/u</small>
        </div>
        <button class="remove-cart" onclick="removeFromCart('${item.id}'); renderCartPreview();" title="${currentLang === 'fr' ? 'Supprimer' : 'Eliminar'}">✕</button>
      </div>
    `;
  }).join('');
  cartPreview.innerHTML += `<div class="cart-total">${currentLang === 'fr' ? `Total: ${total.toLocaleString()} €` : `Total: Gs. ${total.toLocaleString()}`}</div>
    <button class="whatsapp-btn" onclick="sendWhatsAppOrder()">${translations[currentLang].pedido}</button>`;
}

// --- INICIALIZACIÓN SEGURA ---
document.addEventListener('DOMContentLoaded', () => {
  // Idioma fijo en español
  currentLang = 'es';
  currentCurrency = 'gs';
  
  // Asegurar que productos está disponible
  if (typeof productos !== 'undefined' && productos.length > 0) {
    window.productos = productos;
    productosFiltrados = productos.slice();
  } else {
    window.productos = [];
    productosFiltrados = [];
  }
  
  loadCart();
  updateCart();
  // Renderizar solo lo esencial primero para mejorar la percepción de carga
  previewLanguage(currentLang);
  renderVistaCategorias();
  llenarMenuCategorias();
  // Retrasar la carga de productos para mejorar la experiencia inicial
  setTimeout(() => {
    renderProductos(productosFiltrados, true);
  }, 100);
});

document.addEventListener('DOMContentLoaded', function() {
  const dropdown = document.querySelector('.nav-item-dropdown');
  const link = document.getElementById('productos-menu-link');
  const menuCategorias = document.getElementById('menu-categorias');
  const headerNav = document.querySelector('.header-nav');

  // Toggle menú en móviles
  link.addEventListener('click', function(e) {
    // Mostrar todos los productos al hacer clic en "Productos" (desktop y móvil)
    if (window.innerWidth > 768) {
      productosFiltrados = productos.slice();
      paginaActual = 1;
      renderProductos(productosFiltrados, true);
    } else {
      e.preventDefault();
      dropdown.classList.toggle('active');
      productosFiltrados = productos.slice();
      paginaActual = 1;
      renderProductos(productosFiltrados, true);
    }
  });

  // Mostrar todos los productos al hacer clic en el logo
  const logoLink = document.querySelector('.header-left a');
  if (logoLink) {
    logoLink.addEventListener('click', function(e) {
      e.preventDefault();
      productosFiltrados = productos.slice();
      paginaActual = 1;
      renderProductos(productosFiltrados, true);
    });
  }

  // Cerrar menú al seleccionar una opción del submenú de productos
  if (menuCategorias) {
    menuCategorias.addEventListener('click', function(e) {
      if (window.innerWidth <= 768 && e.target.tagName === 'A') {
        dropdown.classList.remove('active');
        // Oculta el menú hamburguesa también
        if (headerNav && headerNav.classList.contains('open')) {
          headerNav.classList.remove('open');
          headerNav.style.display = 'none';
          setTimeout(() => {
            headerNav.style.display = '';
          }, 10);
        }
      }
    });
  }

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (
      window.innerWidth <= 768 &&
      dropdown.classList.contains('active') &&
      !dropdown.contains(e.target)
    ) {
      dropdown.classList.remove('active');
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // --- HAMBURGER MENU LOGIC ---
  const headerNav = document.querySelector('.header-nav');
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Abrir/cerrar menú hamburguesa
  if (hamburger && headerNav) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      headerNav.classList.toggle('open');
    });
  }

  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768 && headerNav.classList.contains('open')) {
        headerNav.classList.remove('open');
        // Forzar repaint para asegurar que el menú desaparezca inmediatamente
        // y no quede ningún overlay que bloquee la pantalla
        headerNav.style.display = 'none';
        setTimeout(() => {
          headerNav.style.display = '';
        }, 10);
      }
    });
  });

  // Cerrar menú al hacer clic fuera del menú
  document.addEventListener('click', function(e) {
    if (
      window.innerWidth <= 768 &&
      headerNav &&
      headerNav.classList.contains('open') &&
      !headerNav.contains(e.target) &&
      (!hamburger || !hamburger.contains(e.target))
    ) {
      headerNav.classList.remove('open');
    }
  });
});

// Extrae la subcarpeta de la ruta de la imagen
function getCategoriaFromImagen(imagen) {
  const match = imagen.match(/imagenes\/([^/]+)\//i);
  return match ? match[1] : "Otros";
}

// Agrupa productos por categoría (usando la propiedad "categoria")
function agruparPorCategoria(productos) {
  const categorias = {};
  productos.forEach(prod => {
    const cat = prod.categoria || getCategoriaFromImagen(prod.imagenes[0]);
    if (!categorias[cat]) categorias[cat] = [];
    categorias[cat].push(prod);
  });
  return categorias;
}

// Renderiza las tarjetas grandes de categorías
function renderVistaCategorias() {
  const contenedor = document.getElementById('productos-container');
  if (!contenedor) return;
  contenedor.innerHTML = '';
  const categorias = agruparPorCategoria(productos);
  Object.entries(categorias).forEach(([cat, prods]) => {
    // Usar imagen personalizada para la categoría "Collares"
    const imagenVista = cat === "Collares"
      ? "imagenes/tarjeta_collares.webp"
      : prods[0].imagenes[0];
    contenedor.innerHTML += `
      <div class="categoria-card-grande" onclick="mostrarCategoria('${cat}')">
        <img src="${imagenVista}" alt="${cat}">
        <div style="padding:16px;text-align:center;width:100%;font-size:1.3em;font-weight:bold;color:var(--marron-oscuro);">${cat}</div>
      </div>
    `;
  });
}

// Muestra los productos de una categoría
function mostrarCategoria(cat) {
  const contenedor = document.getElementById('productos-container');
  if (!contenedor) return;
  const productosCat = productos.filter(
    p => (p.categoria || getCategoriaFromImagen(p.imagenes[0])) === cat
  );
  renderProductos(productosCat, false);
}

// Renderiza una tarjeta de producto
function renderProductoCard(prod) {
  const prodData = encodeURIComponent(JSON.stringify(prod));
  if (prod.imagenes.length > 1) {
    const id = `prod-${prod.id}`;
    return `
      <div class="product-card" id="${id}" onclick='abrirPopupProductoDesdeHTML(this)' data-prod='${prodData}'>
        <div class="product-carousel">
          <button class="gallery-arrow gallery-prev" onclick="cambiarImagenCarrusel('${id}', -1, event)" tabindex="0" aria-label="Anterior">&#8592;</button>
          <img src="${prod.imagenes[0]}" alt="${prod.nombre}" class="product-image" id="main-img-${prod.id}" />
          <button class="gallery-arrow gallery-next" onclick="cambiarImagenCarrusel('${id}', 1, event)" tabindex="0" aria-label="Siguiente">&#8594;</button>
        </div>
        <div class="product-info">
          <h3>${prod.nombre}</h3>
          <span class="price">Gs. ${prod.precio}</span>
          <button class="btn-add-cart" onclick="addToCart('${prod.id}', '${prod.nombre}', ${prod.precio});event.stopPropagation();">Añadir al carrito</button>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="product-card" onclick='abrirPopupProductoDesdeHTML(this)' data-prod='${prodData}'>
        <img src="${prod.imagenes[0]}" alt="${prod.nombre}" class="product-image"/>
        <div class="product-info">
          <h3>${prod.nombre}</h3>
          <span class="price">Gs. ${prod.precio}</span>
          <button class="btn-add-cart" onclick="addToCart('${prod.id}', '${prod.nombre}', ${prod.precio});event.stopPropagation();">Añadir al carrito</button>
        </div>
      </div>
    `;
  }
}

// Lógica del carrusel
window.cambiarImagenCarrusel = function(cardId, dir, event) {
  event.stopPropagation();
  const card = document.getElementById(cardId);
  if (!card) return;
  const img = card.querySelector('.product-image');
  const prodId = cardId.replace('prod-', '');
  const prod = productos.find(p => p.id === prodId);
  if (!prod) return;
  let idx = parseInt(img.getAttribute('data-idx')) || 0;
  idx = (idx + dir + prod.imagenes.length) % prod.imagenes.length;
  img.src = prod.imagenes[idx];
  img.setAttribute('data-idx', idx);
};

// Llenar select de categorías
function llenarSelectCategorias() {
  const select = document.getElementById('tipo');
  if (!select) return;
  // Obtén categorías únicas desde las subcarpetas
  const categorias = Array.from(new Set(productos.map(p => getCategoriaFromImagen(p.imagenes[0]))));
  // Limpia y agrega la opción "Todos"
  select.innerHTML = `<option value="">Todos</option>`;
  categorias.forEach(cat => {
    select.innerHTML += `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`;
  });
}

// Crear tabs de categorías
function crearTabsCategorias() {
  const categorias = Array.from(new Set(productos.map(p => getCategoriaFromImagen(p.imagenes[0]))));
  const tabsDiv = document.getElementById('categorias-tabs');
  if (!tabsDiv) return;
  tabsDiv.innerHTML = '';

  // Pestaña "Todos"
  tabsDiv.innerHTML += `<button class="tab-cat active" data-cat="">Todos</button>`;
  categorias.forEach(cat => {
    tabsDiv.innerHTML += `<button class="tab-cat" data-cat="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>`;
  });

  // Listener para tabs
  tabsDiv.querySelectorAll('.tab-cat').forEach(btn => {
    btn.addEventListener('click', function() {
      tabsDiv.querySelectorAll('.tab-cat').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderProductos(this.dataset.cat);
    });
  });
}

// --- Paginación de productos con numeración completa ---
let paginaActual = 1;
const productosPorPagina = 15;

function renderProductos(lista = productosFiltrados, paginacion = true) {
  const cont = document.getElementById('productos-container');
  cont.innerHTML = '';

  // Calcular paginación solo si paginacion=true
  let totalPaginas = 1;
  let productosPagina = lista;
  if (paginacion) {
    totalPaginas = Math.ceil(lista.length / productosPorPagina);
    if (paginaActual > totalPaginas) paginaActual = totalPaginas || 1;
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    productosPagina = lista.slice(inicio, fin);
  }

  productosPagina.forEach(producto => {
    // --- Traducción dinámica de campos de producto ---
    let nombre = producto.nombre;
    let desc = producto.desc;
    let precio = producto.precio;
    let precioTexto = '';
    if (currentLang === 'fr') {
      nombre = producto.nom || producto.nombre;
      desc = producto.desc_fr || producto.desc;
      precio = producto.prix || producto.precio;
      precioTexto = `${precio.toLocaleString()} €`;
    } else {
      precioTexto = `Gs. ${precio.toLocaleString()}`;
    }

    // Asegura que las imágenes existan y se muestren correctamente
    let imagenPrincipal = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : '';
    let carouselHtml = '';
    if (producto.imagenes && producto.imagenes.length > 1) {
      carouselHtml = `
        <div class="product-carousel">
          <button class="gallery-arrow gallery-prev" aria-label="Anterior">&#8592;</button>
          <img src="${imagenPrincipal}" class="product-image" alt="${nombre}" data-idx="0">
          <button class="gallery-arrow gallery-next" aria-label="Siguiente">&#8594;</button>
        </div>
      `;
    } else {
      carouselHtml = `<img src="${imagenPrincipal}" class="product-image" alt="${nombre}">`;
    }

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${carouselHtml}
      <div class="product-info">
        <h3>${nombre}</h3>
        <div class="price">${precioTexto}</div>
        <button class="btn-add-cart">${currentLang === 'fr' ? 'Ajouter au panier' : 'Añadir al carrito'}</button>
      </div>
    `;

    // Evento para abrir popup al hacer clic en la tarjeta (excepto en el botón de añadir al carrito o flechas)
    card.onclick = (e) => {
      if (!e.target.classList.contains('btn-add-cart') &&
          !e.target.classList.contains('gallery-arrow')) {
        abrirPopupProducto(producto);
      }
    };

    // Carrusel (si tienes varias imágenes)
    if (producto.imagenes && producto.imagenes.length > 1) {
      const carousel = card.querySelector('.product-carousel');
      const img = carousel.querySelector('.product-image');
      let idx = 0;
      carousel.querySelector('.gallery-prev').onclick = (e) => {
        e.stopPropagation();
        idx = (idx - 1 + producto.imagenes.length) % producto.imagenes.length;
        img.src = producto.imagenes[idx];
        img.setAttribute('data-idx', idx);
      };
      carousel.querySelector('.gallery-next').onclick = (e) => {
        e.stopPropagation();
        idx = (idx + 1) % producto.imagenes.length;
        img.src = producto.imagenes[idx];
        img.setAttribute('data-idx', idx);
      };
    }

    // Botón añadir al carrito solo añade, no abre popup
    card.querySelector('.btn-add-cart').onclick = (e) => {
      e.stopPropagation();
      addToCart(producto.id, nombre, precio);
    };

    cont.appendChild(card);
  });

  // --- Controles de paginación con numeración completa ---
  // Traducción de botones de paginación
  const anteriorText = currentLang === 'fr' ? 'Précédent' : 'Anterior';
  const siguienteText = currentLang === 'fr' ? 'Suivant' : 'Siguiente';

  let paginacionHtml = '';
  if (paginacion && totalPaginas > 1) {
    paginacionHtml += `<div class="paginacion-productos" style="display:flex;justify-content:center;gap:8px;margin:24px 0 0 0;">`;
    paginacionHtml += `<button ${paginaActual === 1 ? 'disabled' : ''} onclick="cambiarPaginaProductos(-1)">${anteriorText}</button>`;
    for (let i = 1; i <= totalPaginas; i++) {
      paginacionHtml += `<button class="${i === paginaActual ? 'pagina-activa' : ''}" onclick="irPaginaProductos(${i})">${i}</button>`;
    }
    paginacionHtml += `<button ${paginaActual === totalPaginas ? 'disabled' : ''} onclick="cambiarPaginaProductos(1)">${siguienteText}</button>`;
    paginacionHtml += `</div>`;
  }

  // Elimina controles previos si existen
  const prevPag = document.querySelector('.paginacion-productos');
  if (prevPag) prevPag.remove();

  // Inserta la paginación después del contenedor de productos
  if (paginacionHtml) cont.insertAdjacentHTML('afterend', paginacionHtml);
}

// Cambiar página de productos
window.cambiarPaginaProductos = function(dir) {
  paginaActual += dir;
  renderProductos(productosFiltrados, true);
};

// Ir a una página específica
window.irPaginaProductos = function(num) {
  paginaActual = num;
  renderProductos(productosFiltrados, true);
};

// Reiniciar página al buscar o filtrar
document.addEventListener('DOMContentLoaded', function() {
  const searchBar = document.getElementById('search-bar');
  if (searchBar) {
    searchBar.addEventListener('input', function() {
      paginaActual = 1;
      const query = this.value.trim().toLowerCase();
      productosFiltrados = window.productos.filter(producto => {
        const nombre = producto.nombre.toLowerCase();
        const precio = producto.precio.toString();
        return (
          nombre.includes(query) ||
          precio.includes(query)
        );
      });
      renderProductos(productosFiltrados, true);
    });
  }
});

// Llenar menú de categorías
function llenarMenuCategorias() {
  const menu = document.getElementById('menu-categorias');
  if (!menu) return;
  const categorias = Array.from(new Set(productos.map(p => getCategoriaFromImagen(p.imagenes[0]))));
  menu.innerHTML = '';
  categorias.forEach(cat => {
    // Traducción dinámica de la categoría
    let catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (currentLang === 'fr' && window.categorias_fr && window.categorias_fr[cat]) {
      catLabel = window.categorias_fr[cat];
    }
    menu.innerHTML += `<li><a href="#productos" onclick="mostrarCategoria('${cat}'); cerrarMenuCategorias()">${catLabel}</a></li>`;
  });
}

function cerrarMenuCategorias() {
  document.getElementById('menu-categorias').classList.remove('show');
}

function abrirPopupProducto(producto) {
  // Traducción dinámica de campos de producto
  let nombre = producto.nombre;
  let desc = producto.desc;
  let precio = producto.precio;
  if (currentLang === 'fr') {
    nombre = producto.nom || producto.nombre;
    desc = producto.desc_fr || producto.desc;
    precio = producto.prix || producto.precio;
  }

  // Galería de imágenes
  const gallery = document.getElementById('popup-gallery');
  gallery.innerHTML = '';
  let mainImage = document.createElement('img');
  mainImage.src = producto.imagenes[0];
  mainImage.alt = nombre;
  mainImage.style.width = '100%';
  mainImage.style.maxHeight = '220px';
  mainImage.style.objectFit = 'cover';
  mainImage.style.borderRadius = '12px';
  gallery.parentNode.insertBefore(mainImage, gallery);

  producto.imagenes.forEach((img, idx) => {
    const image = document.createElement('img');
    image.src = img;
    image.alt = nombre;
    image.className = idx === 0 ? 'selected' : '';
    image.onclick = () => {
      gallery.querySelectorAll('img').forEach(i => i.classList.remove('selected'));
      image.classList.add('selected');
      mainImage.src = img;
    };
    gallery.appendChild(image);
  });

  // Título, precio y descripción
  document.getElementById('popup-title').textContent = nombre;
  document.getElementById('popup-price').textContent = (currentLang === 'fr' ? 'Prix: ' : 'Precio: ') + (currentLang === 'fr' ? `${precio.toLocaleString()} €` : `Gs. ${precio.toLocaleString()}`);
  document.getElementById('popup-desc').textContent = desc;

  // Añadir al carrito
  document.getElementById('popup-add-cart').textContent = currentLang === 'fr' ? 'Ajouter au panier' : 'Añadir al carrito';
  document.getElementById('popup-add-cart').onclick = function() {
    addToCart(producto.id, nombre, precio);
    cerrarPopupProducto();
  };

  document.getElementById('producto-popup-bg').style.display = 'flex';
}

function cerrarPopupProducto() {
  document.getElementById('producto-popup-bg').style.display = 'none';
  // Limpiar galería e imagen principal del popup
  document.getElementById('popup-gallery').innerHTML = '';
  const mainImage = document.querySelector('#popup-gallery').previousSibling;
  if (mainImage && mainImage.tagName === 'IMG') {
    mainImage.remove();
  }
}

// Cerrar popup al hacer clic en la X o fuera del contenido
document.getElementById('cerrar-popup').onclick = cerrarPopupProducto;
document.getElementById('producto-popup-bg').onclick = function(e) {
  if (e.target.id === 'producto-popup-bg') cerrarPopupProducto();
};

let lightboxImgs = [];
let lightboxIdx = 0;
let zoomLevel = 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

function aplicarZoom() {
  const img = document.getElementById('lightbox-img');
  img.style.transform = `scale(${zoomLevel})`;
  img.style.transition = 'transform 0.2s';
}

document.getElementById('zoom-in').onclick = function(e) {
  e.stopPropagation();
  if (zoomLevel < MAX_ZOOM) {
    zoomLevel += ZOOM_STEP;
    aplicarZoom();
  }
};
document.getElementById('zoom-out').onclick = function(e) {
  e.stopPropagation();
  if (zoomLevel > MIN_ZOOM) {
    zoomLevel -= ZOOM_STEP;
    aplicarZoom();
  }
};

// Mostrar imagen en lightbox solo si se hace clic en la miniatura seleccionada
document.getElementById('popup-gallery').addEventListener('click', function(e) {
  if (
    e.target.tagName === 'IMG' &&
    e.target.classList.contains('selected')
  ) {
    // Obtén todas las imágenes del producto en el popup
    lightboxImgs = Array.from(document.querySelectorAll('#popup-gallery img')).map(img => img.src);
    lightboxIdx = lightboxImgs.indexOf(e.target.src);
    mostrarLightbox(lightboxImgs[lightboxIdx]);
  }
});

function mostrarLightbox(src) {
  const lightboxBg = document.getElementById('lightbox-bg');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = src;
  zoomLevel = 1;
  aplicarZoom();
  lightboxBg.style.display = 'flex';
  actualizarFlechasLightbox();
}

function cerrarLightbox() {
  document.getElementById('lightbox-bg').style.display = 'none';
  document.getElementById('lightbox-img').src = '';
  zoomLevel = 1;
  aplicarZoom();
  lightboxImgs = [];
  lightboxIdx = 0;
}

function navegarLightbox(dir) {
  if (!lightboxImgs.length) return;
  lightboxIdx = (lightboxIdx + dir + lightboxImgs.length) % lightboxImgs.length;
  mostrarLightbox(lightboxImgs[lightboxIdx]);
}

function actualizarFlechasLightbox() {
  document.getElementById('lightbox-prev').style.display = lightboxImgs.length > 1 ? 'flex' : 'none';
  document.getElementById('lightbox-next').style.display = lightboxImgs.length > 1 ? 'flex' : 'none';
}

// Eventos para cerrar y navegar
document.getElementById('cerrar-lightbox').onclick = cerrarLightbox;
document.getElementById('lightbox-bg').onclick = function(e) {
  if (e.target.id === 'lightbox-bg') cerrarLightbox();
};
document.getElementById('lightbox-prev').onclick = function(e) {
  e.stopPropagation();
  navegarLightbox(-1);
};
document.getElementById('lightbox-next').onclick = function(e) {
  e.stopPropagation();
  navegarLightbox(1);
};
// Opcional: navegación con flechas del teclado
document.addEventListener('keydown', function(e) {
  const lightboxBg = document.getElementById('lightbox-bg');
  if (lightboxBg.style.display === 'flex') {
    if (e.key === 'ArrowLeft') navegarLightbox(-1);
    if (e.key === 'ArrowRight') navegarLightbox(1);
    if (e.key === 'Escape') cerrarLightbox();
  }
});

// --- ZOOM Y DRAG EN LIGHTBOX ---

const lightboxImg = document.getElementById('lightbox-img');
let isDragging = false;
let startX = 0, startY = 0, lastX = 0, lastY = 0;

// Doble clic para zoom in/out
lightboxImg.ondblclick = function(e) {
  e.preventDefault();
  if (zoomLevel === 1) {
    zoomLevel = 2;
  } else {
    zoomLevel = 1;
    lightboxImg.style.left = '0px';
    lightboxImg.style.top = '0px';
    lastX = lastY = 0;
  }
  aplicarZoom();
};

// Drag con mouse
lightboxImg.onmousedown = function(e) {
  if (zoomLevel === 1) return;
  isDragging = true;
  startX = e.clientX - lastX;
  startY = e.clientY - lastY;
  document.body.style.cursor = 'grabbing';
};
document.onmousemove = function(e) {
  if (!isDragging) return;
  lastX = e.clientX - startX;
  lastY = e.clientY - startY;
  lightboxImg.style.left = lastX + 'px';
  lightboxImg.style.top = lastY + 'px';
};
document.onmouseup = function() {
  isDragging = false;
  document.body.style.cursor = '';
};

// Touch drag y pinch zoom
let pinchStartDist = 0, pinchStartZoom = 1;
lightboxImg.ontouchstart = function(e) {
  if (e.touches.length === 2) {
    // Pinch zoom
    pinchStartDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    pinchStartZoom = zoomLevel;
  } else if (e.touches.length === 1 && zoomLevel > 1) {
    // Drag
    isDragging = true;
    startX = e.touches[0].clientX - lastX;
    startY = e.touches[0].clientY - lastY;
  }
};
lightboxImg.ontouchmove = function(e) {
  if (e.touches.length === 2) {
    // Pinch zoom
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    let scale = pinchStartZoom * (dist / pinchStartDist);
    scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale));
    zoomLevel = scale;
    aplicarZoom();
  } else if (e.touches.length === 1 && isDragging && zoomLevel > 1) {
    lastX = e.touches[0].clientX - startX;
    lastY = e.touches[0].clientY - startY;
    lightboxImg.style.left = lastX + 'px';
    lightboxImg.style.top = lastY + 'px';
  }
};
lightboxImg.ontouchend = function(e) {
  if (e.touches.length === 0) {
    isDragging = false;
  }
};

// Restablece posición y zoom al cerrar o cambiar imagen
function aplicarZoom() {
  lightboxImg.style.transform = `scale(${zoomLevel})`;
  lightboxImg.style.transition = 'transform 0.2s';
  if (zoomLevel === 1) {
    lightboxImg.style.left = '0px';
    lightboxImg.style.top = '0px';
    lastX = lastY = 0;
  }
}

function abrirPopupProductoDesdeHTML(cardElem) {
  // Recupera el objeto producto desde el atributo data-prod
  const prod = JSON.parse(decodeURIComponent(cardElem.getAttribute('data-prod')));
  abrirPopupProducto(prod);
}

// --- Arrays de productos en español y francés ---
// const productos = [...]; // Español
// const produits = [...];  // Francés





// Mostrar carrito al tocar una vez en móviles
document.addEventListener('DOMContentLoaded', function() {
  const cartIcon = document.querySelector('.cart-icon');
  if (!cartIcon) return;

  // Detectar si es móvil (pantalla <= 900px)
  function isMobile() {
    return window.innerWidth <= 900;
  }

  // Mostrar carrito con un solo toque en móviles
  cartIcon.addEventListener('click', function(e) {
    if (isMobile()) {
      e.stopPropagation();
      toggleCart();
    }
    // En desktop, sigue funcionando el hover/preview normalmente
  });

  // Cerrar el carrito al tocar fuera en móviles
  document.addEventListener('touchstart', function(e) {
    const cartDiv = document.getElementById('cart');
    const modalContent = document.getElementById('cart-modal-content');
    if (
      isMobile() &&
      cartDiv &&
      !cartDiv.classList.contains('hidden') &&
      !modalContent.contains(e.target) &&
      !e.target.closest('.cart-icon')
    ) {
      cartDiv.classList.add('hidden');
    }
  });
});