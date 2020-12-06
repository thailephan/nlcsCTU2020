import { Button, Divider, Empty, Tag } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { fetchOrdersforOneUser } from '../../redux/features/OrderSlice/OrderSlice'

import styles from '../styles.module.sass'


const ThumbnailProductCart = ( { plant, image } ) => (
    <div style = {{width: '20vw'}} className = {styles.flex_center}>
            <NavLink to = {{
                pathname: `/products/details/${plant.MACAYCANH}`
            }
            }>
                <img src = {image.DUONGDAN} 
                alt = "thumbnails for Plants" 
                style = {{width: '150px', minHeight: '150px', maxHeight: '150px'}}
                className = {styles.m5}
                />
            </NavLink>
        <div style = {{width: '80%',  borderBottom: '.25px solid #9999',}}>
            <p className = {styles.h3}>{plant.TENCAYCANH}</p>
            <div className = {styles.flex_space_center + ' ' + styles.m5}>
                <div>
                    <p className = {styles.h5} style = {{fontSize: '1em'}}>Giá bán</p>
                    <p className = {styles.h3}>{plant.GIABAN}<sup>đ</sup></p>
                </div>
                <div>
                    <p className = {styles.h5} style = {{fontSize: '1em'}}>Số lượng</p>
                    <p className = {styles.h3}>{plant.SOLUONG}</p>
                </div>
            </div>
        </div>
    </div>
)

const PlantInOrderCard = ( {NGAYDATHANG, NGAYGIAOHANG, total, images, order, _} ) => (
    <div
        style = {{ width: '80%' }}
        className = { styles.m5 + ' ' + (_ % 2 === 0 ? styles.plant_in_Order_Card_left : styles.plant_in_Order_Card_right)}>
            <div className = {styles.flex_center}>
                <div className = {styles.h2}>#{_  + 1}</div>
                <span style = {{padding: '10px'}}>|</span>
                <Tag color= 'green'>{order.TENTINHTRANG}</Tag>
            </div>
            <div className = {styles.flex_center}>
                <div>
                    <div className = {styles.h4}>Ngày đặt hàng</div>
                    <div className = {styles.h3}>{NGAYDATHANG}</div>
                </div>
                <span style = {{padding: '10px'}}>|</span>
                <div>
                    <div className = {styles.h4}>Ngày giao dự kiến</div>
                    <div className = {styles.h3}>{NGAYGIAOHANG}</div>
                </div>
            </div>
            <div className = {styles.flex_space_center + ' ' + styles.m5}>
                {order.DSCAYCANH.map(
                    (plant, index) => {
                    const image = images.find(img => {
                        return plant.MACAYCANH === img.MACAYCANH
                    })
                    total += plant.SOLUONG * plant.GIABAN
                    return <ThumbnailProductCart 
                    key = {index}
                    plant = { plant } 
                    image = {image} />
                })}
            </div>
            <div>
                <div>
                    <p className = {styles.h4}>Phí vận chuyển</p>
                    <p className = {styles.h3}>0<sup>đ</sup></p>
                </div>
                <p className = {styles.h4}>Tổng đơn hàng</p>
                <p className = {styles.h3}>{total}<sup>đ</sup></p>
            </div>
            <Divider />
    </div>
)

class OrderHistory extends Component {
    state = {
        total: 0,
        currentPage: 1,
    }

    async componentDidMount() {
        const { orders } = this.props
        this.setState({ total: Math.ceil(orders.length / 3) })
    }

    handleChangePagination = (page) => {
        this.setState({currentPage: page});
        window.scrollTo(0, 0)
    }

    render() {
        const pagination = []
        const { currentPage, total } = this.state
        const { orders, images } = this.props

        for (let index = 1; index <= total; index++) {
            let className = index === currentPage ? styles.fbackground : '' ;
            pagination.push(
                <Button type = "primary"
                    htmlType = 'button' key = {index}
                    className = {className}
                    style = {{margin: '5px', width: '48px', height: '48px'}}
                    onClick = {() => this.handleChangePagination(index)}
                    >
                    {index}
                </Button>
            )            
        }

        return (
            <div className = {styles.flex_center} style = {{minHeight: '80vh'}}>
                <p className = {styles.h1}>
                    Lịch sử đơn hàng
                </p>

                {orders !== undefined && images !== undefined
                ? orders.map((order, _) => {
                    let total = 0

                    let NGAYDATHANG = new Date(order.NGAYDATHANG).toISOString().slice(0, 10)                    
                    let NGAYGIAOHANG = new Date(order.NGAYGIAOHANG).toISOString().slice(0, 10)                    
                    return (
                        (_ < currentPage * 3 && _ >= (currentPage - 1) * 3 ) ? (
                            <PlantInOrderCard
                            key = {_}
                            _ = {_}
                            total = { total } 
                            images = {images} 
                            order = { order }
                            NGAYGIAOHANG = {NGAYGIAOHANG} 
                            NGAYDATHANG = {NGAYDATHANG} 
                        />
                        ) : null
                    )
                }) : <Empty description = "Bạn chưa có đơn hàng đã đặt" />
            } 
            
            {
            <div style = {{width:'100%'}} className = {styles.flex_center + ' ' + styles.m5}>
                {pagination}
            </div>
            }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  const { user , token } = state.user
  
  const { images } = state.product
  
  const {orders } = state.order 

    return {user, token, orders, images}
}

const mapDispatchToProps = {
    fetchOrdersforOneUser
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory)
