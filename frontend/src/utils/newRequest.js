import axios from "axios";

const accessToken = JSON.parse(localStorage.getItem('currentUser'))?.accessToken

const newRequest = axios.create({
    baseURL: "http://localhost:8800/api/", 
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
    },
    credentials: 'include'
})

export default newRequest