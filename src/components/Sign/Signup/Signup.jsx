import React, { Component } from 'react'
import { Form, Input, Button, Divider } from 'antd';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

import styles from '../Sign.module.sass'

import Layout from 'antd/lib/layout/layout';

import { NavLink, withRouter } from 'react-router-dom'

import {setPathForSidebar, setKeyforSidebar} from '../../../redux/features/Sidebar/SidebarSlice'

import axios from 'axios'
import { connect } from 'react-redux';

class Signup extends Component {
    state = {
        error: null,
        username: '',
        password: ''
    }

    onFinish = async (values) => {
        try{
            const response = await axios.post('/register', {
                name: values.username,
                password: values.password
            })
            const data = await response.data

            // data : {error, isSuccess}
            if(data.isSuccess === false) {
                this.setState({error: data.error})
            } else {
                this.setState({error: 'Tạo tài khoản thành công'})
            }
            this.props.history.push({
                pathname: '/login',
                userData: {...values}
            })
        }
        catch (rej) {
            console.log(rej)
        }
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    componentDidMount () {
        const { setPathForSidebar, setKeyforSidebar, location } = this.props
        setPathForSidebar( {pathname: location.pathname })
        setKeyforSidebar( { submenu: '0',  key : 'dk'})
    }

    render() {
        return (
            <Layout
                className={styles.sign_in__form}>
                <Form
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <p className={styles.h2}>Đăng ký</p>
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Tên tài khoản/Số điện thoại không được để trống',
                            },
                            {
                                min: 8,
                                message: 'Tên tài khoản/Số điện thoại không được ít hơn 8 ký tự',
                            },
                        ]}
                        initialValue = {this.state.username}
                        >
                        <Input
                            placeholder='Tên tài khoản/Số điện thoại'
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Mật khẩu không được để trống',
                            },
                            {
                                min: 8,
                                message: 'Mật khẩu không được ít hơn 8 ký tự',
                            },
                        ]}
                        initialValue = {this.state.username}
                        >
                        <Input.Password
                            placeholder="Mật khẩu"
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            size="large"
                        />
                    </Form.Item>
                    {this.state.error ? <div>{this.state.error}</div> : null}

                    <Button block htmlType="submit" className={styles.sign_in__button} size='large'>
                        Đăng ký
                    </Button>

                    <Divider>Đã có tài khoản ?</Divider>

                    <NavLink to='/login'>
                        <Button block htmlType="button" type='primary' size='large'>
                            Đăng nhập
                        </Button>
                    </NavLink>
                </Form>

            </Layout>
        )
    };
};

const mapDispatchToProps = {
    setPathForSidebar,
    setKeyforSidebar
}

export default connect(null, mapDispatchToProps)( withRouter(Signup) )