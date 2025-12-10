// Utilities
function readBookingsFromStorage(){
  try {
    const raw = localStorage.getItem('mrtravel_bookings');
    return raw ? JSON.parse(raw) : [];
  } catch(e){
    console.error('readBookingsFromStorage', e);
    return [];
  }
}
function writeBookingsToStorage(bookings){
  localStorage.setItem('mrtravel_bookings', JSON.stringify(bookings));
}
function uid(prefix='b'){
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

// Booking handler (call this from DOMContentLoaded or existing installBookingHandler)
const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', function(e){
  e.preventDefault();

  // collect guest fields (update IDs if your inputs use other IDs)
  const guestName  = document.getElementById('guestName').value.trim();
  const guestEmail = document.getElementById('guestEmail').value.trim();
  const guestMobile= document.getElementById('guestMobile').value.trim();

  // collect booking context (hotel fields on page)
  const hotelName = document.getElementById('bookingHotelName').textContent;
  const hotelAddress = document.getElementById('bookingAddress').textContent;
  const checkIn = document.getElementById('bookingCheckIn').textContent || '';
  const checkOut = document.getElementById('bookingCheckOut').textContent || '';
  const price = document.getElementById('price').textContent || '';
  const hotelThumb = document.getElementById('bookingThumb').src || '';

  // create booking object
  const booking = {
    id: uid(),
    createdAt: new Date().toISOString(),
    hotelName,
    hotelAddress,
    checkIn,
    checkOut,
    price,
    guestName,
    guestEmail,
    guestMobile,
    hotelThumb
  };

  // save to localStorage
  const bookings = readBookingsFromStorage();
  bookings.unshift(booking); // newest first
  writeBookingsToStorage(bookings);

  // navigate to bookings page and pass id so bookings page can open details immediately
  window.location.href = `bookings.html?id=${booking.id}`;
});
