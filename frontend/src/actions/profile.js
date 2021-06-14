import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_PROFILE,
    PROFILE_ERROR
}
from './types';

//get current users profile


export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }
};

//create or update the profile




export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            'Contenr-Type': "application/json"
        };

        const res = await axios.post('/profile', formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });


        dispatch(setAlert(edit ? "Profile updated" : "profile created"));

        if (!edit) {
            history.push('/dashboard');
        }


    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })

    }

};