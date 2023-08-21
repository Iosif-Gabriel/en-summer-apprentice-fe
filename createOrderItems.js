import { addLoader, removeLoader } from "./loader";
import { usesStyles } from "./styles";
import { addPurchase, kebabcase } from "./utils";
import { renderOrdersPage } from "./main";
import { deleteOrder } from "./deleteOrder";
import {updateOrder} from './updateOrder';

export const createOrderItem = (categories, order) => {

  const purchase = document.createElement('div');
  purchase.id = `purchase-${order.idOrder}`;
  purchase.classList.add(...usesStyles('purchase'));

  
  const purchaseTitle = createParagraph(...usesStyles('purchaseTitle'));
  purchaseTitle.innerText = order.eventName;
  purchase.appendChild(purchaseTitle);
  
  const purchaseQuantity = createInput(...usesStyles('purchaseQuantity'));
  purchaseQuantity.type = 'number';
  purchaseQuantity.min = '1';
  purchaseQuantity.value = `${order.numberOfTickets}`;
  purchaseQuantity.disabled = true;
  
  const purchaseQuantityWrapper = createDiv(...usesStyles('purchaseQuantityWrapper'));
  purchaseQuantityWrapper.append(purchaseQuantity);
  purchase.appendChild(purchaseQuantityWrapper);
  
  const purchaseType = createSelect(...usesStyles('purchaseType'));
  purchaseType.setAttribute('disabled', 'true');
  
  const eventTicketCategories = categories.filter(ticketCategory => ticketCategory.event === order.idEvent);

const categoriesOptions = eventTicketCategories.map((ticketCategory) => `
  <option class="text-sm font-bold text-black" value=${ticketCategory.idTicketCategory} ${ticketCategory.idTicketCategory === order.ticketCategoryID ? 'selected' : ''}>
    ${ticketCategory.descriptionEventCategory}
  </option>`
).join('\n');


  purchaseType.innerHTML = categoriesOptions;
  const purchaseTypeWrapper = createDiv(...usesStyles('purchaseTypeWrapper'));
  purchaseTypeWrapper.append(purchaseType);
  purchase.appendChild(purchaseTypeWrapper);

const purchaseDate = createDiv(...usesStyles('purchaseDate'));
purchaseDate.innerText = new Date(order.orderedAt).toLocaleDateString();
purchase.appendChild(purchaseDate);

const purchasePrice = createDiv(...usesStyles('purchasePrice'));
purchasePrice.innerText = order.totalPrice;
purchase.appendChild(purchasePrice);

const actions = createDiv(...usesStyles('actions'));

const editButton = createButton([...usesStyles(['actionButton', 'editButton'])], '<i class="fa-solid fa-pencil"></i>', editHandler);
actions.appendChild(editButton);

const saveButton = createButton([...usesStyles(['actionButton', 'hidden', 'saveButton'])], '<i class="fa-solid fa-check"></i>', saveHandler);
actions.appendChild(saveButton);

const cancelButton = createButton([...usesStyles(['actionButton', 'hidden', 'cancelButton'])], '<i class="fa-solid fa-xmark"></i>', cancelHandler);
actions.appendChild(cancelButton);

const deleteButton = createButton([...usesStyles(['actionButton', 'deleteButton'])], '<i class="fa-solid fa-trash-can"></i>', deleteHandler);
actions.appendChild(deleteButton);
purchase.appendChild(actions);



function createDiv(...classes) {
  const div = document.createElement('div');
  div.classList.add(...classes);
  return div;
}


function createParagraph(...classes) {
  const p = document.createElement('p');
  p.classList.add(...classes);
  return p;
}

function createInput(...classes) {
    const input = document.createElement('input');
    input.classList.add(...classes);
    return input;
  }
  
  function createSelect(...classes) {
    const select = document.createElement('select');
    select.classList.add(...classes);
    return select;
  }
  
  function createButton(classes, innerHTML, handler) {
    const button = document.createElement('button');
    button.classList.add(...classes);
    button.innerHTML = innerHTML;
    button.addEventListener('click', handler);
    return button;
  }
  
  function doNothing() {
    console.log("Hi bye!");
  }


  function editHandler(){
   
    if(saveButton.classList.contains('hidden') && cancelButton.classList.contains('hidden')){
      saveButton.classList.remove('hidden');
      cancelButton.classList.remove('hidden');
      purchaseType.removeAttribute('disabled');
      purchaseQuantity.removeAttribute('disabled');
      deleteButton.classList.add('hidden');
      editButton.classList.add('hidden');
    }
  }

  function cancelHandler(){
    saveButton.classList.add('hidden');
    cancelButton.classList.add('hidden');
    purchaseType.setAttribute('disabled', 'true');
    purchaseQuantity.setAttribute('disabled', 'true');

    purchaseQuantity.value = order.numberOfTickets;
    Array.from(purchaseType.options).forEach(function(element,index){
      if(element.value == order.ticketCategoryID){
        purchaseType.selectedIndex = index;
        return;
      }
    });
    deleteButton.classList.remove('hidden');
    editButton.classList.remove('hidden');
  }

  function saveHandler(){
    const newType=purchaseType.value;
    const newQuantity=purchaseQuantity.value;
    if(newType!= order.ticketCategoryID || newQuantity != order.numberOfTickets){
      addLoader();
      
      updateOrder(order.idOrder, newType, newQuantity)
      .then((response) => {
        if(response.status == 200){
          
         response.json().then((data) => {
      
          order=data;
          purchasePrice.innerHTML = order.totalPrice; 
          purchaseDate.innerHTML = new Date(order.orderedAt).toLocaleDateString();
        });
          
        } else {
          toastr.error('Error updating order');
        }
      }).catch((error) => {
        toastr.error('Error updating order');
      }).finally(() => {
        setTimeout(() => {
          removeLoader();
        }, 200);
      });

    }
    saveButton.classList.add('hidden');
    cancelButton.classList.add('hidden');
    editButton.classList.remove('hidden');
    purchaseType.setAttribute('disabled', 'true');
    purchaseQuantity.setAttribute('disabled', 'true');
    deleteButton.classList.remove('hidden');
  }

  function deleteHandler(){
    deleteOrder(order.idOrder)
  }




  

  return purchase;
};


