import axios from 'axios'
import {store} from "../redux/store";
axios.defaults.baseURL = "http://localhost:5000"

axios.interceptors.request.use(function (config) {
    store.dispatch({
        type: 'change_loading',
        payload: true
    })
    return config
}, function (err) {
return Promise.reject(err);
})

axios.interceptors.response.use(function (res) {
    store.dispatch({
        type: 'change_loading',
        payload: false
    })
    return res;
}, function(err) {
    store.dispatch({
        type: 'change_loading',
        payload: false
    })
    return Promise.reject(err)
})
