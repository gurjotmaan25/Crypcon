import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Show from './pages/Show';
import Mylist from './pages/Mylist';
import {Toaster} from 'react-hot-toast'
import './index.css';
import { AuthProvider } from './context/auth';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PrivateRoute from './components/Routes/Private';
import AdminPage from './pages/AdminPage';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
    <BrowserRouter>
    <Toaster/>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/:id" element={<Show />} />
        {/* <Route path="/mylist" element={<Mylist />} /> */}
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/mylist' element={<PrivateRoute />}>
          <Route path={``} element={<Mylist />} />
          {/* <Route path={`/${auth?.user?.username}`} element={<Mylist/>} /> */}
        </Route>
        <Route path='/admin' element={<PrivateRoute />}>
          <Route path={``} element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
);
