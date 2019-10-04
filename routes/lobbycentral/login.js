const cheerio = require('cheerio')
const fs = require('fs');
const axios = require('axios');

const hostname = 'https://login.lobbycentral.com'
const companyID = 'SDDC0341'
// const sessionID = 'neycaa1ztbt0oztjlkzjzgva'
// const lastProfileCheck = '10/2/2019'
const sessionID = '4xqyjzo3gmst5q3ryiozuqel'
const lastProfileCheck = '9/30/2019'

function parseLogin(list_array, html_string) {
    const $ = cheerio.load(html_string);

    let obj = {};
    // TODO: parse the following info
    obj.lastProfileCheck = '';
    obj.sessionID = '';

    return obj;
}

function login(username, password) {
    let url = hostname + '/Login.aspx';
    return axios({
            method: 'post',
            url: url,
            headers: {
                'Cookie': 'LobbyCentralOnline=companyID=' + companyID + '&lastProfileCheck=' + lastProfileCheck + '; ASP.NET_SessionId=' + sessionID,
                'Accept': 'ext/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Host': 'login.lobbycentral.com',
                'Referer': 'https//login.lobbycentral.com/Login.aspx',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: 'ctl00%24ScriptManager1=ctl00%24ContentPlaceHolder1%24UpdatePanel1%7Cctl00%24ContentPlaceHolder1%24cmdSubmit&__LASTFOCUS=&__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUKLTQyNzM2NDE2MQ9kFgJmD2QWBgIDD2QWAgIJD2QWAgIBD2QWAmYPZBYCAgEPZBYGAgEPZBYCAgEPDxYCHgRUZXh0BRJMb2cgb3V0IHN1Y2Nlc3NmdWxkZAIKDw8WAh8ABQhTRERDMDM0MWRkAg4PZBYCZg9kFgICAQ9kFgICAQ8QZGQWAGQCBQ8PFgIfAAUEMjAxOWRkAgcPDxYCHwAFGXY1LjIgYnVpbGQgNi4gIFNlcnZlciBXMDFkZBgBBR5fX0NvbnRyb2xzUmVxdWlyZVBvc3RCYWNrS2V5X18WAQUiY3RsMDAkQ29udGVudFBsYWNlSG9sZGVyMSRyZW1lbWJlcntkTkozt0DkB0c0YzTCLjRQqyEXMN6R2cMpMNJSLQEI&__VIEWSTATEGENERATOR=C2EE9ABB&__EVENTVALIDATION=%2FwEdABPgpuCQ54naQRQ4KujsVBr%2FVmQGZm3rmYTuqjjWsxocDfDkmJWdLe%2Bz%2B6xbAHsaM0iY%2B62Ax0U1ejAS%2BJx5cWa9H70NXARbt4D00QagmxFg%2FYGAqhVWLhg6QiVdu2ITy0jzjX%2FzbSHLuW%2FhyhSdsGBvm4js5vmkGM4nrVY%2F3TzH%2FrnYIS1PaU8upJ%2BzLNFwcyvnwAsezgtGEoBNLk1MWnHO8ms6Ir4MGWOZvaCk%2Brr2Al%2FDUh9T%2BUQ3wIBPijH7kYMIxV20nCMadavnQDkahkD3jtpHOHbyOQ%2FNoKj5uAD7NpBD1MzrQ00Ub2TMC0MQ6Guem6JYRcAu5W9nfI3NpTHJUoHH3FWT%2BlnOs0d5FHLS9gj0sNBmGjMKTll79mnPMfugLAEQEgKXJDJa8p5KNJSasd5DPpQ1vYcgA2gX5ACSzzx59xrUtp1X4Dcr%2BjspmTE%3D&ctl00%24ContentPlaceHolder1%24login_username=' + username + '&ctl00%24ContentPlaceHolder1%24login_password=' + password + '&ctl00%24ContentPlaceHolder1%24companyID=' + companyID + '&ctl00%24ContentPlaceHolder1%24remember=on&__ASYNCPOST=true&ctl00%24ContentPlaceHolder1%24cmdSubmit=Sign%20In',
        }).then(function (response) {
            let html_string = response.data.toString();

            return Promise.resolve(parseLogin(html_string));
        })
        .catch(function (error) {
            // ignored
        })
}

module.exports = async (request, response) => {
    
    let promise = login(request.query.username, request.query.password);
    promise.then( (obj) => {
        response.render('menu', obj);
    })
};
