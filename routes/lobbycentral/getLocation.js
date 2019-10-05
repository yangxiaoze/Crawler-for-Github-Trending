const Service = require('../../models/location');
const cheerio = require('cheerio')
const fs = require('fs');
const axios = require('axios');

const hostname = 'https://login.lobbycentral.com'
const companyID = 'SDDC0341'
// const sessionID = 'neycaa1ztbt0oztjlkzjzgva'
// const lastProfileCheck = '10/2/2019'
const sessionID = '4xqyjzo3gmst5q3ryiozuqel'
const lastProfileCheck = '9/30/2019'
const outputDIR = '.'
var tableId = 'ContentPlaceHolder1_Content_lstLocations';
var columns = 4;
var pageSize = 8;


function formatText(s) {
  if (s == undefined) return '';
  return s.replace('&nbsp;', ' ').trimStart().trimEnd();
}

function parseResource(list_array, html_string, resource) {
  const $ = cheerio.load(html_string);

  switch(resource) {
      case 'Services':
          $('tr', '#' + tableId).each(function () {
              let tds = $(this).find('td');
              if (tds.length === columns) {
                  let obj = {};
                  obj.serviceName = formatText($(tds[0]).text());
                  obj.kioskName = formatText($(tds[1]).text());
                  obj.isKioskDefault = formatText($(tds[2]).text());
                  obj.category = formatText($(tds[3]).text());
                  obj.status = formatText($(tds[4]).text());
                  list_array.push(obj);
              }
          });
          break;
      case 'Users':
        break;
      case 'Locations':
          $('tr', '#' + tableId).each(function () {
            let tds = $(this).find('td');
            if (tds.length === columns) {
                let obj = {};
                obj.locationName = formatText($(tds[0]).text());
                obj.status = formatText($(tds[1]).text());
                list_array.push(obj);
            }
        });
      break;
      case 'Queues':
      default:
          break;
  }


  return list_array;
}

function getResource(resource) {
  let url = hostname + '/admin/' + resource + '.aspx';
  return axios({
      method: 'get',
      url: url,
      headers: {
          'Cookie': 'LobbyCentralOnline=companyID=' + companyID + '&lastProfileCheck=' + lastProfileCheck + '; ASP.NET_SessionId=' + sessionID,
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
      parseResource(list_array, html_string, resource);

      console.log(resource + " Page(1), " + list_array.length + " records retrieved.");
      return Promise.resolve(list_array);
  })
}

module.exports = async (request, response) => {
  let resource = 'Locations';
  let route = 'lobbycentral/locations';

  let raw = false;
  if (request.query.raw) {
    raw = (request.query.raw == 'true');
  }

  let promise = getResource(resource);
  promise.then(listOfLocations => {
    if (raw) {
      response.status(200).send({
        listOfLocations
      });
    } else {
      response.render(route, {
        listOfLocations
      });
    }
  });

};
