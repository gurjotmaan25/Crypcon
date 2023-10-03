import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import { FaBars } from "react-icons/fa"
import { FaTimes } from "react-icons/fa"


const Header = () => {
  const [auth, setAuth] = useAuth()
  const [Sidebar, setSidebar] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      setAuth({
        ...auth,
        user: null,
        token: ''
      })
      localStorage.removeItem('auth')
      window.location.href = '/login';
      toast.success('User Logged out')
    }
  }

  return (
    <header className='header'>
      <div className='title'>
        <h1>
          <Link to='/'>CRYPCON </Link>
        </h1>
      </div>
      <div className={`overlay ${Sidebar ? 'active' : ''}`} onClick={() => setSidebar(false)}></div>
      <div className={`watch ${Sidebar ? 'watch-active' : ''}`} onClick={()=> setSidebar(false)}>
        {
          auth.user ? (<>
            {
              auth.user.role === 1 ? (
                <>
                   
                  <div className='navcross'>
                  <button className="mobbtn" onClick={() => setSidebar(!Sidebar)}>
                    <i className="fas fa-times"> <FaTimes /> </i>
                    </button>
                  </div>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/mylist'}>My Watchlist</Link>
                    <Link to={'/admin'}>Admin Page</Link>
                    <Link onClick={handleLogout} >Logout</Link>
                  {/* </div> */}
                </>
              ) : (
                <>
                  <div className='navcross'>
                  <button className="mobbtn" onClick={() => setSidebar(!Sidebar)}>
                    <i className="fas fa-times"> <FaTimes /> </i>
                    </button>
                  </div>
                  <Link to={'/'}>Home</Link>
                  <Link to={'/mylist'}>My Watchlist</Link>
                  <Link onClick={handleLogout}>Logout</Link>
                </>
              )
            }
          </>) : (
            <>
              <div className='navcross'>
                    <button className="mobbtn" onClick={() => setSidebar(!Sidebar)}>
                    <i className="fas fa-times"> <FaTimes /> </i>
                    </button>
                  </div>
              <Link to={'/'}>Home</Link>
              <Link to='/register'>SignUp</Link>
              <Link to='/login'>Login</Link>
            </>
          )
        }
      </div>
      <div>
        <button className="mobbtn" onClick={() => setSidebar(!Sidebar)}>
          <i className="fas fa-bars"> <FaBars /> </i>
          {/* {Sidebar ? (<i className="fas fa-times"> <FaTimes /> </i>): (<i className="fas fa-bars"> <FaBars /></i>)} */}
        </button>
      </div>
    </header>
  )
}

export default Header