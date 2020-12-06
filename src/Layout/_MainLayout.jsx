import React, { Component } from 'react'

import { UpOutlined } from '@ant-design/icons';

import { BackTop, Layout } from 'antd'

import styles from './Layout.module.sass'

import SidebarUser from '../container/user/SidebarUser';

import Footer from '../container/Footer'
const { Content } = Layout

export default class _Layout extends Component {
render() {
return (
    <Layout>
        <BackTop visibilityHeight='0'>
            <div className = {styles.backtop__button}>
                <UpOutlined />
            </div>
        </BackTop>
        <SidebarUser/>
        <Layout
            style ={{paddingLeft: '20vw'}}
        >
        <Content>
            {this.props.children}
        </Content>
      <Footer />
      </Layout>
    </Layout>
    )}
}