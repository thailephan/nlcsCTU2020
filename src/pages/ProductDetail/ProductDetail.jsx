import React, { Component } from 'react'

import { Alert, Button, Carousel, Col, Divider, Empty, InputNumber, Row, Tabs } from 'antd'
import { LeftOutlined, RightOutlined, ShoppingOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'

import { Link, withRouter } from 'react-router-dom'

import styles from '../styles.module.sass'
import { connect } from 'react-redux'
import ProductCard from '../../components/ProductCard/ProductCard'

import { addProductToCart } from '../../redux/features/Cart/CartSlice'

import { setKeyforSidebar, setPathForSidebar} from '../../redux/features/Sidebar/SidebarSlice'

const { TabPane } = Tabs

class ProductDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messageError: '',
            amount: 1,
            carousel: null,
            isErrorVisible: false,
        }
        this.setCarouselRef = (element) => {
            this.carousel = element
        }
    }

    onClickDecreAmountPlant = () => {
        const {amount} = this.state
        if( amount > 1 )
            this.setState({amount: amount - 1})
    }

    onClickIncreAmountPlant = () => {
        const {amount} = this.state
        this.setState({amount: amount + 1})
    }

    onChangeAmountPlant = (value) => {
        if(value <= 0 || value === '')
           {
            this.setState({amount: 1})
           }
        else this.setState({amount: value})
    }

    componentDidMount () {
        const {setKeyforSidebar, location, match} = this.props
        console.log(match)
        console.log(location)
        setKeyforSidebar( { submenu: '0',  key : 'cc'})
    }

    addToCart =() => {
        const {amount} = this.state

        const { userCart, match, plants } = this.props

        const plant = plants.find((pl) => {
            return pl.MACAYCANH === (match.params.id * 1)
        })
        const plantIndex = userCart.findIndex(plt => {
            return plt.id === plant.MACAYCANH
        })
        
        if( plantIndex >= 0 && userCart[plantIndex].amount + amount > plant.SOCAYTON) {
            this.setState({isErrorVisible: true, messageError: 'Tổng số cây trong giỏ không lớn hơn số cây sẳn có'})
            setTimeout(() => 
                this.setState({isErrorVisible: false}),
                2000)
        }
        else {
            try {
                this.props.addProductToCart({id: plant.MACAYCANH, amount: amount})
                alert("Thêm vào giỏ hàng thành công");
                this.setState({amount: 1})
            } catch (err) {
                alert("Something Went Wrong");
                console.log(err);
            }
        }
      }

    render() {
        const {plants, match, setPathForSidebar} = this.props

        if( plants === [] ) return <div></div>
        else {

        const plant = plants.find((pl) => {
            return pl.MACAYCANH === (match.params.id * 1)
        })
        
        if(plant === undefined) return <div></div>
        setPathForSidebar( {pathname: match.url })

        const { amount, isErrorVisible } = this.state
        return (
            <Row className={styles.flex_left + ' ' + styles.flex_column}>
                    {isErrorVisible === true 
                    ? <Alert
                        style = {{position: "fixed", top: '20px', left: '50%', zIndex: 100}}
                        message="Lỗi"
                        description={this.state.messageError}
                        type="error"
                        showIcon
                    />
                : null 
            }
                <Col className = {styles.flex_start_center} style = {{width: '100%'}}>
                    <Button htmlType = "button" onClick = {() => this.props.history.goBack()} 
                    className = {styles.fbackground}
                    style = {{margin: '20px 0',padding: '20px', height: '100%'}}
                    >
                        <ArrowLeftOutlined size = "large"/>
                        Trở lại trang trước
                    </Button>
                </Col>
                <Divider />
                <Col className={styles.flex_center} >
                    <Button onClick={() => this.carousel.prev()} style={{ width: '48px', height: '48px', margin: '.25em', backgroundColor: '#0005' }} htmlType="button">
                        <LeftOutlined />
                    </Button>
                    <Carousel
                        centerMode
                        ref={this.setCarouselRef}
                        effect = "fade"
                        autoplay
                        autoplaySpeed="50"
                        style={{ width: '35vw' }}
                    >
                        {plant !== undefined && plant.images.length !== 0 ? 
                            plant.images.map((img, index) => (
                                <div key={index}>
                                    <img src={img.DUONGDAN} alt="Plants" style={{ width: '100%', minHeight: '400px', maxHeight: '400px' }} />
                                </div>
                            )) : null
                        }
                    </Carousel>
                    <Button onClick={() => this.carousel.next()} style={{ width: '48px', height: '48px', margin: '.25em', backgroundColor: '#0005' }} htmlType="button">
                        <RightOutlined />
                    </Button>
                </Col>
                <Divider className={styles.m5} />
                <Row>
                    <Col>
                        <p className={styles.h1}>
                            {plant.TENCAYCANH}
                        </p>
                        <br />
                        <div className={styles.flex_center}>
                            <span className={styles.m4}>
                                Giá bán
                            </span>
                            <span className={styles.h2}>
                                {plant.GIANIEMYET}<sup>đ</sup>
                            </span>
                        </div>
                        <Divider />
                        <div className={styles.flex_center}>
                            <span className={styles.m4}>
                                Loại
                            </span>
                            <span className={styles.h3}>
                                {plant.TENLOAI}
                            </span>
                            <span className= {styles.m5}>|</span>
                            <span className={styles.m4}>
                                Sẳn có
                            </span>
                            <span className={styles.h3}>
                                {plant.SOCAYTON}
                            </span>
                        </div>

                        <Divider />
                        <div className={styles.flex_center}>
                            <span className={styles.m4}>
                                Số lượng
                            </span>
                            <Button htmlType = "button" 
                            disabled = {amount === 1}
                            className = {styles.fbackground} 
                            onClick = {this.onClickDecreAmountPlant}>
                                -
                            </Button>
                            <InputNumber max={plant.SOCAYTON} min={1} 
                                value = { amount } 
                                className={styles.m5} 
                                size="large" 
                                onChange = {this.onChangeAmountPlant}
                                defaultValue="1" />
                            <Button htmlType = "button" className = {styles.fbackground} onClick = {this.onClickIncreAmountPlant}>
                                +
                            </Button>
                        </div>
                        
                        <Divider />
                        
                        <div className={styles.flex_center}>
                            <Button
                                htmlType="button"
                                className={styles.sbackground}
                                style={{ height: '60px', fontSize: '20px', padding: '.25rem 1rem', margin: '.25rem' }}
                                icon={<ShoppingCartOutlined />}
                                onClick = {this.addToCart}
                            >Thêm vào giỏ hàng</Button>
                            <Link
                                to = {{
                                    pathname: '/shopping-cart'
                                }}
                            >
                                <Button
                                    htmlType="button"
                                    style={{ height: '60px', fontSize: '20px', padding: '.25rem 1rem', margin: '.25rem' }}
                                    className={styles.fbackground}
                                    icon={<ShoppingOutlined />}
                                >Mua hàng</Button>
                            </Link>
                        </div>
                        
                        <Divider />
                        
                        <div className = {styles.flex_center}>
                            <Tabs tabPosition="left" size = "large"
                                style = {{fontSize: '18px', margin: '5rem', minWidth: '80%', maxWidth: '80%'}}
                            >
                                <TabPane tab="Mô tả ngắn" key="1" >
                                    {plant.MOTANGAN !== null ? plant.MOTANGAN : <Empty description = {'Không tìm thấy'}/>}
                                </TabPane>
                                <TabPane tab="Mô tả chi tiết" key="2">
                                    {plant.MOTACHITIET !== null ? plant.MOTACHITIET : <Empty />}
                                </TabPane>
                            </Tabs>
                        </div>

                        <Divider />

                        <div 
                            className = {styles.flex_center}
                            style = {{width: '80%', margin: '20px auto'}}
                            >
                            <p className = {styles.h2}>
                                Các sản phẩm tương tự
                            </p>
                            <div className = {styles.flex_row + ' ' + styles.flex_center}>
                                {plants.map((item, index) => (
                                    ( index < 5 )
                                    ? <ProductCard plant = {item} key = {index} />
                                    : null
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
                </Row>
            )
        }
    }
}

const mapStateToProps = state => {
    const {plants} = state.product
    const {userCart} = state.cart

    return {userCart, plants}
}

const mapDispatchToProps = {
    addProductToCart,
    setPathForSidebar,
    setKeyforSidebar
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductDetail))