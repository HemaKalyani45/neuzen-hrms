import axios from 'axios';

const api = axios.create({
 
   baseURL:'http://localhost:5000/api/'
   //   baseURL: "https://neuzen-hrms-vcav.vercel.app/api",

  
  // headers: {
  //   'Content-Type': 'application/json'
  // }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('neuzen_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('neuzen_token');
      localStorage.removeItem('neuzen_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://neuzen-hrms-vcav.vercel.app/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("neuzen_token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("neuzen_token");
//       localStorage.removeItem("neuzen_user");

//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error.response?.data || { message: error.message });
//   }
// );

// export default api;
