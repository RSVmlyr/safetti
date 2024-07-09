import { config } from "../../../config.js"

async function request(url, params, method = 'GET', stringifyParams = true, getBlob = false) {

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTcxNTczODQ2MCwiZXhwIjoxNzE1NzUyODYwfQ.zrWo70zaQJr_DjrZArEoR8GLntdTilciYg8PPKNV4YY'
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
            options.body = params;
        }
    }
  }

  const response = await fetch(config.baseUrl + url, options);
  console.log(response);
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