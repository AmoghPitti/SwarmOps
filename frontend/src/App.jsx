import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
// import HorNav from './Components/HorNav';
import Nodes from './Components/Nodes';
import Services from './Components/Services';
import Home from './Components/Home';
import { ThemeProvider, useTheme } from './Context/ThemeContext';
import AddUser  from './Components/AddUser.jsx';
import ServiceInspect from './Components/ServiceInspect.jsx';
import Login from './Components/Login.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import Unauthorized from './Components/Unauthorized.jsx';
import Users from './Components/Users.jsx';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  //const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  // <HorNav/>

  return (
    <ThemeProvider>
      <BrowserRouter>
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <MainContent isSidebarOpen={isSidebarOpen} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

const MainContent = ({ isSidebarOpen }) => {
  const { isDarkTheme } = useTheme();
  const {isLoggedIn, userRole } = useTheme();

  return (
    <>
    <div className={`transition-all duration-100 ${isSidebarOpen ? 'ml-64' : 'ml-16'} p-4 ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nodes" element={<Nodes />} />
        <Route path="/services" element={<Services />} />
        <Route
          path="/adduser"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole}>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="/services/inspect/:id" element={<ServiceInspect/>}/>
        <Route path="/login" element={<Login  />} />
        <Route path="/unauthorized" element={<Unauthorized/>}/>
      </Routes>
    </div>
    <ToastContainer />
    </>
  );
};

export default App;