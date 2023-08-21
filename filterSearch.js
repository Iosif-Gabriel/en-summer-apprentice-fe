import { setEvents, getEvents } from './eventsModule.js';
import { addEvents } from './main.js';

function liveSearch() {
  const filterInput = document.querySelector('#filter-name');
  const events = getEvents();

  if (filterInput) {
    const searchValue = filterInput.value;
   
    if (searchValue !== undefined) {
      const filteredEvents = events.filter((event) =>
        event.eventName.toLowerCase().includes(searchValue.toLowerCase())
      );
      addEvents(filteredEvents);
    }
  }
}

export function setupFilterEvents() {
  const nameFilterInput = document.querySelector('#filter-name');
  
  if (nameFilterInput) {
    const filterInterval = 500;
    nameFilterInput.addEventListener('keyup', () => {
      setTimeout(liveSearch, filterInterval);
    });
  }
}