import React, { Component } from 'react'
import { Col, Layout, Row } from 'antd'

import styles from './Shared.module.sass'
import DevInfo from '../components/Field/DevInfo'
import StudentInfo from '../components/Field/StudentInfo'

export default class Footer extends Component {
    render() {
        const {Footer} = Layout
        return (
            <Footer className = {styles.top_bgshadow}>
                <p className = {styles.h1 + " " + styles.text_left}>About</p>
                <Row justify = 'center'>
                    <Col span = {12}>
                        <DevInfo />
                    </Col>
                    <Col span = {12}>
                        <StudentInfo />
                    </Col>
                </Row>
            </Footer>
        )
    }
}
