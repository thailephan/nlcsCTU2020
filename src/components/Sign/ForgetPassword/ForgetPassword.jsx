import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

import styles from '../Sign.module.sass'

import Layout from 'antd/lib/layout/layout';

import { withRouter } from 'react-router-dom'

import axios from 'axios'

class ForgetPassword extends Component {
    state = {
        error: null,
    }

    onFinish = async (values) => {
        if(values.password.localeCompare(values.retypePassword) === 0) {
            this.setState({error: ''})
            try {
                const response = await axios.post('/reset-password', {
                    name: values.username,
                    password: values.password
                })
                console.log(response)
                const data = await response.data
                
                // data : {error, isSuccess}
                if (data.isSuccess === false) {
                    this.setState({ error: data.error })
                } else {
                    this.props.history.push({
                        pathname: '/login'
                    })
                } 
            }
            catch (rej) {
                console.log(rej)
            }
        } else {
            this.setState({error: 'Xác nhận mật khẩu không trùng khớp'})
        }
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        return (

            <div style={{ height: '100vh' }} className={styles.flex_center + " m_l_2 " + styles.h1}>
                <div>
                    <Layout
                        className={styles.sign_in__form}>
                        <Form
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                        >
                            <p className={styles.h2}>Quên mật khẩu</p>
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Tên tài khoản/Số điện thoại không được để trống',
                                    },
                                ]}
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
                                        message: 'Mật khẩu mới không được để trống',
                                    },
                                    {
                                        min: 8,
                                        message: 'Mật khẩu mới không được để trống',
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="Mật khẩu mới"
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    size="large"
                                />
                            </Form.Item>
                            
                            <Form.Item
                                name="retypePassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Xác nhận mật khẩu mới không được để trống ',
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="Xác nhận mật khẩu mới"
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    size="large"
                                />
                            </Form.Item>
                            {this.state.error ? <div>{this.state.error}</div> : null}

                            <Button block htmlType="submit" className={styles.sign_in__button} size='large'>
                                Đổi mật khẩu
                            </Button>

                        </Form>

                    </Layout>
                </div>
            </div>

        )
    };
};

export default withRouter(ForgetPassword)