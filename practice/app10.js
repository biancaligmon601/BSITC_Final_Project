// Data model
const hotels = [
  {
    id: 1,
    name: 'Baguio Holiday Villas',
    thumb: "https://ik.imagekit.io/tvlk/apr-asset/Ixf4aptF5N2Qdfmh4fGGYhTN274kJXuNMkUAzpL5HuD9jzSxIGG5kZNhhHY-p7nw/hotel/asset/10017230-566bfab7f8f9dbd274b2ee8621c7fbda.jpeg?_src=imagekit&tr=dpr-2,c-at_max,f-jpg,h-360,pr-true,q-80,w-640",
    rating: 8.4,
    rooms: 50,
    price: 2817.68,
    discount: '15%',
    desc: 'Luxury hotel near Amber Fort',
    amenities: ['Wi-Fi','AC', 'Restaurant', '24-Hour Front Desk'],
    address: '10 Legarda Rd, Baguio, 2600 Benguet'
  },
  {
    id: 2,
    name: 'Abraham Bohol',
    thumb: 'https://pix8.agoda.net/hotelImages/43339694/-1/1b964cc37d31564d76af64f02040c6a8.jpg?ce=0&s=1024x',
    rating: 4.5,
    rooms: 80,
    price: 8000,
    discount: '10%',
    desc: 'Heritage hotel with royal decor',
    amenities: ['Bar', 'Conference Hall', 'Gym', 'Wi-Fi'],
    address: 'Purok 5,Panglao Island, Bohol, Philippines, 6340'
  },

  {
    id: 3,
    name: 'La Carmela de Boracay Hotel',
    thumb: 'https://pix8.agoda.net/hotelImages/82092/-1/7a02b8aec84ddfcc0b15cf3db7773d6a.png?ca=15&ce=1&s=1024x',
    rating: 4.2,
    rooms: 120,
    price: 2000,
    discount: '20%',
    desc: 'Affordable stay with modern amenities',
    amenities: ['Wi-Fi', 'Parking', 'Swimming Pool'],
    address: 'Beachfront, Station 2, Boracay Island, Philippines, 560'}
];

// Also render the country strip (cards using same data for demo)
function renderCountries() {
  const grid = document.getElementById('countryGrid');
  grid.innerHTML = '';
  hotels.forEach(h => {
    const art = document.createElement('article');
    art.className = 'country';
    art.innerHTML = `
      <img src="${h.thumb}" alt="${h.name}">
      <div class="meta">
        <div>
          <strong>${h.name.split(' ')[0].toUpperCase()}</strong><br>
          <small class="place">${h.address}</small>
        </div>
        <div class="price">$${Math.round(h.price/30)}</div>
      </div>
      <div class="moreCircle\"><button class="moreBtn" data-id="${h.id}" aria-label="More Info" title="More Info">More</button></div>
    `;
    grid.appendChild(art);
  });
}

// Hotel list rendering with "More Info" in circle (to match screenshot)
function createHotelCard(h) {
  const el = document.createElement('div');
  el.className = 'hotel-card';
  el.innerHTML = `
    <img src="${h.thumb}" alt="${h.name}">
    <div class="hotel-meta">
      <h4>${h.name}</h4>
      <p>${h.desc}</p>
      <div style="margin-top:8px">
        ${h.amenities.slice(0,3).map(a => `<small style="margin-right:6px;display:inline-block;background:#f2f5f5;padding:6px 8px;border-radius:8px">${a}</small>`).join('')}
      </div>
    </div>
    <div class="hotel-side">
      <div style="color:#0b6b66;font-weight:600">Very Good <span style="background:#eef;padding:6px 8px;border-radius:10px;margin-left:6px">${h.rating}</span></div>
      <div style="color:#d33;margin-top:6px;font-weight:600">${h.rooms} Rooms Left</div>
      <div class="price" style="margin-top:12px">${h.price} Rs / night</div>
    </div>
    <div class="hotel-more">
      <button class="moreBtn btn-ghost" data-id="${h.id}">More Info</button>
    </div>
  `;
  return el;
}

function renderHotels(list = hotels) {
  const container = document.getElementById('hotelList');
  container.innerHTML = '';
  list.forEach(h => container.appendChild(createHotelCard(h)));
}

// Show detail section and populate fields
function showDetail(h) {
  if (!h) return;
  const detail = document.getElementById('detail');
  detail.hidden = false;

  document.getElementById('detailTitle').textContent = h.name;
  document.getElementById('mainPhoto').src = h.thumb;
  document.getElementById('rating').textContent = h.rating;
  document.getElementById('rooms').textContent = h.rooms;
  document.getElementById('price').textContent = h.price;
  document.getElementById('discount').textContent = h.discount;
  document.getElementById('desc').textContent = h.desc;

  // amenities
  const amenList = document.getElementById('amenList');
  amenList.innerHTML = '';
  h.amenities.forEach(a => {
    const li = document.createElement('li');
    li.textContent = a;
    amenList.appendChild(li);
  });

  // Booking card info
  document.getElementById('bookingHotelName').textContent = h.name;
  document.getElementById('bookingAddress').textContent = h.address;
  document.getElementById('bookingThumb').src = h.thumb.replace('/seed/','/seed/thumb');

  // Set some mock dates (you can wire real inputs later)
  document.getElementById('bookingCheckIn').textContent = 'Th 11 Dec 2025';
  document.getElementById('bookingCheckOut').textContent = 'Fri 12 Dec 2025';

  // scroll smoothly
  setTimeout(() => {
    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

// Handlers: More Info (from country or hotel card) -> open detail
function installHandlers() {
  document.addEventListener('click', e => {
    const more = e.target.closest('.moreBtn');
    if (more) {
      const id = Number(more.dataset.id);
      const hotel = hotels.find(h => h.id === id);
      showDetail(hotel);
      return;
    }
  });

  // top Book Now button in sidebar (just show booking form)
  document.getElementById('bookNowTop')?.addEventListener('click', () => {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) bookingForm.scrollIntoView({behavior:'smooth', block:'center'});
  });

  // Register / Login interactions
  document.getElementById('registerBtn')?.addEventListener('click', () => {
    document.getElementById('registerCard').scrollIntoView({behavior:'smooth', block:'center'});
    document.querySelector('#registerCard input')?.focus();
  });
  document.getElementById('loginBtn')?.addEventListener('click', () => alert('Login flow stub'));

  // Booking form: when submitted, show confirmation overlay
  const bookingForm = document.getElementById('bookingForm');
  bookingForm?.addEventListener('submit', e => {
    e.preventDefault();
    // Grab guest details
    const name = document.getElementById('guestName').value || 'Guest';
    const email = document.getElementById('guestEmail').value || '';
    const mobile = document.getElementById('guestMobile').value || '';

    // Show overlay with booking success message
    const overlay = document.getElementById('confirmOverlay');
    const msg = document.getElementById('confirmMsg');
    msg.textContent = `${name}, your booking was successful! We sent confirmation to ${email || 'your email'}.`;
    overlay.hidden = false;
  });

  // Confirm OK to hide overlay
  document.getElementById('confirmOk')?.addEventListener('click', () => {
    document.getElementById('confirmOverlay').hidden = true;
    // optional: clear form
    document.getElementById('bookingForm')?.reset();
  });

  // Basic filters (client-side)
  const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
  checkboxes.forEach(cb => cb.addEventListener('change', () => {
    const active = Array.from(checkboxes).filter(c => c.checked).map(c => c.dataset.filter);
    if (active.length === 0) {
      renderHotels();
      return;
    }
    const filtered = hotels.filter(h => active.every(a => h.amenities.includes(a)));
    renderHotels(filtered);
  }));

  // burger menu toggle
  document.getElementById('burger')?.addEventListener('click', () => {
    const nav = document.querySelector('.main-nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  renderCountries();
  renderHotels();
  installHandlers();
});


