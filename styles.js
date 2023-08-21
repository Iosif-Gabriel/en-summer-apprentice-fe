const bookOfStyles = {
  purchase: [
    'bg-white',
    'px-4',
    'py-3',
    'sm:border-b',
    'sm:border-white-400',
    'flex',
  ],
  purchaseTitle: [
    'text-lg',
    'font-medium',
    'text-gray-900',
    'flex-1'
  ],

  purchaseTypeWrapper: [
    'flex',
    'flex-row',
    'justify-end',
    'flex-1'
  ],

  purchaseType: [
    'flex',
    'flex-row',
    'justify-end',
    'flex-1'
  ],
  
  
  purchaseDate: [
    'text-center',
    'flex-1',
    'hidden',
    'md:flex'
  ],
  
  purchasePrice: [
    'text-center',
    'w-12',
    'hidden',
    'md:flex'
  ],
  
  actions: [
    'sm:mt-0',
    'sm:text-right',
    'w-28'
  ],
  
  actionButton: [
    'ml-2',
    'text-xl',
    'ps-2',
    'font-medium',
    'underline',
    'text-gray-700'
  ],
  
  purchaseQuantity: [
    'w-[50px]',
    'text-center',
    'py-1',
    'px-2',
    'border',
    'border-orange-700',
    'border-2',
    'disabled:border-0',
    'rounded',
    'text-orange-700',
    'text-sm',
    'leading-tight',
    'font-bold',
    'disabled:text-gray-700',
    'focus:outline-none',
    'focus:shadow-outline'
  ],
  
  purchaseQuantityWrapper: [
    'flex',
    'flex-row',
    'flex-1'
  ],
  eventWrapper: [
    'event',
    'height-300',
    'bg-zinc-500',
    'rounded',
    'shadow-md',
    'p-4',
    'flex',
    'flex-col',
    'm-6',
    'mt-8',
    'overflow-hidden',
    'display-flex',
    'justify-content-space-between',
    'align-items-center',
    'white-space-nowrap',
    'width-300px',
  ],
  actionsWrapper: [
    'actions',
    'flex',
    'items-center',
    'mt-4',
  ],
  quantity: [
    'actions',
    'flex',
    'items-center',
    'mt-4',
  ],
  quantityActions: ['quantity-actions', 'flex', 'space-x-2', 'ml-6'],
  input: [
    'input',
    'w-16',
    'text-center',
    'border',
    'border-gray-300',
    'rounded',
    'py-2',
    'px-4',
    'text-gray-700',
    'focus:outline-none',
    'focus:shadow-outline',
  ],
  quantityActions: [
    'quantity-actions',
    'flex',
    'space-x-2',
    'ml-6'
  ],
  increaseBtn: [
    'increase',
    'px-3',
    'py-1',
    'rounded',
    'bg-black',
    'font-bold',
    'text-white',
    'hover:bg-black-900',
    'disabled:cursor-not-allowed',
    'focus:outline-none',
    'focus:shadow-outline',
  ],
  decreaseBtn: [
    'decrease',
    'px-3',
    'py-1',
    'rounded',
    'bg-white',
    'font-bold',
    'text-black',
    'hover:bg-black-900',
    'disabled:cursor-not-allowed',
    'focus:outline-none',
    'focus:shadow-outline',
  ],
  addToCartBtn: [
    'add-to-cart-btn',
    'px-4',
    'py-2',
    'rounded',
    'text-black',
    'font-bold',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'focus:outline-none',
    'focus:shadow-outline',
    'relative',
    'hover:bg-black-900',
  ],
  deleteButton:[
    'hover:text-red-500',
  ],
  cancelButton: ['hover:text-red-500'],
  saveButton: ['hover:text-green-500'],
  editButton: ['hover:text-blue-500'],
  hidden: ['hidden'],
};

export function usesStyles(type) {
  if (typeof type === 'string') return bookOfStyles[type];
  else {
    const allStyles = type.map(style => bookOfStyles[style]);
    return allStyles.flat();
  }
}

