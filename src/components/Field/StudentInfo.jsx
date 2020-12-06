import React, { Component } from 'react'

import Field from './Field';
import Layout from 'antd/lib/layout/layout';

export default class StudentInfo extends Component {
    render() {
        return (
            <Layout>
                <Field icon = {require('../../img/icon/student.png')}>
                    Lê Phan Minh Thái
                </Field>
                <Field>
                    MSSV : B1809180
                </Field>
            </Layout>
        )
    }
}
