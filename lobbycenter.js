const cheerio = require('cheerio')
const fs = require('fs');
const axios = require('axios');
const express = require('express')
const app = express()

const hostname = 'https://login.lobbycentral.com'
const companyID = 'SDDC0341'
const sessionID = '4xqyjzo3gmst5q3ryiozuqel'
const outputDIR = '.'

function outputResource(list_array, html_string, resource, url, status) {
    let obj = {};
    obj.type = resource;
    obj.url = url;
    obj.status = status;
    obj.output = resource + '.html';

    list_array.push(obj);

    fs.writeFile(outputDIR + '/' + resource + '.html', html_string, (err) => {
        if (err) throw err;
        console.log(resource + ' saved!');
    });

    return list_array;
}

function formatText(s) {
    if (s == undefined) return '';
    return s.replace('&nbsp;', ' ').trimStart().trimEnd();
}

function parseResource(list_array, html_string, resource) {
    const $ = cheerio.load(html_string);

    switch(resource) {
        case 'Services':
            $('tr', '#ContentPlaceHolder1_Content_lstServices').each(function () {
                let tds = $(this).find('td');
                if (tds.length === 7) {
                    let obj = {};
                    obj.name = formatText($(tds[0]).text());
                    obj.kioskName = formatText($(tds[1]).text());
                    obj.isKioskDefault = formatText($(tds[2]).text());
                    obj.category = formatText($(tds[3]).text());
                    obj.status = formatText($(tds[4]).text());
                    list_array.push(obj);
                }
            });
            break;
        case 'Users':
        case 'Locations':
        case 'Queues':
        default:
            break;
    }


    return list_array;
}

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
        let html_string = response.data.toString();

        let list_array = [];
        // outputResource(list_array, html_string, resource, url, response.status);
        parseResource(list_array, html_string, resource);

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
