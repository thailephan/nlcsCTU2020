import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class PopoverContent extends Component {
    
    render() {
        const props = this.props
        const LinkList = props.links.map((obj, _) => (
            <div style = {{padding: '1em .25em'}} key = {_}>
                <NavLink to = {obj.linkClient}
                    >
                    {obj.value}
                </NavLink>
                </div>
        ))
        return (
            <div>
                {LinkList}
            </div>
        )
    }
}
