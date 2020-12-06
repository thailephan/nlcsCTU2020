import { Alert, Button, Divider, Empty, InputNumber, Table } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CloseOutlined } from '@ant-design/icons'

import { setKeyforSidebar, setPathForSidebar} from '../../redux/features/Sidebar/SidebarSlice'
import { addProductToCart, removeProductFromCart } from '../../redux/features/Cart/CartSlice'

import styles from '../styles.module.sass'
import { Link, withRouter } from 'react-router-dom'

export class ShoppingCart extends Component {
    state = {
        cart: [],
        shippingFee: 0,
        amount: 1,
        isErrorVisible: false, 
        messageError: '',
    }

    columns = [
        {
            title: 'STT',
            dataIndex: 'STT',
            align: 'center'
        }, {
            title: 'Tên cây cảnh',
            dataIndex: 'TENCAYCANH',
            align: 'center'
        }, {
            title: 'Hình ảnh',
            dataIndex: 'HINHANH',
            render: link => {
                return <img src = {link} alt = "thumbnail" className = {styles.logo}/>
            },
            align: 'center'
        }, {
            title: 'Giá cây cảnh',
            dataIndex: 'GIANIEMYET',
            align: 'center'
        }, {
            title: 'Số lượng',
            dataIndex: 'SOLUONG',
            align: 'center',
            render: (amount, record) => (
                <div className = {styles.flex_center}>
                    <Button htmlType = "button" className = {styles.sbackground}
                    onClick = {() => this.onMinusItem(record, 1)}
                    // disabled = {amount === 1 ? true : false }
                     style = {{width: '40px', height: '40px', textAlign: 'center', margin: '10px'}}>
                        -
                    </Button>
                    
                    <InputNumber min = {1} 
                            max = {record.SOCAYTON}
                            size = "large" 
                            defaultValue = {1}
                            value = {amount}
                            onChange = {(value) => this.onChangeItem(record, value)}
                            onBlur = {() => this.onUpdateItemNumber(record)}
                            style = {{width: '50px'}}
                        />

                    <Button htmlType = "button" type = "primary"
                    onClick = {() => this.onAddItem(record)}
                     style = {{width: '40px', height: '40px', textAlign: 'center', margin: '10px'}}>
                        +
                    </Button>
                </div>
            )
        }, {
            title: 'Tổng',
            render: (record) => {
                const totalPriceForEachPlant = record.SOLUONG * record.GIANIEMYET
                return <p className = {styles.h3}>
                    {totalPriceForEachPlant} <sup>đ</sup>
                </p>
            }
        }, {
            title: 'Xóa',
            render: (record) => {

                return (
                    <p onClick = {() => this.removeProductFromCart(record)} style = {{cursor: "pointer"}}>
                        <CloseOutlined size = "large"/>
                    </p>
                )
            }
        }
    ]

    removeProductFromCart = (record) => {
        const answer = window.confirm("Bạn có chắc muốn xóa sản phẩm")
            if(answer === false) return
        this.props.addProductToCart({id: record.MACAYCANH, amount: - record.SOLUONG})
        this.setState({amount: 1})
    }

    onUpdateItemNumber = (record) => {
        if( this.state.amount > record.SOCAYTON) {
            this.props.addProductToCart({
                id: record.MACAYCANH, 
                amount: record.SOCAYTON - record.SOLUONG
            })
            this.setState({isErrorVisible: true, amount: record.SOCAYTON,
                messageError: 'Số cây trong giỏ không lớn hơn số cây sẳn có'})
                setTimeout(() => 
                this.setState({isErrorVisible: false}),
                2000)
            } else if( this.state.amount <= 0 ) {
                this.removeProductFromCart(record)
            }
            else 
            {
                this.props.addProductToCart({id: record.MACAYCANH, amount: this.state.amount - record.SOLUONG})
                this.setState({amount: this.state.amount})
            }
    }

    onChangeItem = (record, value) => {
        this.setState({amount: value})
    }

    onMinusItem = (record) => {
        if(record.SOLUONG <= 1) {
            const answer = window.confirm("Bạn có chắc muốn xóa sản phẩm")
            console.log(answer)
            if(answer === false) return
        }
        this.props.addProductToCart({id: record.MACAYCANH, amount: - 1})
        this.setState({amount: record.SOLUONG - 1})
    }
    
    onAddItem = (record) => {
        if( record.SOLUONG >= record.SOCAYTON) {
            this.setState({isErrorVisible: true, 
                messageError: 'Số cây trong giỏ không lớn hơn số cây sẳn có'})
            setTimeout(() => 
                this.setState({isErrorVisible: false}),
                2000)
        } else {
            this.props.addProductToCart({id: record.MACAYCANH, amount: 1})
            this.setState({amount: record.SOLUONG + 1})
        }
    }
    
    componentDidMount() {
        window.scrollTo(0, 0)
        
        const { setPathForSidebar, setKeyforSidebar, location } = this.props
        setPathForSidebar( {pathname: location.pathname })
        setKeyforSidebar( { submenu: '0',  key : 'gh'})
    }

    render() {
        let total = 0
        const {userCart, plants} = this.props

        const { isErrorVisible, messageError } = this.state
        const data = userCart.map((item, _) => {
            const plant = plants.find(plt => {
                return plt.MACAYCANH === item.id
            })
            
            if(plant !== undefined) {
                total += plant.GIANIEMYET * item.amount
                return (
                    {
                        STT: _ + 1,
                        key: _ + 1,
                        TENCAYCANH: plant.TENCAYCANH, 
                        HINHANH: plant.images[0].DUONGDAN,
                        GIANIEMYET: plant.GIANIEMYET,
                        SOLUONG: item.amount,
                        SOCAYTON: 1 * plant.SOCAYTON,
                        MACAYCANH: plant.MACAYCANH
                    }
                )
            }
            return undefined
        })

        return (
            <div style = {{minHeight: '70vh'}}>
               <p className = {styles.h1} 
                style = {{padding: '30px'}}
               >Giỏ hàng</p>
               {isErrorVisible === true 
                    ? <Alert
                        style = {{position: "fixed", top: '20px', left: '50%', zIndex: 100}}
                        message="Lỗi"
                        description={messageError}
                        type="error"
                        showIcon
                    />
                : null 
            }
               <div className = {styles.flex_center}>
                   {data.length !== 0 && data[0] !== undefined ?
                    <Table dataSource = {data} columns = {this.columns} />
                    : <Empty description = "Giỏ hàng của bạn đang rỗng" />
                    }
               </div>
               {total === 0 ? <div></div>
                :
                    <div style = {{width: '50%', 
                            margin: '10px', 
                            marginLeft: 'auto', 
                            border: '1px solid #0005',
                            padding: '10px'
                        }}
                        className = {styles.flex_space_center}
                    >
                        <div style = {{width: '100%'}}
                            className = {styles.flex_space_center}
                        >
                                <span className = {styles.h3}> 
                                    Tổng giỏ hàng
                                </span>
                                <span className = {styles.h2}>
                                    {total}<sup>đ</sup>
                                </span>
                        </div>
                        <div style = {{width: '100%'}}
                            className = {styles.flex_space_center}
                        >
                                <span className = {styles.h3}> 
                                    Phí vận chuyển
                                </span>
                                <span className = {styles.h2}>
                                    {this.state.shippingFee}<sup>đ</sup>
                                </span>
                        </div>
                          
                        <div style = {{width: '100%'}}
                            className = {styles.flex_space_center}
                        >
                                <span className = {styles.h3}> 
                                    Tổng
                                </span>
                                <span className = {styles.h2}>
                                    {this.state.shippingFee + total}<sup>đ</sup>
                                </span>
                        </div>
                          
                   <Divider />
                   <div>
                       <Link
                       to = {{
                        pathname: '/check-out',
                        state: {total: total, shippingFee: this.state.shippingFee, data: data}
                       }}
                       >
                       <Button htmlType = {'button'} type = "primary"
                        style = {{width: '20vw', height: '64px', 
                        fontSize: '18px', marginTop: '5vh'}}
                //         onClick = { () => {
                // localStorage.setItem('menuselect', JSON.stringify({...JSON.parse(localStorage.getItem('menuselect')), 
                //     item: 'tc'})) 
                //         }}
                        >
                            Mua hàng
                       </Button>
                       </Link>
                   </div>
               </div>
            }
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    const {userCart} = state.cart
    const {plants} = state.product

    return {userCart, plants}
}


const mapDispatchToProps = {
    addProductToCart,
    removeProductFromCart,
    setPathForSidebar,
    setKeyforSidebar
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter( ShoppingCart ))
