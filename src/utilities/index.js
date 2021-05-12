import axios from "axios"

const clientAxios = axios.create({
  // baseURL: process.env.REACT_APP_BACKEND_ROUTE,
})

export { clientAxios }
