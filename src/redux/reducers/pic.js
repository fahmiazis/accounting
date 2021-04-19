/* eslint-disable import/no-anonymous-default-export */
const picState = {
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
    dataPic: [],
    detailPic: {},
    alertM: '',
    alertUpload: [],
    page: {}
};

export default (state=picState, action) => {
        switch(action.type){
            case 'ADD_PIC_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_PIC_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add pic Succesfully'
                };
            }
            case 'ADD_PIC_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'GET_PIC_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_PIC_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataPic: action.payload.data.result.rows,
                    alertMsg: 'get pic Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_PIC_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_PIC_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_PIC_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataPic: action.payload.data.result.rows,
                    alertMsg: 'get pic Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_PIC_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_PIC_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_PIC_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailPic: action.payload.data.result,
                    alertMsg: 'get detail pic Succesfully'
                };
            }
            case 'GET_DETAIL_PIC_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'UPDATE_PIC_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'UPDATE_PIC_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    isError: false,
                    alertMsg: 'update pic Succesfully'
                };
            }
            case 'UPDATE_PIC_REJECTED': {
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