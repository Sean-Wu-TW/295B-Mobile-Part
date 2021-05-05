export const getScore = function({auth}){
    const username = auth.substring(0, auth.length - 2)
    return fetch(`https://cloudyuniverse.com/usergamedataget?username=${ username }`,  {
      method: 'GET',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    })
    .catch( () => Promise.reject({ error: 'network-error'} ) )
    .then( response => {
      if(response.ok) {
        return response.json();
      }
      return response.json().then( json => Promise.reject(json) );
    });
  };