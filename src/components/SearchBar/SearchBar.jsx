import { Button, Input } from 'antd';
import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import styles from '../styles.module.sass'

export class SearchBar extends Component {
    state = {
        query : ''
    }
    onChangeSearchText = (e) => {
        this.setState({query: e.target.value})
    }
    
    render() {
        const {query} = this.state
        const { onSearchClose } = this.props
        return (
            <div
                className = {styles.search_bar_home}
            >
                <p className = {styles.search_text_home}
                >
                    Tìm kiếm với
                </p>
                <Input 
                    type = "text"  
                    placeholder = "Vd: Sen đá, hoa hồng"
                    size = "large"
                    defaultValue = {''}
                    style = {{fontSize: '24px', padding: '.5em'}}
                    onChange = {this.onChangeSearchText}
                    value = {query}
                />
                <Button  htmlType = "button" 
                    type = "primary" 
                    className = {styles.search_button}
                    onClick = {() => {
                        this.setState({query: ''})
                        if(onSearchClose !== undefined) {
                            onSearchClose()
                        }
                    }}
                >
                    <Link
                        to={{
                            pathname: "/search",
                            search: `?q=${query}`,
                        }}
                        >
                        Tìm kiếm
                    </Link>
                </Button>
            </div>
        )
    }
}

export default SearchBar
