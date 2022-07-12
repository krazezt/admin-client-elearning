import Axios from "axios"
import { Account } from "./Model"
import api from './assets/JsonData/api.json'

export const checkToken = async () => {
    if (localStorage.getItem('token-admin') === null || localStorage.getItem('token-admin') === undefined) return null
    let data
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset-UTF-8',
            "Accept": 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token-admin')}`
        }
    }

    return 1
}
