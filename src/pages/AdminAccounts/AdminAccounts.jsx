import React, { Component } from 'react'

import axios from 'axios'
import moment from 'moment'

import { Button, Table, Space, Input, Form, Switch, Select, Radio, DatePicker, Drawer } from 'antd'

import {UserAddOutlined, UserDeleteOutlined, SwapOutlined, SearchOutlined} from '@ant-design/icons'

import styles from '../styles.module.sass'

import Highlighter from 'react-highlight-words'

const {Option} = Select

export default class AdminAccounts extends Component {

    state = {
        accounts: [],
        newAccounts: {
            key: '',
            id: '',
            name: '',
            password: '',
            Namepermission: '',
            state: true,
            avatar: null,
            permission: ''
        },
        newUser: {
            fullname: '',
            sex : 0,
            dateOfBirth: '',
            phone : '',
            address: '',
        },
        permissions: [],
        idAccount: -1,
        type : 1,
    }

    
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
              <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }} className = {styles.sbackground}>
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

      options = [
          {label: "Nam", value: 0},
          {label: 'Nữ', value: 1}
    ]

    columns = [
        
        {
            title: 'Mã tài khoản',
            dataIndex: 'MATAIKHOAN',
            align: 'center',
            ...this.getColumnSearchProps('MATAIKHOAN')
        },
        {
            title: 'Mã khách hàng',
            dataIndex: 'MAKH',
            align: 'center',
            ...this.getColumnSearchProps('MAKH')        
        },
        {
            title: 'Tên quyền',
            dataIndex: 'TENQUYEN',
            align: 'center',
            ...this.getColumnSearchProps('TENQUYEN')
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'TENTAIKHOAN',
            align: 'center',
            ...this.getColumnSearchProps('TENTAIKHOAN')
        },
        {
            title: 'Mật khẩu',
            dataIndex: 'MATKHAU',
            align: 'center',
            ...this.getColumnSearchProps('MATKHAU')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'state',
            align: 'center',
            ...this.getColumnSearchProps('state')
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
              response = await axios.post(`/admin/account/update/${this.state.newAccounts.id}`, {
                  token: this.props.token,
                  ...this.state.newAccounts
              })
  
          } else if( this.state.type === 1) {
              response = await axios.post('/admin/account', {
                  ...this.state.newAccounts,
                  ...this.state.newUser,
                  token : this.props.token
                  })
          }
          const data = await response.data

          if(data.isSuccess === true) {
              alert("Thành công")
          } else {
              alert("Có lỗi xảy ra vui lòng thử lại sau")
          }
          if(this.state.type === 1) {
              let max = this.state.accounts.reduce((prevValue, curValue) => {
                  return prevValue.MATAIKHOAN < curValue.MATAIKHOAN ? curValue : prevValue
              })

              const acc = this.state.newAccounts
              this.setState({accounts: [...this.state.accounts, {MATAIKHOAN: data.idAccount,
              TENTAIKHOAN: acc.name, 
              key: max.MATAIKHOAN + 1,
              MATKHAU: acc.password,
              MAKH: data.idUser,
              TENQUYEN: acc.Namepermission, 
              state: acc.state ? 'Đang hoạt động' : 'Vô hiệu hóa', 
              MAQUYEN: acc.permission}]})
          } else
          this.setState({
            accounts: this.state.accounts.map((value, index) => {
                if(value.MATAIKHOAN === this.state.newAccounts.id) {
                    const acc = this.state.newAccounts
                    value = {...value, TENTAIKHOAN: acc.name, MATKHAU: acc.password, TENQUYEN: acc.Namepermission, state: acc.state ? 'Đang hoạt động' : 'Vô hiệu hóa', MAQUYEN: acc.permission}
                }
                return value
            }),
            });
            this.setState({
                newAccounts: {
                    name: '',
                    password: '',
                    state: 1,
                    permission: '',
                },
                newUser: {
                    address: '',
                    dateOfBirth: '',
                    fullname: '',
                    phone: '',
                    sex: 0
                },
                visible: false,
                type: 1,
            })
            
      }
  
      onEdit = async (e) => {
          this.setState({type: 0, visible: true, 
            newAccounts: {name: e.TENTAIKHOAN, password: e.MATKHAU, state: e.TRANGTHAI ? true : false, permission: e.MAQUYEN, Namepermission: e.TENQUYEN, id: e.MATAIKHOAN, key: e.MATAIKHOAN}})
      }
      
      onDelete = async (e) => {
          
          await axios.post(`/admin/account/delete/${e.MATAIKHOAN}`, {
              token: this.props.token,
          })
          
          this.setState({accounts: this.state.accounts.map((value, index) => {
              if(value.MATAIKHOAN === e.MATAIKHOAN) {
                return {...value, TRANGTHAI: 0, state: 'Vô hiệu hóa'}
              }
              return value
          })})
      };
    
      handleCancel = e => {
        this.setState({
          visible: false,
        });
      };
  
  
    async componentDidMount() {
        if (this.state.accounts.length === 0) {
            const responseUser = await axios.get('/admin/account', {
                headers: { "x-access-token": this.props.token }
            })
            const accounts = await responseUser.data
            
            accounts.map((account, index) => {
                account.key = account.MATAIKHOAN
                account.state = !account.TRANGTHAI ? 'Vô hiệu hóa' : 'Đang hoạt động'
                return account
                
            })

            this.setState({accounts : accounts})
        }

        if (this.state.permissions.length === 0) {
            const responseUser = await axios.get('/admin/permission', {
                headers: { "x-access-token": this.props.token }
            })
            const permissions = await responseUser.data

            this.setState({ permissions })
        }
    }
    dateFormat = 'YYYY-MM-DD';
    today = moment(new Date(), this.dateFormat)

    render() {
        this.columns[6] = 
        {
            title: '',
            dataIndex: 'action',
            align: 'center',
            render: (_, record) => (
                <div>
                    <Button icon = {<SwapOutlined />} htmlType = "button" type = "primary" className = {styles.m1} onClick = {() =>this.onEdit(record)}>Sửa</Button>
                    <Button icon = {<UserDeleteOutlined />} htmlType = "button" className ={styles.sbackground + " " + styles.m1 } onClick = {() =>this.onDelete(record)} >Xóa</Button>
                </div>
            )
        }
        return (
            <div>
                <div className = {styles.h3}>Danh sách tài khoản khách hàng</div>
                <Button icon = {<UserAddOutlined />} type = "primary" htmlType = "button" className = {styles.m1} onClick = {() => this.showModal()}>Thêm</Button>
                {this.state.accounts.length === 0 ? null : <Table columns = {this.columns} dataSource= {this.state.accounts} size = "middle"/>}
                <Drawer
                    
                    title="Tài khoản"
                    visible={this.state.visible}
                    placement = {"top"}
                    // onOk={this.handleOk}
                    // cancelButtonProps = {{danger: true, type : "primary"}}
                    // onCancel={this.handleCancel}
                    key = "top"
                    destroyOnClose = {true}
                    height = {'80vh'}
                    onClose = {() => {
                        this.setState({
                            type: 1,
                            newAccounts: {
                                name: '',
                                password: '',
                                state: 1,
                                permission: '',
                            },
                            newUser: {
                                address: '',
                                dateOfBirth: '',
                                fullname: '',
                                phone: '',
                                sex: 0
                            },
                            visible: false,
                          });
                    }}
                    >
                        { this.state.type === 1 ?
                            <Form
                            validateTrigger = "onBlur"
                         onFinish = {this.handleOk}
                         style = {{width: '50vw', margin: 'auto'}}
                         onFinishFailed = {(e) => console.log(e)}
                         name = "AddUser"
                        >
                            <p className = {styles.h3}>Thông tin tài khoản</p>
                            <Form.Item
                                label = "Tên tài khoản"
                                name = "accountName"
                                rules = {[{
                                    required: true,
                                    message: "Tên tài khoản không được để trống"
                                }, {
                                    min: 8,
                                    message: 'Tên tài khoản không được ngắn hơn 8 ký tự',
                                }, {
                                    whitespace: true,
                                    mesage: "Tên tài khoản không chứa khoảng trắng"
                                }, {
                                    pattern: '^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$',
                                    message: "Tên tài khoản không được chứa ký tự đặc biệt, và phải gồm chữ cái hoặc số"   
                                }
                            ]}
                                initialValue = {this.state.newAccounts.name}
                            >
                                <Input
                                    placeholder='Tên tài khoản'
                                    size="large"
                                    onChange = {(e) => {this.setState({newAccounts: {...this.state.newAccounts, name: e.target.value}})}}
                                    value = {this.state.newAccounts.name}
                                />
                            </Form.Item>

                            <Form.Item
                                label = "Mật khẩu"
                                name = "password"
                                rules = {[{
                                    required: true,
                                    message: "Mật khẩu không được để trống"
                                },{
                                    min: 8,
                                    message: 'Mật khẩu không được ngắn hơn 8 ký tự',
                                },]}
                                initialValue = {this.state.newAccounts.password}
                            >
                                <Input.Password
                                    placeholder='Mật khẩu'
                                    size="large"
                                    onChange = {(e) => {this.setState({newAccounts: {...this.state.newAccounts, password: e.target.value}})}}
                                    
                                />
                            </Form.Item>

                            <Form.Item
                                label = "Quyền truy cập"
                                name = "permission"
                                rules = {[{
                                    required: true,
                                    message: "Quyên truy cập không được để trống"
                                }]}
                                initialValue = {this.state.newAccounts.Namepermission}
                            >
                                <Select  size = "large" 
                                onChange = {(value) => this.setState(
                                    {newAccounts: 
                                        {...this.state.newAccounts, permission: value, Namepermission: this.state.permissions.find((permission, index) => {
                                            return permission.MAQUYEN === value
                                }).TENQUYEN
                                }})}>
                                    {this.state.permissions.map((permission, index) => (
                                        <Option value = {permission.MAQUYEN} key = {permission.MAQUYEN}>{permission.TENQUYEN}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label = "Trạng thái"
                                name = "state"
                            >
                                <Switch checkedChildren = "On" unCheckedChildren = "Off" checked = {this.state.newAccounts.state || false} className = {styles.fbackground} onChange = {() => this.setState({newAccounts : {...this.state.newAccounts, state: !this.state.newAccounts.state}})}>
                                </Switch>
                            </Form.Item>

                            {this.state.type === 1 ?
                            (<div>
                                <p className = {styles.h3}>Thông tin người dùng mới</p>
                                <Form.Item
                                rules = {[{
                                    required: true,
                                    message: "Họ tên người dùng không được để trống"
                                },{
                                    pattern: '^[ a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ|_]+$',
                                    message: 'Họ tên người dùng không chứa số và ký tự đặc biệt',
                                },]}
                                label = "Họ và tên"
                                initialValue = {this.state.newUser.fullname}
                                name = "fullname"
                            >
                                <Input
                                    placeholder='Họ và tên'
                                    size="large"
                                    onChange = {(e) => {this.setState({newUser: {...this.state.newUser, fullname: e.target.value}})}}
                                />
                            </Form.Item>
                            <Form.Item label = "Giới tính">
                            <Radio.Group
                                options={this.options}
                                onChange={(e) => {this.setState({newUser: {...this.state.newUser, sex: e.target.value}})}}
                                value={this.state.newUser.sex}
                                optionType="button"
                                buttonStyle = "solid" />
                            </Form.Item>
                            
                            
                            <Form.Item label="Ngày sinh" name = "birthday"
                                initialValue={''}
                                rules = {[{
                                    required: true,
                                    message: "Ngày, tháng, năm sinh không được để trống"
                                }]} 
                            >
                                <DatePicker 
                                    format={this.dateFormat}
                                    onChange = {(value) => {this.setState({newUser: {...this.state.newUser, dateOfBirth: value}})
                                }}
                                    />
                            </Form.Item>

                            <Form.Item
                                label = "Địa chỉ"
                                name = "address"
                                rules = {[{
                                    required: true,
                                    message: "Địa chỉ người dùng không được để trống"
                                },{
                                    pattern: "^[ ,.a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ|_]+$",
                                    message: 'Địa chỉ người dùng không chứa số và ký tự đặc biệt',
                                },]}
                                initialValue =  {this.state.newUser.address}
                            >
                                <Input
                                    placeholder='An Khánh, Ninh Kiều, Cần Thơ'
                                    size="large"
                                    onChange = {(e) => {this.setState({newUser: {...this.state.newUser, address: e.target.value}})}}
                                />
                            </Form.Item>

                            <Form.Item
                                label = "Số điện thoại"
                                initialValue = {this.state.newUser.phone}
                                name = {'phone'}
                                rules = {[
                                    {pattern: '^[0-9]{10,12}$',
                                    message: "Số điện thoại chỉ bao gồm số, không gồm chữ cái hoặc ký tự đặc biệt"
                                }, {
                                    required: true,
                                    message: 'Số điện thoại không được để trống'
                                }
                                ]}
                            >
                                <Input
                                    placeholder='0123456789'
                                    size="large"
                                    onChange = {(e) => {this.setState({newUser: {...this.state.newUser, phone: e.target.value}})}}
                                />
                            </Form.Item>

                            </div>) 
                            : null }
                            <Button htmlType= 'submit' type = "primary"
                            block
                            >
                                {this.state.type === 1 ? 'Tạo tài khoản' : "Lưu"}
                            </Button>
                        </Form>
                            : 
                        <Form
                        validateTrigger = "onBlur"
                        onFinish = {this.handleOk}
                        onFinishFailed = {(e) => console.log(e)}
                        name = "updateUser"
                        style = {{width: '50vw', margin: 'auto'}}
                       >
                           <p className = {styles.h3}>Thông tin tài khoản</p>
                           <Form.Item
                               label = "Tên tài khoản"
                               name = "accountName"
                               rules = {[{
                                   required: true,
                                   message: "Tên tài khoản không được để trống"
                               }, {
                                   min: 8,
                                   message: 'Tên tài khoản không được ngắn hơn 8 ký tự',
                               }, {
                                   whitespace: true,
                                   mesage: "Tên tài khoản không chứa khoảng trắng"
                               }, {
                                   pattern: '^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$',
                                   message: "Tên tài khoản không được chứa ký tự đặc biệt, và phải gồm chữ cái hoặc số"   
                               }
                           ]}
                               initialValue = {this.state.newAccounts.name}
                           >
                               <Input
                                   placeholder='Tên tài khoản'
                                   size="large"
                                   onChange = {(e) => {this.setState({newAccounts: {...this.state.newAccounts, name: e.target.value}})}}
                                   value = {this.state.newAccounts.name}
                               />
                           </Form.Item>

                           <Form.Item
                               label = "Mật khẩu"
                               name = "password"
                               rules = {[{
                                   required: true,
                                   message: "Mật khẩu không được để trống"
                               },{
                                   min: 8,
                                   message: 'Mật khẩu không được ngắn hơn 8 ký tự',
                               },]}
                               initialValue = {this.state.newAccounts.password}
                           >
                               <Input.Password
                                   placeholder='Mật khẩu'
                                   size="large"
                                   onChange = {(e) => {this.setState({newAccounts: {...this.state.newAccounts, password: e.target.value}})}}
                                   
                               />
                           </Form.Item>

                           <Form.Item
                               label = "Quyền truy cập"
                               name = "permission"
                               rules = {[{
                                   required: true,
                                   message: "Quyên truy cập không được để trống"
                               }]}
                               initialValue = {this.state.newAccounts.Namepermission}
                           >
                               <Select  size = "large" 
                               onChange = {(value) => this.setState(
                                   {newAccounts: 
                                       {...this.state.newAccounts, permission: value, Namepermission: this.state.permissions.find((permission, index) => {
                                           return permission.MAQUYEN === value
                               }).TENQUYEN
                               }})}>
                                   {this.state.permissions.map((permission, index) => (
                                       <Option value = {permission.MAQUYEN} key = {permission.MAQUYEN}>{permission.TENQUYEN}</Option>
                                   ))}
                               </Select>
                           </Form.Item>
                           <Form.Item
                               label = "Trạng thái"
                               name = "state"
                           >
                               <Switch checkedChildren = "On" unCheckedChildren = "Off" checked = {this.state.newAccounts.state} className = {styles.fbackground} onChange = {() => this.setState({newAccounts : {...this.state.newAccounts, state: !this.state.newAccounts.state}})}>
                               </Switch>
                           </Form.Item>
                           <Button htmlType= 'submit' type = "primary"
                           block
                           >
                               {this.state.type === 1 ? 'Tạo tài khoản' : "Lưu"}
                           </Button>
                       </Form>
                }
                </Drawer>
            </div>
        )
    }
}
