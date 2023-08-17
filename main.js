import { usesStyles } from "./styles";
import { addPurchase, kebabcase } from "./utils";
import { addLoader, removeLoader } from "./loader";
import { createOrderItem } from "./createOrderItems";
import { createEventElement } from "./createEventElement";
import { setEvents, getEvents } from './eventsModule.js';
import { setTickets, getTickets } from "./ticketsModule";
import {setupFilterEvents} from "./filterSearch";
import {displayEventByVenue, displayEventByType} from "./filterDrop";
import { getTicketsCategory } from "./getTicket";
// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <video autoplay loop muted playsinline mt-4>
        <source src="./src/assets/videos/introVideo.mp4" type="video/mp4">
      </video>
      <div class="flex flex-col items-center">
        <div class="w-80" >
          <h1>Explore Events</h1>
          <div class="filters flex flex-col text-black font-bold ">
            <input type="text" id="filter-name" placeholder="Filter by name" class="px-4 mt-4 mb-2 py-2 border " />
            <select id="filter-type" class="filter-select px-4 py-2 border rounded-lg">
            <option value="">All Types</option>
            
          </select>
          <select id="filter-venue" class="filter-select px-4 py-2 border rounded-lg mt-4">
                <option value="">All Venues</option>
              </select>
           
          </div>
        </div>
      </div>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
      <div class="cart"></div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
  <div id="content" class="w-2/3 mx-auto">
  <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
  <div class="purchases">
    <div class="px-2 py-2 gap-x-2 flex font-bold text-white">
      <button class="mr-10 text-center justify-center" id="sorting-button-1">
        <span>Name</span>
        <i class="fa-solid fa-arrow-up-wide-short text-x1" id="sorting-icon-1"></i>
      </button>
      <span class="flex-1">Nr tickets</span>
      <span class="flex-1">Category</span>
      <span class="flex-1">Date</span>
      <button class="md:flex text-center justify-center" id="sorting-button-2">
        <span>Price</span>
        <i class="fa-solid fa-arrow-up-wide-short text-x1" id="sorting-icon-2"></i>
      </button>
      <span class="w-12 sm:w-4"></span>
    </div>
    <div id="purchases-content">
    </div>
  </div>
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


function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

 
  addLoader();
  setupFilterEvents();
  
  fetchTicketEvents().then((data) => {
    setEvents(data);

    const { venueArray, eventTypeArray } = getVennueEventTypes();

    updateDropdowns(venueArray, eventTypeArray);
    displayEventByVenue();
    displayEventByType();

    setTimeout(() => {
      removeLoader();
    }, 500);

    addEvents(data);
  });
}

async function fetchTicketEvents() {
  const response = await fetch('http://localhost:8080/getAllEvents');
  const data = await response.json();
  return data;

}

async function fetchOrdersCustomer() {
  const userId = 1;
  const response = await fetch(`http://localhost:8080/customer-orders/${userId}`);
  const orders = await response.json();
 
  return orders;
}


export const addEvents = (events) => {
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML = '';

  if(events.length) {
    eventsContainer.innerHTML = '';
    events.forEach(event => {
      const eventCard = createEvent(event);
      eventsContainer.appendChild(eventCard);
    });
  }

}

const createEvent= (eventData) => {
  const title=kebabcase(eventData.eventName);
  
  const eventElement = createEventElement(eventData,title);
  return eventElement;
}


export function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  const purchasesDiv = document.querySelector('.purchases');
  const purchasesContent = document.getElementById('purchases-content');


  addLoader();

  if (purchasesDiv) {
    fetchOrdersCustomer().then(orders => {
      if (orders.length) {
        setTimeout(() => {
          removeLoader();
        }, 200);

        orders.forEach(order => {
        
          const newOrder = createOrderItem(categories, order);
          purchasesContent.appendChild(newOrder);
        });

        purchasesDiv.appendChild(purchasesContent);
      } else {
        removeLoader();
      }
    });
  }
}


function getVennueEventTypes() {
  const events = getEvents();
  const venueArray = Array.from(new Set(events.map(event => event.venueDTO.venueLocation.split(',')[1])));
  const eventTypeArray = Array.from(new Set(events.map(event => event.eventType)));

  return {
    venueArray,
    eventTypeArray
  };
}


function updateDropdowns(venueArray, eventTypeArray) {
  const venueOptionsHTML = generateDropdownOptions(venueArray);
  const eventTypeOptionsHTML = generateDropdownOptions(eventTypeArray);

  const venueSelect = document.getElementById('filter-venue');
  const eventTypeSelect = document.getElementById('filter-type');

  if (venueSelect) {
    venueSelect.innerHTML = `<option value="">All Venues</option>${venueOptionsHTML}`;
  }

  if (eventTypeSelect) {
    eventTypeSelect.innerHTML = `<option value="">All Types</option>${eventTypeOptionsHTML}`;
  }
}

function generateDropdownOptions(optionsArray) {
return optionsArray.map(option => `<option value="${option}">${option}</option>`).join('');
}
// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    getTicketsCategory().then(categories => {
      renderOrdersPage(categories);
    }).catch(error => {
      console.log(error);
    } );
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
