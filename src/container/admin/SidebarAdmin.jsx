import React, { Component } from 'react'

import { UserOutlined, LaptopOutlined, NotificationOutlined, AreaChartOutlined } from '@ant-design/icons'

import { Image, Layout, Menu } from 'antd';

import styles from '../Shared.module.sass'
import { NavLink, withRouter } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu

class SidebarAdmin extends Component {
  render() {
    // console.log(this.props)
  return (
  <Sider theme='light' className={styles.rig_bgshadow + " " + styles.m_r_2}
        width='20vw'>
      <NavLink to='/'>
          <div span={24} className={styles.flex_center}>
              <Image src={require('../../img/logo.jpg')} className={styles.logo} />
          </div>
    </NavLink>
      <Menu
          onSelect = {
            (item) => {
              setTimeout(
                () => localStorage.setItem('pathToAdminPageForAdminReload', this.props.location.pathname) 
                , 1000
                )
              localStorage.setItem('menuselect', JSON.stringify({submenu: item.item.props.subMenuKey, item: item.key})) 
            }
          }
          
          mode="inline"
          >

            <Menu.Item key="db" icon={<AreaChartOutlined />} >
                <NavLink to='/admin/'>
                  Dashboard
                </NavLink>
              </Menu.Item>
            <SubMenu key="qlcc" icon={<NotificationOutlined />} title='Quản lý cây cảnh' >
            <Menu.Item key="ha" >
            <NavLink to='/admin/images'>
                Hình ảnh
            </NavLink>
            </Menu.Item>
            <Menu.Item key="lc" >
            <NavLink to='/admin/plantTypes'>
                Loại cây
            </NavLink>
            </Menu.Item>
            <Menu.Item key="cc" >
            <NavLink to='/admin/products'>
                Danh sách cây
            </NavLink>
            </Menu.Item>
            </SubMenu>
            <SubMenu key="qldh" icon={<LaptopOutlined />} title='Quản lý đơn hàng'>
            <Menu.Item key="ttdh" >
              <NavLink to = '/admin/order/state'>
                Tình trạng đơn hàng
              </NavLink>
              </Menu.Item>
            <Menu.Item key="dsdh">Danh sách đơn hàng</Menu.Item>
            </SubMenu>
            <SubMenu key="qltk" icon={<UserOutlined />} title='Quản lý tài khoản'>
            <Menu.Item key="dstk">

              <NavLink to='/admin/accounts'>
                  Danh sách tài khoản </NavLink>
              </Menu.Item>

            <Menu.Item key="dsnd" >
              <NavLink to='/admin/users'>
                Danh sách người dùng
              </NavLink>

            </Menu.Item>
              <Menu.Item key="qtc" >
                <NavLink to='/admin/permissions'>
                  Danh sách quyền truy cập
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="tkdt" icon={<NotificationOutlined />} title="Thống kê doanh thu">
            <Menu.Item key="tkkh">
              Theo khách hàng
            </Menu.Item>
            <Menu.Item key="tklc">
              Theo loại cây
            </Menu.Item>
          </SubMenu>
      </Menu>
  </Sider>
  )}
}

export default withRouter(SidebarAdmin)