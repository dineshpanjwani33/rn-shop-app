import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Button, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';

const ProductsOverviewScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();

    const dispatch = useDispatch();

    const displayedProducts = useSelector(state => state.products.availableProducts)

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        })
    }

    const loadProducts = useCallback( async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts())
        }
        catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false)
    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
        return () => {
            willFocusSub.remove();
        }

    }, [loadProducts])

    useEffect(() => { 
        setIsLoading(true);
        loadProducts().then(() =>{
            setIsLoading(false)
        });
    }, [dispatch, loadProducts])

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        )
    }

    if(error){
        return (
            <View style={styles.centered}>
                <Text>An error occured! Please try again</Text>
                <Button title="Try Again" color={Colors.primary} onPress={loadProducts} />
            </View>
        )
    }

    if (!isLoading && displayedProducts.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found. Please try to add some products</Text>
            </View>
        )
    }

    return <FlatList
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={displayedProducts}
        keyExtractor={item => item.id}
        renderItem={itemData =>
            <ProductItem
                title={itemData.item.title}
                price={itemData.item.price}
                image={itemData.item.imageUrl}
                onSelect={() => {
                    selectItemHandler(itemData.item.id, itemData.item.title);
                }}
            >
                <Button
                    color={Colors.primary}
                    title="VIEW DETAILS"
                    onPress={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }} />

                <Button
                    color={Colors.primary}
                    title="ADD TO CART"
                    onPress={() => {
                        dispatch(cartActions.addToCart(itemData.item))
                    }} />
            </ProductItem>
        }
    />
}

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: "All Products",
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
        ),

        headerRight: () =>
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Cart"
                    iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
                    onPress={() => {
                        navData.navigation.navigate('Cart')
                    }}
                />
            </HeaderButtons>
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductsOverviewScreen;