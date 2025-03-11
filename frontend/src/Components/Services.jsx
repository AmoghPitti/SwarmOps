import { useState, useEffect, useRef } from "react";
import { useTheme } from "../Context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loadingGif from '../assets/loadinggif.gif';
import './styles.css';
import {
  faTrash,
  faPen,
  faEllipsisV,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Services = () => {
  const { isDarkTheme, userRole, isLoggedIn } = useTheme(); // Assuming userRole and isLoggedIn are provided by your context
  const navigate = useNavigate();
  const [servicesData, setServicesData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerms, setSearchTerms] = useState([]);
  const [editableService, setEditableService] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const url = "/api/services";

  const fetchServices = async () => {
    try {
      const response = await axios.get(url);
      setServicesData(response.data);
    } catch (error) {
      setError(
        error.response ? error.response.data : "Error fetching services"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownRef = useRef();
  if (isLoading) {
    return (
      <div className="loading-container">
        <img src={loadingGif} alt="Loading..." className="loading-gif" />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  const handleSearch = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setSearchTerms([...searchTerms, e.target.value.trim().toLowerCase()]);
      e.target.value = "";
    }
  };

  const removeSearchTerm = (term) => {
    setSearchTerms(searchTerms.filter((t) => t !== term));
  };

  const filteredServices = servicesData.filter((service) => {
    return searchTerms.every((term) => {
      return (
        service.name?.toLowerCase().includes(term) ||
        service.id?.toLowerCase().includes(term) ||
        `${service.pub_port}:${service.tar_port}`
          .toLowerCase()
          .includes(term) ||
        (service.image ?? "").toLowerCase().includes(term) ||
        (service.replicas ?? "").toString().includes(term) ||
        (service.version ?? "").toString().includes(term) ||
        (service.created_at ?? "").toLowerCase().includes(term)
      );
    });
  });

  const handleEditClick = (service) => {
    console.log("is logged in:", isLoggedIn)
    console.log("user role:",userRole);
    if (!isLoggedIn) {
      toast.warn("Login Required")
      navigate("/login");
      return;
    }
    if (userRole !== "admin" && userRole !== "superadmin") {
      toast.warn("You do not have permission to edit this service.");
      return;
    }
    setEditableService(service);
    setDropdownOpen(null);
  };

  const handleSaveClick = async (service) => {
    try {
      setIsLoading(true);
      const payload = {
        name: service.name,
        replicas: service.replicas,
        pub_port: service.pub_port,
        tar_port: service.tar_port,
      };
      await axios.post(`${url}/update/${service.id}`, payload);
      toast.success("Service Updated Successfully")
      await fetchServices();
      setEditableService(null);
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Error Occured "+error.message)
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!isLoggedIn) {
      toast.warn("Login Required");
      navigate("/login");
      return;
    }
    if (userRole !== "superadmin") {
      toast.warn("You do not have permission to delete this service.");
      return;
    }
    try {
      const response = await axios.delete(`/api/services/delete/${id}`);
      toast.success("Service deleted successfully!");
      await fetchServices();
      console.log(response.data.message);
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("An error occurred while deleting the service.");
    }
  };

  const handleDropdownToggle = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <>
    <div className={`${
      isDarkTheme ? "bg-black text-white" : "bg-white text-black"
    } h-screen`}>
      {isLoading && <div className="spinner">Loading...</div>}
      <div className="flex justify-between items-center">
        <Link
          to="/services"
          className={`ml-3 text-3xl font-bold ${
            isDarkTheme
              ? "text-gray-300 hover:text-white"
              : "text-gray-700 hover:text-black"
          }`}
        >
          Services
        </Link>
      </div>
      <div className="p-4 bg-white">
        <label htmlFor="table-search" className="sr-only">Search</label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className={isDarkTheme ? "w-5 h-5 text-gray-400" : "w-5 h-5 text-gray-500"}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className={`${
              isDarkTheme
                ? "bg-gray-700 border border-gray-600 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 pr-10 py-2"
                : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 pr-10 py-2"
            }`}
            placeholder="Type and press Enter to add filter"
            onKeyDown={handleSearch}
          />
        </div>
        <div className="mt-2">
          {searchTerms.map((term, index) => (
            <span
              key={index}
              className={
                isDarkTheme
                  ? "inline-block bg-gray-600 text-gray-400 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded"
                  : "inline-block bg-gray-200 text-gray-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded"
              }
            >
              {term}
              <button
                onClick={() => removeSearchTerm(term)}
                className={
                  isDarkTheme
                    ? "ml-2 text-red-600 hover:text-red-800"
                    : "ml-2 text-red-900 hover:text-red-700"
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      <div className={isDarkTheme ? "shadow-md sm:rounded-lg bg-black" : "shadow-all-sides sm:rounded-lg bg-white"}>
        <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-200px)]">
          <table className={isDarkTheme ? "min-w-full border border-gray-600 text-sm text-left text-gray-400" : "min-w-full border text-sm text-left text-gray-500"}>
            <thead className={isDarkTheme ? "text-xs text-gray-300 uppercase bg-gray-800" : "text-xs text-white uppercase bg-delftBlue"}>
              <tr>
                <th scope="col" className="px-6 py-3 text-base text-center">Name of the Service</th>
                <th scope="col" className="px-6 py-3 text-base text-center">ID</th>
                <th scope="col" className="px-6 py-3 text-base text-center">Image Name</th>
                <th scope="col" className="px-6 py-3 text-base text-center">Published Port : Target Port</th>
                <th scope="col" className="px-6 py-3 text-base text-center">Replicas</th>
                <th scope="col" className="px-6 py-3 text-base text-center">Version</th>
                <th scope="col" className="px-6 py-3 text-base text-center">Creation Time</th>
                <th scope="col" className="px-6 py-3 text-base text-center"></th>
                <th scope="col" className="px-6 py-3 text-base text-center"></th>
              </tr>
            </thead>
            <tbody>
            {filteredServices.map((data) => (
              <tr className={`border-b text-center ${isDarkTheme ? "border-gray-700 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-200"} `} key={data.id}>
                <td className={`px-6 py-4 font-medium ${isDarkTheme ? "text-gray-400" : "text-blue-600"}`}>
                  {editableService?.id === data.id ? (
                    <input
                      type="text"
                      value={editableService.name}
                      onChange={(e) =>
                        setEditableService({
                          ...editableService,
                          name: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded p-1 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  ) : (
                    data.name ?? "Null"
                  )}
                </td>
                <td className={`px-6 py-4 font-medium ${isDarkTheme ? "text-gray-400" : "text-gray-900"}`}>
                  {data.id ?? "Null"}
                </td>
                <td className={`px-6 py-4 font-medium ${isDarkTheme ? "text-gray-400" : "text-blue-600 underline"}`}>
                  {data.image ?? "Null"}
                </td>
                <td className={`px-6 py-4 font-medium ${isDarkTheme ? "text-gray-400" : "text-gray-900"}`}>
                  {editableService?.id === data.id ? (
                    <input
                      type="text"
                      value={`${editableService.pub_port}:${editableService.tar_port}`}
                      onChange={(e) => {
                        const [pubPort, tarPort] = e.target.value.split(":");
                        setEditableService({
                          ...editableService,
                          pub_port: pubPort,
                          tar_port: tarPort,
                        });
                      }}
                      className="border border-gray-300 rounded p-1 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  ) : (
                    `${data.pub_port}:${data.tar_port}` ?? "Null"
                  )}
                </td>
                <td className={`px-6 py-4 font-medium ${isDarkTheme ? "text-gray-400" : "text-gray-900"}`}>
                  {editableService?.id === data.id ? (
                    <input
                      type="number"
                      value={editableService.replicas ?? ""}
                      onChange={(e) =>
                        setEditableService({
                          ...editableService,
                          replicas: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded p-1 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  ) : (
                    data.replicas ?? "Null"
                  )}
                </td>
                <td className={`px-6 py-4 font-medium ${isDarkTheme ? "text -gray-400" : "text-gray-900"}`}>
                  {data.version ?? "Null"}
                </td>
                <td className={`px-6 py-4 font-medium ${isDarkTheme ? "text-gray-400" : "text-gray-900"}`}>
                  {data.created_at ?? "Null"}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        onClick={() => handleDropdownToggle(data.id)}
                        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200"
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                    </div>
                    {dropdownOpen === data.id && (
                      <div
                        ref={dropdownRef}
                        className={`absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                      >
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          <button
                            onClick={() => handleEditClick(data)}
                            className="flex items-center block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                          >
                            <FontAwesomeIcon icon={faPen} className="mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => (window.location.href = `/services/inspect/${data.id}`)}
                            className="flex items-center block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                          >
                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                            Inspect
                          </button>
                          <button
                            onClick={() => handleDeleteClick(data.id)}
                            className="flex items-center block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {editableService?.id === data.id && (
                    <button
                      onClick={() => handleSaveClick(editableService)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      <FontAwesomeIcon icon={faCircleCheck} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default Services;