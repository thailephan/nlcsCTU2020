import { createSlice } from '@reduxjs/toolkit'

import local from '../../../utils/withTokenUser'

const SidebarSlice = createSlice({
    name: 'product',
    initialState: {
        menu: {
            path: '',
            submenu: '0',
            item: 'tc',
        }
    },
    reducers: {
      initSidebar : (state, action) => {
          return {menu: {...local.menuselect, path: local.pathUserReload}}
      },
      setKeyforSidebar: (state, action) => {
        const submenu = action.payload.submenu.split('-')[0]

        localStorage.setItem('menuselect', JSON.stringify({submenu, item: action.payload.key})) 
                
        return { menu: {...state.menu,
            submenu: submenu, 
            item: action.payload.key, 
        }}
      },
      setPathForSidebar: (state, action) => {
        localStorage.setItem('pathToUserPage', action.payload.pathname) 
      },
      resetSidebar: (state, action) => {
            localStorage.removeItem('pathToUserPage')
          return {menu: {path: '', submenu: '0', item: 'tc'}}
      }
    },
})

export default SidebarSlice.reducer
export const { initSidebar, setKeyforSidebar, setPathForSidebar, resetSidebar } =  SidebarSlice.actions
