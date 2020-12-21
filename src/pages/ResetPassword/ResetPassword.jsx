import React, { Component } from 'react'

import { Form, Input, Button } from 'antd'

import styles from '../styles.module.sass'

import axios from 'axios'

import local from '../../utils/withTokenUser'
import { withRouter } from 'react-router-dom'

class ResetPassword extends Component {
    formRef = React.createRef()
    state = {
        error: null,
    }

    onFinish = async values => {
        console.log('Success:', values);
        if(values.password.localeCompare(values.retypePassword) === 0) {
            this.setState({error: ''})
            try {
                const response = await axios.post('/reset-password', {
                    name: local.user.TENTAIKHOAN,
                    password: values.password
                })
                console.log(response)
                const data = await response.data
                
                if (data.isSuccess === false) {
                    this.setState({ error: data.error })
                } else {
                    alert("Đổi mật khẩu thành công")
                    this.props.history.push('/admin')
                } 
            }
            catch (rej) {
                console.log(rej)
            }
        } else {
            this.setState({error: 'Xác nhận mật khẩu không trùng khớp'})
        }

    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);

    };

    shouldComponentUpdate(prevProps, prevState) {
        if(prevState === this.state) return false;
        return true
    }
    
    render() {
        return (
            <div className={styles.mt5 + " " + styles.flex_center}
                style = {{height: '70vh'}}
            >
            <Form
                style = {{width: '30vw'}}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                name = "password"
                labelAlign = 'left'
                labelCol = {{sm: {span: 12}}}
            >
            <p className={styles.h2}> Đổi mật khẩu</p>
                <Form.Item
                    label = "Mật khẩu cũ"
                    name = 'oldPassword'
                    rules = {[
                        {required: true, message: "Mật khẩu cũ không được để trống"}
                    ]}
                >
                    <Input.Password  />
                </Form.Item>
                <Form.Item
                    label = "Mật khẩu mới"
                    name = 'password'
                    rules = {[
                        {required: true, message: "Mật khẩu mới không được để trống"}
                        ,{
                            min: 8,
                            message: 'Mật khẩu mới phải có ít nhất 8 ký tự',
                        },
                    ]}
                >
                    <Input.Password  />
                </Form.Item>
                <Form.Item
                    label = "Xác nhận mật khẩu mới"
                    name = 'retypePassword'
                    rules = {[
                        {required: true, message: "Xác nhận mật khẩu mới không được để trống"}
                        ,{
                            min: 8,
                            message: 'Mật khẩu mới phải có ít nhất 8 ký tự',
                        },
                    ]}
                >
                    <Input.Password  />
                </Form.Item>
                    {this.state.error}
                <Form.Item>
                    <Button className = {styles.sbackground} block htmlType = "submit" >Đối mật khẩu</Button>
                </Form.Item>
            </Form>
        </div>
        )
    }
}
export default withRouter(ResetPassword)