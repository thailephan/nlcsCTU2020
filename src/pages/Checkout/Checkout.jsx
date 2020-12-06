import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Button, Input, Divider, Table } from 'antd'

import styles from '../styles.module.sass'
import { Redirect, withRouter } from 'react-router-dom';

import local from '../../utils/withTokenUser'

import axios from 'axios'
import { clearCartAfterPurchase } from '../../redux/features/Cart/CartSlice';
import { updateUserPersonalInfo } from '../../redux/features/User/UserSlice';
import { fetchOrdersforOneUser } from '../../redux/features/OrderSlice/OrderSlice';
import { fetchPlants } from '../../redux/features/Product/ProductSlice';
import { setKeyforSidebar, setPathForSidebar } from '../../redux/features/Sidebar/SidebarSlice';

class Checkout extends Component {

    state = {
        userInfo: {}
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
                return <img src={link} alt="thumbnail" className={styles.logo} />
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
                <div className={styles.flex_center}>
                    <p style={{ width: '50px' }}>
                        {amount}
                    </p>
                </div>
            )
        }, {
            title: 'Tổng',
            render: (record) => {
                const totalPriceForEachPlant = record.SOLUONG * record.GIANIEMYET
                return <p className={styles.h3}>
                    {totalPriceForEachPlant} <sup>đ</sup>
                </p>
            }
        }
    ]


    onPurchaseProduct = async (userInForm) => {
        const {user ,location, 
            token, 
            history,
            plants,
            fetchPlants,
            fetchOrdersforOneUser,
            clearCartAfterPurchase, 
            updateUserPersonalInfo} = this.props
        const cart  = location.state.data
        console.log(user, cart, token, plants)

        try {
            const data = {
                user: {
                    HOTENKH : userInForm.fullname,
                    SDT: userInForm.phone,
                    DIACHI: userInForm.address,
                    MATAIKHOAN: user.MATAIKHOAN,
                    MAKH: user.MAKH,
                },
                cart: cart.map(item => {
                    return {
                        SOCAYTON: plants.find(plant => {
                            return plant.MACAYCANH === item.MACAYCANH
                        }).SOCAYTON,
                        MACAYCANH: item.MACAYCANH,
                        SOLUONG: item.SOLUONG,
                        GIABAN: item.GIANIEMYET
                    }
                }),
                token: token,
                headers: {
                    "x-access-token": token
                }
            }
            const response = await axios.post('/customer/purchase', data)
            console.log(response)
            
            if(response.data.isSuccess === true) {
                alert(`${response.data.message}`)
                local.cart = []
                clearCartAfterPurchase()
                localStorage.removeItem('cart')
                history.push('/order-history')

                const newUpdatedUser = {...user, HOTENKH : userInForm.fullname,
                    SDT: userInForm.phone, DIACHI: userInForm.address }
                    
                updateUserPersonalInfo({user: newUpdatedUser, token: token})
                localStorage.setItem("user", JSON.stringify(newUpdatedUser))
                local.user = localStorage.getItem('user')
                fetchOrdersforOneUser({idUser: user.MATAIKHOAN, token})
                fetchPlants( )

            } else {
                alert(`Có lỗi xảy ra vui lòng tải lại trang và thử lại`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        const { setPathForSidebar, setKeyforSidebar } = this.props
        setPathForSidebar( {pathname: '/shopping-cart' })
        setKeyforSidebar( { submenu: '0',  key : 'gh'})

        const { isAuthentication, history } = this.props
        if (isAuthentication === false) {
            const answer = window.confirm('Cần tài khoản để có thể mua hàng.\nBạn có muốn đăng ký tài khoản để tiếp tục thanh toán')
            if (answer === false) {
                localStorage.setItem('menuselect', JSON.stringify({ ...local.menuselect, item: '/' }))
                history.push('/')
            } else {
                localStorage.setItem('menuselect', JSON.stringify({ ...local.menuselect, item: '/register' }))
                history.push('/register')
            }
        }
    }

    render() {
        const { location, user } = this.props
        if(location.state === undefined) {
            
            return <Redirect to = '/shopping-cart' />
        }
            
        const { total, shippingFee, data } = location.state
        return (
            <div style={{ minHeight: '70vh' }} className={styles.flex_space_center}>
                <p className={styles.h1} style={{ width: '100%' }}>
                    Mua hàng
                </p>
                <Divider />
                <div style={{ width: '100%' }} className = {styles.flex_center}>

                    <Form
                        onFinish = {this.onPurchaseProduct}
                        validateTrigger="onBlur"
                        style={{ width: '30vw', margin: 'auto' }}
                        name="AddUser"
                        labelCol={{ span: 6 }}
                    >
                        <p className={styles.h2}>
                            Kiểm tra thông tin
                            </p>
                        <div>
                            <Form.Item
                                rules={[{
                                    required: true,
                                    message: "Họ tên người dùng không được để trống"
                                }, {
                                    pattern: '^[ a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ|_]+$',
                                    message: 'Họ tên người dùng không chứa số và ký tự đặc biệt',
                                },]}
                                label="Họ và tên"
                                name="fullname"
                                initialValue={user.HOTENKH}
                            >
                                <Input
                                    placeholder='Họ và tên'
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[{
                                    required: true,
                                    message: "Địa chỉ người dùng không được để trống"
                                }, {
                                    pattern: "^[ ,.a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ|_]+$",
                                    message: 'Địa chỉ người dùng không chứa số và ký tự đặc biệt',
                                },]}
                                initialValue={user.DIACHI}

                            >
                                <Input
                                    placeholder='An Khánh, Ninh Kiều, Cần Thơ'
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name={'phone'}
                                rules={[
                                    {
                                        pattern: '^[0-9]{10,12}$',
                                        message: "Số điện thoại chỉ bao gồm số, không gồm chữ cái hoặc ký tự đặc biệt"
                                    }, {
                                        required: true,
                                        message: 'Số điện thoại không được để trống'
                                    }
                                ]}
                                initialValue={user.SDT}
                            >
                                <Input
                                    placeholder='0123456789'
                                    size="large"
                                />
                            </Form.Item>

                        </div>

                        <Button htmlType='submit' className={styles.sbackground}
                            block
                        >
                            Đặt hàng
                            </Button>
                    </Form>
                <div style={{
                    width: '30vw',
                    margin: '10px auto',
                    marginLeft: 'auto',
                    border: '1px solid #0005',
                    padding: '10px'
                }}
                    className={styles.flex_space_center}
                >
                    <div style={{ width: '100%' }}
                        className={styles.flex_space_center}
                    >
                        <span className={styles.h3}>
                            Tổng giỏ hàng
                                </span>
                        <span className={styles.h2}>
                            {total}<sup>đ</sup>
                        </span>
                    </div>
                    <div style={{ width: '100%' }}
                        className={styles.flex_space_center}
                    >
                        <span className={styles.h3}>
                            Phí vận chuyển
                                </span>
                        <span className={styles.h2}>
                            {shippingFee}<sup>đ</sup>
                        </span>
                    </div>

                    <Divider />
                    <div style={{ width: '100%' }}
                        className={styles.flex_space_center}
                    >
                        <span className={styles.h3}>
                            Tổng
                                </span>
                        <span className={styles.h2}>
                            {shippingFee + total}<sup>đ</sup>
                        </span>
                    </div>
                </div>
                </div>
                <Divider />

                <div>
                    <p className = {styles.h2}>Giỏ hàng</p>
                    <Table dataSource={data} columns={this.columns} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { user, token, isAuthentication} = state.user
    const { plants } = state.product

    return { user, token, isAuthentication, plants }
}

const mapDispatchToProps = {
    clearCartAfterPurchase,
    fetchOrdersforOneUser,
    fetchPlants,
    setKeyforSidebar,
    updateUserPersonalInfo,
    setPathForSidebar
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Checkout))
