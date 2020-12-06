import React, { Component } from 'react'

import axios from 'axios'

import { Button, Modal, Table, Input, Space } from 'antd'

import {UserAddOutlined, UserDeleteOutlined, SwapOutlined, SearchOutlined} from '@ant-design/icons'

import Highlighter from 'react-highlight-words'

import styles from '../styles.module.sass'


export default class AdminOrderState extends Component {
    state = { 
        visible: false, 
        orderStates: [],
        newOrderState: '',
        idOrderState: -1,
        type : 1,
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
            title: 'Mã trạng thái',
            dataIndex: 'MATINHTRANG',
            align: 'center',
            ...this.getColumnSearchProps('MATINHTRANG')
        },
        {
            title: 'Tên trạng thái',
            dataIndex: 'TENTINHTRANG',
            align: 'center',
            ...this.getColumnSearchProps('TENTINHTRANG')
        },
    ]

    showModal = () => {
      this.setState({
        visible: true,
      });
    };
  
    handleOk = async e => {
        let response
        if(this.state.type === 0) {

            response = await axios.post(`/admin/order/state/update/${this.state.idOrderState}`, {
                token: this.props.token,
                name: this.state.newOrderState
            })

        } else if( this.state.type === 1) {
            response = await axios.post('/admin/order/state', {
                name: this.state.newOrderState,
                token : this.props.token
            })
        }
        const data = await response.data
        console.log(data)
        
        if(data.newOrderState)
            this.setState({orderStates: [...this.state.orderStates, {...data.newOrderState, key: data.newOrderState.MATINHTRANG}]})
            
        if(data.isSuccess === true) {
            alert("Thành công")
        } else {
            alert("Có lỗi xảy ra vui lòng thử lại sau")
        }
      this.setState({
        visible: false,
        orderStates: this.state.orderStates.map((value, index) => {
            if(value.MATINHTRANG === this.state.idOrderState) value.TENTINHTRANG = this.state.newOrderState
            return value
        }),
        newOrderState: '',
        type : 1,
      });
    }

    onEdit = async (e) => {
        this.setState({type: 0, visible: true, newOrderState: e.TENTINHTRANG, idOrderState: e.MATINHTRANG})
        console.log(e)
    }
    
    onDelete = async (e) => {
        
        const response = await axios.post(`/admin/order/state/delete/${e.MATINHTRANG}`, {
            token: this.props.token,
        })
        
        const result = await response.data
        console.log(result)
        this.setState({orderStates: this.state.orderStates.filter((value, index) => {
            return value.MATINHTRANG !== e.MATINHTRANG
        })})
    };
  
    handleCancel = e => {
      this.setState({
        visible: false,
        newOrderState: ''
      });
    };

    onFieldState = (e) => {
        this.setState({newOrderState: e.target.value})
    }


    async componentDidMount() {
        console.log(this.state.orderStates.length)
        if (this.state.orderStates.length === 0) {
            const responseUser = await axios.get('/admin/order/state', {
                headers: { "x-access-token": this.props.token }
            })
            const orderStates = await responseUser.data
            
            console.log( orderStates )
            orderStates.map((orderState, index) => {
                orderState.key = orderState.MATINHTRANG
                return orderState
            })

            this.setState({ orderStates })
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
                <div className = {styles.h3}>Danh sách trạng thái đơn hàng</div>
                <Button icon = {<UserAddOutlined />} type = "primary" htmlType = "button"  onClick = {this.showModal} className = {styles.m1}>Thêm</Button>
                {this.state.orderStates.length === 0 ? null : <Table columns = {this.columns} dataSource= {this.state.orderStates} size = "middle"/>}
                <Modal
                    title="Trạng thái đơn hàng"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    cancelButtonProps = {{danger: true, type : "primary"}}
                    onCancel={this.handleCancel}
                    destroyOnClose = {true}
                    >
                        <Input
                            placeholder='Trạng thái đơn hàng'
                            size="large"
                            defaultValue = {this.state.newOrderState}
                            onBlur = {this.onFieldState}
                        />
                </Modal>
            </div>
        )
    }
}
