import React, { Component } from 'react'

import styles from '../styles.module.sass'

import axios from 'axios'

import moment from 'moment'

import local from '../../utils/withTokenUser'

import { Button, Input, Radio, Form, DatePicker } from 'antd'
import { PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

import {updateUserPersonalInfo } from '../../redux/features/User/UserSlice'
import { withRouter } from 'react-router-dom'

class PersonalInfo extends Component {
    
    onFinish = async values => {
        const { updateUserPersonalInfo, history } = this.props
        console.log('Success:', values);
        try {
            const responseUser = await axios.post('/auth/profile/user', {
                ...values,
                token: this.props.token
            })
            const dataResponse = await responseUser.data

            console.log(dataResponse)
            
            if(dataResponse.isSuccess) {
                alert("Lưu thành công")
                const newUpdatedUser = {...this.props.user, ...dataResponse.newInfo}
                console.log(newUpdatedUser)
                updateUserPersonalInfo({user: newUpdatedUser, token: this.props.token})

                localStorage.setItem("user", JSON.stringify(newUpdatedUser))
                local.user = localStorage.getItem('user')

                history.push('/')
            } else {
                alert("Lưu thất bại vui lòng thử lại sau")
            }
        } catch(err) {
            console.log(err)
        }
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);

    };   
    
    render() {

        const dateFormat = 'YYYY-MM-DD';

        const {user} = this.props
        
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };
        return (
            <div className={styles.mt5 + " " + styles.flex_center}>
                {user.length === 0 ? null : 
                    <div>
                        <p className={styles.h2}>Thông tin người dùng</p>
                        <Form
                            style = {{width: '30vw'}}
                            {...formItemLayout}
                            name="user"
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                            initialValues={{ fullname: user.HOTENKH }}
                            labelCol = {{span: 8}}
                            labelAlign="left"
                        >
                            <Form.Item
                                name="fullname"
                                label="Họ và tên"
                            >
                                <Input
                                    placeholder='Họ và tên'
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Só điện thoại"
                                name="phone"
                                initialValue={user && user.SDT ? user.SDT : ''}
                            >
                                <Input
                                    placeholder='Số điện thoại (Tùy chọn)'
                                    prefix={<PhoneOutlined className="site-form-item-icon" />}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item label="Giới tính" name="sex" initialValue={user.GIOITINH ? 1 : 0}>
                                <Radio.Group>
                                    <Radio.Button value={0}>Nam</Radio.Button>
                                    <Radio.Button value={1}>Nữ</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="Ngày sinh" name = "birthday"
                                initialValue={user.NGAYSINH 
                                    ? moment(user.NGAYSINH, dateFormat) 
                                    : null} 
                            >
                                <DatePicker 
                                    format={dateFormat} 
                                    />
                            </Form.Item>
                            <Form.Item 
                                label = "Địa chỉ"
                                name = "address"
                                initialValue = {user.DIACHI ? user.DIACHI : ''}
                            >
                                <Input type = "text" />
                            </Form.Item>
                            <Button htmlType="submit" className={styles.sbackground} block >Lưu</Button>
                        </Form>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state =>{
    const {user, token} = state.user
    return {user, token}
}

const mapDispatchToProps = {
    updateUserPersonalInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter( PersonalInfo ))