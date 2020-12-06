import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'axios'

const fetchOrdersforOneUser = createAsyncThunk('order/fetchOrders',
    async (user) => {
        try {
            const orderResponse = await axios.get(`/customer/order/${user.idUser}`, {
                    headers: { "x-access-token": user.token }
            })
            const orderData = orderResponse.data
            
            return {orders: orderData}
        } catch (err) {
            console.log(err)
        }
    }
)


const OrderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: []
    },
    reducers: {

    },
    extraReducers: {
        [fetchOrdersforOneUser.fulfilled] : (state,action) => {
            const { orders } = action.payload
            let groupedOrders = []
            let OrderCodePositionInGroupedOrders = []
            orders.forEach((order) => {
                const OrderCodeIndex = OrderCodePositionInGroupedOrders.findIndex((orderCode) => {
                    return order.MADONHANG === orderCode
                })
                // console.log(OrderCodeIndex)
                if(OrderCodeIndex < 0) {
                    groupedOrders.push({
                        MADONHANG: order.MADONHANG,
                        TENTINHTRANG: order.TENTINHTRANG,
                        NGAYDATHANG: order.NGAYDATHANG,
                        NGAYGIAOHANG: order.NGAYGIAOHANG,
                        DSCAYCANH: [{
                            TENCAYCANH: order.TENCAYCANH,
                            MACAYCANH: order.MACAYCANH,
                            SOLUONG: order.SOLUONG,
                            GIABAN: order.GIABAN
                        }]
                    })
                    OrderCodePositionInGroupedOrders.push(order.MADONHANG)
                    // console.log(OrderCodePositionInGroupedOrders)
                } else {
                    groupedOrders[OrderCodeIndex]
                    .DSCAYCANH.push({
                        TENCAYCANH: order.TENCAYCANH,
                        SOLUONG: order.SOLUONG,
                        GIABAN: order.GIABAN,
                        MACAYCANH: order.MACAYCANH,
                    })
                }
            })


            return { orders: groupedOrders }
        }
    }    
})

export { fetchOrdersforOneUser }
export default OrderSlice.reducer
