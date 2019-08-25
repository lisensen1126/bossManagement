/**
 * create by NightKnight
 * */
import store from '../vuex/store'
// API root
export const root = process.env.API_ROOT || (
  location => `${location.protocol}//platform.${location.host.replace(/^.*?\./, '')}/admin/v1`
)(window.location)

// detect whether an API result is successful
export function check (result) {
  return result && result.msgcode === 100000
}

// resolve any API path and return the full url
export function resolve (path) {
  if (/^(https?:)?\/\//.test(path)) {
    return path
  } else {
    // deal with absolute paths when necessary
    return `${root}${path.replace(/^([^/])/, '/$1')}`
  }
}

// the $fetch function that makes async requests
// always call it from an api mixin avoid direct use in business codes
// - params:       [path: string] relative or absolute path of the api, full url is also acceptable
//                 [options?: Object] follows fetch API options but with proper defaults, request body will be stringified
//                   - supports a `query` object for query params
//                   - request body will be sent via query string for GET request (values of the fields with the same names in `query` will be overwritten)
// - return value: a promise resolves to (parsed | unparsed response body, response object);
//                 when the content type of the response is json or any text,
//                 it resolves when response body is fully received and successfully parsed (to an object or plain text)
//                 and rejects if fetch API rejected or parsing went wrong;
//                 in other cases, it follows fetch API behavior (but resolves to (response, response) for consistency)
export function $fetch (path, options = {}) {
  // merge options with defaults
  options = {
    method: 'GET',
    headers: options.headers || new window.Headers(),
    mode: 'cors',
    credentials: 'include',
    cache: 'no-cache',
    redirect: 'follow',
    // specify referrer if necessary
    // merge options
    ...options,
  }
  // accept json by default
  if (!options.headers.has('Accept')) {
    options.headers.set('Accept', 'application/json')
  }
  // request method should be in upper case
  options.method = options.method.toUpperCase()
  // create query string
  // just as a reference: [jQuery.param](https://github.com/jquery/jquery/blob/5f35b5b406ae7d504de86a3f0a5647b2fdf4f2af/src/serialize.js#L57)
  if (options.method === 'GET' && options.body) {
    // send request body as query params for GET requests
    options.query = {
      ...(options.query || {}),
      ...options.body,
    }
    delete options.body
  }
  if (options.query) {
    // parse query params, handle arrays
    const queries = Object.keys(options.query)
      .filter(key =>
        // not undefined
        options.query[key] !== undefined &&
        // not null
        options.query[key] !== null &&
        // not an empty array
        (!Array.isArray(options.query[key]) || options.query[key].length))
      .map(queryKey => Array.isArray(options.query[queryKey])
        // parse array
        ? options.query[queryKey].map(value => `${queryKey}[]=${value}`).join('&')
        // normal param
        : `${encodeURIComponent(queryKey)}=${encodeURIComponent(options.query[queryKey])}`
      )
    if (queries.length) {
      // append query string to request url
      path = `${path}${path.indexOf('?' < 0) ? '?' : '&'}${queries.join('&')}`
    }
  }
  // stringify request body and append content type header if possible
  if (typeof options.body === 'object') {
    // detect body type
    if (options.body instanceof window.FormData) {
      // send as form data
      // let the browser assign an appropriate content type (application/x-www-form-urlencoded or multipart/form-data with boundary)
      options.headers.delete('Content-Type')
    } else {
      // send request body as a JSON string by default
      options.headers.set('Content-Type', 'application/json')
      options.body = JSON.stringify(options.body)
    }
  }
  // Access-Control-Request-Headers
  const headerKeys = new Set()
  for (const headerKey of options.headers.keys()) {
    headerKeys.add(headerKey)
  }
  options.headers.set('Access-Control-Request-Headers', [...headerKeys].join())
  // the code below is more intuitive but results in Chrome 56 looping infinitely,
  // use the lines above instead (╯‵□′)╯︵┻━┻
  // for (const headerKey of options.headers.keys()) {
  //   options.headers.append('Access-Control-Request-Headers', headerKey)
  // }
  // create a promise
  const fetching = new Promise((resolve, reject) => {
    // send request
    if (options.query && options.query.hide_loading) {
      store.dispatch('FETCH_LOADING', 0)
    } else {
      store.dispatch('FETCH_LOADING', 1)
    }
    window.fetch($fetch.resolve(path), options).then(
      response => {
        // attempt to parse response (body)
        let parsing
        const contentType = response.headers.get('Content-Type').toLowerCase()
        if (contentType === 'application/json') {
          // json
          parsing = response.json()
        } else if (/^text\//.test(contentType)) {
          // text
          parsing = response.text()
        }
        // resolve
        if (parsing) {
          // resolve with parsed result
          parsing.then(
            result => {
              if (response.status === 401) {
                // not logged in or session expired, redirect to login page
                // store.dispatch('FETCH_LOADING', false)
                const consoleURIPattern = /^p\.([^.]+\.)?chedianai/
                location.href = process.env.LOGIN_PATH || `${location.protocol}//p.${(location.hostname.match(consoleURIPattern) || [])[1] || ''}chedianai.com/#/login`
                if (options.forceResolve) {
                  resolve({response, result})
                }
              } else {
                // consider it a successful result
                resolve({response, result})
              }
            },
            // result => resolve({response, result}),
            error => {
              console.error('[$fetch] Failed to parse:', error)
              throw new Error(`Response Body Parsing Exception: (${path}) ${error.message}`)
            },
          )
        } else {
          // resolve with unhandled response (body)
          resolve({response})
        }
        if (options.query && options.query.hide_loading) {
          store.dispatch('FETCH_LOADING', 0)
        } else {
          store.dispatch('FETCH_LOADING', -1)
        }
      }
    ).catch(error => {
      store.dispatch('FETCH_LOADING', -1)
      console.error('[$fetch] Failed to fetch:', error)
      reject(error)
    })
  })
  // return the promise
  return fetching
}

// attach utils to $fetch
$fetch.resolve = resolve
$fetch.check = check

// export plugin
export default {
  install (Vue) {
    // register to context
    Vue.prototype.$fetch = $fetch
  },
}
