/* eslint-disable import/no-anonymous-default-export */
const initialState = {
  isLoading:   false,
  isError:     false,
  isGet:       false,
  isGenerate:  null,
  isDelete:    null,
  alertMsg:    '',
  dataJurnal:  [],
  detailJurnal: {},
  totalCount:  0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    // GET
    case 'GET_JURNAL_PENDING':
      return { ...state, isLoading: true, isGet: false }
    case 'GET_JURNAL_FULFILLED':
      return {
        ...state,
        isLoading:  false,
        isGet:      true,
        isError:    false,
        dataJurnal: action.payload.data.result.rows,
        totalCount: action.payload.data.result.count,
      }
    case 'GET_JURNAL_REJECTED':
      return { ...state, isLoading: false, isGet: false, isError: true, alertMsg: 'Unable to connect to server' }

    // GENERATE
    case 'GENERATE_JURNAL_PENDING':
      return { ...state, isLoading: true, isGenerate: null }
    case 'GENERATE_JURNAL_FULFILLED':
      return { ...state, isLoading: false, isGenerate: true, isError: false }
    case 'GENERATE_JURNAL_REJECTED':
      return {
        ...state,
        isLoading:  false,
        isGenerate: false,
        isError:    true,
        alertMsg:   action.payload?.response?.data?.message || 'Generate failed',
      }

    // DELETE
    case 'DELETE_JURNAL_PENDING':
      return { ...state, isLoading: true, isDelete: null }
    case 'DELETE_JURNAL_FULFILLED':
      return { ...state, isLoading: false, isDelete: true }
    case 'DELETE_JURNAL_REJECTED':
      return { ...state, isLoading: false, isDelete: false, isError: true }

    // RESET
    case 'RESET_JURNAL':
      return { ...state, isGenerate: null, isDelete: null, isError: false, alertMsg: '' }

    default:
      return state
  }
}