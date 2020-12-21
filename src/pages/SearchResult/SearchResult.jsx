import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'

import styles from '../styles.module.sass'
import ProductCard from '../../components/ProductCard/ProductCard'
import { Divider } from 'antd'

import { setKeyforSidebar, setPathForSidebar} from '../../redux/features/Sidebar/SidebarSlice'

export class SearchResult extends Component {

    componentDidMount () {
        const { setPathForSidebar, setKeyforSidebar, location } = this.props
        setPathForSidebar( {pathname: location.pathname + location.search})
        setKeyforSidebar( { submenu: '0',  key : 'tc'})
    }

    render() {
        const { plants , location } = this.props
        const qQueries = queryString.parse(location.search).q || ''
        
        const qToLowerCase = qQueries.toLowerCase().trim()
        
        const PlantFilter = plants.filter((plant, _) => {
            return plant.TENCAYCANH.toLowerCase().includes(qToLowerCase)
            || plant.TENLOAI.toLowerCase().includes(qToLowerCase)
        })
        
        const plantCardFiltered = PlantFilter.map((plant, _) => {
            return <ProductCard plant = {plant} key = {_} />
        })

        return (
            <div className = {styles.flex_center + ' ' + styles.m5}>
                <p style = {{margin: '3rem'}}
                    className = {styles.h1}
                >
                    Kết quả tìm kiếm 
                        <br />
                    "{qQueries}"
                </p>

                <Divider />
                {plantCardFiltered}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {plants} = state.product

    return {plants: plants}
}


const mapDispatchToProps = {
    setPathForSidebar,
    setKeyforSidebar
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchResult))
