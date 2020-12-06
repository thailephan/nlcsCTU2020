import React, { Component } from 'react'

import axios from 'axios'

export default class UploadImgs extends Component {

    constructor(props) {
        super(props);
          this.state = {
            selectedFile: null
          }
      }

      onChangeHandler = event=>{
        this.setState({
          selectedFile: event.target.files,
        })
      }

      onSubmitHandler = async (e) => {
        e.preventDefault()
        const data = new FormData() 
        console.log(this.state)
        for (let x = 0; x < this.state.selectedFile.length; x++) {
            data.append('file', this.state.selectedFile[x])
        }
        data.append('token', localStorage.getItem('token'))
        let item = {cat: 'mew', dog: 'gau'}
        for ( var key in item ) {
            data.append(key, item[key]);
        }
        const request = axios.post('/admin/products/add', data, {
            headers: {
                'content-type': "multipart/form-data",
                'x-access-token': localStorage.getItem('token'),
            }
        })

        const info = (await request).statusText
        console.log(info)
    }


    render() {
        return (
            <div>
                <form onSubmit = {this.onSubmitHandler}>
                    <input type="file" multiple name = 'file' onChange={this.onChangeHandler}/>
                    <button type="submit">Upload</button> 
                </form>
            </div>
        )
    }
}
