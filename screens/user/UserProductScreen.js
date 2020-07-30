import React from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as productActions from '../../store/actions/products';
import Colors from '../../constants/Colors';

const UserProductScreen = props => {
    const items = useSelector(state => state.products.userProducts);

    const dispatch = useDispatch();

    const editProductHandler = id => {
        props.navigation.navigate('EditProduct', { productId: id })
    }

    const deleteProductHandler = id => {
        Alert.alert('Are you sure?', 'Do you want to delete this product?', [
            {text: 'No', style: "default"},
            {text: 'Yes', style: 'destructive', onPress: () => { dispatch(productActions.deleteProduct(id))}}
        ])
    }

    if(items.length === 0) {
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No products found. Please try to add some products!</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={itemData =>
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        editProductHandler(itemData.item.id)
                    }}
                >
                    <Button
                        color={Colors.primary}
                        title="EDIT"
                        onPress={() => {
                            editProductHandler(itemData.item.id)
                        }} />

                    <Button
                        color={Colors.primary}
                        title="DELETE"
                        onPress={deleteProductHandler.bind(this, itemData.item.id)} />
                </ProductItem>
            }
        />
    );
}

UserProductScreen.navigationOptions = navData => {
    return {
        headerTitle: "Your Products",
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
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Add"
                    iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
                    onPress={() => {
                        navData.navigation.navigate('EditProduct');
                    }}
                />
            </HeaderButtons>
        )
    }
}

export default UserProductScreen;
