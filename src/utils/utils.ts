import { isPast, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { createToast } from 'mosha-vue-toastify';
import store from '@/store';
import type { GenericObject } from '@/types/GenericObject';
import historyService from '@/services/api/history';

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
    // errMsg = error.response
    //   ? error.response.data.errors.msg
    //   : 'SERVER_TIMEOUT_CONNECTION_ERROR';
    // setTimeout(
    //   () =>
    //     errMsg
    //       ? commit('errorModule/error', errMsg, { root: true })
    //       : commit('errorModule/showError', false, { root: true }),
    //   0,
    // );
    createToast('Error', { timeout: 3000, type: 'danger' });
  }
  reject(error);
  return 0;
};

export const buildSuccess = (msg: string) => {
  createToast(msg, { timeout: 3000, type: 'success' });
};

export const buildAlert = (
  msg: string,
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
    const { page, search, fieldsToSearch } = query;
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

export const addCustomScript = (src: string) => {
  const recaptchaScript = document.createElement('script');
  recaptchaScript.setAttribute('src', src);
  recaptchaScript.async = true;
  document.head.appendChild(recaptchaScript);
};

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// export let msToTime = (duration) => {
//   //   var milliseconds = parseInt((duration % 1000) / 100),
//   (seconds = Math.floor((duration / 1000) % 60)),
//     (minutes = Math.floor((duration / (1000 * 60)) % 60)),
//     (hours = Math.floor((duration / (1000 * 60 * 60)) % 24));

//   return (
//     (hours > 0 ? (hours != 1 ? hours + " horas " : hours + " hora ") : "") +
//     (minutes > 0 ? minutes + " minutos" : "") +
//     (seconds > 0 ? seconds + " segundos" : "")
//   );
//   // seconds +
//   // " segundos"
// };

// export const isLogged = () => {
//   return new Promise((resolve, reject) => {
//     axios
//       .post("/api/users/logged")
//       .then((res) => {
//         if (res.data.ok) {
//           resolve(res.data.payload);
//         } else {
//           resolve(false);
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         reject(err);
//       });
//   });
// };

// const localesDateFns = {
//     en: require('date-fns/locale/en'),
//     es: require('date-fns/locale/es')
// }

export const getFormat = (date: string, formatStr: string): string => {
  // return format(date, formatStr, {
  //     locale: localesDateFns[window.__localeId__]
  // })
  return format(new Date(date), formatStr);
};

export const timeout = (millis: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
};

export const startsWith = (str: string, word: string): boolean => {
  return str.lastIndexOf(word, 0) === 0;
};

export const distinctArrayObjects = (array: GenericObject[], field: string) => {
  return [...new Set(array.map((item) => item[field]))];
};

export const millisToMinutesAndSeconds = (millis: number): string => {
  const minutes: any = Math.floor(millis / 60000);
  const seconds: any = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

export const getHistoryScore24 = async (
  team1_slug: string,
  team2_slug: string,
  matchSlug: string,
) => {
  const formattedDate = format(new Date(), 'dd-MM-yyyy', {
    locale: es,
  });
  const response = await historyService.scrapHistory(
    [team1_slug, team2_slug],
    formattedDate,
    matchSlug,
    2020, // solo hasta 2020
  );
  const history = response.data.payload;
  return history;
};

export const getMaxMinDifference = (unders: GenericObject[]) => {
  let max;
  let min;
  let maxIndex = 0;
  let minIndex = 0;
  for (let i = 0; i < unders.length; i++) {
    if (i === 0) {
      max = unders[i].value;
      min = unders[i].value;
    } else {
      if (unders[i].value > max) {
        max = unders[i].value;
        maxIndex = i;
      }
      if (unders[i].value < min) {
        min = unders[i].value;
        minIndex = i;
      }
    }
  }
  return {
    max,
    min,
    difference: Math.abs(max - min),
    orientation: maxIndex > minIndex ? 'up' : 'down',
  };
};

export const getUpsDowns = (unders: GenericObject[]) => {
  let upsCounter = 0;
  let downsCounter = 0;
  for (let i = 0; i < unders.length; i++) {
    // if (i > 0 && unders[i].quarter == "c4") {
    if (unders[i - 1] && unders[i].value > unders[i - 1].value) {
      upsCounter++;
    } else if (unders[i - 1] && unders[i].value < unders[i - 1].value) {
      downsCounter++;
    }
    // }
  }
  return {
    upsCounter,
    downsCounter,
    upsCounterPercent: roundDecimal(upsCounter / (upsCounter + downsCounter)),
    downsCounterPercent: roundDecimal(
      downsCounter / (upsCounter + downsCounter),
    ),
  };
};

export const getInvertedCones = (unders: GenericObject[], range = 12) => {
  const RANGE = range;
  let p1, p2, p3;
  const p1Indexes = [];
  const p2Indexes: any = [];
  const p3Indexes: any = [];
  const pointsFound = false;
  const points = [];
  for (let i = 0; i < unders.length; i++) {
    if (!pointsFound) {
      p1 = unders[i];
      for (let j = i; j < unders.length; j++) {
        if (p1.value - unders[j].value >= RANGE && !p2Indexes.includes(j)) {
          p2 = unders[j];
          for (let k = j; k < unders.length; k++) {
            if (unders[k].value > p1.value && !p3Indexes.includes(k)) {
              p3 = unders[k];
              points.push({ p1, p2, p3 });
              p1Indexes.push(i);
              p2Indexes.push(j);
              p3Indexes.push(k);
              k = unders.length;
              j = unders.length;
              i = unders.length;
            }
          }
        }
      }
    }
  }
  return points;
};

export function formatDate(value: string, syntax = 'dd/MM/yyyy'): string {
  return format(new Date(value), syntax, {
    locale: es,
  });
}

export function formatBettingOdds(
  bettingOdds: GenericObject[],
): GenericObject[] {
  return bettingOdds.map((el) => {
    // TODO improve this to select any odd easily
    const underOdds = el.odds.filter((odd) =>
      odd.value.toLowerCase().includes('menos de'),
    );
    const selectedOdd = underOdds[Math.floor(underOdds.length / 2)];
    return {
      quarter: el.quarter,
      value: selectedOdd.valueParsed,
      scores: [el.scores.home, el.scores.away],
      millis: el.millis,
      date: formatDate(el.createdAt, 'HH:mm:ss'),
      underQuota: 1.6,
      overQuota: 1.6,
    };
  });
}

export function roundDecimal(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}
