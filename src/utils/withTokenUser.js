const user = localStorage.getItem('user')
const refreshToken = localStorage.getItem('refreshToken')
const token = localStorage.getItem('token')
const menuselect = localStorage.getItem('menuselect')
const pathAdminReload = localStorage.getItem('pathToAdminPageForAdminReload')
const cart = localStorage.getItem('cart')
const pathUserReload = localStorage.getItem('pathToUserPage')

const userObject = JSON.parse(user)
const menuselectObject = JSON.parse(menuselect)
const cartObject = JSON.parse(cart)

// const menuselectResult = menuselectObject === null ? undefined : {...menuselectObject, submenu: menuselectObject.submenu.split('-')[0]}

export default {user: userObject, refreshToken, token, menuselect: menuselectObject, pathAdminReload, cart : cartObject, pathUserReload}