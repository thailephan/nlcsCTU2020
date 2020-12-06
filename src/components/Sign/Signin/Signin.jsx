import React, {Component} from 'react'
import { Form, Input, Button, Divider } from 'antd';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

import styles from '../Sign.module.sass'
import Layout from 'antd/lib/layout/layout';
import { NavLink, withRouter  } from 'react-router-dom';

import { connect } from 'react-redux'
import { setAuthenication } from '../../../redux/features/User/UserSlice.js'
import { fetchOrdersforOneUser } from '../../../redux/features/OrderSlice/OrderSlice'
import { setPathForSidebar, resetSidebar } from '../../../redux/features/Sidebar/SidebarSlice'

import axios from 'axios'

const mapDispatchToProps = {
    setAuthenication,
    fetchOrdersforOneUser,
    setPathForSidebar,
    resetSidebar
}

class Signin extends Component {
    state = {
        error: null,
    }

    onFinish = async (values) => {
        const { resetSidebar, setAuthenication, fetchOrdersforOneUser, history} = this.props
        try{
            const response = await axios.post('/login', {
                name: values.username,
                password: values.password  
            })
        
            const data = await response.data

            localStorage.setItem('token', data.accessToken)
            localStorage.setItem('user', JSON.stringify(data.record))
            localStorage.setItem('refreshToken', data.refreshToken)

            await resetSidebar ()
            await fetchOrdersforOneUser({idUser: data.record.MATAIKHOAN,
                token: data.accessToken 
            })
            await setAuthenication({user: data.record, token: data.accessToken})

            await history.push('/')
     
        } catch(rej) {
            console.log(rej)
            this.setState(
                {error: "Sai tài khoản hoặc mật khẩu"})
        }
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    componentDidMount () {
        const { setPathForSidebar, location } = this.props
        setPathForSidebar( {pathname: location.pathname })
    }

    render(){
        const {userData} = this.props.location

        return (
        <Layout
                className={styles.sign_in__form}>
            <Form
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}>
                <p className={styles.h2}>Đăng nhập</p>
                <Form.Item
                        name="username"
                        rules={[
                        {
                        required: true,
                        message: 'Tên tài khoản/Số điện thoại không được để trống' ,
                        },
                        ]}
                        initialValue = {userData && userData.username ? userData.username : ''}
                        >
                    <Input
                        placeholder='Tên tài khoản/Số điện thoại'
                        prefix={<UserOutlined className="site-form-item-icon" />}
                    size = "large"
                    />
                </Form.Item>

                <Form.Item
                        name="password"
                        rules={[
                        {
                        required: true,
                        message: 'Mật khẩu không được để trống' ,
                        },
                        ]}
                        initialValue = {userData && userData.password? userData.password : ''}
                        >
                    <Input.Password
                                    placeholder="Mật khẩu"
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                    size = "large"
                    />
                </Form.Item>
                <Form.Item>
                    <NavLink className="login-form-forgot p_1" to="/reset-password">
                        Quên mật khẩu
                    </NavLink>
                </Form.Item>

                {this.state.error ? <div style = {{color: '#DB504A', fontSize: '18px'}}>{this.state.error}</div> : null}
                <Button block htmlType="submit" className={styles.sign_in__button} size='large'>
                    Đăng nhập
                </Button>

                <Divider>Chưa có tài khoản ?</Divider>
                <NavLink to = '/register'>
                    <Button block htmlType="submit" type='primary' size='large'>
                        Đăng ký
                    </Button>
                </NavLink>
            </Form>

        </Layout>
    )};
};

export default withRouter(connect(null, mapDispatchToProps)(Signin))