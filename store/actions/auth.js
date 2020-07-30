import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
        type: AUTHENTICATE,
        token: token,
        userId: userId
    });
  };
};

export const signUp = (email, password) => {
    return async dispatch => {

        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDN1y9G7YzCWJJSzgUFPW1MYZ59yv4oaM8',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            })

        if (!response.ok) {
            errResponse = await response.json();
            const errorId = errResponse.error.message;

            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'The email already exists';
            }
            throw new Error(message)
        }

        const resData = await response.json();

        console.log(resData);

        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    }
};

export const login = (email, password) => {
    return async dispatch => {

        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDN1y9G7YzCWJJSzgUFPW1MYZ59yv4oaM8',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            })

        if (!response.ok) {
            errResponse = await response.json();
            const errorId = errResponse.error.message;

            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'The email id could not found';
            }
            if (errorId === 'INVALID_PASSWORD') {
                message = 'The password could not match';
            }
            throw new Error(message)
        }

        const resData = await response.json();

        console.log(resData);

        // dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000));
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    }
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};


const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        userId: userId,
        token: token,
        expiryDate: expirationDate.toISOString()
    }))
}