/* eslint-disable import/no-anonymous-default-export */
const authState = {
    isLogin: false,
    isRegister: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
};

export default (state=authState, action) => {
        switch(action.type){
            case 'AUTH_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'AUTH_USER_FULFILLED': {
                return {
                    ...state,
                    isLogin: true,
                    isError: false,
                    token: action.payload.data.Token,
                    alertMsg: 'Login Succesfully'
                };
            }
            case 'AUTH_USER_REJECTED': {
                return {
                    ...state,
                    isLogin: false,
                    isError: true,
                    alertMsg: 'Login Failed'
                };
            }
            case 'SET_TOKEN': {
                return {
                  ...state,
                  token: action.payload.token,
                  isLogin: true,
                }
              }
            case 'LOGOUT': {
                return {
                    ...state,
                    isLoading: false,
                    isLogin: false,
                    token: '',
                    alertMsg: 'Logout success'
                };
            }
            default: {
                return state;
            }
        }
    }