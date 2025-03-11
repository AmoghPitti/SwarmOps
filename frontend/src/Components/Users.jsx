import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faCircleCheck, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../Context/ThemeContext'
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const navigate = useNavigate();
  // const { userName } = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      //toast.success('Users fetched successfully!');
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user.username);
    setNewRole(user.role);
  };

  const handleSave = async (username) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/editUser/${username}`, { role: newRole }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setEditUser(null);
      fetchUsers();
      toast.success('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error updating user role.');
    }
  };

  const handleDelete = async (username) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/deleteUser/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchUsers();
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user.');
    }
  };

  const handleAddUser = () => {
    navigate('/adduser');
  };

  return (
    <>
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="ml-3 text-4xl font-bold text-gray-900">Users</h1>
        <button
          onClick={handleAddUser}
          className="bg-delftBlue text-white px-4 py-2 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Add User
        </button>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 shadow-md sm:rounded-lg">
          <thead className="bg-delftBlue text-white">
            <tr>
              <th className="py-3 px-6 text-center">Name</th>
              <th className="py-3 px-6 text-center">Email</th>
              <th className="py-3 px-6 text-center">Role</th>
              <th className="py-3 px-6 text-center">Edit</th>
              <th className="py-3 px-6 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.username} className="border-b hover:bg-gray-200">
                <td className="py-3 px-6 text-center">{user.username}</td>
                <td className="py-3 px-6 text-center text-blue-700">{user.email}</td>
                <td className="py-3 px-6 text-center">
                  {editUser === user.username ? (
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">SuperAdmin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editUser === user.username ? (
                    <button onClick={() => handleSave(user.username)} className="text-green-600">
                      <FontAwesomeIcon icon={faCircleCheck} />
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(user)} className="text-blue-600">
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  
                  <button onClick={() => handleDelete(user.username)} className="text-red-600">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
    </div>
    </>
  );
};

export default Users;
