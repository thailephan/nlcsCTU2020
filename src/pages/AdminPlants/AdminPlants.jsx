import React, { Component } from 'react'

import axios from 'axios'

import { Button, Table, Space, Input, Form, Select, InputNumber, Tooltip, Divider, Drawer } from 'antd'

import { UserAddOutlined, UserDeleteOutlined, SwapOutlined, SearchOutlined } from '@ant-design/icons'

import styles from '../styles.module.sass'

import Highlighter from 'react-highlight-words'
import { fetchPlants } from '../../redux/features/Product/ProductSlice'
import { connect } from 'react-redux'

const { Option } = Select
const { TextArea } = Input


class AdminPlants extends Component {

    state = {
        newPlant: {
            id: '',
            maloai: '',
            tenloai: '',
            tencaycanh: '',
            gianiemyet: 0,
            motangan: '',
            socayton: 0,
            motachitiet: ''
        },

        selectedFile: null,

        typePlant: [],
        idAccount: -1,
        type: 1,
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
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }} className={styles.sbackground}>
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
            title: 'Mã cây cảnh',
            dataIndex: 'MACAYCANH',
            align: 'center',
            ...this.getColumnSearchProps('MACAYCANH')
        },
        {
            title: 'Loại cây',
            dataIndex: 'TENLOAI',
            align: 'center',
            ...this.getColumnSearchProps('TENLOAI')
        },
        {
            title: 'Tên cây cảnh',
            dataIndex: 'TENCAYCANH',
            align: 'center',
            ...this.getColumnSearchProps('TENCAYCANH')
        },
        {
            title: 'Giá niêm yết',
            dataIndex: 'GIANIEMYET',
            align: 'center',
            ...this.getColumnSearchProps('GIANIEMYET')
        },
        {
            title: 'Mô tả ngắn',
            dataIndex: 'MOTANGAN',
            align: 'center',
            ...this.getColumnSearchProps('MOTANGAN'),
            ellipsis: {
                showTitle: false
            },
            render: description => (
                <Tooltip placement="topLeft" title={description}>
                  {description}
                </Tooltip>
              ),
        },
        {
            title: 'Số cây sẳn có',
            dataIndex: 'SOCAYTON',
            align: 'center',
            ...this.getColumnSearchProps('SOCAYTON')
        },
    ]

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = async e => {
        console.log(e)        
        console.log(this.state)
        let response
        
        const data = new FormData()
        if(this.state.selectedFile !== null){
            
            for (let x = 0; x < this.state.selectedFile.length; x++) {
                // console.log(this.state.selectedFile[x])
                data.append('file', this.state.selectedFile[x])
            }

        } 
        const config = {
            headers: {
                'content-type': "multipart/form-data",
            }
        }

        let res
        try {
            if (this.state.type === 0) {
                response = await axios.post(`/admin/products/update/${this.state.newPlant.id}`, {
                    token: this.props.token,
                    ...this.state.newPlant,
                })

                data.append('plantID', this.state.newPlant.id)

            } else if (this.state.type === 1) {
                response = await axios.post('/admin/products/add', {
                    ...this.state.newPlant,
                    token: this.props.token
                } , {
                    headers: {
                        "x-access-token": this.props.token,
                    }
                })
            }
            res = response.data
            
        } catch (err) {
            console.log(err)
        }
        // console.log(res)

        if (!res.isSuccess) {
            alert("Có lỗi xảy ra vui lòng thử lại sau")
        } else {
            alert("Thành công")
        }

        if(this.state.selectedFile !== null && this.state.selectedFile.length > 0) {
            await axios.post('/upload', data, config)
        }

        this.props.fetchPlants()

        this.setState({
            type: 1,
            newPlant: {
                id: '',
                maloai: '',
                tenloai: '',
                tencaycanh: '',
                gianiemyet: 0,
                motangan: '',
                socayton: 0,
                motachitiet: ''
            },
            fileList : [],
            visible: false
        });};
        
    onChangeHandler = event=>{
        this.setState({
            selectedFile: event.target.files,
        })
        }

    onEdit = async (e) => {
        this.setState({newPlant: {
            tencaycanh : e.TENCAYCANH,
            id: e.MACAYCANH,
            gianiemyet: e.GIANIEMYET,
            maloai: e.MALOAI[0],
            socayton: e.SOCAYTON,
            tenloai: e.TENLOAI,
            motachitiet: e.MOTACHITIET,
            motangan: e.MOTANGAN
        },
            type: 0, 
            visible: true,
        })
        console.log(this.state.newPlant)
        // console.log(e)
    }

    onDelete = async (e) => {
        let response, result
        // console.log(e)
        try{

             response = await axios.post(`/admin/products/delete/${e.MACAYCANH}`, {
                token: this.props.token,
            })
            result = await response.data
            console.log("Delete From adminPlants" ,result)
        } catch (err) {
            console.log(err)
        }

        this.props.fetchPlants()
        
        console.log(result)
        this.setState({
            plants: this.props.plants.filter((value, index) => {
                return value.MACAYCANH !== e.MACAYCANH
            })
        })
    };

    handleCancelModal = e => {
        this.setState({
            visible: false,
            type: 1
        });
        // console.log(this.state)
    };


    async componentDidMount() {
        if (this.state.typePlant.length === 0) {
            const responseUser = await axios.get('/admin/species', {
                headers: { "x-access-token": this.props.token }
            })
            const typePlant = await responseUser.data

            this.setState({ typePlant })
        }
    }

    render() {

        this.columns[6] =
        {
            title: '',
            dataIndex: 'action',
            align: 'center',
            render: (_, record) => (
                <div>
                    <Button icon={<SwapOutlined />} htmlType="button" type="primary" className={styles.m1} onClick={() => this.onEdit(record)}>Sửa</Button>
                    <Button icon={<UserDeleteOutlined />} htmlType="button" className={styles.sbackground + " " + styles.m1} onClick={() => this.onDelete(record)} >Xóa</Button>
                </div>
            )
        }
        return (
            <div>
                <div className={styles.h3}>Danh sách cây cảnh</div>
                <Button icon={<UserAddOutlined />} type="primary" htmlType="button" className={styles.m1} onClick={() => this.showModal()}>Thêm</Button>
                {this.props.plants.length === 0 ? null : <Table columns={this.columns} dataSource={this.props.plants} size="middle" />}
                <Drawer
                    title="Cây cảnh"
                    visible={this.state.visible}
                    destroyOnClose={true}
                    placement = 'top'
                    closable = {true}
                    key = 'top'
                    height = {'80vh'}
                    onClose = {() => {
                        this.setState({
                            type: 1,
                            newPlant: {
                                id: '',
                                maloai: '',
                                tenloai: '',
                                tencaycanh: '',
                                gianiemyet: 0,
                                motangan: '',
                                socayton: 0,
                                motachitiet: ''
                            },
                            fileList : [],
                            visible: false
                        });
                    }}
                >
                    <Form
                        labelCol={{ span: 8 }}
                        validateTrigger = 'onBlur'
                        onFinish = {this.handleOk}
                        style = {{width: '50vw', margin: 'auto'}}
                        name = "Plant"
                        onFinishFailed = {(e) => console.log(e)}
                    >
                        <p className={styles.h3}>Thông tin cây cảnh</p>
                        <Form.Item
                            label="Tên cây cảnh"
                            name="plantName"
                            initialValue = {this.state.newPlant.tencaycanh}
                            rules={[{
                                required: true,
                                message: "Tên cây cảnh không được để trống"
                            },{
                                pattern: '^[ a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ|_]*$',
                                message: "Tên cây cảnh không được chứa ký tự đặc biệt, phải gồm chữ cái hoặc số"   
                            }
                        ]}
                        >
                            <Input
                                placeholder='Tên cây cảnh'
                                size="large"
                                onChange={(e) => { this.setState({ newPlant: { ...this.state.newPlant, tencaycanh: e.target.value } }) }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Giá niêm yết"
                            name='basePrice'
                            initialValue = {this.state.newPlant.gianiemyet}
                            rules = {[{
                                required: true,
                                message: 'Giá niêm yết không được để trống'
                            }
                        ]}
                        >
                            <InputNumber
                                placeholder='100000'
                                size="large"
                                onChange={(value) => { this.setState({ newPlant: { ...this.state.newPlant, gianiemyet: value } }) }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Loại cây cảnh"
                            name = 'tenloai'
                            initialValue = {this.state.newPlant.tenloai ? this.state.newPlant.tenloai : 'Chọn loại cây'}
                            rules = {[{
                                required: true,
                                message: 'Loại cây không được để trống'
                            }]}
                        >
                            <Select size="large"
                                onChange={(value) => this.setState(
                                    {
                                        newPlant:
                                        {
                                            ...this.state.newPlant, maloai: value, tenloai: this.state.typePlant.find((type, index) => {
                                                return type.MALOAI === value
                                            }).TENLOAI
                                        }
                                    })}>
                                {this.state.typePlant.map((type, index) => (
                                    <Option value={type.MALOAI} key={type.MALOAI}>{type.TENLOAI}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Mô tả ngắn"
                            name="shortDescription"
                            initialValue = {this.state.newPlant.motangan}
                            rules = {[{
                                required: true,
                                message: 'Mô tả không được trống'
                            }, {
                                min: 20,
                                message: "Mô tả không được ít hơn 20 ký tự"
                            }
                        ]}
                        >
                            <TextArea
                                showCount
                                maxLength={200}
                                rows={4}
                                placeholder='Mô tả ngắn sản phẩm'
                                size="large"
                                onChange={(e) => { this.setState({ newPlant: { ...this.state.newPlant, motangan: e.target.value } }) }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả chi tiết"
                            name="detailDescription"
                            initialValue = {this.state.newPlant.motachitiet}
                            rules = {[{
                                message: "Mô tả không được ít hơn 50 ký tự",
                                min: 50
                            }]}
                        >
                            <TextArea
                                showCount
                                maxLength={1000}
                                rows={4}
                                placeholder='Mô tả chi tiết sản phẩm'
                                size="large"
                                onChange={(e) => { this.setState({ newPlant: { ...this.state.newPlant, motachitiet: e.target.value } }) }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Số cây sẳn có"
                            name='available'
                            initialValue = {this.state.newPlant.socayton || 1}
                            rules = {[{
                                required: true,
                                message: 'Số cây không được trống'
                            },
                        ]}
                        >
                            <InputNumber
                                placeholder='0'
                                size="large"
                                min = {1}
                                onChange={(value) => { this.setState({ newPlant: { ...this.state.newPlant, socayton: value } }) }}
                            />
                        </Form.Item>
                        <Button type = "primary" htmlType = 'submit' block>
                            {this.state.type === 1 ? 'Thêm cây mới' : 'Cập nhật cây'}
                        </Button>
                    </Form>
                    <Divider></Divider>
                    <div>
                    <p className = {styles.h3}>Hình ảnh</p>
                    <input type="file" multiple name = 'files' onChange={this.onChangeHandler}/>
                    </div>
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {plants} = state.product
    return { plants }
}

const mapDispatchToProps = {
    fetchPlants
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPlants)