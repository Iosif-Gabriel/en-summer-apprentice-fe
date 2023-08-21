import { setEvents, getEvents } from './eventsModule.js';
import { addEvents } from './main.js';
import get from 'lodash/get';
import { filterBack } from './backEndFilter.js';

    export function displayEventsByFilter(events,dropdownElement, filterProperty) {
    
        const selectedValue = dropdownElement.value.toLowerCase();
    
        if (selectedValue !== "") {
          const filteredEvents = events.filter(event => {
            const propertyValue = get(event, filterProperty);
            if (typeof propertyValue === 'string') {
              return propertyValue.toLowerCase().includes(selectedValue);
            }
            
            return false; 
          });
    
          addEvents(filteredEvents);
        } else {
          addEvents(events);
        }
     
    }


    export function filterVenueEventTypes(venueDropDown, typeDropDown) {
      const events = getEvents();
      
      function handleFilter() {
          const selectedVenue = venueDropDown.value.toLowerCase();
          const selectedType = typeDropDown.value.toLowerCase();
          
          if (selectedVenue !== "" && selectedType !== "") {
              const filteredEvents = events.filter(event => {
                  const venueProperty = get(event, "venueDTO.venueLocation");

                  if (typeof venueProperty === 'string') {
                      return venueProperty.toLowerCase().includes(selectedVenue);
                  }
                  return false;
              });
  
              for (const event of filteredEvents) {
                const idVenue = event.venueDTO.idVenue;
            
                if (idVenue !== null) {
                    backFilter(idVenue, selectedType);
                }
            }
          } else if (selectedVenue !== "" && selectedType === "") {
           
            displayEventsByFilter(events,venueDropDown, "venueDTO.venueLocation");
          }else if(selectedVenue === "" && selectedType !== ""){
            displayEventsByFilter(events,typeDropDown, "eventType");
      }else{
        addEvents(events);
      }
    }
  
      venueDropDown.addEventListener("change", handleFilter);
      typeDropDown.addEventListener("change", handleFilter);
  }
  
  


function backFilter(idVenue, selectedType) {
  filterBack(idVenue, selectedType)
    .then(data => {
      if (data.length == 0) {
        const eventsContainer = document.querySelector('.events');
        eventsContainer.innerHTML = '';
        const noEvents = document.createElement('h1');
        noEvents.innerText = 'No events found';
        eventsContainer.appendChild(noEvents);
      } else {
        addEvents(data);
      }

    })
    .catch(error => {
      console.error("Error:", error);
    });
}

