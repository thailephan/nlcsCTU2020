import React, { Component } from 'react'

import { Image, Layout, Menu, Drawer, Button } from 'antd';

import styles from '../Shared.module.sass'
import { NavLink, withRouter } from 'react-router-dom';

import Avatar from 'antd/lib/avatar/avatar';
import PopoverContent from '../../components/PopoverContent/PopoverContent';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import local from '../../utils/withTokenUser'
import SearchBar from '../../components/SearchBar/SearchBar';

import { setKeyforSidebar } from '../../redux/features/Sidebar/SidebarSlice'

const { Sider } = Layout;

const links = [
    { linkClient: '/profile/user', value: "Thông tin cá nhân" },
    { linkClient: '/order-history', value: "Lịch sử đơn hàng" },
    { linkClient: '/profile/reset-password', value: "Đổi mật khẩu" },
    { linkClient: '/logout', value: "Đăng xuất" },
]

class SidebarUser extends Component {
    constructor (props) {
      super(props)
      this.state = { 
        visible: false, 
        placement: 'left',
        searchVisible: false,
        searchPlacement: 'top',

        // selectedMenuItem: local.menuselect !== undefined
        // ? local.menuselect.item 
        // : 'tc',
        
        // selectedSubMenu: local.menuselect !== undefined
        // ? local.menuselect.submenu 
        // : '',
  
      };
    }
    
    showSearchDrawer = () => {
      this.setState({
        searchVisible: true,
      });
    };
  
    onSearchClose = () => {
      this.setState({
        searchVisible: false,
      });
    };

    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };
  
    onClose = () => {
      this.setState({
        visible: false,
      });
    };

    render() {
      // console.log(this.state)
      const { visible, placement, searchPlacement, searchVisible} = this.state
      const { isAuthentication, menu, setKeyforSidebar} = this.props
      

        return (
      <Sider theme = 'light' className = {styles.rig_bgshadow + " " + styles.m_r_2 }
          style = {{position: 'fixed', top: 0, left: 0}}
        width = '20vw'>
          
          <Drawer
              title="Tìm kiếm"
              placement={searchPlacement}
              closable={false}
              height = {'60vh'}
              onClose={this.onSearchClose}
              visible={searchVisible}
              key={searchPlacement}
              mask = {true}
            >
              <SearchBar onSearchClose = {this.onSearchClose}/>
            </Drawer>

          <NavLink to  = '/' >
            <div span = {24} className = {styles.flex_center}>
              <Image src = {require('../../img/logo.jpg')} className = {styles.logo} />
            </div>
          </NavLink>
          
          
          <Button 
              onClick = {this.showSearchDrawer} 
              style = {{padding: '20px', width: '100%', height: '64px'}}
              htmlType = "button"
              className = {styles.fbackground}
            >
              Tìm kiếm <SearchOutlined />
            </Button>

          <Menu
            onSelect = {(item) => 
              {
                setKeyforSidebar({submenu: item.item.props.subMenuKey, key: item.key})
              }
            }
            style = {{textAlign: 'right'}}
            selectedKeys = {[menu.item]}
            mode="inline"
            defaultOpenKeys = {[menu.submenu]}
            // defaultSelectedKeys={[menu.item]}
          >

            <Menu.Item key="tc">
              
              <NavLink to = '/'
              >
                Trang chủ
              </NavLink>
              
            </Menu.Item>
            
            <Menu.Item key="cc">
              
              <NavLink to = '/products'>
                Cây cảnh
              </NavLink>
              
            </Menu.Item>

            <Menu.Item key="gh">
              
              <NavLink to = '/shopping-cart'>
                Giỏ hàng
              </NavLink>
              
            </Menu.Item>

            {isAuthentication === false ? <>
              <Menu.Item key="dk">
              <NavLink to = '/register'>
                Đăng ký
              </NavLink>
            </Menu.Item>
              <Menu.Item key="dn">
                <NavLink to = "/login">
                  Đăng nhập
                </NavLink>
              </Menu.Item>
            </> : null    
            }
              
          </Menu>
              {isAuthentication !== false ? <>
                <Drawer
                  title="Danh sách tùy chọn"
                  placement = {placement}
                  closable={false}
                  onClose={() => this.onClose()}
                  visible={visible}
                  key={placement}
                  mask = {true}
                >
                  <PopoverContent links = {links} />
                </Drawer>
                <div className = {styles.flex_center}>
                <p onClick = {() => this.showDrawer()}>
                  <Avatar
                    style = {{margin: '10px', marginTop: '5vh'}}
                    className = {styles.fbackground}
                    size="large"
                  >
                      {<UserOutlined />}
                    </Avatar>
                </p>
                </div>
              </> : null
              }
      </Sider>
    )}
}
const mapStateToProps = state => {
  const {user, isAuthentication} = state.user
  const { menu } = state.sidebar

  return {user, isAuthentication, menu}
}

const mapDispatchToProps = {
  setKeyforSidebar
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SidebarUser))