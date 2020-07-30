import React, {useState, useEffect } from 'react';
import { FlatList, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';

import * as orderActions from '../../store/actions/orders';
import OrderItem from '../../components/shop/OrderItem';
import Colors from '../../constants/Colors';

const OrderScreen = props => {

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const orderItems = useSelector(state => state.orders.orders);

    useEffect(() => {
        setIsLoading(true);
        dispatch(orderActions.fetchOrders()).then(() => {
            setIsLoading(false);
        });
    }, [dispatch])

    if(isLoading){
        return(
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        )
    }

    if(orderItems.length === 0) {
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No orders found. Please try to do some shopping!</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={orderItems}
            keyExtractor={item => item.id}
            renderItem={itemData =>
                <OrderItem 
                    amount = {itemData.item.amount} 
                    date={itemData.item.readableDate} 
                    items={itemData.item.orderItems} 
                />
            }
        />
    )
}

OrderScreen.navigationOptions = navData => {
    return {
        headerTitle: "Your Orders",
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default OrderScreen;