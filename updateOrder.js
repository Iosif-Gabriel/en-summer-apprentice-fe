export function updateOrder(orderId, newType, newQuantity) {
 return   fetch(`http://localhost:8080/update-order/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ticketCategoryID: newType,
            numberOfTickets: newQuantity,
        })
    }).then(response => 
        { 
            if(response.status === 200){
               toastr.success('Order updated successfully');
            } else {
                toastr.error('Error updating order');
            }

            return response;
        }).catch(error => {
           throw new Error(error);
        });
}