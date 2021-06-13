import axios from 'axios';


const setAuthToken = token => {
    // axios.defaults.headers.common['content-type'] = 'application/json; charset=utf-8';
    if (token) {
        axios.defaults.headers.common.authorization = token;
    } else {
        delete axios.defaults.headers.common.authorization;
    }
};



export default setAuthToken;