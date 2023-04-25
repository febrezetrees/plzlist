//imported in order of creation
import useTitle from './hooks/useTitle'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import PersistLogin from './features/auth/PersistLogin'
import { ROLES } from './config/roles'
import RequireAuth from './features/auth/RequireAuth'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
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
      </Route>

      {/* Protected routes */}
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[Object.values(ROLES)]} />}>
          <Route path="dash" element={<DashLayout />}>
            <Route index element={<Welcome />} />

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path=":id" element={<EditUser />} />
                <Route path="new" element={<NewUserForm />} />
              </Route>
              <Route path="items">
                <Route path=":id" element={<EditItem />} />
                <Route path="new" element={<NewItem />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App;
