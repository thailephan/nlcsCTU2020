let user = localStorage.getItem('user')
let refreshToken = localStorage.getItem('refreshToken')
let token = localStorage.getItem('token')
let menuselect = localStorage.getItem('menuselect')
let pathAdminReload = localStorage.getItem('pathToAdminPageForAdminReload')
let cart = localStorage.getItem('cart')
let pathUserReload = localStorage.getItem('pathToUserPage')

let userObject = JSON.parse(user)
let menuselectObject = JSON.parse(menuselect)
let cartObject = JSON.parse(cart)

// let menuselectResult = menuselectObject === null ? undefined : {...menuselectObject, submenu: menuselectObject.submenu.split('-')[0]}

let local = {
    user: userObject, refreshToken, token, menuselect: menuselectObject, pathAdminReload, cart : cartObject, pathUserReload
}
const resetTempLocal = () => {
    local.user = null
    local.refreshToken = null
    local.token = null
    local.menuselect = null
    local.pathAdminReload = null
    local.cart = null 
    local.pathUserReload = null
}
export { resetTempLocal }

export default local