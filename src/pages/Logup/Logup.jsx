import React, { Component } from 'react'
import Signup from '../../components/Sign/Signup/Signup'

import styles from '../styles.module.sass'

export default class Logup extends Component {
    render() {
        return (
            <div style = {{height : '100vh'}} className = {styles.flex_center + " m_l_2 " + styles.h1}>
                <div>
                    <Signup />
                </div>
            </div>
        )
    }
}
