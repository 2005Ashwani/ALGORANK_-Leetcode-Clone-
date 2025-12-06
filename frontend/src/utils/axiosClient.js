import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://leetcode-backend-2-1.onrender.com",   // that is the default URL
    withCredentials: true,  //
    headers: {
        'Content-Type': 'application/json'      // Sends the data in json formate

    }

},
);

// axiosClient.post('/user/register',data)      // axios client ki wajaha sai hum asa data access kar payanga





export default axiosClient
