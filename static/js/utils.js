'use strict';
const httpGet = (url) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = () => resolve(request.responseText);
    request.onerror = () => reject(request);
    request.send();
});
const httpPost = (url, data) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.onload = () => resolve(request.responseText);
    request.onerror = () => reject(request);
    request.send(data);
});
// const httpDelete = (url) => new Promise((resolve, reject) => {
//     const request = new XMLHttpRequest();
//     request.open('DELETE', url, true);
//     request.onload = () => resolve(request.responseText);
//     request.onerror = () => reject(request);
//     request.send();
// });