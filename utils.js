

export const kebabcase=(str)=> str.replaceAll(' ','-');

export const addPurchase =(data) => {
    const purchasedEvent=JSON.parse(localStorage.getItem('purchasedEvent')) || [];
    purchasedEvent.push(data);
    localStorage.setItem('purchasedEvent',JSON.stringify(purchasedEvent));
};