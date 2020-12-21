import { Empty } from 'antd'
import React, { Suspense, lazy } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import UploadImg from '../Layout/tmp/UploadImg'
import UploadImgs from '../Layout/tmp/UploadImgs'

// import ProductDetail from '../pages/ProductDetail/ProductDetail'
// Layout mặc định xài cho từng nhóm người dùng
import Layout from '../Layout/_MainLayout'
import Logout from '../pages/Logout/Logout'
import { setAuthenication } from '../redux/features/User/UserSlice'
import { fetchPlants } from '../redux/features/Product/ProductSlice'
import local from '../utils/withTokenUser'


const LogupLazy = lazy(() => import('../pages/Logup/Logup'))
const LoginLazy = lazy(() => import('../pages/Login/Login'))
const HomeLazy = lazy(() => import('../pages/Home/Home'))
const ProductListLazy = lazy(() => import('../pages/ProductList/ProductList'))
const PersonalInfoLazy = lazy(() => import('../pages/PersonalInfo/PersonalInfo'))
const ResetPasswordLazy = lazy(() => import('./Sign/ForgetPassword/ForgetPassword'))
const ProductDetaillazy = lazy(() => import('../pages/ProductDetail/ProductDetail'))
const SearchResultlazy = lazy(() => import('../pages/SearchResult/SearchResult'))
const ShoppingCardlazy = lazy (() => import('../pages/ShoppingCart/ShoppingCart'))
const CheckoutLazy = lazy (() => import('../pages/Checkout/Checkout'))
const OrderHistoryLazy = lazy (() => import('../pages/OrderHistory/OrderHistory'))

const AdminLazy = lazy(() => import('../Layout/AdminLayout'))
const AdminResetPasswordLazy = lazy(() => import('../pages/ResetPassword/ResetPassword'))
const AdminAccountsLazy = lazy(() => import ('../pages/AdminAccounts/AdminAccounts'))
const AdminUsersLazy = lazy(() => import ('../pages/AdminUsers/AdminUsers'))
const AdminAccesPermissionLazy = lazy(() => import ('../pages/AccessPermission/AccessPermission'))
const AdminOrderStateLazy = lazy( () => import('../pages/AdminOrderState/AdminOrderState'))  
const AdminPlantlazy = lazy(() => import('../pages/AdminPlants/AdminPlants'))



const RouteConfig = ({user, plants, token, userCart, isAuthentication}) => {
        
    if(plants !== [])
      return (
        <Switch>

        <Route path = '/img'>
          <UploadImg />
        </Route>
        <Route path = '/imgs'>
          <UploadImgs />
        </Route>

        <Route path='/admin'>
        {(isAuthentication === false || user.MAQUYEN !== 1) 
        ? <Redirect to='/' /> 
        : null}

          <Suspense fallback = "Loading...">
            <AdminLazy>
              <Suspense fallback = "Loading...">
                  <Route exact path='/admin/profile/user'>
                    <PersonalInfoLazy />
                  </Route>
              </Suspense>
              <Suspense fallback = "Loading...">
                  <Route exact path='/admin/profile/reset-password'>
                    <AdminResetPasswordLazy token ={token}/>
                  </Route>
              </Suspense>

              
              <Suspense fallback = "Loading...">
                  <Route exact path='/admin/accounts'>
                    <AdminAccountsLazy token = {token}/>
                  </Route>
              </Suspense>

              <Suspense fallback = "Loading...">
                  <Route exact path='/admin/users'>
                    <AdminUsersLazy token ={token}/>
                  </Route>
              </Suspense>
              
              <Suspense fallback = "Loading...">
                  <Route exact path='/admin/permissions'>
                    <AdminAccesPermissionLazy token = {token}/>
                </Route>
              </Suspense>
              
              <Suspense fallback = "Loading...">
                  <Route exact path='/admin/order/state'>
                    <AdminOrderStateLazy token ={token}/>
                  </Route>
              </Suspense>

              <Suspense fallback = "Loading...">
                  <Route exact path='/admin/products'>
                    <AdminPlantlazy token ={token} plants = {plants}/>
                  </Route>
              </Suspense>

                <Route path = '/admin' exact >
                  Hello
                </Route>
            </AdminLazy>
        </Suspense>
      </Route>
      
        <Route exact path='/logout'>
          
          <Suspense fallback = "Loging out!!">
            <Logout token = {token}/>
          </Suspense>
        </Route>

        <Route path='/'>
          <Layout>
            {local.user && (user.MAQUYEN === 1 || local.user.MAQUYEN === 1)
            ? <Redirect to= {
              local.pathAdminReload !== null 
              ? local.pathAdminReload
              : '/admin'
            }/>
            : local.pathUserReload !== null ? <Redirect to= {
              local.pathUserReload !== '/logout' 
            ? local.pathUserReload 
            : '/logout'}/> : null}

          <Suspense fallback = "Loading...">
                  <Route exact path='/profile/user'>
                    <PersonalInfoLazy />
                  </Route>
              </Suspense>
              <Suspense fallback = "Loading...">
                  <Route exact path='/profile/reset-password'>
                    <AdminResetPasswordLazy />
                  </Route>
              </Suspense>
            
            <Suspense fallback = "Loading...">
              <Route exact path='/register'>
                <LogupLazy />
              </Route>
            </Suspense>
            
            <Suspense fallback = "Loading...">
              <Route exact path='/login'>
                <LoginLazy />
              </Route>
            </Suspense>
            
            <Suspense fallback = "Loading...">
              <Route exact path='/reset-password'>
                <ResetPasswordLazy />
              </Route>
            </Suspense>
            
            <Suspense fallback = "Loading...">
              <Route exact path='/products'>
                {plants.length ? 
                  <ProductListLazy />
                  : <div></div>}
              </Route>
            </Suspense>

            <Suspense fallback = "Loading...">
              <Route exact path='/'>
                {plants.length ? 
                  <HomeLazy/>
                  : <div></div>}
              </Route>
            </Suspense>
            
            <Suspense fallback = "Loading...">
              <Route exact path='/products/details/:id'>
                <ProductDetaillazy />
              </Route>
            </Suspense>

            <Suspense fallback = "Loading...">
              <Route exact path='/shopping-cart'>
                <ShoppingCardlazy />
              </Route>
            </Suspense>

            
            <Suspense fallback = "Loading...">
              <Route exact path='/order-history'>
                {( isAuthentication === false ) ? <Redirect to='/' /> : null}
                <OrderHistoryLazy />
              </Route>
            </Suspense>

            <Suspense fallback = "Loading...">
              <Route exact path='/search'>
                <SearchResultlazy />
              </Route>
            </Suspense>
            

            <Suspense fallback = "Loading...">
              <Route exact path='/check-out'>
                {( userCart.cart === [] ) ? <Redirect to='/' /> : null}
                <CheckoutLazy />
              </Route>
            </Suspense>

            
          </Layout>
        </Route>
        <Route>
          <Empty />
        </Route>
      </Switch>
    )
    else return <div>Loading....</div>

}
const mapStateToProps = state => {
  const {user, isAuthentication, token} = state.user
  const {plants} = state.product
  const {userCart} = state.cart

  return {user, isAuthentication, token, plants, userCart}
}

const mapDispatchToProps = {
  setAuthenication,
  fetchPlants
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteConfig)