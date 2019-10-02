const cheerio = require('cheerio')
const fs = require('fs');
const axios = require('axios');
const express = require('express')
const app = express()

const hostname = 'https://login.lobbycentral.com'
const companyID = 'SDDC0341'
const sessionID = '4xqyjzo3gmst5q3ryiozuqel'
const outputDIR = '.'

function getResources(resource) {
    let url = hostname + '/admin/' + resource + '.aspx';
    return axios({
        method: 'get',
        url: url,
        headers: {
            'Cookie' : 'LobbyCentralOnline=companyID=' + companyID + '&lastProfileCheck=9/30/2019; ASP.NET_SessionId=' + sessionID,
            'Accept' : 'ext/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Accept-Encoding' : 'gzip, deflate, br',
            'Host' : 'login.lobbycentral.com',
            'Referer' : 'https//login.lobbycentral.com/admin/' + resource + '.aspx',
            'Sec-Fetch-Mode' : 'navigate',
            'Sec-Fetch-Site' : 'same-origin',
            'Sec-Fetch-User' : '?1',
            'Upgrade-Insecure-Request' : '1',
            'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36',
            'Content-Type' : 'application/x-www-form-urlencoded',
        },
    }).then(function (response) {
        let list_array = [];

        let obj = {};
        obj.type = resource;
        obj.url = url;
        obj.status = response.status;
        obj.output = resource + '.html';
        list_array.push(obj);

        let html_string = response.data.toString();
        fs.writeFile(outputDIR + '/' + resource + '.html', html_string, (err) => {
            if (err) throw err;
            console.log(resource + ' saved!');
        });

        return Promise.resolve(list_array);
    })
}

app.get('/', (req, res) => {
    let promise = getResources('Services'); // retrieve services by default
    promise.then(response => {
        res.json(response);
    });
})

app.get('/:resource', (req, res) => {
    const {
        resource,
    } = req.params;
    let promise = getResources(resource);
    promise.then(response => {
        res.json(response);
    });
})

app.listen(3000, () => console.log('Listening on port 3000!'))
