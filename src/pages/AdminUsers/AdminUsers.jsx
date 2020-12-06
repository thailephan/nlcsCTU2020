import React, { Component } from 'react'

import axios from 'axios'

import { Table } from 'antd'

import styles from '../styles.module.sass'

const columns = [
    
    {
        title: 'Mã khách hàng',
        dataIndex: 'MAKH',
        align: 'center'
    },
    {
        title: 'Họ và tên khách hàng',
        dataIndex: 'HOTENKH',
        align: 'center'
    },
    {
        title: 'Giới tính',
        dataIndex: 'sex',
        align: 'center',
    },
    {
        title: 'Ngày sinh',
        dataIndex: 'NGAYSINH',
        align: 'center',
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'SDT',
        align: 'center',
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'DIACHI',
        align: 'center'
    },
]

export default class AdminUser extends Component {

    state = {
        users: []
    }

    async componentDidMount() {
        // console.log(this.state.users.length)
        if (this.state.users.length === 0) {
            const responseUser = await axios.get('/admin/customers', {
                headers: { "x-access-token": this.props.token }
            })
            const users = await responseUser.data
            
            // console.log(users)
            users.map((account, index) => {
                account.key = account.MAKH
                account.sex = account.GIOITINH ? 'Nữ' : 'Nam'
                return account
            })

            this.setState({users})
        }
        // console.log(this.state.users[0].key)
    }
    render() {
        return (
            <div>
                <div className = {styles.h3}>Danh sách người dùng</div>
                {this.state.users.length === 0 ? null : <Table columns = {columns} dataSource= {this.state.users} size = "middle"/>}
            </div>
        )
    }
}
