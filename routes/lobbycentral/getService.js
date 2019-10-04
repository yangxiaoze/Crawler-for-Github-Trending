const Service = require('../../models/service');
const cheerio = require('cheerio')
const fs = require('fs');
const axios = require('axios');

const hostname = 'https://login.lobbycentral.com'
const companyID = 'SDDC0341'
const sessionID = 'neycaa1ztbt0oztjlkzjzgva'
const lastProfileCheck = '10/2/2019'
// const sessionID = '4xqyjzo3gmst5q3ryiozuqel'
// const lastProfileCheck = '9/30/2019'
const outputDIR = '.'
var tableId = 'ContentPlaceHolder1_Content_lstServices';
var columns = 7
var pageSize = 8;


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
      case 'Locations':
      case 'Queues':
      default:
          break;
  }


  return list_array;
}

function getServices(resource) {
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
      // outputResource(list_array, html_string, resource, url, response.status);
      parseResource(list_array, html_string, resource);

      console.log(resource + " Page(1), " + list_array.length + " records retrieved.");
      return Promise.resolve(list_array);
  })
}

function queryServicesByPage(resource, pageNumber) {
  let url = hostname + '/admin/' + resource + '.aspx';
  return axios({
      method: 'post',
      url: url,
      headers: {
          'Cookie' : 'LobbyCentralOnline=companyID=' + companyID + '&lastProfileCheck=' + lastProfileCheck + '; ASP.NET_SessionId=' + sessionID,
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
      data: 'ctl00%24ctl00%24ScriptManager1=ctl00%24ctl00%24ContentPlaceHolder1%24Content%24UpdatePanel1%7Cctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstServices&__EVENTTARGET=ctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstServices&__EVENTARGUMENT=Page%242&__LASTFOCUS=&__VIEWSTATE=7DDDLmsbd0JRrIx57fuJ%2FzwSfRPWio1UJk9EbHfQZ8D9ToiENwiLdKW8GmS%2BCiTsufW656iTn5HnEmokFfi31ivCLSpP4PqiGD9CZEoc%2FbdrMD44EZoowsZiO6TC4NgMbyLTKN0RjJmAvu1aq9QGrW3wZ9tVMS3bnXzXBvf5quqLWsfVM%2FG43uYlFG75ALZlFBGrMkIEIpi6hYnFz146T5Hi%2Fz6ORHOiLnQtSImWMXG6XyCwb8akvajyVuZRzb8flGfjMN%2Fh6yapOkzaE2EWsKJqVKFOGbftN8dVsOevUewYfVRUlaVQSnTeLDMChfWCCfqKNHh240X7K0bg4lCclFTwp%2FRG1wc3IlIOivb73Y2Fba77fQkRtK312eEqR%2BH5boXiV23zuiv4EfEJpqHv5fXo8dpb%2FOYyz5k4QWuTgGO2MYrsmB%2FDdc9ZjK2AP%2FoKPSXxp%2BaR3fbvd4McKeGClag3KIO%2Fbxkbq73nH48Pu1lKWM4oYn9yTTv6HFqjif2bNEnKAtoQJ0BcD%2FHhrGjOzYiAUFjynHO6ehU9K6Ag9PMJ2vlND%2BQyiNHQefncKqtEJV9cMKhTi2EAlCLTaR6w9aQV%2FUOERaaVYGIJDUOTEoI6dl%2FsfQcHprKJ1nPKb97t%2FizQVVGa5TbY2kl2BNuuwXM1e6B2CZLHJVuJGMbmBi9%2BhLiPOJqzjE9oU46rI5G8J3GwCMIGTB3b7H4ylbhRyJ9Sj7EfJ5iUUJLU5eZ0crIxm1Ax8%2F%2FZqyJEqRvkeJ%2FFQ12uFm9l0CxVcbmavinMBOjDa6LcBLQWVPJUowVou7iggbIgKsSCCm22NTsDBuzEylOFJNZc1opigDTXtSJ0lyWwGGqLTmvHBGaUSyzlG%2BwTsudOybmLhDjtp6%2FsTxRZj8W7Hz7j6DTJWvmv0hfjtzM8LkVwbD1okx9bIotYnv8KgDN%2BvtW%2FHGi4SvFxXrD8Gbj%2FNHjI2yz5TS3arzLEnCAbVMXg8fbpYJ2Il723Yl2iuSdMHUK%2FsvKmMntnlZFtniF43sq6gSsKS8q3unkNO4mSD%2B2Utlpqroi%2FCpfqsBfcFWusCknFbjU37P8dgBTWYrLpd2Sic%2FZBWAdyALHYyWI%2FJQCqWF7Ko8o93LPk4kRYNR3weFgWpgIwxSOc%2FZPgbAsLWpdFaSRfbIIApYYavotxTwPu97OUEn7Jm6JbJyT4%2FA6B%2FlgABTGPRZa4H0icL5HOjsm9PBA8GKbmu2QRpEJODxUSm2hBKrcY6kaEf8oufvR3zh8JyhzivsLutoWtmEl%2BvXPg7%2B11uT9mHQoCtic3J0U8EBGapAdMXXpeHWdmJIll5AXAZS1x2L25MDhopmxp6e8ZHqW3kVPcSLHaITA3N%2B9pbZzQrkB1DMrt8QsE8TYkCrxedARZ%2BJfkp5UZGAHOxKzKIG3kfX53D7pl00xjX%2BEUSu1cdXhr%2FKammObXjfUEvWAqrLTlT2OJOMWXnFF783AVqVnyVZYjupK302wbms%2F8RWS%2Bs37NeVJwPdrnja2V1faOTIWU429frNUqex9jaMDtZB4Bi99Efsdu5BfkibHQ2sHC2J57ga6J1DUrgRnxvUUw73C22vOXkB%2F5qxHDrOh3MOqRZ80YAqDI%2BcFw0nJ7EbGi1R0K1ysVAIBBukRh3N6gq5PTnfzyci2buuBtXrK6xcuqO7%2F8GG23r5NyPrWdCxpct%2FNYyrWozJ9OYKF5AY7XmAJnrpcoOhJ2sArNWzw01ehT%2BVuhej1ELkxarAcY89qA1n2e6ZsKDsVqw1iJnZRI1L%2B5YczBVmC%2FldlPrPzPWBpOXXoZwKcbB7BArxLD1RRqO3cqoZ9JHEHyegG20PPiBWGbNhaoun69FTkgEvTUqUVL906IpXpnNsrWeTeav9tEzNoQGqy8jwf%2F%2B%2Bky1buATziHvEGmyIn1ShaQ1sKMHb91sl%2BFoLWa8O%2BguPfEbLBGBwzKevUsqG3uFQx3Mvgmg2C34XJ2Hxe16WljSZ681Mc4%2FXoT61x6JjMliN9EfDPDmdCSn7%2FFNTirNEssoh9ymjcg2idy7jbTIXgECl%2FKUeE4SYFNBdSMrqLYWirgMf6TNh2Lai4nzsupdfGLhVB0k0%2FF95c3sqq8w5LO%2FfcmmOHPUd4dkM%2FY5kCI%2Fm0rk0xm3S0yhG%2Fa8GP5iuPvzzKV05HCbjOe5yWPw1lxEp0Uw5x93zBho9%2F28RcEM5%2Fu4KMT1Y21TUks69PbP07idONwti5GoigIS0NlQBji%2FajMkUV%2BvqzNqbzIjczxM%2F%2F5JyUajx9JLQ%2FXSziZ7Nl%2Fp%2ByuHsjnxRe8xN9S7h3k8n87IELfJqXf1JOOxY%2FXORX5FAW4%2BjeJqp4okffAbdxSkjGLBp7%2BwhvKDee7LxAtsHxbYh765bhqHN0UzpCN3qNvFvMgmhQxL%2BU4cGWOdd1WgbADB4XExgPm0HZIvdrpQj8eB%2FogcMStkPTN8IQ1q3v6YAWgkK3WpjB%2BT0TeoGaKlAdNpemepLechPOKg2NBLahPsJeG373VtO%2BnyfayDid6lKJA1mvxwYSqw7C%2BfBg0QsPFhUOh99GYBgxF%2FPDvpjv%2BdqtoeGemtWvyyjEprWNIY4piBW0RzXomBTHK4skSMxoj8xt53m9UIeJYkwaHOoMiOkdgz2pLjPyXjYHRr2760ZsqIShOK01IZDGcIJH8WObEbqV7uZRmjJX9YnlythwEtXjJIeb0%2FjwjEOIt3uQlPO2rfz75KzfG5M1JC6Hx2ga7B1%2Frfm2Gnfv8e%2BKUTCizG%2B%2BhKF2i%2Fenk7pI2kETmUz8myI309EtZGSFAuWjKXSibLt0ISRhZ7wTTjPdHh8bNJaHeHWwwpgbugbDTpS%2BhSrNXAup3aI3ykvFHV8Hn3AQKUoB09rxn7hTT55E%2F1bBFCewPjha6yGpXf8Tiq1fH%2FDoLIm4oLQPn68W0GGCuu%2BhEKZAa%2B74Mz%2FyXQLqJTMYS3dCm4yDeCkLWgu5B%2B44rc2c76mj1dyT%2BRpwMc2DVJ9zisJUEC9%2Fldcwe6fveIkeDp%2FAaVHFgUqA1zIe3sMlOpMbgbUZCSppPH%2BssrHyXwqgQ3%2BzVVj9lKAVUZ3mvTWNsWeYM%2B2DYrHRQpP2fq968DIJsj%2F1OUiFH%2Bt4FYefUKocC2Xo9rA22jcLflg9I7hVvbMEwMiAU%2B%2FkUv0cjS90e77ZXAMimYqLRpsqcxN9FBPFeB4VEDxw%2F4hEd9lQ%2FRtq1CoAw6RUeeTg2tBAt0ShMchVdkjse%2F9KYhZYVpCJc5V7Fcv7V7ajnKsTxJ4DM5GSFSliNgq9tyqsgx3LUevA5%2BupZYvLHf6g%2BsPz6MC6RYkDUTW%2B9t4PTe%2Feqhn4qvy8vUjkM9Sh3LH0C6s9wlGdkKiPet1tc5NjT57bZ%2FajnzYheJrN5dUHH1eOici0H%2B74anhLb8GpAy%2B2t1KRNyQVsDDwwTNsjpeuqGJHr9Zdk%2BINHbJauqGJHAYhIIEIshQRR4aEkHvSJIdwnDyqx5Sczs5UP2QmW22177KVPIxDU16w5EyF%2FNLMPEe%2BKhg8YiSvdMvAi4LN7o0eZKbcQb5Jg5n5Wg92VhujnSYUqfKis27sA1IYFXAnjWr3vaAGS9XADCHlIe6ZyQE8%2Fftk5OUHRl%2B8%2BsCFZnhxjc2OMg57RZpD7VJGf0VSnrC9pstvXTBsxZoZJ5x0igY48fZ%2F2nOty5pCg4UUSLzAF6Ds3zSnJASnzOHtVSrgmAhPUJKzYhtLwlr63Gj3WvZTQxodo9bZ5NtFLrFxUcPCvkw0uZ9zIxhVPc9x5ls99572srZZ5nGKLSmwWPhr8LkNVflbsMOVlFBnOO9MiWzT%2BEPOLrmk67t8giGGNGNsgdmMyvXrrB1Ke%2BGE77kdCo12uOnot%2BE%2BuiC9HM9EbrM9Lej60VcgEtzv6L3nX26In%2BZENFb1rQELt%2BDNM2%2B%2FJMh8f2qo37xrEzgRtgh9fE%2B7G%2FTJ8hHo4CpPM%2F2Vvuuru33uvtFxk89h4YNZ5kRi1I1%2F1%2FgbF3BA2CLXxs0geh1XO%2FhgjzTWrSJh4T%2BgVxTecwEa3bpt5Nsbvv6WPCQYX5dgzh38qFmQ7K5%2Bs4jBlgClRyD%2BEZxdQ%2BaD%2BZxfwxdcRlRdCxBXCXogwrmXHbP6BBv2z9w1ARKNAl2o1MT4N7fMPcPL%2BYTSzGp5YsE4SGoYea4OCQLyxo57dPMzw8Xmg7jMYWf5v5ibPLA7BFlI380MaRqPfLTRAW6wjAwSEuEtu3082G0cvgGzFOTcCA7yD5FkCG4vkl6SLps7pvxxOKrT85SKj1Irzikb7ccHKydeMIoZbT1djvDTZpxPpH8W24E7MfYNXKHLJ84QAvZW27yeartWzhVsgs3Gej5J5AUSNRbfm&__VIEWSTATEGENERATOR=0880C9C7&__VIEWSTATEENCRYPTED=&__EVENTVALIDATION=x%2BMdHu4JRSMv2uoy89mnldizAN%2FeYiPzG9fEYrcVVEV1PcDf4am5wUtzS1SBmmVLhWtZm2jcACHMWfz%2B3GBIYzXT4uUxMXlzfHlBjV68hOOVRnFVcqO8sHOMlIE0lU8SsQSDWG6xgisGON8U2VDdRE9kastNwWwcDiulhafCdFGbXycq7lwM7mgKcwrCKuUYSfOfs6jwS53xUV2S32CxOvA%2BLlM7pf2sj%2B4Kjhb7xgq4ZxrPjv94fN8NxIklwlS29bwg%2BgKubFauhfyBNQ2fZTNdR%2BlF3AL39O5YFRvWnBgooq7KQkVZoFAV1kD%2FaytJoEJW2CAhnXzAs%2Bg2sbsc31SdW6wqkgsFMYsx7p20b1h2xT6kR4EllbFVqdBxAh8GvSD72c2sjnNRLyzRWH9m0tp27iXT7GiRqWA6zyn78Y5ubd2pUcHgnU92OPW6XMg2NtDtc3FNsgFuP%2BaUeXAQbuyie0pRnXq0iak%2Ftxf8Gpxp5qwQNLYRbtZsoIH4qkEyhLUoecrPUVEWTCMoU3S%2BZG9X4CG2oce5OKIW8OMvsmmnsqccxO03pUvcBt522CNmDEh7mx2j5Xt2QNJ7Hgf5RqNP3lStQn9DFl0GY9jCXKW1TF9PWlB18snvj9YnMD%2BRC0Mk9ZGrEN75UNNv8zzJMRUuqmaAPfGtjusx%2BrnWEjf%2FQdkIo9eOxCtUXzl2ZJc63EEcThMnGalXv4hKk1rhvZqQjU4O%2FvMsncVe5AMpdk81%2FIv%2BjuAK7KLQCZO8fafFCnk0HxYAaCVvHhLIi%2FDK5486qWSv4cVwVrdyc8L%2BhcGVdKuPM3eMF1drnjbJfiVx5UjThhyOk35KTDXE1Ohp7IL9RqLgq7N22Ptg2%2Bgavw69d1DwwO9O657HPrltxVnqHg3yD7CCdBKW00kLHZUEb0yTCbEOrgtpDTX%2F27fCykPkOwWs7SKmYAqeJYqrb7Ey7jMlYqJ8SHjFqDAe0Brz7TBU%2BUmxirfKyykzoAPC4k8zFBvUWb9yUlzxVEF3087K3n8OkER0RyZWDFeMv4qQAyUiRjtxDUrqGgXWt8a%2B3xj9U2jxPEY4Wrh3g5FvuaxfovX5RxN%2BcwrUjkykq7bKp125JwctM7vgS7LeYLsDffSyWa6xiS1O%2Fn2nKzaQ9RGMOtSQEn5aIl2txcBtjoNmlRYrRgYwutxXJnDczLzwzNyXRevl2X1GapzOPfjiYooH3QCaSZev3zHXyil8EKTLk0PZZdy2Rp8ROehc94tFAduJSAPy7AnFbpC%2B2TLnMV08tzp5xoeXoHnoDieJDCSFJlUWGDdv%2BfREOBI%2BjycWvAWJoVN7Jz%2FW3yu74%2FrG7TT0my8j6FarwxGg6dibMzjsfMy1p5E4V6xaKuBwsRwwBUx8nUla68Al9bUN2WHWdOuXQLc%2F%2FLxDj5PswA5kMsHWYCk8KJGYLKWNO22nPDwDC84AddEWLtqtzpsz2THoMd3u9IwCU0oDl60h0g3Ub%2BotGXJProBUHH28Z5AoXgSWx6FIKY8kjkCIMghbxCfoz1oAI3LEE0po0iNEVzOcuq9Gh1pRrd8FWWUoxJV8Xw1yKtxVUAKkoITszGCaUAxgSjK3h6aM%2BFFaSNmMI2FLgIvzWh4C%2FevKlk71zzDhVAnafasz6xmulmHLWKKRAHFp4WE8NRdrkTLP6GXwzhZGwID0daNAeMhjAsn4ktuUokHWJuuQzmK4CFBZeiSujJw5kRFPFzG%2BRxx%2FTzzsaQu0rflwG7bdvysrSzKbcv%2BJ%2FEE%2B3SuS7VhxppInO%2FD1eFJeeroxitPm5DUxvIWKxe9GqkO1Zg%3D%3D&ctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstStatus=1&ctl00%24ctl00%24ContentPlaceHolder1%24Content%24categoryFilter=&__ASYNCPOST=true&',
  }).then(function (response) {
      let html_string = response.data.toString();
      let list_array = [];
      // outputResource(list_array, html_string, resource, url, response.status);
      parseResource(list_array, html_string, resource);

      console.log(resource + " Page(" + pageNumber + "), " + list_array.length + " records retrieved.");
      return Promise.resolve(list_array);
  })
  .catch(function (error) {
      // ignored
  })
}

module.exports = async (request, response) => {
  let resource = 'Services';
  let route = 'services';

  // listOfServices.push({
  //   serviceName: 'Case Closure',
  //   kioskName: 'Case Closure | Cerrar Caso',
  //   isKioskDefault: false,
  //   category: 'Child Support Services',
  //   status: 'Active',
  // })

  // FIXME: fix post query issue when page number is 1

  let raw = false;
  if (request.query.raw) {
    raw = (request.query.raw == 'true');
  }

  if (request.query.page) {
    // fetch by page

    let page = request.query.page;
    let promise = (page == 1) ? 
                  getServices(resource) :
                  queryServicesByPage(resource, page);
    promise.then(listOfServices => {
      if (raw) {
        response.status(200).send({
          listOfServices
        });
      } else {
        response.render(route, {
          listOfServices
        });
      }
    });

  } else {

    // fetch all

    // let p1 = getServices(resource);
    // let p2 = queryServicesByPage(resource, 2);
    // Promise.all([p1, p2]).then( (arrays) => {
    //   console.log("merging results...");
  
    //   let arr1 = arrays[0];
    //   let arr2 = arrays[1];
    //   let listOfServices = arr1.concat(arr2);

    let promises = [];
    promises.push(getServices(resource));
    for (let i = 1; i < 2; i++) {
      promises.push(queryServicesByPage(resource, (i + 1)));
    }
    Promise.all(promises).then( (arrays) => {
      console.log("merging results...");
      let listOfServices = arrays[0];
      listOfServices = listOfServices.concat(arrays[1]);
      console.log("merged results, " + listOfServices.length);

      if (raw) {
        response.status(200).send({
          pageSize: pageSize,
          pages: arrays.length,
          listOfServices
        });
      } else {
        response.render(route, {
          pageSize: pageSize,
          pages: arrays.length,
          listOfServices
        });
      }
    });
  }

};
