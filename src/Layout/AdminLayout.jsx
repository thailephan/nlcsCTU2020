import React, { Component } from 'react'

import { UpOutlined } from '@ant-design/icons';

import { BackTop, Layout } from 'antd'

import SidebarAdmin from '../container/admin/SidebarAdmin';

import styles from './Layout.module.sass'

import HeaderAdmin from '../container/admin/HeaderAdmin';

const { Content } = Layout

export default class AdminLayout extends Component {
    render() {
        const props = this.props

        return (
            <Layout>
                <BackTop visibilityHeight='0'>
                    <div className = {styles.backtop__button}>
                        <UpOutlined />
                    </div>
                </BackTop>
                <SidebarAdmin />
                <Layout>
                    <HeaderAdmin />
                <Content>
                    {props.children}
                </Content>
                
            </Layout>
            </Layout>
    )}
}