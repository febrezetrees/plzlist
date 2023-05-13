//imported in order of creation
import useTitle from './hooks/useTitle'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import PersistLogin from './features/auth/PersistLogin'
import { ROLES } from './config/roles'
import RequireAuth from './features/auth/RequireAuth'
import Prefetch from './features/auth/Prefetch'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import ItemsList from './features/items/ItemsList'
import EditItem from './features/items/EditItem'
import NewItem from './features/items/NewItem'

function App() {
  useTitle('App')

  return (
    <Routes>

      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>

              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="items">
                  <Route index element={<ItemsList />} />
                  <Route path=":id" element={<EditItem />} />
                  <Route path="new" element={<NewItem />} />
                </Route>

              </Route>
              {/*end dash*/}
            </Route>
          </Route>
          {/*end protected routes - RequireAuth*/}
        </Route>
      </Route>

    </Routes>
  )
}

export default App
