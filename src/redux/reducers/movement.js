/* eslint-disable import/no-anonymous-default-export */
const movementState = {
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
    dataMovement: [],
    detailMovement: {},
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    link: ''
};

export default (state=movementState, action) => {
        switch(action.type){
            case 'EXPORT_MASTER_MOVEMENT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_MOVEMENT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_MOVEMENT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'ADD_MOVEMENT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_MOVEMENT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add pic Succesfully'
                };
            }
            case 'ADD_MOVEMENT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'GET_MOVEMENT_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_MOVEMENT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataMovement: action.payload.data.result.rows,
                    alertMsg: 'get pic Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_MOVEMENT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_MOVEMENT_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_MOVEMENT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataMovement: action.payload.data.result.rows,
                    alertMsg: 'get pic Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_MOVEMENT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_MOVEMENT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_MOVEMENT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailMovement: action.payload.data.result,
                    alertMsg: 'get detail pic Succesfully'
                };
            }
            case 'GET_DETAIL_MOVEMENT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'UPDATE_MOVEMENT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'UPDATE_MOVEMENT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    isError: false,
                    alertMsg: 'update pic Succesfully'
                };
            }
            case 'UPDATE_MOVEMENT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPLOAD_MASTER_MOVEMENT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_MASTER_MOVEMENT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_MASTER_MOVEMENT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'RESET_MOVEMENT': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isExport: false
                }
            }
            default: {
                return state;
            }
        }
    }