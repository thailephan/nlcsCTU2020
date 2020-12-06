import React, { Component } from 'react'
import {Card} from 'antd'
import { Link } from 'react-router-dom'
import styles from '../styles.module.sass'

import logo from '../../img/logo.jpg'

const {Meta} = Card

export default class ProductCard extends Component {
    render() {
        const props = this.props
        const { plant } = props
        return (
            <Link to = {{
                pathname: '/products/details/'+ plant.MACAYCANH,
            }}
                onClick = {() => window.scroll(0, 0)}
                key = {plant.MACAYCANH}
                className = {styles.product_card}
                >
                <Card
                    bordered = {false}
                    cover = {<img alt = "Hình ảnh" src = {`${plant.images.length !== 0 ? plant.images[0].DUONGDAN : logo }`} style = {{height: '250px', width: '250px', margin: 'auto', marginTop: '10px'}}/>}
                >
                    <Meta title = {<p className = {styles.h3}>{plant.TENCAYCANH}</p>} description = {<p className = {styles.h3}>{plant.GIANIEMYET}</p>} />
                </Card>
            </Link> 
        )
    }
}
