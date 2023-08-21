export async function filterBack(idVenue, eventTypeName) {
    try {
      const response = await fetch(`http://localhost:8080/getEventsByVenueAndEventType?idVenue=${idVenue}&eventTypeName=${eventTypeName}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }