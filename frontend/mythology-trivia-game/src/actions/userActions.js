import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT
} from './actionTypes';

export const loginUser = (credentials) => async (dispatch) => {
    console.log('Sending credentials:', credentials);
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const response = await fetch('http://localhost:5000/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(credentials),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        // try {
        //     dispatch({ type: USER_LOGIN_REQUEST });

        //     const response = await fetch('http://localhost:5000/auth/login/', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        //         credentials: 'include',
        //         body: JSON.stringify(credentials),
        //     });

        //     const data = await response.json();

        if (response.ok) {
            const expiresAt = new Date(new Date().getTime() + 2 * 60 * 60 * 1000); // 2 hours
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: {
                    access_token: data.access_token,
                    username: credentials.username,
                    expiresAt: expiresAt.toISOString()
                }
            });
        } else {
            dispatch({
                type: USER_LOGIN_FAIL,
                payload: data.msg || 'Login failed'
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.message || 'Login failed'
        });
    }
};

export const setCurrentUser = (userData) => (dispatch) => {
    const expiresAt = new Date(new Date().getTime() + 2 * 60 * 60 * 1000); // 2 hours
    const userDataWithExpiration = {
        ...userData,
        expiresAt: expiresAt.toISOString()
    };
    dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: userDataWithExpiration
    });

    localStorage.setItem('currentUser', JSON.stringify(userDataWithExpiration));
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('currentUser');
    dispatch({ type: USER_LOGOUT });
};