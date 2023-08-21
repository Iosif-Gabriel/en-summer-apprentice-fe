import { addLoader, removeLoader } from "./loader";

export function deleteOrder(orderId) {
    
    const deleteUrl = `http://localhost:8080/delete-order/${orderId}`;
  
    
    fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      toastr.success('Order deleted successfully!');
      const purchaseToDelete= document.getElementById(`purchase-${orderId}`);
      purchaseToDelete.remove();
      console.log(purchaseToDelete);
      addLoader();
    }).finally(() => {
        
      setTimeout(removeLoader, 500);
    });

  
  }