import React, { Component } from 'react'
import { Avatar, Popover } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styles from '../Shared.module.sass'
import PopoverContent from '../../components/PopoverContent/PopoverContent'
import { connect } from 'react-redux'

class HeaderAdmin extends Component {
        render() {
        const links = [
        { linkClient: '/admin/profile/user', value: "Thông tin cá nhân" },
        { linkClient: '/admin/profile/reset-password', value: "Đổi mật khẩu" },
        { linkClient: '/logout', linkToGetData: "", value: "Đăng xuất" },
    ]
        return (
            <div style = {{width: '100%', height:'10vh',}} className = {styles.flex_right + " " + styles.p3 + " " + styles.bot_bgshadow + " "}>
                    <Popover placement="bottomRight" content={<PopoverContent links = {links}/>} trigger="click">
                        <Avatar
                        style = {{margin: '10px', marginTop: '5vh'}}
                        className = {styles.fbackground}
                        size="large"
                    >
                        {<UserOutlined />}
                        </Avatar>                    
                    </Popover>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {user} = state.user
    return {user}
}

export default connect(mapStateToProps)(HeaderAdmin)