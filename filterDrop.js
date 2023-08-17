import { setEvents, getEvents } from './eventsModule.js';
import { addEvents } from './main.js';

export function displayEventByVenue() {
    const venueDropdown  = document.getElementById('filter-venue');
    
    const events = getEvents();
    
    venueDropdown.addEventListener("change", function() {
        var selectedValue = venueDropdown.value.toLowerCase();
      
        if (selectedValue !== "") { 
          const filteredEvents = events.filter((event) => event.venueDTO.venueLocation.toLowerCase().includes(selectedValue));
          addEvents(filteredEvents);
        } else{
          addEvents(events);
        }
    });
    }
    
export function displayEventByType() {
      const typeDropdown  = document.getElementById('filter-type');
      const events = getEvents();
    
      typeDropdown.addEventListener("change", function() {
        var selectedValue = typeDropdown.value.toLowerCase();
        if (selectedValue !== "") { 
          const filteredEvents = events.filter((event) => event.eventType.toLowerCase().includes(selectedValue));
          addEvents(filteredEvents);
        } else{
          addEvents(events);
        }
      });
    }


