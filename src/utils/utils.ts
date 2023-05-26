import { isPast, format } from 'date-fns';
import { createToast } from 'mosha-vue-toastify';
import store from '@/store';
import router from '@/router';
import type { GenericObject } from '@/types/GenericObject';

export const formatErrorMessages = (
  translationParent: string,
  msg: GenericObject,
) => {
  const errorArray = [];
  // Check for error msgs
  if (msg !== null) {
    const json = JSON.parse(JSON.stringify(msg));
    // If error message is an array, then we have mutiple errors
    if (Array.isArray(json)) {
      json.map((error) => {
        errorArray.push(`${error.msg}`);
      });
    } else {
      // Single error
      errorArray.push(`${msg}`);
    }
    return errorArray;
  }
  // all good, return null
  return null;
};

export const buildPayloadPagination = (
  pagination = { page: 1, itemsPerPage: 20 } as any,
  search: GenericObject,
) => {
  const { page, itemsPerPage } = pagination;
  let { sortDesc, sortBy } = pagination;

  // When sorting you always get both values
  if (sortBy && sortDesc)
    if (sortBy.length === 1 && sortDesc.length === 1) {
      // Gets order
      sortDesc = sortDesc[0] === true ? -1 : 1;
      // Gets column to sort on
      sortBy = sortBy ? sortBy[0] : '';
    }

  let query = {};

  // If search and fields are defined
  if (search) {
    query = {
      sort: sortBy,
      order: sortDesc,
      page,
      limit: itemsPerPage,
      filter: search.query,
      fields: search.fields,
    };
  } else if (sortBy && sortDesc) {
    // Pagination with no filters
    query = {
      sort: sortBy,
      order: sortDesc,
      page,
      limit: itemsPerPage,
    };
  } else {
    query = {
      page,
      limit: itemsPerPage,
    };
  }
  return query;
};

// Catches error connection or any other error (checks if error.response exists)
export const handleError = (error: GenericObject, commit: any, reject: any) => {
  let errMsg = '';
  // Resets errors in store
  commit('loadingModule/showLoading', false, { root: true });
  console.log('sucedio un error....');
  console.log('el error: ', error);
  // Checks if unauthorized
  if (!error.response) {
    commit('errorModule/error', 'La solicitud tardó mucho tiempo...', {
      root: true,
    });
    return reject(error);
  }
  if (error.response.status === 401) {
    store.dispatch('authModule/logout', { root: true });
    console.log('se fue al loign');
  } else {
    console.log('se produjo else');
    // Any other error
    errMsg = error.response
      ? error.response.data.errors.msg
      : 'SERVER_TIMEOUT_CONNECTION_ERROR';
    // setTimeout(
    //   () =>
    //     errMsg
    //       ? commit('errorModule/error', errMsg, { root: true })
    //       : commit('errorModule/showError', false, { root: true }),
    //   0,
    // );
    createToast(errMsg, { timeout: 3000, type: 'danger' });
  }
  reject(error);
  return 0;
};

export const buildSuccess = (msg: String) => {
  createToast(msg, { timeout: 3000, type: 'success' });
};

export const buildAlert = (
  msg: String,
  type: any = 'success',
  timeout = 3000,
) => {
  createToast(msg, { timeout, type: type });
};

// Checks if tokenExpiration in localstorage date is past, if so then trigger an update
export const checkIfTokenNeedsRefresh = () => {
  // Checks if time set in localstorage is past to check for refresh token
  if (
    window.localStorage.getItem('token') !== null &&
    window.localStorage.getItem('tokenExpiration') !== null
  ) {
    if (
      isPast(
        new Date(
          JSON.parse(window.localStorage.getItem('tokenExpiration') || '') *
            1000,
        ),
      )
    ) {
      store.dispatch('refreshToken');
    }
  }
};

export const buildQueryWithPagination = (query: GenericObject) => {
  let queryWithPagination = {};
  if (query && query.page) {
    let { page, search, fieldsToSearch } = query;
    queryWithPagination = buildPayloadPagination(
      {
        page,
        itemsPerPage: store.state.itemsPerPage,
      },
      search ? { query: search, fields: fieldsToSearch.join(',') } : {},
    );
    delete query['page'];
    delete query['fieldsToSearch'];
    delete query['search'];
  }
  return { ...queryWithPagination, ...query };
};
