// --- Movie Listing API Fetch (using mock API for demo) ---
document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
  setUpFAQ();
  setUpSubscription();
  setUpCarousel();
});

function fetchMovies() {
  const movieList = document.getElementById('movieList');
  fetch('https://api.tvmaze.com/shows')
    .then(res => res.json())
    .then(data => {
      movieList.innerHTML = '';
      const movies = data.slice(0, 18); 
      movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
          <img src="${movie.image?.medium || 'img/placeholder.jpg'}" alt="${movie.name}">
          <div class="movie-info">
            <div class="movie-title">${movie.name}</div>
            <div class="movie-desc">${movie.summary ? movie.summary.replace(/<[^>]*>/g, '').slice(0,70) + "..." : ""}</div>
          </div>
        `;
        movieList.appendChild(movieCard);
      });
    })
    .catch(() => {
      movieList.innerHTML = "<p>Unable to fetch movies at this time.</p>";
    });
}
function setUpFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.parentElement;
      item.classList.toggle('open');
    });
  });
}
function setUpSubscription() {
  const form = document.getElementById('subscriptionForm');
  const message = document.getElementById('formMessage');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    message.textContent = '';
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
      message.style.color = "#e50914";
      message.textContent = "Please enter a valid email address.";
      return;
    }

    fetch("https://email-subscribe-app.vercel.app/api/subscribe", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email})
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        message.style.color = "#43e51a";
        message.textContent = "Subscribed successfully! 🎉";
        form.reset();
      })
      .catch(() => {
        message.style.color = "#e50914";
        message.textContent = "Failed to subscribe. Please try again.";
      });
  });
}
function setUpCarousel() {
  const cards = document.querySelectorAll('.carousel-card');
  let index = 0;
  let interval;
  function showCard(newIndex) {
    cards.forEach(card => card.classList.remove('active'));
    cards[newIndex].classList.add('active');
    index = newIndex;
  }
  function nextCard() {
    showCard((index + 1) % cards.length);
  }
  interval = setInterval(nextCard, 3000); // Autoplay
  cards.forEach(card => {
    card.addEventListener('click', nextCard);
  });
}
