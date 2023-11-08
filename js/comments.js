/* global console document fetch google Headers Request window */
const APP_URL =
  'https://script.google.com/macros/s/AKfycbwqj7Lm474hRHlD0Z3gYIhf9v6-LaIJEIKwjMIRsUrHPlgftbPNns48OTOWllZpogoP/exec';

/**
 * Handle the JWT Token received after a successful login
 */
function handleCallbackResponse(response) {
  const { name, email, pictureUrl } = decodeToken(response.credential);
  document.querySelector('#login-div').hidden = true;
  console.log(response.credential);
}

/**
 * Extract name, email, pic url from token
 */
function decodeToken(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  const jsn = JSON.parse(jsonPayload);
  return {
    name: jsn.name,
    givenName: jsn.given_name,
    familyName: jsn.family_name,
    email: jsn.email,
    pictureUrl: jsn.picture,
    emailVerified: jsn.email_verified,
  };
}

function renderButton() {
  google.accounts.id.initialize({
    // Initilize with the client id from the GCP project OAuth Client ID
    client_id:
      '8978887829-e26g8mhn8s3gne545tbvmo460ehs8p1i.apps.googleusercontent.com',
    callback: handleCallbackResponse,
  });
  google.accounts.id.renderButton(document.querySelector('#login-div'), {
    theme: 'outline',
    size: 'large',
  });
}

async function renderComments() {
  const headers = new Headers();
  headers.append('Content-Type', 'text/plain;charset=utf-8'); // this is key!
  const req = new Request(`${APP_URL}?p=${window.location.pathname}`, {
    method: 'GET',
    redirect: 'follow',
    headers,
  });

  try {
    const res = await fetch(req);
    const jsn = await res.json();
    console.log(jsn);
  } catch (err) {
    console.log(err);
  }
}

renderButton();
renderComments();
