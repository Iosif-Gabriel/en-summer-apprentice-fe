import { usesStyles } from "./styles";
import { kebabcase } from "./utils";

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

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  
  
  fetchTicketEvents().then((data) => {
    addEvents(data);
  });
}

async function fetchTicketEvents() {
  const response = await fetch('http://localhost:8080/getAllEvents');
  const data = await response.json();
  return data;

}

const addEvents = (events) => {
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML = 'No events found.';

  if(events.length) {
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

const createEventElement = (event,title) => {
  const {eventID, eventDescription, eventName, eventStartDate, eventEndDate, venueDTO , eventTypeName ,ticketCategoriesDTO} = event;
  const eventDiv = document.createElement('div');
  const eventWrapperClasses=usesStyles('eventWrapper');
  const actionsWrapperClasses=usesStyles('actionsWrapper');
  const quantityClasses=usesStyles('quantity');
  const inputClasses=usesStyles('input');
  const quantityActionClasses=usesStyles('quantityAction');
  const increseBtnClasses=usesStyles('increaseBtn');
  const decreaseBtnClasses=usesStyles('decreaseBtn');
  const addToCartBtnClasses=usesStyles('addToCartBtn');

  eventDiv.classList.add(...eventWrapperClasses);

  const contentMarkup = `
  <header>
    <h2 class="event-name text-2xl font-bold">${eventName}</h2>
  </header>
      <img src="./src/assets/images/event_${eventID}.png" alt="Event Image" class="event-image">
`;
eventDiv.innerHTML = contentMarkup;


const actions = document.createElement('div');
actions.classList.add(...actionsWrapperClasses);

const categoriesOptions = ticketCategoriesDTO.map(category => `
  <option value="${category.idTicketCategory}">${category.descriptionEventCategory + ' ' + category.price + '$'}</option>
`);

const descSection = createSectionWithIcon('./src/assets/icons/description.png', `<p class="event-description ">${eventDescription}</p>`);

const locationSection = createSectionWithIcon('./src/assets/icons/location.png', `<p class="event-location ">${venueDTO.venueLocation}</p>`);

const ticketSection = createSectionWithIcon('./src/assets/icons/ticket.png', `
  <select id="ticketType" name="ticketType" class="select ${title}-ticket-type text-sm bg-white border border-gray-300 rounded px-2 py-1 ">
    ${categoriesOptions.join('\n')}
  </select>
`);



const allSectionsMarkup = descSection + locationSection + ticketSection;
actions.innerHTML = allSectionsMarkup;



  const quantity = document.createElement('div');
  quantity.classList.add(...quantityClasses);
  
  const input = document.createElement('input');
  input.classList.add(...inputClasses);
  input.type='number';
  input.value='0';
  input.min='0';
  
  input.addEventListener('blur', () => {
    if(!input.value) {
      input.value = 0;
    }
  });
  
  input.addEventListener('input', () => {
    const currentQuantity = parseInt(input.value);
    if(currentQuantity >0){
      addToCart.disabled = false;
    }else {
      addToCart.disabled = true;
    }
  });
  
  quantity.appendChild(input);
  
  const quantityAction=document.createElement('div');
  quantityAction.classList.add(...quantityActionClasses);
  
  const increse=document.createElement('button');
  increse.classList.add(...increseBtnClasses);
  increse.innerText='+';
  increse.addEventListener('click', () => {
    input.value = parseInt(input.value) + 1;
    const currentQuantity = parseInt(input.value);
    if(currentQuantity >0){
      addToCart.disabled = false;
    }else {
      addToCart.disabled = true;
    }
  });
  
  
  const decrese=document.createElement('button');
  decrese.classList.add(...decreaseBtnClasses);
  decrese.innerText='-';
  decrese.addEventListener('click', () => {
    const currentValue = parseInt(input.value);
    if(currentValue >0){
      input.value=currentValue-1;
    }

    const currentQuantity = parseInt(input.value);
    if(currentQuantity >0){
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  });
  
  quantityAction.appendChild(increse);
  quantityAction.appendChild(decrese);
  
  quantity.appendChild(quantityAction);
  actions.appendChild(quantity);
  eventDiv.appendChild(actions);
  
  const eventFooter = document.createElement('footer');
  const addToCart = document.createElement('button');
  addToCart.classList.add(...addToCartBtnClasses);
  addToCart.innerText='Add to cart';
  addToCart.disabled=true;
  
  addToCart.addEventListener('click', () => {
    handleAddToCart(title, eventID, input,addToCart)
  });
  eventFooter.appendChild(addToCart);
  eventDiv.appendChild(eventFooter);

  return eventDiv;
  
}

function createSectionWithIcon(iconSrc, content) {
  const imgIcon = document.createElement('img');
  imgIcon.src = iconSrc;
  imgIcon.alt = 'Icon';
  imgIcon.classList.add(...usesStyles('imgicon'));
  imgIcon.style.height = '25px';
  imgIcon.style.width = '25px';

  return `
    <div class="flex items-center">
      ${imgIcon.outerHTML}
      ${content}
    </div>
  `;
}

const handleAddToCart = (title, id, input, addToCart) => {

  const ticketType = document.querySelector(`.${title}-ticket-type`).value;
  const quantity = input.value;
  console.log(ticketType, quantity,id);
  if (parseInt(quantity) > 0) {
    const idUser = 1; 
    fetch(`http://localhost:8080/createOrder/${idUser}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idEvent: +id,
        ticketCategoryID: +ticketType, 
        numberOfTickets: +quantity,           
        
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        window.alert('Order created successfully!');
      }
      return data;
    })
    .then(data => {
      input.value = 0;
      addToCart.disabled = true;
    })
    .catch(error => {
      console.error('Error creating order:', error);
    });
  }
};


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
