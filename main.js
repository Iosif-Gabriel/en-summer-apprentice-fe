// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img src="./src/assets/festivalBlack.png" alt="summer">
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}
/*
function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  // Sample hardcoded event data
  const eventData = {
    id: 1,
    description: 'Event description.',
    img: 'https://images.unsplash.com/photo-1505842465776-3b4953ca4f44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    name: 'Event',
    location: 'Event location',
    ticketCategories: [
      { id: 1, description: 'General Admission' },
      { id: 2, description: 'VIP' },
    ],
  };
  // Create the event card element
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card'); 
  // Create the event content markup
  const contentMarkup = `
    <div class="container m-12">
    <div class="card">
        <div class="event-info">
            <h2 class="event-name">${eventData.name}</h2>
            <p class="event-description flex"><img src="./src/assets/description.png" class="img-icon" alt="Description Icon">${eventData.description}</p>
            <p class="event-location flex"><img src="./src/assets/location.png" class="img-icon" alt="Location Icon">${eventData.location}</p>
            <p class="event-ticket-categories flex"><img src="./src/assets/ticket.png" class="img-icon" alt="Ticket Icon">${eventData.ticketCategories.map((category) => category.description).join(', ')}</p>
            <button class="order-button">Order</button>
        </div>
        <img src=${eventData.img} alt="img" class="event-image">
    </div>
</div>
  `;

  eventCard.innerHTML = contentMarkup;
  const eventsContainer = document.querySelector('.events');
  // Append the event card to the events container
  eventsContainer.appendChild(eventCard);
}
*/

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  
  fetch('http://localhost:8080/getAllEvents') // Replace with your actual API endpoint
    .then(response => response.json())
    .then(data => {
      console.log('Received data from the backend:', data);
      const eventsContainer = document.querySelector('.events');
      data.forEach(eventData => {
        const eventCard = createEventCard(eventData);
        eventsContainer.appendChild(eventCard);
      });
    })
    .catch(error => {
      console.error('Error fetching event data:', error);
    });
}

function createEventCard(eventData) {
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');
  const ticketCategoriesMarkup = eventData.ticketCategoriesDTO.map(category => category.descriptionEventCategory).join(', ');


  const contentMarkup = `
    <div class="container m-12">
      <div class="card">
        <div class="event-info">
          <h2 class="event-name">${eventData.eventName}</h2>
        
          <img src="./src/assets/images/event_${eventData.eventID}.png" alt="Event Image" class="event-image">
  
          <p class="event-description flex"><img src="./src/assets/icons/description.png" class="img-icon" alt="Description Icon">${eventData.eventDescription}</p>
          <p class="event-location flex"><img src="./src/assets/icons/location.png" class="img-icon" alt="Location Icon">${eventData.venueDTO.venueLocation}</p>
          <p class="event-ticket-categories flex"><img src="./src/assets/icons/ticket.png" class="img-icon" alt="Ticket Icon">${ticketCategoriesMarkup}</p>
          <button class="order-button">Order</button>
       
    </div>
  `;

  eventCard.innerHTML = contentMarkup;
  return eventCard;
}

function createEventCards(events) {
  const eventsContainer = document.querySelector('.events');

  events.forEach(event => {
    const eventCard = createEventCard(event);
    eventsContainer.appendChild(eventCard);
  });
}


function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
