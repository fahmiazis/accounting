/* eslint-disable import/no-anonymous-default-export */
const divisiState = {
    isAdd: false,
    isGet: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDate: [],
    alertM: '',
    alertUpload: [],
    page: {}
};

export default (state=divisiState, action) => {
        switch(action.type){
            case 'ADD_DATE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_DATE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add divisi Succesfully'
                };
            }
            case 'ADD_DATE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: 'failed add date',
                };
            }
            case 'GET_DATE_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DATE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataDate: action.payload.data.result.rows,
                    alertMsg: 'get date Succesfully'
                };
            }
            case 'GET_DATE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET': {
                return {
                    ...state,
                    isError: false,
                    isAdd: false
                }
            }
            default: {
                return state;
            }
        }
    }