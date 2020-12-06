import { createSlice } from '@reduxjs/toolkit'

import local from '../../../utils/withTokenUser'

const CartSlice = createSlice({
    name: 'cart',
    initialState: {
        userCart: []
    },
    reducers: {

        initCart (state,action) {
            if(local.cart !== null)
                return {userCart: local.cart}
        },

        addProductToCart(state, action) {
            let userCart = {}
            let productFound = state.userCart.find((productInCard) => {
                return productInCard.id === action.payload.id
            })

            if( productFound === undefined) {

                state.userCart = [...state.userCart, action.payload]
                localStorage.setItem('cart', JSON.stringify( state.userCart ))

            } else
            {
                userCart = state.userCart.map((productInCard, _ ) => {  
                    if( productInCard.id === action.payload.id )
                        return { id: action.payload.id, 
                            amount: productInCard.amount + action.payload.amount }
                    else

                    return productInCard
                })

                userCart = userCart.filter((item => {
                    return item.amount !== 0
                }))
                
                localStorage.setItem('cart', JSON.stringify( userCart ))
                
                return { userCart }
            }
        },

        removeProductFromCart(state, action) {

        },
        clearCartAfterPurchase (state, action) {
            return {userCart: []}
        }
    },
})

export default CartSlice.reducer
export const { addProductToCart, removeProductFromCart, initCart, clearCartAfterPurchase} = CartSlice.actions
