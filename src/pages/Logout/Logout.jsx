import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { setDeAuthenication } from '../../redux/features/User/UserSlice'
import { resetSidebar } from '../../redux/features/Sidebar/SidebarSlice'

import { resetTempLocal } from '../../utils/withTokenUser'

class Logout extends Component {
    
    async componentDidMount() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('pathToAdminPageForAdminReload')
        localStorage.removeItem('cart')
        localStorage.removeItem('pathToUserPage')
        
        resetTempLocal()
        await this.props.resetSidebar()
        await this.props.setDeAuthenication()
        await this.props.history.push('/')
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

window.onclose = () => {
    window.localStorage.clear()
}

const mapDispatchToProps ={
    setDeAuthenication,
    resetSidebar
}

export default connect(null, mapDispatchToProps)(withRouter( Logout ))