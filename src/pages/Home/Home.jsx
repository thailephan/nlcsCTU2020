import React, { Component } from 'react'
import { ArrowDownOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

import styles from '../styles.module.sass'
import SearchBar from '../../components/SearchBar/SearchBar';
import { Button, Divider } from 'antd';
import { Link, withRouter } from 'react-router-dom';

import { setKeyforSidebar, setPathForSidebar} from '../../redux/features/Sidebar/SidebarSlice'

class Home extends Component {
    componentDidMount() {
        window.scrollTo(0, 0)
        const { setPathForSidebar, setKeyforSidebar, location } = this.props
        setPathForSidebar( {pathname: location.pathname })
        setKeyforSidebar( { submenu: '0',  key : 'tc'})
    }
    
    render () {
            return (
                <div className = {styles.flex_center}>
                    
                    <div
                        className = {styles.flex_center}
                    >
                        <div
                            className = {styles.home_banner}
                        >
                            <img src = {require('../../img/banner/banner1.jpg')} alt = "Banner 1" 
                                className = {styles.img_banner}
                            />
                            
                            <div className = {styles.hover_banner}>
                                <p>
                                    Welcome to <ArrowRightOutlined />
                                </p>
                            </div>
                        </div>
                        <div
                            className = {styles.home_banner}
                        >
                            <img src = {require('../../img/banner/banner2.jpg')} alt = "Banner 1" 
                                className = {styles.img_banner}
                            />
                            
                            <div className = {styles.hover_banner}>
                                <p>
                                    Eco Friendly!!! <ArrowDownOutlined />
                                </p>
                            </div>
                        </div>
                    </div>

                    <Divider />
                    
                    <SearchBar />
                    
                    <Divider />
                    <div style = {{width: '60%', padding: '5vh', fontSize: '18px'}}
                        className = {styles.flex_center}
                    >
                        <p className = {styles.h2}>
                        Cây cảnh giúp tăng cường tâm trạng, năng suất, sự tập trung, sáng tạo và giảm căng thẳng, mệt mỏi cũng như cảm lạnh.
                        </p>
                        <p className = {styles.h4}>
                            Chăm sóc cây cảnh vừa giúp duy trì cân bằng sinh thái,
                            vừa giúp giảm căng thẳng và cải thiện sức khỏe tinh thần.
                        </p>
                        <Link
                        to = {
                            {
                                pathname: '/products',
                            }
                        }>
                            <Button htmlType = "button" className = {styles.link_banner_home_button}>
                                Tham quan khu vườn dành cho bạn 
                            </Button>
                        </Link>
                    </div>

                    <Divider />
                    
                    <div className = {styles.flex_center_start}  style = {{padding: '5vh', fontSize: '18px'}}>
                        <div style = {{width: '50%'}}>
                            <img src = {require('../../img/banner/plantCategory3.jpg')} 
                                alt = "Banner For Type 1"
                                style = {{width: '100%'}}
                            />
                        </div>
                        <div 
                        style = {{width: '30%', margin: 'auto'}} 
                        className = {styles.flex_center}
                        >
                            <span className = {styles.h2}>Câu chuyện về khu vườn ngoài trời</span>
                            <span className = {styles.h4}>
                                Một khu vườn đẹp là một công trình của trái tim. Vẻ đẹp nở trong lòng cũng như vườn.
                            </span>
                            
                            <Link
                            to = {
                                {
                                    pathname: '/search',
                                    search: '?q=dây leo'
                                }
                            }>
                                <Button htmlType = "button" className = {styles.link_banner_home_button}>
                                    Các cây ngoài trời
                                    <ArrowRightOutlined />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Divider />
                    
                    <div className = {styles.flex_center_start}  style = {{padding: '5vh', fontSize: '18px'}}>
                        <div 
                        style = {{width: '30%', margin: 'auto'}} 
                        className = {styles.flex_center}
                        >
                            <span className = {styles.h2}>
                            Làm vườn, một khoản "đầu tư" trong tương lai
                            </span>
                            <span className = {styles.h4}>
                            Những gì bạn đang phát triển ngày hôm nay sẽ giúp bạn ngày mai, 
                            một bước tiến tới một tương lai tốt đẹp hơn.
                            </span>
                            
                            <Link
                            to = {
                                {
                                    pathname: '/search',
                                    search: '?q=Sen đá'
                                }
                            }>
                                <Button htmlType = "button" className = {styles.link_banner_home_button}>
                                    <ArrowLeftOutlined />
                                    Các loại cây trong nhà
                                </Button>
                            </Link>
                        </div>
                        <div style = {{width: '50%'}}>
                            <img src = {require('../../img/banner/plantCategory2.jpg')} 
                                alt = "Banner For Type 1"
                                style = {{width: '100%'}}
                            />
                        </div>
                    </div>
                </div>
            )
        }

}

const mapStateToProps = state => {
    const {plants} = state.product
    
    return {plants}
}

const mapDispatchToProps = {
    setPathForSidebar,
    setKeyforSidebar
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter (Home))
// export default Home


/*

    constructor(props) {
        super(props)
        this.state = {
            // plants: [],
            // imgs: [],
            total: 1,
            currentPage: 1,
        }
    }

    async componentDidMount() {
        // const responsePlants = await axios.get('/products')

        // const plants = await responsePlants.data
        // console.log(plants)
        //     plants.map((plant, index) => {
        //     plant.key = plant.MACAYCANH
        //     plant.img = 'http://localhost:4000/images/1606433687660-sendanau1.jpg'
        //     return plant
        // })

        // this.setState({ plants: [...plants, ...plants], total: Math.floor(plants.length) })
        this.setState({ total: Math.round(this.props.plants.length) })
        // console.log(this.state)
    }

    handleChangePagination = (page) => {
        this.setState({currentPage: page});
        window.scrollTo(0, 0)
    }

    render() {
        const { currentPage, total } = this.state
        const { plants } = this.props
        return (
            <div className = {styles.flex_start_center}>
                {
                    plants.length !== 0
                    ? (
                        plants.map((plant, index) =>
                            ((index < currentPage * 12) && index >= (currentPage - 1) * 12) ? (
                                <ProductCard plant = {plant} key = {index}/>
                            ): null
                        ))
                    : null
                }
                <div className = {styles.m5 + ' '+ styles.flex_center} style = {{width:'100%'}}>
                    <Pagination responsive 
                    onChange = {this.handleChangePagination} defaultCurrent={currentPage} total={total} />
                </div>
            </div>
        )
    }
*/ 