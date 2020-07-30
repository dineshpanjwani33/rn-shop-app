import PRODUCTS from '../../data/dummy-data';
import { DELETE_PRODUCT, ADD_PRODUCT, UPDATE_PRODUCT, SET_PRODUCTS } from '../actions/products';
import Product from '../../models/product';

const initialState = {
    availableProducts: [],
    userProducts: []
}

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            }

        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(
                    product => product.id !== action.pid),
                availableProducts: state.availableProducts.filter(
                    product => product.id !== action.pid)
            }
        case ADD_PRODUCT:
            const newProduct = new Product(
                action.productData.id,
                action.productData.ownerId, 
                action.productData.title, 
                action.productData.imageUrl, 
                action.productData.description, 
                action.productData.price
            )
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct),
            }
        case UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(
                product => product.id === action.pid
            );
            const updatedProduct = new Product(
                action.pid,
                state.userProducts[productIndex].ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                state.userProducts[productIndex].price,
            )
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[productIndex] = updatedProduct;
            const availableProductIndex = state.userProducts.findIndex(
                product => product.id === action.pid
            );
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProductIndex] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            }
        default:
            return state;
    }
}

export default productReducer;