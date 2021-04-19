/* eslint-disable import/no-anonymous-default-export */
const divisiState = {
    isAdd: false,
    isUpload: false,
    isUpdate: false,
    isGet: false,
    isDetail: false,
    isDelete: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataAlasan: [],
    detailAlasan: {},
    alertM: '',
    alertUpload: [],
    page: {}
};

export default (state=divisiState, action) => {
        switch(action.type){
            case 'ADD_ALASAN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_ALASAN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add divisi Succesfully'
                };
            }
            case 'ADD_ALASAN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'GET_ALASAN_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALASAN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataAlasan: action.payload.data.result.rows,
                    alertMsg: 'get alasan Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_ALASAN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_ALASAN_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_ALASAN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataAlasan: action.payload.data.result.rows,
                    alertMsg: 'get alasan Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_ALASAN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_ALASAN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_ALASAN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailAlasan: action.payload.data.result,
                    alertMsg: 'get detail divisi Succesfully'
                };
            }
            case 'GET_DETAIL_ALASAN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'UPDATE_ALASAN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'UPDATE_ALASAN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    isError: false,
                    alertMsg: 'update divisi Succesfully'
                };
            }
            case 'UPDATE_ALASAN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPLOAD_MASTER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_MASTER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_MASTER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'RESET': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false
                }
            }
            default: {
                return state;
            }
        }
    }