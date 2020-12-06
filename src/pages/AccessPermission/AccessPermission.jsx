import React, { Component } from 'react'

import axios from 'axios'

import { Button, Table, Input, Space, Drawer, Form } from 'antd'

import {UserAddOutlined, UserDeleteOutlined, SwapOutlined, SearchOutlined} from '@ant-design/icons'

import Highlighter from 'react-highlight-words'

import styles from '../styles.module.sass'


export default class AccessPermission extends Component {
    state = { 
        visible: false, 
        permissions: [],
        newPermission: '',
        idPermission: -1,
        type: 1,
    };

    
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select(), 100);
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });
    
      handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };

    columns = [
        
        {
            title: 'Mã Quyền',
            dataIndex: 'MAQUYEN',
            align: 'center',
            ...this.getColumnSearchProps('MAQUYEN')
        },
        {
            title: 'Tên quyền truy cập',
            dataIndex: 'TENQUYEN',
            align: 'center',
            ...this.getColumnSearchProps('TENQUYEN')
        },
    ]

    showModal = () => {
      this.setState({
        visible: true,
        type: 1
      });
    };
  
    handleOk = async e => {
        let response
        if(this.state.type === 0) {

            response = await axios.post(`/admin/permission/update/${this.state.idPermission}`, {
                token: this.props.token,
                name: this.state.newPermission.trim()
            })

        } else if( this.state.type === 1) {
            response = await axios.post('/admin/permission', {
                name: this.state.newPermission.trim(),
                token : this.props.token
                })
        }
        const data = await response.data
        // console.log(data)
        
        if(data.newPermission)
            this.setState({permissions: [...this.state.permissions, {...data.newPermission, key: data.newPermission.MAQUYEN}]})
            
        if(data.isSuccess === true) {
            alert("Thành công")
        } else {
            alert("Có lỗi xảy ra vui lòng thử lại sau")
        }
      this.setState({
        visible: false,
        permissions: this.state.permissions.map((value, index) => {
            if(value.MAQUYEN === this.state.idPermission) value.TENQUYEN = this.state.newPermission
            return value
        }),
        newPermission: '',
        type : 1,
      });
    }

    onEdit = async (e) => {
        this.setState({type: 0, visible: true, newPermission: e.TENQUYEN, idPermission: e.MAQUYEN})
    }
    
    onDelete = async (e) => {
        
        try {
          await axios.post(`/admin/permission/delete/${e.MAQUYEN}`, {
              token: this.props.token,
          })
          
          // const result = await response.data
          this.setState({permissions: this.state.permissions.filter((value, index) => {
              return value.MAQUYEN !== e.MAQUYEN
          })})
        } catch (err) {
          console.log(err)
        }
    };
  
    handleCancel = e => {
      this.setState({
        visible: false,
        newPermission: '',
        idPermission: -1,
        type: 1
      });
    };

    onFieldPermission = (e) => {
        this.setState({newPermission: e.target.value})
    }


    async componentDidMount() {
        // console.log(this.state.permissions.length)
        if (this.state.permissions.length === 0) {
            const responseUser = await axios.get('/admin/permission', {
                headers: { "x-access-token": this.props.token }
            })
            const permissions = await responseUser.data
            
            // console.log( permissions )
            permissions.map((permission, index) => {
                permission.key = permission.MAQUYEN
                return permission
            })

            this.setState({ permissions })
        }
    }
    render() {
        this.columns[2] = {
            title: '',
            dataIndex: 'action',
            align: 'center',
            render: (_, record) => (
                <div>
                    <Button icon = {<SwapOutlined />} htmlType = "button" type = "primary" className = {styles.m1} onClick = {() =>this.onEdit(record)}>Sửa</Button>
                    <Button icon = {<UserDeleteOutlined />} htmlType = "button" onClick = {() => this.onDelete(record)} className ={styles.sbackground + " " + styles.m1} >Xóa</Button>
                </div>
            )
        }
        return (
            <div>
                <div className = {styles.h3}>Danh sách quyền truy cập</div>
                <Button icon = {<UserAddOutlined />} type = "primary" htmlType = "button"  onClick = {this.showModal} className = {styles.m1}>Thêm</Button>
                {this.state.permissions.length === 0 ? null : <Table columns = {this.columns} dataSource= {this.state.permissions} size = "middle"/>}
                <Drawer
                    title="Quyền truy cập"
                    visible={this.state.visible}
                    placement = "top"
                    key = "top"
                    destroyOnClose = {true}
                    height = {'40vh'}
                    onClose = {this.handleCancel}
                    >
                     <Form
                        validateTrigger = "onBlur"
                        style = {{width: '40vw', margin: 'auto'}}
                        onFinishFailed = {(e) => console.log(e)}
                        onFinish = {this.handleOk}
                        >
                       <Form.Item
                          name = "permissionName"
                          label = "Tên quyền truy cập"
                          rules = {[{
                            required: true,
                            message: "Tên quyền không được để trống"
                          },{
                            pattern: '^[ a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ|_]+$',
                            message: 'Tên quyền không chứa số hoặc ký tự đặc biệt',
                          }
                        ]}
                            initialValue = {this.state.newPermission}
                        >
                        <Input
                              
                              placeholder='Tên quyền truy cập'
                              size="large"
                              onChange = {this.onFieldPermission}
                          />
                        </Form.Item>
                          <Button htmlType = "submit" type = "primary"
                          block
                          >
                              {this.state.type === 1 ? "Thêm quyền truy cập" : "Sửa"}
                          </Button>
                      </Form> 
                </Drawer>
            </div>
        )
    }
}
