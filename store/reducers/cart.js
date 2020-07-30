import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import CartItem from '../../models/cartItem';
import { ADD_ORDERS } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0
}

export default (state = initialState, action) => {
    switch(action.type){
        case ADD_TO_CART:
            const addedProduct = action.product;
            const productPrice = addedProduct.price;
            const productTitle = addedProduct.title;
            
            let updateOrNewCartItem;

            if(state.items[addedProduct.id]){
                updateOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    productPrice,
                    productTitle,
                    state.items[addedProduct.id].sum + productPrice
                )
            }
            else{
                updateOrNewCartItem = new CartItem(1, productPrice, productTitle, productPrice );      
            }
            return {
                ...state,
                items: {
                    ...state.items,
                    [addedProduct.id]: updateOrNewCartItem
                },
                totalAmount: state.totalAmount + productPrice
            }
        
        case REMOVE_FROM_CART:
            const selectedItem = state.items[action.pid];
            const currentQuantity = selectedItem.quantity;

            let updatedCartItems;

            if(currentQuantity > 1){
                const updatedCartItem = new CartItem(
                    selectedItem.quantity - 1, 
                    selectedItem.productPrice, 
                    selectedItem.productTitle,
                    selectedItem.sum - selectedItem.productPrice
                );
                updatedCartItems = {...state.items, [action.pid]: updatedCartItem};
            }
            else{
                updatedCartItems = {...state.items};
                delete updatedCartItems[action.pid];
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedItem.productPrice
            };
            case ADD_ORDERS:
                return initialState;
            case DELETE_PRODUCT:
                if(!state.items[action.pid]){
                    return state;
                }
                const updateItems = {...state.items};
                const amount = state.items[action.pid].sum;
                delete updateItems[action.pid];
                return {
                    ...state,
                    items: updateItems,
                    totalAmount: state.totalAmount - amount
                }
        default:
            return state
    }
}