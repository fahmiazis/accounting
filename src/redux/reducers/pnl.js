/* eslint-disable import/no-anonymous-default-export */
const initialState = {
  isLoading: false,
  isError: false,
  isGet: false,
  isDetail: false,
  isGenerate: null,
  isDelete: null,
  alertMsg: '',
  dataPnl: [],
  detailPnl: {},
  totalCount: 0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    // GET LIST
    case 'GET_PNL_PENDING':
      return { ...state, isLoading: true, isGet: false }
    case 'GET_PNL_FULFILLED':
      return {
        ...state,
        isLoading: false,
        isGet: true,
        isError: false,
        dataPnl: action.payload.data.result.rows,
        totalCount: action.payload.data.result.count,
      }
    case 'GET_PNL_REJECTED':
      return { ...state, isLoading: false, isGet: false, isError: true, alertMsg: 'Unable to connect to server' }

    // GET DETAIL
    case 'GET_DETAIL_PNL_PENDING':
      return { ...state, isLoading: true, isDetail: false }
    case 'GET_DETAIL_PNL_FULFILLED':
      return { ...state, isLoading: false, isDetail: true, detailPnl: action.payload.data.result }
    case 'GET_DETAIL_PNL_REJECTED':
      return { ...state, isLoading: false, isDetail: false, isError: true }

    // GENERATE
    case 'GENERATE_PNL_PENDING':
      return { ...state, isLoading: true, isGenerate: null, alertMsg: 'Generating...' }
    case 'GENERATE_PNL_FULFILLED':
      return { ...state, isLoading: false, isGenerate: true, isError: false }
    case 'GENERATE_PNL_REJECTED':
      return {
        ...state,
        isLoading: false,
        isGenerate: false,
        isError: true,
        alertMsg: action.payload?.response?.data?.message || 'Generate failed',
      }

    // DELETE
    case 'DELETE_PNL_PENDING':
      return { ...state, isLoading: true, isDelete: null }
    case 'DELETE_PNL_FULFILLED':
      return { ...state, isLoading: false, isDelete: true }
    case 'DELETE_PNL_REJECTED':
      return { ...state, isLoading: false, isDelete: false, isError: true }

    // RESET
    case 'RESET_PNL':
      return { ...state, isGenerate: null, isDelete: null, isError: false, alertMsg: '' }

    default:
      return state
  }
}