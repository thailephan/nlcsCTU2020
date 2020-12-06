import React, { Component } from 'react'

import axios from 'axios'

export default class UploadImg extends Component {

    constructor(props) {
        super(props);
          this.state = {
            selectedFile: null
          }
       
      }

      onChangeHandler = event=>{
        this.setState({
          selectedFile: event.target.files[0],
          loaded: 0,
        })
      }

      onClickHandler = async () => {
        const data = new FormData() 
        data.append('file', this.state.selectedFile)

        const request = axios.post('/upload', data, {

        })

        const info = (await request).statusText
        console.log(info)
    }


    render() {
        return (
            <div>
                <input type="file" name="file" onChange={this.onChangeHandler}/>
                <button type="button" onClick={this.onClickHandler}>Upload</button> 
            </div>
        )
    }
}
