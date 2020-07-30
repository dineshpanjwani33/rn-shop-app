import React from 'react';
import { Platform, View, SafeAreaView, Button } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import StartupScreen from '../screens/StartupScreen';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductScreen from '../screens/user/UserProductScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import * as authActions from '../store/actions/auth';
import Colors from '../constants/Colors';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : ''
    },
    headerTitleStyle:{
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === "android" ? 'white' : Colors.primary
};

const ProductNavigator = createStackNavigator({
    ProductOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
},{
    navigationOptions: {
        drawerIcon: drawerConfig => <Ionicons 
                                        name={Platform.OS === "android" ? 'md-cart': 'ios-cart'} 
                                        size={23} 
                                        color={drawerConfig.tintColor} 
                                    />
    },
    defaultNavigationOptions: defaultNavOptions
})

const OrderNavigator = createStackNavigator({
    Orders: OrdersScreen
},
{
    navigationOptions: {
        drawerIcon: drawerConfig => <Ionicons 
                                        name={Platform.OS === "android" ? 'md-list': 'ios-list'} 
                                        size={23} 
                                        color={drawerConfig.tintColor} 
                                    />
    },
    defaultNavigationOptions: defaultNavOptions
})

const AdminNavigator = createStackNavigator({
    UserProduct: UserProductScreen,
    EditProduct: EditProductScreen
},
{
    navigationOptions: {
        drawerIcon: drawerConfig => <Ionicons 
                                        name={Platform.OS === "android" ? 'md-create': 'ios-create'} 
                                        size={23} 
                                        color={drawerConfig.tintColor} 
                                    />
    },
    defaultNavigationOptions: defaultNavOptions
})

const ShopNavigator = createDrawerNavigator({
    Products: ProductNavigator,
    Orders: OrderNavigator,
    Admin: AdminNavigator
},{
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {

        const dispath = useDispatch();

        return <View style={{flex: 1, paddingTop: 20}}>
            <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                <DrawerNavigatorItems {...props} />
                <Button title="Logout" color={Colors.primary} onPress={() => {
                    dispath(authActions.logout());
                    // props.navigation.navigate('Auth')
                }} />
            </SafeAreaView>
        </View>
    }
})

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
},{
    defaultNavigationOptions: defaultNavOptions
})

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
})

export default createAppContainer(MainNavigator)