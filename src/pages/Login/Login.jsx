import React, { Component } from 'react'
import Signin from '../../components/Sign/Signin/Signin'

import styles from '../styles.module.sass'

export default class Login extends Component {
    render() {
        return (
            <div  style = {{height : '100vh'}} className = {styles.flex_center + " m_l_2 " + styles.h1}>
                <div>
                    <Signin />
                </div>
            </div>
        )
    }
}
