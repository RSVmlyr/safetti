import { config } from "../../../config.js"
import { langParam } from "../lang.js"

const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
const token = searchParams.get('token') || '';

async function request(url, params, method = 'GET', stringifyParams = true, getBlob = false) {

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': langParam === 'es' ? 'es-CO' : 'en-US',
      'auth': token
    }
  };

  if (params) {
    if (method === 'GET') {
        url += '?' + objectToQueryString(params);
    }
    else {
        if(stringifyParams === true)
        {
            options.body = JSON.stringify(params);
        }
        else {
            delete options.headers['Content-Type'];
            options.body = params;
        }
    }
  }

  const response = await fetch(config.baseUrl + url, options);

  if (response.status !== 200) {
    return generateErrorResponse('The server responded with an unexpected status.');
  }

  if(getBlob === true)
  {
    return await response.blob();
  }
  else {
    const stringResponse = await response.text();
    return stringResponse ? JSON.parse(stringResponse) : {};
  }
}

function objectToQueryString(obj) {
  return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

function generateErrorResponse(message) {
  return {
    status : 'error',
    message
  };
}

const get = async (url, params) => {
  return request(url, params);
}

const getBlob = async (url, params) => {
  return request(url, params, "GET", true, true);
}

const postBlob = async (url, params) => {
  return request(url, params, "POST", true, true);
}

const post = async (url, params, stringifyParams = true) => {
  return request(url, params, 'POST', stringifyParams);
}

const put = async (url, params, stringifyParams = true) => {
  return request(url, params, 'PUT', stringifyParams);
}

export default {
    get,
    getBlob,
    post,
    postBlob,
    put
};