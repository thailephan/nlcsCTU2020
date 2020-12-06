import React, { Component } from 'react'
import { Col, Row } from 'antd'

import styles from '../styles.module.sass'

export default class Field extends Component {
    render() {
        const props = this.props;
        const {icon, children} = props

        return (
            <Row gutter = {16} className = {styles.p1}>
                <Col flex = '50px'>
                {icon ? 
                <img src = {icon} alt = 'Location' className = {styles.icon}/>
                 : null}
                 </Col>
                <Col flex = 'auto'>
                    <p className = {styles.h3 + " " + styles.text_left}>{children}</p>
                </Col>
            </Row>
        )
    }
}
