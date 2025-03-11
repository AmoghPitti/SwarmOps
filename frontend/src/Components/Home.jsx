import { useState, useEffect } from "react";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom"; 
import axios from 'axios';
import logo from '../assets/logo.png';
 
const Home = () => {
    const url = "/api/";
    const { isDarkTheme } = useTheme(); 
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); 
    const [homeData, setHomeData] = useState([]);
 
    useEffect(() => {
        const fetchHome = async () => {
            try {
                const response = await axios.get(url);
                setHomeData(response.data);
            } catch (error) {
                setError(error.response ? error.response.data : 'Error fetching home endpoint');
            } finally {
                setIsLoading(false);
            }
        };
 
        fetchHome();
    }, []);
 
    if (isLoading) {
        return <div className="text-center mt-4">Loading...</div>;
    }
 
    if (error) {
        return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
    }
 
    return (
        <div className={`h-screen flex flex-col items-center justify-center ${isDarkTheme ? 'bg-gray-900' : 'bg-white'} p-4`}>
            <div className="flex items-center justify-center mb-6">
                <img src={logo} alt="SwarmOps Icon" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mr-2 align-middle" />
                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold ${isDarkTheme ? 'text-white' : 'text-blue-500'}`}>SwarmOps</h1>
            </div>
 
            <div className="w-1/2 sm:w-3/4 md:w-1/2 h-1 bg-blue-500 mb-6"></div>
 
            <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
                <h1 className={`text-4xl sm:text-5xl md:text-7xl font-extrabold ${isDarkTheme ? 'text-white' : 'text-blue-600'} mb-4`}>
                    Simplify Swarm Management
                </h1>
                <p className={`text-lg sm:text-xl md:text-2xl ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    Your services, one click away.
                </p>
                <p className={`text-lg sm:text-xl md:text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-500'} mb-6`}>
                    Access images by clicking on the{" "}
                    <span
                        onClick={() => navigate('/services')}
                        className={`${isDarkTheme ? 'text-blue-400' : 'text-blue-600'} underline cursor-pointer hover:text-blue-500`}
                    >
                        Services
                    </span>{" "}
                    option in the navigation panel.
                </p>
                <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg mt-6`}>
                  <h2 className={`text-2xl sm:text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-blue-600'} mb-4`}>
                      Why Choose SwarmOps?
                  </h2>
                  <p className={`text-gray-700 dark:text-gray-300 mb-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                      Centralize all your needs in one place.
                      No more switching between platforms—everything is streamlined and easy to access.
                  </p>
                  <p className={`text-gray-700 dark:text-gray-300 mb-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                      Whether you are managing a few services or handling a large infrastructure, SwarmOps will save you time and effort with its user-friendly interface.
                  </p>
                </div>
            </div>
 
            <div className={`text-center mt-8 mb-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-500'}`}>
                <p>© 2024 SwarmOps. All rights reserved.</p>
            </div>
        </div>
    );
};
 
export default Home;
