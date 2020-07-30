import Order from "../../models/order";

export const ADD_ORDERS = 'ADD_ORDERS';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async (dispatch, getState) => {

        try {
            const userId = getState().auth.userId;
            const response = await fetch(`https://rn-shop-apps.firebaseio.com/orders/${userId}.json`)

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();

            const loadedOrders = [];

            for (const key in resData) {
                loadedOrders.push(new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].date)
                ))
            }

            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders
            })
        }
        catch (err) {
            throw err;
        }
    }
}

export const addOrders = (cartItems, totalAmount) => {

    return async (dispatch, getState) => {
        const date = new Date();
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        // console.log("Tokenssss: ",token);
        const response = await fetch(`https://rn-shop-apps.firebaseio.com/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString()
            })
        })

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();

        console.log("Order screen: ",resData);

        dispatch({
            type: ADD_ORDERS,
            orderData: {
                id: resData.name,
                items: cartItems,
                amount: totalAmount,
                date: date
            }
        })
    }
}