import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Header from '../components/Header'

const AdminPage = () => {
    const [users, setUsers] = useState([])
    useEffect(() => {
        axios.get('/api/users').then((res) => {
            setUsers(res.data)
        }).catch((error) => {
            console.log('Error in mylist users ', error);
        })
    }, [])

    const handleDeleteUser = async (userId) => {
        try {
            // Make a DELETE request to delete the user by ID
            await axios.delete(`/api/users/${userId}`);

            // Remove the deleted user from the local state
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            toast.success('User deleted successfully !')
        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    return (
        <div className='admin'>
            <Header />
            <div className="admList">
                <h1>All Users</h1>
                <div>
                    {users.map((user) => (
                        <div className='admUsers' key={user._id}>
                            {user.role === 0 ? (<>
                                <div className="admUser">
                                <p>Name: {user.name}</p>
                                <p>Username: {user.username}</p>
                                </div>
                                <div >
                                <button className="btn" onClick={() => handleDeleteUser(user._id)}> Delete</button>
                                </div>
                            </>
                            ) : (
                                <><p className='admName'>Admin: {user.name}</p></>
                            )}
                            {/* Render other user fields as needed */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminPage