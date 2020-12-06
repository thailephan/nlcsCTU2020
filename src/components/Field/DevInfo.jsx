import React, { Component } from 'react'

import Field from './Field';
import Layout from 'antd/lib/layout/layout';

export default class DevInfo extends Component {
    render() {
        return (
            <Layout>
                <Field icon = {require('../../img/icon/location.png')}>
                    đường 30/4, P. Hưng lợi, Q. Ninh Kiều, TP. Cần Thơ
                </Field>
                <Field icon = {require('../../img/icon/phone.png')}>0949-198-163</Field>
                <Field icon = {require('../../img/icon/email.png')}>
                            thailephanminh@gmail.com
                </Field>
            </Layout>
        )
    }
}
