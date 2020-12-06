import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from "./features/User/UserSlice";
import productReducer from './features/Product/ProductSlice'
import cardReducer from './features/Cart/CartSlice'
import orderReducer from './features/OrderSlice/OrderSlice'
import sidebarReducer from './features/Sidebar/SidebarSlice'

const rootReducer = combineReducers({
    user: userReducer,
    product: productReducer,
    cart: cardReducer,
    order: orderReducer, 
    sidebar: sidebarReducer 
})

const store = configureStore({
    reducer: rootReducer
})

export default store