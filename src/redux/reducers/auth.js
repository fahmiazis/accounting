/* eslint-disable import/no-anonymous-default-export */
const authState = {
    isLogin: false,
    isRegister: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    level: 0
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
                localStorage.setItem('token', action.payload.data.Token)
                localStorage.setItem('level', action.payload.data.user.user_level)
                localStorage.setItem('name', action.payload.data.user.username)
                localStorage.setItem('kode', action.payload.data.user.kode_depo)
                return {
                    ...state,
                    level: action.payload.data.user.user_level,
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
                localStorage.removeItem('token')
                localStorage.removeItem('level')
                return {
                    state: undefined
                }
            }
            case 'RESET': {
                return {
                    ...state,
                    isLogin: false
                }
            }
            default: {
                return state;
            }
        }
    }