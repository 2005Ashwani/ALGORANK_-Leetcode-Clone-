import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:3000",   // that is the default URL
    withCredentials: true,  //
    headers: {
        'Content-Type': 'application/json'      // Sends the data in json formate

    }

},
);

// axiosClient.post('/user/register',data)      // axios client ki wajaha sai hum asa data access kar payanga




export default axiosClient