const User = require('../../models/user');
const exists = require('../../util/exists');
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
var tableId = 'ContentPlaceHolder1_Content_lstUsers';
var columns = 7    // data(4)+action(3)
var pageSize = 15;
var navigateSize = 10;
var activePages = 22;
var allPages = 30;

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
          $('tr', '#' + tableId).each(function () {
            let tds = $(this).find('td');
            if (tds.length === columns) {
                let obj = {};
                obj.userName = formatText($(tds[0]).text());
                obj.fullName = formatText($(tds[1]).text());
                obj.email = formatText($(tds[2]).text());
                obj.status = formatText($(tds[3]).text());
                list_array.push(obj);
            }
        });
        break;
    case 'Locations':
      case 'Queues':
      default:
          break;
  }


  return list_array;
}

function getResources(resource) {
  let url = hostname + '/admin/Users.aspx';
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

function queryResourcesByPage(resource, pageNumber) {
  let url = hostname + '/admin/Users.aspx';
  let datas = [ 
    'ctl00%24ctl00%24ScriptManager1=ctl00%24ctl00%24ContentPlaceHolder1%24Content%24UpdatePanel1%7Cctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstUsers&__EVENTTARGET=ctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstUsers&__EVENTARGUMENT=Page%24' + pageNumber + '&__LASTFOCUS=&__VIEWSTATE=yKYbqXuKFBd4SJ1IGle7Yj6cvu2J0esUzydJ7Nd6qh%2FNII0hanlybh%2BhL8NlUAzN816p0qi8%2Bbjgw66ZCWDYPQVOpW%2FSQRufd5otjKjZKMoLlSn2nY7pLWHW32X0nYp32upPYcFXGdoDdBBydrMGrDeWzetr5IfOLlOm%2FYLPIhhPrpWxKE0QtRAjg0vcYfEVDhHq5HJT%2F68ErisK4r1eg2PXF9%2FYxwDvxCvNPmq%2F96N7jbzb8l7GlmNacC1ePAp%2BhQBOlXqCMfbz7j8GCeWgjpzQxGQWkxKcZSAW%2Bu6VTeH5hBy0E4X2JwMBYHANiKVHtzUJjvkTH3qphjIP1zJCvKDYbRKwhOkrMk4pBjj4NZ8H5um9j2hOBX%2FDXyN2UlP8IPBSlWS1T8KBUb8usriK%2F1RZZ8UdUy1hWAJGKdKAQgR2og6JPfb1NNL8VrNa1uv7h0ciUGSP5nD5w3G91rcc0uCnSy9sV%2BLAN0ob5308p3WyIrP0z2ibc0HHsi%2BUpZpp8dgZGjG4cBu8c%2BKtIKvPkx9Vi%2BYAaOBIrDSXEvDpYfhYPqciUtnrpfXF5I%2BGdlI0tJgja7iWyCt3HQLN%2FVZt4Fb5MiJX55NYB51JEIyFFyam6mBqmo%2BYKacn5jOZMdAijhc5Tl4Vyx5c%2F7DpgMzt85XCl0LMqZUyGHugewlaQSk26TUs3hguL78ibfjdmdB2uf%2BDx66K1PuRExOe0uo6cJLV1A7fH%2BfGV93XiIirOAUCCZ3ywoWcGbEhFOYzZSlZMvh6937gQ284%2FGBKJmdJbk2VZN88Sg7FJKB46DHnNtM0al%2BB50LlfyOi0bO%2BlPkOv9rqaks2lu2LWqTVRoOJirrAFgyLY8xb%2BmqQiUiNgrHYIMPUhkMLY%2BUdNnf5TsDi2lvmSGUkLyzUbEuHys4MZ3ycTE7ykb4pZLhTAeZoRdme1C6dD7eYhrRfasGYtoRmp09lJZR1cidDFPnzshpzhCKS%2FnhZfNKc9XktKr0ijPyh%2BRmYzG7DLGA8gCIUdrkEugj5Wj6kOfYq7kP7fdHph8xKxKJfUKE5x5XUAouqLbR1twRmxBh3SdLFRUZPVqcQs3NgYRCIpY%2FxnRTRl%2BD9CO0E30JAjlFDnH2kiUXHg%2BrkdBRUxVo%2BHF9vJINBrzkDKn4WGUJSsou4j3I1T57JTq87uQUGE7BUISkosjjhZxtXoPfZEvn%2BDaCmahzkHU3IUnRwGILECd3mAPhtmf7Ixi%2BFoQDVJ4qWihXa73GJchIccjG%2FnuM4GNse8K%2BDOEktx%2Bkm1uCQGpPObmMyrpzPpx4IgWXNHHHxqwf53xMARj1AdsBtJcf%2FnPA9T1RE5Ess6GlAISaQPmp1BUcKS4gCUB1VmzOLkwJgBXCOuoNO7aGuouOPifHQowswtBQdShPofYCB56tPjr25IjESRDi3veUFMZavgbIOYOeRqDQUfdhJ89Ew9ozjpHR9sStBGYv4%2B03ju90ey1Cu0sU%2BzGonN8ya2D5cYYuP%2FlY56gVilctKH%2FN9sXBtVVWtYQ9f%2FqcR%2FFT9YvXncwOHx5ZR7VSSSR8HwkibF5OZYhiOX02HbeQ4ijiqaJwg%2BC72fSFLrSqhkeMD7JxJZSBWSZldu9Vr%2F3ZJchI%2Fr7sgrpKMFqy2Nr%2FSgpxZWnItJiUg%2B%2FxDN5jIocov99TdslQQ4DJgeq2XZmbv74nc3PrS3gc14tiGuByECO6nP4kMZoYkwbnLPxOZLVNr%2FzsMYZAO%2FNBHjRB8fKpQsDky7Wz4dllmosiDWMhApN6fHjPOAneOt95quzmOAI5daQbKi3EXNTDaHLGjTFCjEL5rQpe4xr4wABJgSOLdE9B6GR1D%2BhpL0Z0RyckYEcP%2BzwlKYDWtY3OzWo3sKar%2Fqm5Absm0DN3g3gidR9Z4252oxOKRPTXVGoisiBkOlwJZsHBkU1ZZNFtyofk5WqAKNiVMjPmZkU5y%2F2Sy1OeZoE%2Funmfco1XUjGpibN3gdgLSI1WlIwzLaBZsHBUOpRGO8QBAsLnoW1ptfYK5echMscIaVd%2BEtdpNbuLDDGbB0VL%2FysUXLmsrSnhIj0ASLi1EPr1ZBl6h47d8i%2B5p4hxCs22WQIZSxAxIY8%2BxKOevdZwa%2BmSEdsuw03GSPWrNQylVoMZGiXj%2F3Txf7T3PwmfW9HVgvhjQQl27JkKI53xslQJrZtuvfizWE7W0e24%2BNcw0Y5t%2Fv%2Beuv5HUc9PObPywdj4GH4ctixN6BzFZJ%2FXReH25vhH91HWQp1OmXt%2BqL4shydqVSA6h%2BFdwsF5L3WoIcYvjhBTHcehi2otjdEnwS%2B%2FNNQXRt4ki1KTas%2B7%2Bzz72TZEBtH%2BP4ABKU%2Bd2ZEog3n84iPcu7J%2F%2FEh%2F0OCBE1Hgy%2BsiVMzDV%2BpGx6o%2BV3N8IJrd1JpQb4MoB9d4jIENiNWtS3F2N5bN%2BulePPv4y%2BgruQ0yl502EQsHsiHeRsozqwNOpP9lxexgc6hMYoi%2FDZ3CVCh%2BWRzv3icpAy%2BX7mLhvyDJQnB%2BqDOF508h%2BLxIvbMbRtli%2FIQhIzWKWxyD6yZOJI6jLJjUaaq%2BgQ59n2NcTBBGS7Sr5xr%2FOg6ivlsOZiA7gY7AatJ5wvuxdEFFDnPr93FqRfJkzBg2i0xZl%2FhDmmBuidsytI1J0a9d3yTWUz22fVjAuG0KPjDP7p0qnXF1%2FdiENqC2l4hXp%2B0OdcJvXV%2FRJqqB6CV%2BLAKMv61XrhNwrHi9ggCTFnP%2BR6OBkI9vUg1P0DdBgjLUC6OROZFKXNO4NRv%2BujrllRnWR7pSirO3qke%2BECRYJXcR6b6vgXn9cmdGJTW1evRUtjz6QwnRYfokOKAyVysG2Op3TuHvah%2F2fViSBg5Zg%2Bn9QoJVeuCBYUWkDJmTg5I2y%2FmqRdqHO0uUCcE%2BZXoXL%2B%2FRzdiF6SkOge5wOkdmnLj8TaAlRdsj9X2QFgCfiEcyjGPjlLKbZUZeY%2B15ZItCNa%2BtWj0X0tOU3x8OU2Sq2Z0gXpISHtlEEejC9bynSvAyZ%2BoI4JHcluz4673EfEZ2N0Qeotl%2FmumK8zTupa2LrDD2kIe5ilZdycgT2f3mmc2KOGNaDY3Qyd1nsD%2Bbe9jw%2Biwgc452KACsyTgq4t3qx%2BS2ojn7pXSi%2FkPsh7B7EvcjlLlgNPzkoilrkCG24tE79aAY1JSt1n6biep2XOUiyHPdwdLXiBBQWo1aDT2akYeeiJIQ3tgBqrXnAnkycnh6P0wj4X517MrDcRSgdAcqvEo9SLAbyS4wX7LfYWUAwkhbS4YoEsRJ9XVSkl3vUi1UoAYZKYCLzFbLDK2FXiABaOd1yzhQtPocaAsbXJ1Ysv0%2Bf56dEKnSlY2vlXkjFCzLHXkHHfOPDYJjB0BYsgPcLNpSeiE%2BxAFYrk7e3MB%2FbGOHnDRAoPsru2v%2BsgGe6K2fvb%2FdN1qvh1CczXYuBeksBUKl4NZgOqLweU0W%2BsQmhNcnlAYbwMgyXHYzLpQNsMvCdWZIFIolsSOXDLGmUKGSflEsQnl9CHnNDyGsei%2F6aSwJwfWXrTmJ7VaxSDhYGGtSHAnhE2WDWjq9UBU7Z3GrGHZy38kEdONsSOSeDKuCT6RgzMxYu4MrFXCKgCVNN1hIYp%2FXn%2For9oKAtfsLbG8C4IDFV9a5cR%2Bu4VuQ5rTNvS97UpvVJRzGgNipJoEP8MZP07eEz5mHvI%2BQDpEGw6fVeojOekK%2B9ny8ku4qJpeIXhT%2BlqA4%2Fnopbtu6bYfkfvrO7HJj4HD29FuxUZ9ZOqfsfyUR3grH2lsL7itH8XxkqFot%2BPo%2BPRIYvQCf7wnkBgc9jQ7Sh4FmrcYjOlVZaKmdFLfbwGXz3Yrm3XZf2BjB7n3zREZRbs3w9c5QZgbegQWCgfBl7%2FHqLRxMORKhj%2F%2BPbM9qclxXnRaL%2BHEcTg6%2FkDZxnR3jEeqhYtlMcgHTTOmpApYNVNzStMbfMHlQf%2FSd0OfPOL%2F8yzvw0DhjaGa0YOJJNflMx1YGPDRCndBZRCO4bmEk54r6lIwkY2a7%2BvAYLnO7QBvINlEd8WYi%2B334cXtBhaEIcy2U9rzBl51eW4peBQNEXMfwq%2B1GUolnxfFJkIun9rQPLXd2bPL9IcKWFlxrLuI0riWP32hLUYlMTcez5oYf%2FOgZp1L8%2Fc6A9tSTv3wJ0UWz0CXqctI%2Bv3lr%2Fog1mJIEzS%2BU7%2BfH5uQNNU6Q4AeWMS7ma37ByGhZe712e%2FqVlauYuwTO%2FX%2BqIq3Bl97acEsl1vjERQafyNWEZlVGOemJ24JXnJMS1ETd7g7mFui7kKNL0r167bDrYMSrCp5TpP6r0wpYbX%2FQXMD%2F63KD8VCGiT5Wk2HLwxEQcr1bvhczg8wpwI6W7MJ1ryX3qL61WVnvNbNF1jtnOhEC3%2Bg29NxygVO4b6nVUIvl1JRmhtn%2BcbNMovqV1%2FpYGwfCcsnxXk6XetP0rQ5%2BZW%2B5ULGPnoriACxe1t5mBZ%2BlHR5UW1A3PZHuVBNgIgdTXpbK2W5kBnIIgvV4675oCpybZ%2Fir3oq8hT4fD9PH6CyoL4unwDNXEiTi%2FecR673MiK0ab%2B8CMIv4GbBprz%2B2zvrvyA54VKiyMVxj%2FsMgC4cawX7rmP2kPuPQbSl3qkudp5XU%2FPY3xO%2Fxks8V7Es7PeBatOGUrjchFYRU%2FAh9PmC27ZJ2pp18jBUN9ak1E7am%2BUVoAOLLmpPSTSkszzdnjR4gaP5KyVL0remCr8kqcf3Bjq8H4ccyzWk0IpY1zKie1mRe%2FUBjxvEf%2FjpX3blKqrvwbd61Zg40CxBko7%2BM7lZXoCEUJ28lz7xBqKm3Aw9SBI7gOoG83aS6cudecyXhplk73B2uVNMqWq56Ja6WLU1UG82vhLhcdJAh%2Fjb7krhG%2FGVZD9WMwAgko7vnPMTH0ruoT%2FygAhBpy32pjwHo0pHosz%2Bb4ihYIiTahvsKOFpTco9t7p%2BgAQlujgTj4k8RRpBVzC0fgZpDAl6GMD18HG1P8lw2TcwMX4FclPQrGT0l8XoY5MNJk31%2FnWFRVlhk48FXZ5varHNoPXnS3lJYBfwrzKSIREr87q4CN2f4gfiYpHBQVv2ZEwyGqis6L22MqgBpndN0J%2B4drr7eHvnmIjtX9iQWmxto6%2BlNDEFKx37IQDedCzDeReF7Zsdj5SUAcWcqOiJGH5LcPYcxt5BKVpEVIBLO2w8FhJtygzhJ1VaAJcFWVReJoGA4gBQo7qExbtQn0pMuNbsAGTsOUz2F7JmSdPevqb9sq1iQZUObiHuiSuJFs%2B%2FscTdoiY86lfkLDntIdMmdoWewXny2N0Z5Fnd%2BL%2FVoNp9Zx%2FovHFT9TDtETOEDtRwhViONjuGHvyJaQsQevwxwFc7Ly67C4TClfCKi1zM8sV20qI4vuAFzoHzgd2nHKSb835ug8cHvDwtqUiIJep0kuPhPdx1N8YYo%2FcphiV9QMwW0xNh%2BmnknFQ8QIKzykt68P36dgbmn9QhsN7tBWl9viU5lqr%2FhJ9%2FrJg8OQXv%2Fjh7NFA2x%2BGuOJPzDfAI1pulpWvIO%2B%2BzwBIElDetqgCHqvw1MV%2B6H2xft3uZQM3z%2FnOUdtZF2UiejHNHdowc%2B%2Bf6v%2FdNqeJdvalNtKotQ8E1ShC1J6XdLqZ3ZJRnxfK2KrMaSnTaAR%2B30irlLuEhkTCV39qO2XNKUqem%2BOSV3aCmf4%2FCOXlZUNxnti8R354QvBcH35pTjCaq%2F074zo5r7CYlFPj%2FY4YBWWwhswTCAYdU%2Fa4n%2Fc7dgby7yuy58wzC9ROFc4L4%2BbRiRVRbHk7hi0%2B4%2BiI%2B0tGjDPdSqvdT3wir3Yr5kcloHAS5h3mggUJICUMlKURhbOv3D%2FrUCcldCMQTxMKeGGZse6vD4sW3mnNpLMtHJwO6Zg6BJ0G8uE82WqY1miOvwLPm3yWPbKi9ZnQ2QCLy8b1%2B7WLe05qPCdxrab64Hdno5yVhcdFk%2B4WvmYvEU2OisCUPTG3V7Kh8xqqlnJUnIoCfMQeOyPO7mKttX853B6%2BC%2Bkz239AVKnCUZSa30rUHd%2F%2BZ5AS3LqEl94zvY8hI6nc6QFTUhoAoWiZ0cHX1w0gPubCkJdBriPUHuaoDYvdNGEH%2BoGxadHy6d286xlbnIvfcSOz3QDnzCyUwh3ggJEyXjI5JXHRbO9dxDcMqMUClxXeDev0II4Xe7g0Cl1DJDkOWicEb5P5QD2%2BZcxBGX6HuFd0L1BgGu8By3yucW%2FZpNKdpN2x8hM4qcG%2BETf2EhB5wWXUXpY8r6x03DHHeNRILIV1nZMToN9ebyY%2F9sMJJWZCfQ6md3bKbxI4iPe5ljQJN1WERnL1kmFHOMnuHHZKchijvNl6bSXJWCgCsnpy6uXZw9Ei4r3HwKbtQVfyYQI4HsqPCFxPTj%2F9CyQH6CRVF1YIWemO0yQChmN4uy1wvykhsVOQbLESxuhYlZ9u4CzkplHgw9SoCWgQNgaQg5yD3Cj%2B6NPUVHRy%2BgbaZij31w%3D&__VIEWSTATEGENERATOR=8EC5B72D&__VIEWSTATEENCRYPTED=&__EVENTVALIDATION=Zx9itl4aw0yFo%2BI9ATnawTybEQzXT7RQVxvnklVLkgGb49nz2buKeaY79CAJJiBebXV7f%2BsTi0ouXpyAi3GtJSvOys1sqeIFNyjhTk9A6shn32YWi0nLY6NZGpEeigs5s6971DVHPeHuH61xPB6FoPhgcsLGFO9rM%2FDdCjCyUU5B4VClP9zh5Pl7Vz%2BH7M9xgXSJB5MEf2Siz%2F7yGm7Qwv3i4D1hQk0feZp0%2B%2FvF7tKJ4riLUU3wSeFV1UASDejSmruNUWAXM%2BmiZVJOLkfJihELwmt2Ae8JoYPX1P8cowtk2D1fkySvKKFk6b%2FqGpA6pfe5oEOprbG1pzP5pPn7Ovga5eieRkJzTyp7kF8wXHfoASEeZp2upKKkyj7dhvTmxgkfKhGf4MuTVJgMFkA0whGb4FPm%2FozAlth0wXRZBUypOTPgWnZKWZJOiVpGLIDS72jHwA8YgKsdKxan2rXSDrVrNxUU83St0nqWa1IMPrnCR4j2ZLnoi%2Bm6Lip7HZS1co7sBKUyD4VmXxXuGyupPjnakKNHr%2B8BPAp1VV6T1xZ6peMAVS9TlrYtI%2FS981b9Z4o%2F9N22Lg%2FEkO37mqaQHVplPnwIAmbGiEy5CD%2BvrN7Cz4nMbfDeb8TXNrYq6oTsSKqknXbgnpuojvzWfTnhlxbdMWtWPIapSObJavLmrmY8xYqXYS%2FfegVguAW8YRrYe7Rj4q0bjPQbkdU4ovChl0JIE6O%2FH1koQhdlF26m8tPmSUyzug2gqJHx4Y7O6I93Kxv0PO0PW45Ww92KgJY1GOKjquRzHzZK9YdQvoPHuF9%2BjWI8rMT35Qttp3qjvc%2Bbyg0Vxtx8Pz6ng0mbp%2BCwM8PtBf%2B1DiXdbCNFwflxurxfMl4LHVlRBBqjsHQKLa%2FRr%2F7u%2FHY9xisF2jZ0tdVHm18DjqVkfTRD550KPHIqz9B2ROjJBkGweHbVtcfR9RHxmGB%2FlfQ%2Ffomeck4ETOzvqMl%2B8LJ1cKzFZH9nnwvjwTfb8qdeP2mmmoNnTHH32s%2FWNp66ILXFkiq9wYKRxEAq%2F%2BdkmWVJ%2FCPVXicqDeE15TAVX8Xf4dBI0V65Y15H7mhh%2Fj1J1ALlzP7VqbcUdHc%2FtzjK%2Bl%2FWjJ7esJsqaHeYcKJK7cE6%2FIbHGBjlsj0a6N%2BVqEsUtQX9W0atBGndqAfQJ6kcQs1x%2BkdSNRU4dp6jehP5Oqswcb9Vk2icmspr3nRC7KZgrBbCc%2FWlpDMdlhhBcmbax7B6Yv%2BNCg2kk8PZHootu8%2BAOTEzGzlr2HS3XNiCm6wXJU5GkwCoMCX68803FB2kdmwjsV8Iv1OmjRmcKWACQMDdg8rYDkzzzNScuwx40DTHUernaGGwedKrAnuIc3fTt5Xi0CyFhirMnYCf0oet4XY1ynw9Tr%2FDN6NoubkNclNPgtcUSWdi4WdlgOpZnbbJQO1Dc52Wu98k5F%2BA%2FeER8pWlpumKRQ1N6%2F6R5i1FHYQuLyX8ZO7%2BoHftTY%2F5Szj60oPiYZEEbeDxbRvRqUAal6cKlNAdbJ%2FVReLsEHvYBXQh9DUVO4o7bqNnEdjMO%2FPwzd79cK9dR1WNSoZOzE4QM2OUtF%2F3Qc366uCYcudYkxunNxt5MGy8WE5ehzhxixPxixvCZ%2F1iFIA%2FzAHEtjPozhtXbnnKDN6aaObqB1%2By1IIiGQhCiavrW%2FNxQAQLKih1wBjRi5T4Kh4eqUMI4jhnqTU5zEebQYw4UYbAbqsj2FikUGC8OLacw2vt5AD6pENn%2FyAi34T8hrFRNO1jSaI%3D&ctl00%24ctl00%24ContentPlaceHolder1%24Content%24userSearch=&ctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstStatus=1&__ASYNCPOST=true&',
    'ctl00%24ctl00%24ScriptManager1=ctl00%24ctl00%24ContentPlaceHolder1%24Content%24UpdatePanel1%7Cctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstUsers&ctl00%24ctl00%24ContentPlaceHolder1%24Content%24userSearch=&ctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstStatus=1&__EVENTTARGET=ctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstUsers&__EVENTARGUMENT=Page%24' + pageNumber + '&__LASTFOCUS=&__VIEWSTATE=HIQKTvVfOFNQHyqC9SI8dxDN%2F73C1y60E8mDy4KKRdH5wbzQ4zev8fO0G%2FqbRc6MajhOmk4SEWVkYOlYg3FsktyVsjI0kbVuJPrJO8QfU%2BSCLYt%2BwhsoLu7P%2BW1xJ8Mn9UTd2IgqStyiVWieP%2BNPlymfn%2F3QyxJcxTGAwjA3a0pAS2N540o8WIJh2Ie%2BoWuHZJdvjSJO04mc81wFdi%2BBSYF4cPI5jn2KmiXxrPn4dD2qrxCvb22YYsck3Z7b2qKv%2B%2B%2BgylSeaGxB0xXtrSZ%2BDGJZjPwjzJpPn4PIpaI9mJfAZavnrKX4SmbgpIaIA%2FH04dGZrMteJct%2BuCjh0j3ifvxiHC66dwuMYTPcgJhYEtOhRFF7PBA1OQhp0CLXxjGS21L4pw%2Bkzkb3Y2ldLyBf1EEiFqU%2BXunUt91CkaBCDsJfr6ygZgWckn2k3lxSXBBcod%2BL45M4JJGV%2BvyxuuzZcTqUXWlu4RhIr9NKiFMRq4EBez1geHzU97FHnstDFGWSKSJ6UCRh%2B6xepoEH7hSrE0JG4RFQMUFFatg8piLCfzORDzRTCn5XcktYnl1j14e0Y5%2Bau8Vghix%2FTxDkG%2B%2FOGPcajiHZk6NDGLkRZxzAiyFauAM5qXDjI7sIAQoRJGVmRQC7q6fl4WlguIBz6n4hlxRKY3zq%2FUyQJ5YHDI7tPESSfJxVYN7RpqoWnzyt5zoAqpakIszYOK5NUykzvnSABBtgipLBdjsaJmW%2FuOIegzdS%2Bc94ic16PCSLDVaCrCmLJBM7QRN2j3ImVpdon2Q7N4RRBi5hH4cE7BIeZxKAkJ3q1zZ7Nkk4MZBL1fAbQq3bRtuh9orlRtu21d4T79PSpa52TKI0kbkuEBx%2Bea11Po15mJye4Ek9U%2FRO32e2dJfHIGINEg03ljdrQOeIEmoxFtLiZltpc%2Fcr12rpyiGQk%2Byo6u%2FTNplxqFP3pxemStMXIJguwgw6H6sPY4NXli9F7%2FZ4PgD4a8x5VdpI3gGuv1wbpB6EEiuqD%2BMFHS6LRVLpHVGJqkFu8DS7tzeyYAIJQ7rnMZU1%2B1XNT6F5TK9hJoyBIPquq5m9DJxLdvHJ4lUbMv3chCahOZ9kOci6USDC9aiAmov3%2Fk0Lh6N7TRAmNvOu4BLNukeZj0XEX5v2hQYr2iUWfjJ3SkBSbqAortAnv6xhr%2Fv9Y32%2BrCymy6yS8VYa4S%2F3F%2BXdNh3MUmU8rdWkH8Y9fsKMRoEltdyxJTktsdm1es1Nj5NhRWkThDMfIKEM9Q2FQLy1CoWRHb03MB7NEmC70%2Bhrju5%2BwlPU5qq1erZALZzRq3avyV65S94wgCCfKRXyizE7DtSQNg0FT9jxrTBapUsCZ0yydJvpW76%2FYF8QynDVcxCn3a7HsSfbLGE7PDaSxD%2FN6bTrg3dw2pXXMxOM5%2BJ9uKpMhFD4lYXWa92qzHLg%2F%2FFpFzTjVWMi36a3JNfpklbIE4igPbNtMbHF1lPQL6vy5YGGqk9h89lxcyczceN7KWbB%2BGNinsfJKcMelHRsUfksaQrOdmEy4anJjNRV1YSVQ0%2B%2BvTNy9BBD7mVzY%2F7ZN%2F9ZYamV7iWJbS6njnV0Ud6WxgKnN1kG%2FHCEn%2BbFJdv6e9p4HB2oYD5Mo9xQMJ5JcE19RNqF2uTEwTBIsgsb8OquCxj6pnzRCpbFF674zJhgAYYuXp4Ix9VOjdJ8NIAcUOI0SL1YE8iEwzt5g4I8Pdqo%2FBGFL9eRkTJNyrEVnmX6D6K0q%2BarC6uZPJwFq7ACuYadwJqkc9SOn1c%2FBmcZtQvz0JlzZ9VzwhBTv8iB6E9XVIpyjN6iQiyc1GeLOA1Daz8CRBQJ3D%2F17Sz9PjJj6CO7reY%2FATAk%2FJUDJUtt2yUmXoW7lLswsZzJwgayDiIpRqljpRJmyG13UUievwoQck%2FkzEBusLMqkjpGFbiry1H5AuWc%2BMCl6ObSARE1IeZD%2BLTCe7%2BLkN9tOkH7O3UaAY1W7Ompl0QS0bbKO0e7v8q0OIUejwVSMA5wLhwpxmmznsXnVr5MQtphgJfe26qh0gimnpBv8poBucVmJF7YF5IVjO56qmV3tcG1G6YJl5T1jK6M8DJPvIIhXZmEDTOcz2mckPNzWsje56mGCcHuKOY9sjpaCNsKXF9JGtgk2Fmm8YyaPBlqYNYg2tuMWKIz%2FtO1Mw9sKWaQ89uH0%2FhNMzLQ9rfG9qUNoM71HFpU9NM8Pv5X%2BA9GWlG%2BpAlUB6ZCUTAFxR6Mb05l%2BBijpEUahz3m%2FAt%2B663Nz0qYEl5RpajFHcNxyNglDrdLgzUv6VuaRVS3N4DMgURfPbulPmxMCL1Q%2F%2Bft%2BMvETzVBVYZ5UH3IfhYQSqHrSeSzHsFPBx1hzAAoTHJAUsLa%2B4nF3jsakIirNhfVRdjL%2FWPLM60acOUMrxU58%2BgaOou81nE5b5zWc14ixNM9g%2BmXSqcyQEGsxr1BMF7rz0lBVdcF75WcVHPMzImhXkIeRtWX4O4X4qLm6SOIuwlle9XJ1Bq7F%2Fu3Up4UNCRBt8ueL3O7bwm16ckaVIT9rpdgUaaRgtMQWnSVJV2wnlQziE%2FTioAIw0yvWlZP1F3bWbySKCnPCwyDZZWSNnMzFXhgC7JyaOPlpObLf5ikbhOE8rMRBzW8ilUrSy48iMYXb9fvfVYm%2Bjv8ylGzKfhXuUWQ1ROdsFg2hE3GSsNocm7tZ7cbhakW8HLIo9b7MSKJnRf1Kw2WICBaKI43RhFIby0yCyDTF0J7zmzS6qCsxNGuR0aO9QTGHg6kO875xlC6wAESLrVhZgoZ0COvcNWtQJLZrJx5nU29DN10H9yjnvwEgpllmXh2%2F6xuPLFMQR3eMy2Ho1O5%2FlpsAxD%2Fqass%2Bu4IPP1xz3454r4gjhU1XvKfLLFbnI2HyUfVbJ8ujz60HHqci%2FdazMFeBfFD49qMt5D1wcsRTqVnPx0fi8Sj%2BmpKVhsNyNOObs7RuC9w4VFJlV2rhrtGPC6vpxMPSsi6uMvVRKx7vvH8xCir%2BJVP8AmWNDN2wvyFPniCvRDrFXSMbKR9sZIEhQrCCpWA75qjOh0kTKrc8RAdsiQq5vLQ8xak7o%2BIvidhDKK%2FeaJzabs4INEiBbBwVAuzyXBuu6czpwrKw6hEFnr%2B7bZeNQ%2B7xWn0vU8woPy5VoCLauWfYsLYhFgh4NNa0t5X%2FbPmYgvfWDj2TCrNrSMQPub85t%2FEenprHJMSwpPBgImSdtFIVyAQOtI8qXiIslDN4ml6tI3IAbZ5v4ahkwh59BYisI7hHr%2FmedO%2Bu12EIHjwYHgBAGGRIASaHK5FynFB4DnYLheZqyYa5z%2BY2ji%2B8J5lmq%2B7OxMqu7FY8tVAwWvnEKOrBNg%2BOI%2F7c4r4Q1wjMSX8pkDnFHanikjyuD8nI6eVxM4ZTt1LeN%2FcMseTymXroyKLF7iSPS38C0HXek6T86krb%2BtAWP11h5YzTKCnLnLZkP4pJGNY70A2vV1EO9txDd61vSeeHfK7RjMsvDqxXKPa9mwWRouDvlfisWqQR9lfl9x9GV1FReKb7Qg6Q0dy5KKrCZ201P5x%2BhnOGEQfITblW0fSAipLGZaPqwXYW7IQrtr%2FjJq5twlZG6LqeXJ%2BL3%2B%2BkeVf3urGxuM%2FL40dWNT9x6UZ5QEjaIDfq3SiJK8x%2Fd8FSXV4vR0LrRt4pnjz8y4jqKTQn%2Bvc6mtIH3dasuii%2FZ7cRsGlYO2bLtKb6gt7NBo4Gm2XySz77ZIIvuQjPHNC68e1QXD58O13PAB0smnDU7X%2BwtzwcBbZ%2F0xCq%2FONrIxGXS4dXCsNJuewxzUDYkBZIyeWk%2BXv93QWkj%2FE3V8dscoWPZv%2F2fi7BBLTZ7vSAWX60uCWF%2BTwM64KKcMWTALf9UApPlKTBdcSBbY5ysgXEYv34Llde2UnwoUKsawwTD%2FNQboBzW9FsjIKiistjHDLpwKEbkwKA%2Bt5A%2BwJ6OxDSUYLu1AnvKI%2BafJwgpawNJZOetZ%2FpbCzrKUJ%2BE3XTNsyx8kK6Rc47hsZHCz%2BFWEbaYI%2FiaeFhNdPtNCZF1cDG6EzvVUsVz3mIKMjbTybnesnqzY3sPx3XzJmtO6lu%2FINALq%2BfVK%2Fkihqo2L8eiSkHG9wODqAwlLUcELUXlL9EumrmKgK2doEEIV9YYbtMm4lleu%2FDf6j0yv1plOdJWvNEtUWUY9hMz49NT0v9JIXk0%2F08cnAh8uqmDlrWy%2B7XuwZOmNl0aafmjYDsq8sZ0BVFTv5WVWn%2BG01wI1UhpkIVWtXrx1R7VPplwAFDLNRPTV04Wf2gAKcxlFThqxRVk%2BHBjy9TeGMur8Vk9%2BeFfNDzTDFqiL76RRX%2F%2F%2FxkzNzL3spQsTkrQhM6MeJZkld4toBodLRs3BPrENmY98olKYB6kIz8TfbgflXp2W2P5NZdGRsYcgA4PE9tAIC1uJ8YHg4J%2BedQ%2BxhLmJ0V%2BohIE%2BVTBaH2%2FkqCjmzBbeM%2BoTw9VWK2QsP8u9j158yPTu%2BIxhKZFTcS79SOb2ip3%2FaDS%2FDpANYTJIXv2p0R%2BZn5RXrCoR%2BLdxCj%2FPZHAVSS%2BExaiUElDJihdAWaxEH27dwklF42lEsL5u2Gm1gKKWcfoKYfrYak6S5IuGpF6O6INnrtPaXGSAUlJRBUyRcoMOxkNNwLZgmdmMtiGPDpUsDH827eqajLv4ZoPYQTT1gr4rOcNtFJefHEKg5khumJQ1wlVssDu4JtH2VrynZx5kIoSmoLgTA6Fga0XfPlZsABMmImsZsNMaqf7uu0u%2BquR0TrWlVzN8fdx9QgeSusjYxBf%2BNFO8fAaYA6StIHb69FG8fXN3UwMxJzhuYS3Sd%2BImsS80lPUZ1U6QuQzILTOj7B%2FabINd4T2jSUqQR%2FhZnQE4sKU5L7nHacbbF6LNNAvfnbnL4FZu%2FVyMtPjgzc7RMs5TqLirBd1cP%2FQl5z7%2BKOHq4YXVVpLlwBaJ5L9fEjO9WtJKAcKdDPTrVosiFFAZMcQgUq1Z%2BuwFvH%2FxbQEbBq5abpoD8qJ0pzMxSr6YjQ2wV7PAcW9pnI9HgVzfagjcVVPMO5DVHOl44Q3PA6zm0R5QfAk%2FBERkUD2gSFxoK%2FqTZskr%2BvY5A5FqtxZOxC12LuKFNOPQMnXgGJn4pjZZCwSQsyu6l%2BMA0u1qmDrO%2BpjgzZRmPVA3asdxGIWHSyjhntG5iT91cBJnSRRB57K7o93wHIguk4uOjy48DuGbD8e1ffJgLTAqU07r2Ag8dBx2sVmf%2BBxHXne7%2BmiLaIYmpgVLu2idvy2xB5BDbu3lfERLYFynj895osCwpnc2uYuUbjQFdxP8TkpHbU8U%2BrK%2BdeiASx0KXxVdo0KMXsNjU%2FcTMEktlUlJCsnaxuxUGKsxhSOhgdjLzrbc%2F8PqbNmC5Xtx07j924nDru6guWDuQNMjZhy2SqnHL87gcWaIpzQ7HZ%2FB5AWUQ36kj3tyuPB4QaAVpMwiGCzjHCIav%2BjUfkqfxVWN2CcCtDIoXmGw0S3ieleDgBBEu81DxZE41kQNSNQ3jEJd0s6gGI16a2EBI589uUiwkYBc0xnxWkNVPFsb0u%2BXJlgV4nXhHm6hMeB2%2Fy0B11%2F2Ohf7qtXgJHv7nqUXGwQPQ3eVpowJT8Slx2fs0pw3Kvf%2FV4RXac5cjOY%2FGxTOrW2ers86H7WGRrZpx52VchOCsSmYLehryf7LXEgWTufo0dTHVFDV4RZFyC%2FK2RybuUkoQKtS0Gsu8vScedApV88TkLg09tgiVICQlIPAV2%2BiWIzcrHT%2Fd0GjXFi7qOXF1GMkw9SEWVzbUTPiT02wIwZmFkJbkQweKwwtr6DouXKyYFCCxujrXxHkTaZrVCnSZ1y9Mqm1CpJ5Bk8JSNgJoEm5CkepmqrKJtJ%2Ftqen1oaL6tTmgKXgxHElGdcjRokqhbpdXIMdztMCS9nvTGWZVKHUg6ls%2BVBRDC0W6GX0Jo75MCnrfN%2Fol8jjfHxPjX4CU%2FtfJc1kgWEM5IqlPfImTH586OtZCZy3cdS1vNx7BC0WyDud%2B8b5MtPRi8qhfCL1xUcqUU8OdT7UjDLey5RzxLexgIqMW6k1HWSocJF4rrj3XMEr6ZFwWvq9H8EGOKXGKNmpulcjdBZPj02QFd%2BUSDfBlbFo3pkaTk1%2Fsac%2BluJDvm0nUKP%2BetSZHE8Jb3pMo3ZbUBb3UEQWpctyW3kvIbGn01AnPn1sdsRKskaOOomp2C4w7sTG2wBHf3DuY54Fg0MlyZ%2FmKtJfird5cVz3EA9t5OQjd7OJtQ2ae%2BWSRDOJPHdceVI%2FeocO7fLpORlHSl%2BBgUcvMB3tF%2FXUOGlRsy5rCPf8oLPa2qC98E9Jg9MtrjQLPTkFyAaZLbG8Nhw5IzMX52YfmX0D27ZiXGiQIrhHQpDRWqqadTU3J3L2rQZt3rOCj5UyiDNKxaGcYrrCy83%2BqigKyLx8DUb2k6oRzj6YpUw46wi6liAXdo4SE6ZGUakx%2BJdIgfM8vCy%2BLX48BRL8RYxte3OXemVSgCwNnbwWiiTMYuhn1bwifVsGA56438r%2FOhK2Wsv0e0gJy7YhWbG5hSad7DT9CY0Z91n9cRp3VsVStqZ33UyhBgYZCcDQQ3nzgKFqoCUGN7mUX%2Fzj3J2W22tMIqtFr1I3pYU%2BqlRM88a6cJhtWvEHWjlJRWC%2FAjwWHdV5JYCARlLm9GtrwLz2s43fkMifr8Hnavc62N519EniSJOP5X3BE8E5IdZu6O7ytzFMd09K710dYcc17lj6ixSy01g8u9zkX1Hvs&__VIEWSTATEGENERATOR=8EC5B72D&__EVENTVALIDATION=5IplPwtZzjvxnWha1CDP9G5IhRMijck59DRX9jU2Kuc%2F%2FOEGke1NML5QGFnrq0JTzuhJ2uhzHtdMdqWtO%2BIAaQ9%2BXq2tQ5G1A3vGj4XkzHK4pJd7aRgc2B8vWQSRLVh8StWP67Kxp1V%2FgKsvMdkZwwPoVGbGAV1d8srjsFUoKDseduq5%2F%2B3Ms7StIeRHWw7LcuZ6izfH0i%2F5oL74a3MEtql92N6rB2V9kBKiAskHgWQoEaVOzfTQrKzPU0GU9mmXV4wU36o0D2F%2Fm9XIdy7koiuJvLRpzHaIyN%2B7fvtFre%2Fu4Ept3MAINyG9Iwl9LFcmtIxJxgDm8Uf9hzgqHnAdotCRyQIIRLQmLGesynem46Yht97oBv%2BW0Ds1VybmS3a1ByNuHtXkR3K7gNfLM608g4pzrqyX0HmlVuNNWylOr5886VKMvdw9VxhJKd4LVVKyzQvrHaRJvhomAx7YreQDeAAqw7olK%2BYPRe8uMjJj%2Bw9IMpDBTq1VidVSSmjrBAxTZDhHr3K7UQR4mE2rmdcXNCcZFWmNYigiJ1db%2FggcLmUOcG3wT%2BIz1Ch%2FK%2ByvBl9XUaY9r6LwKuUL7bmvb37iYNGbbuS57LcwbPwpiBcCVBl1Qb%2B1jvdZgvwisCCZoCFOs%2B%2BMi23JA2g8G116Luyeyh9BnTHzGzD7muVUPDNtLVvB2ZO9Sf%2ByHzAm2Tff9DG1LSx701%2Buxbr9bZWVd3wD9OEll7qXqg%2BLZhMCl7bkliiK4lV4gvmjicENAMqEPh7XrXWxHmqCQC5kZqiLwiz4rHq%2BOfW5XJ3V1zgpQYFK6sFgt%2By7hNWabvNGEc%2FPb9pAnShMw%2FMzLQAnDToxMbIDd4w6wk7gGskjXJ5HulYnDICl7GBLHGJOyK1NZm41qTwQh1DORVlzDSFX76siV%2F0HJASZPYfiHyiMfwPKZCpa%2FVP0baSyRq7HwEnQahv8Mrevs%2Bso%2BGuAgzVY0z4iYTQs4Jg1HuRAGselm607%2B%2B7jzRzt16ixTVep8SoAON1xpsAxyfG7dE%2FLEd5QA2BfodbcS%2BCwNjM%2Flk34vZxowsaPCpNz3%2FrGtJen5fg9t1jFc8J5eA7vwKuHtYxCt8uaFVQDRJti0d4buQGd4t31WFFoomQFwkukxwVoDv5Lk0vGWblRXuOIrSat%2FwMW9cFfg6cRNJpQl3GvDN1v%2B9gOqopN6QXDF13LILK6%2F8ZEjn8uD8w5rMpm2dTbV3TETKymIdY2EleMQPlJ9BxReCZK1Ugn59IFy6oLXEw0dzQLAyp5c6Z4o2chVcYurlSgwZVWRwhwfdRWxIAq37ZogqBMDno4%2BcaL1hnKjEgVXo%2FwCk1YsNXlxEJ9IMQdfAqvlXfyOyNBcVF0whfVVAG39BarVVUD3xlw%2FRYJ7LFG6j3vgzLeeNsj5ZKAyGJkDTuCq%2FRA7WKywrXeqA506L4dHeFaRFp4TBWdyWAdkTKeTU84i8ouIfebQs9cLoXp4DXTAVZ8vNghBSbUe9HBiY6te87LqrOn%2B5xFiD6QAyF50e8x8gB580tadDpFCyNZ3XIqRpUp3Z%2FRsF2eZtl%2FPVQ4Lvlu8cd0nfBMNuUgRTXGjcQ5ESjwvCxYkFCq%2FulHe9Gm%2FwxLnOr4SPFVTZu9k7ges8D01kmYImawOCFOLHg5QavBDqx280vM38DHpuQ3ICx%2BdvQ%2BRBVK0dPXmBz8yVGzJz3sk4urQXbvw1%2FLjfNqPTcyhH0zlolonwzYw7n72lfIi88NlHdoGU21t5WTEiRHqKlT9nKDaIKo5Z5perTt%2BzZBJuQlawjxJPfqMwpvj86%2B33%2FlVJg%2Bqw%3D%3D&__VIEWSTATEENCRYPTED=&__ASYNCPOST=true&',
    'ctl00%24ctl00%24ScriptManager1=ctl00%24ctl00%24ContentPlaceHolder1%24Content%24UpdatePanel1%7Cctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstUsers&ctl00%24ctl00%24ContentPlaceHolder1%24Content%24userSearch=&ctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstStatus=1&__EVENTTARGET=ctl00%24ctl00%24ContentPlaceHolder1%24Content%24lstUsers&__EVENTARGUMENT=Page%24' + pageNumber + '&__LASTFOCUS=&__VIEWSTATE=R3pc%2BzR0mCGPypaPb24YAkxN1zjCl77eZcyO%2F4UfB3We04G60djV5bybyMFIDVAgo5H8HIipESgeClhY5WJr6GX4AzHmoEeIjjXwSAFT0tF9f0qnW2WAJhdW1qmjF8Utf1tu30qAb%2FDKZ%2Bwxbvd12OWnqPe4LJd4xnvROpp9M6Cjmx2PD3Em03LO8OhtB91CZFWVn%2FgF2wyU3mdO8ivrT3Hs6XS0VIGYKUpGRssGY9sJrhr8yPeCBr%2Fa6kdFulHteYoqtryRA7Xpifq7pX8S9jXLZ3Iuh6qO4q%2Bxt8PTNjmSoq5OLQ4x0N3XIc3Y24MBhJsOx8O5JMj7BClvGNUQB4UO5no0LgZjdPgOYUJNVDKtGycAJv4urB4aYRnK9IFt65A54rNYPLqyQgXG31YpLyg1Kzj827nMdW6WWuidt27qlnjarwzF5DurHvrApv2Y%2BvwlJil0H%2Bi6PQS6mx0EAI%2BQAIJvvtaZG20x3xps4hZYSFR%2FV5Xx%2FVfBW%2BFb41NqBx%2BvWgVc5Laq1Is0cXBr26L27eV6MMUMSVdqcdZXm%2FVrLSD5UyQxSZaRjGSjjcNA0wDFzlsfTszZuODaIfecUDzZJNaGKFos2oe68x8SYOC7TwK3zr%2BdiqfnV2aaBYwVNOg%2FEAGIL2hMDGm7f3T7Bt1FSCdyZPavGBgdrEzkKtXTkFtud8RM0EZEV4ydthfZhE8W6diVob%2FpzAMYtQK6NAVP95PQ96S6rIIN4pngmOrgUZxMk0cIVIenW8YCJpsZObh%2BgFJ5cfI7Hpu3nfxklF1DjDyLh94U2MS3LBu6kFnd7REMASrr3pRC502xjXQTsUkDSpyedwG346eWX50AFDEP6mL5fCWq8PniHK0vrkg5k4wZvi%2FB0P32killONFS5AekRAUTGNBaUnuoNltunHacceSYkYBdrrRVfW9yys5fH1Xj5grr4Y6axPci8Q%2FLm0inDvzZ5TsIAXIyXmvkge0T41Pb037xldsNsPFpI0V0G7bvmTbWg6qGK%2Bc4yO7JxvxH1QH1lbmdDLFmRIYDx3Nx839MK8AyB74YhMhfBftHj%2F0m5oITnIc7TP%2BZdFRFpPWDknkGWmlOkzJKyjyrOIExYPpWs9tWVdme%2FeGT7ZT6gErzeIqMBmvJKVH8TvJwFsf08hg3IRiroZj6fV08C%2FSu%2FUngeyCweGaEV%2F6OYKT5s0MFu%2BSD2i5oqywFU0gV3rL2dVDw780OHd1ERGZH%2BPSnTju39VzbfG8w6Po0I7tqiYD7OfWo2iRhW88qNBgh4PTDI43sum8dmTP4tJGrgXgpgPMp3E9AYqbGWJPdBL3tFTdFpEDglnOIiD5D8bZ1dOR0diKnt1iuSdHwJa%2BgNk3g3Q4HGFRgwhmfqqOZZYl43W9PuBNynoLjK6EUtBiFZLtwY%2BTOYUhBdVN7CuZQinOasrAc50e5%2Fi3Wu4DrjLmyN1X22nVGtx7dGCProNPATA0iaCAlDLjMR13DgGgARISi6GAoiWMKcuNt2V0K8ND4sPTS%2Bhk3HsSwewZJ7UQUXwfc97D7J09I1beRPfXuh9VNjTQpS2qpMPZRzQ9hnUZeLWzGNaFiUrZcN4VXYyxjYno4dZy6V%2Bvlk2LySsX4fKZ7Osuajp9oviYHBGCraUN5ZA7c57%2ByEVo1L%2BFyCV4M77g5SIoVHryAdgfkm7SXSZ4gBMZiRdpiQ5ifuMbiIp8Udk4t0FGaqQaHxqYX0QTHzVvEbmxL%2FVZx10SibqQ6QUZlRSYAexDIqwkq8jivZB2Ehg74OkQl88WkzLlNa3u3GlVkbEUp13YdAZG8pE8em9rJyhku0ATQLwb7nFLLXgk7VNX3eS7FkcdR%2FLcXM7HNE%2BHhrl8XBD%2FJim82TSGESd9Jk9Qguzcxs6%2FYiWXRcyMXM2dmPCU5X814aIKPHfmJeclO%2FXhpT4DafkSVJ4YChoDklaPcu6Y6LLGIkOgs3LzZYAkYN7EuRY3gwP7qTvFLjwmQVs1%2FCD5KuV3%2F3WLxUC3j8b%2FwMUvBl4NnCyEFnQs%2BvS6Opzcx8cH4Ic7BimciGdzAX%2F0j55rVSwPD7J9q3s1i%2FSmzm6tNQE4BQJU6674zbgLx7nqescGknXdSx0mOiS8wJrqtQfI61eoIcuxGHsvFFlFG4igpjaMY0DJ6kcUQcTyZukfCF3fb9r%2FjukX45Kv3LWc%2FbyeRKM24fDp27Pt9F%2Bi29oIqm8Ah6MrHBcA5NhBBqsGgziVoUwxySLDVHyC7jxVpqB95RH1uaeiObAeAiFjnl9FtDytuTx9F4dzEVD%2FQ1eMC8uzNun4K8gj9HlxXXJwRNkqQy2aakrb0oPuKx56%2FLAzSdcw5yffjLVjNpivp9JWk4R54UZJ1Q%2BpqxU6PzkhZzSwlSM51j1xceVHT%2Bvb%2BmIRV%2FUMbE9XJyyU7m426MpRcoUpLAT88sC6qpexrp7vqU732fQGyZDGzXJBqGgff1mKXiPG0ihPRofiNl%2BHn1EC1sGZxTf9YBpnYbWnKf26cN450esvaq1RAobltvQUm%2BHcB%2FtnkI7y8agJBvqAFVE1K1hM%2B%2F5OKkQHwcL%2BsiYqso1mWggUE4nvC7rypZBOexEKK5RE9%2Bvk1zONvGCvApfTtH%2B74RyGO6Th780CKcYhEVanmMaBzrE%2BcGJlFLzn0QBQzMedNPXccizK7pOT0eq%2FdwLSf1Bd4LPhBnzwM4%2B7bUfybL4WhDuYcp%2BvRwUHSmP7z3FO0hCy3WetIfyEHQ4LO9dtB5LGM%2FXmYREn1g%2F0itclVCHiDV7HdKwqJb1RDm%2BQvmsQ1za6vcxb2XJ9LnlgJFxO6npcImkoNDominxVNPJMJJpvLLVU4uV6CcpGJeP78XZFm6sPQYTicUsBYgLmJExvvbs5NAgSd7g%2B1GGlHEmkBu9t1bfNlPdj%2FmOaDyMx1hS2bwcJzQn4YCeeLm2gdt7ayWtLNvCkviu%2BKldcwT1aWK%2FxmshdlvV5DCzqi3X2UfbfEp7ZSeiooarMegirDa08A%2BasspYDfNrJSpGVo32xRdinMO9D8IoNcMjeM8nI%2F2%2Bo9AT%2FvZIPXYxGDS5dn%2B7OsHnkiMPBf3WjtA4Y3R0a9KFUNjcqr5uKyduTBLwdX2PPR2UBvPJMqg6ufvG7M9CIXpgNItjReCIsQOnl%2F8Vh0wJZucCWDUBgOpEA33%2FDZUB1YnV4EyYvLUijcJCChew8aIxpSQodGpSxvZnGL%2B1Pefn4lX5lEzkQvKNK3jnqmwvPMIATyHRGcFbhzKLpXUBWLEy2Aglvs7UiKblhQlID%2FfS6GrFDCsnyq6eY4pY%2B3Nb1T%2FfxADGhfXbhZObuvw1MvDdBEgTCKpcFJYzlXmIPQChC6oVYJmCvJGEI8nkaJ2OyB5P3n%2BDi4PWnnGCavGbzPlHZqWFKOrTh%2F%2FoOY1OOrY%2B1SWl1CaXGNKT0FOpnqFbRu%2BOj4lw2P5hHeICZaWNQuqdd1XwoUaVQ254JetnmXKBz0HrbhP%2BLuRRgNvKdK%2FW75aZm60mUIn3kmkC9eSER0VpJPIAomiWh77rE5PdRWkmdfeozcwuUN%2FAONvzZmzP%2FcuU5ost9izApx4Yl8dvfbpcZIHPQv7Z9I4C4PiYjAKYpIombDc2fUbgiyito%2FD22OKzUqqwx9%2BT8NVDbiVgAF8Bt23AyYAS%2F8UAhyQ81T01XSeiQDfk12UKZoD5Cg%2BvF5EguV2eoZJCOIKWrAZpsDyoQjs3MbStTDqDAcl1XMAiPLSLHZCeKIL9ezB8dnFL6pUNhQBGLYSW0zR%2BDiHGc%2BV3rLOc1XBOKn%2Fxfyntjidif7e3b006HvGjwXpbpYCeEOv3SCTrsQxubcj85sTvRfXyDSOQAL1uOc%2Fr0X3yE90uZzqaVbtiGbiDgGMTUZozMR5ZBtYHL7g7UofXjhlmfgYWrT%2FodsEZpV%2BtYUNcJyjRGOWCxkDuaIkdgzS%2FIWOVgoRzj7Pt9vvqmJl07Ys8qnzVa8Xp7M6WqWDN95XQFhnTd9yRyD%2B805yNvYGAC6V2U%2BbzQh9%2B3H56hbBL0H%2FFmDzLfFmUkOVmx2AYf%2FKg7p84kZK%2Bulhn%2F7JORedQeHCwEl%2Bi7p%2FV1ywcvjgl2OtZXXTD2zNuWBVLyYWLTs3xYj0ijJ3Nc3LIMVOIBou7gjYX3A2sQGTcsu5dOXdWrVvy%2B1Uu3BMYW1%2BnFmRPh5F6BXCt7oLeVUELkQhbOrx5ncwh95yBstuNj3Ah7RYCXyxKnyM%2FzPdFQwSHHY5PisN0ftuaH6ipYHKN1KgXe4Afln1M4A80yQgZ3roTYUfhDL%2BD%2By7u5QOKjxu8vpbBPOzlrCEHImu%2FdECSHxIR%2Fd1s2DeNU2aZNYUMgOuL%2FNmkrH9RlBzzFgP%2BbNLci5IHO1fWnN44bJ0KtLNxRvN5NwqpqDK0LnbZqN3HyfdcgVxNg2nLRx70p9PgELzLlRV9RGRv%2FB3dmrguE1eIhNhrU8hqcbhQN0UWp3Aerar41%2FUOPeg8cR880rFohHHdP%2B6nX27CLktqzGTSdxxb%2FB4FXooULdVBrrdLKFgDDgYeNqsbayqTh8dpqWTaYjhg5QaH0dN6iQr%2FYsWuCQ8YPOQX36zP4US8pgiIaYiYg9rRrp1i4WvYdaFOhOJp8385gkehoUTa6sxgXgPMnpM4Z6qbKa%2B4P0WuzLu8Jqhx3HvwHbYI7qokWQK6tTqi6hG7zo4diYSA1Fk1YWV4EJWagqVU7cw2OElfz6OvhbhGD0ThkHwB2ulE8fDL9wib%2F8ML%2BU5%2BwSPCifmZHOMAOV3JYxaHdCtPcXBeNfzxkwXuNUTPB6S2X%2Fo8EDD2Z2RKz0fuigzj0LcLtr7UYsFQRW3Pa6%2Ffa9XhNMUIjcGdtTtHywV648mnAiQb0bWwSPKNl4D2JkMxKWaHRwatVDUIWG4yv4Kt9A23DBvhHDWtGKh0TAjbIFb%2BV4LZd63YujBuliRCjIj%2FbJgqvyNdIndUySgROqG7Qj9Fhi20L%2B3ypn1JKHk7%2F1dfLCDgG8XfMZjwhi1oBFJHlB62FrPpIT%2FvaDR5rPmeH3OMioQWD05573mzsUg8iLgpd5bOJNKMwpEuOAk4%2FgHOPyOcPnRYq13qbrLYea9yysEmELSqg%2FlgTp9hXr0A%2B1q9B4%2B0%2B6h2a2m6JxkgtGcTi7Kqc3G6xFRv%2BinxzSK2pD0w5W384hFT1iLIRrQ9USV4f6w4x26ct%2Fe1vGWQHlq8WsroasHj2sx8Wt9F6HgOfCKZWJUU6x80GQym08u6HMZzkllWbfOa368zXO%2BKJaE3amzW7jk4hWnt1M7Xhe1ufbhIGhLPA5GwTjuns5ldoB1Z0%2B5kBdHKNWPuRNNCbuzt8qW34Dy6fWpVoLf%2BpE3OYVPwoI0eUMtyg7iZ%2FODFW29esgI13QtHeeAGFHnUohna6j4MPudt5%2BJtmsV5wax%2BKLbZtkbUaa0EcafHEoS8Zn7YUM8u2Pr4aI4BKeWmHZ7Usw59ac00cFSCaMuFHQcZAlqCr%2FFeTJBcH%2FqLNdTUT4n9Yb%2B%2BIqJoxttYTzQoNVBr6aEk1LvhTB3Kt3o6E8s0ZwBgwXRnmiPNoB8VecaEalddF8E2dC0fq8XMrYb%2BAtCeQ8rUcCupxmjd2lY%2FzU5%2BxktiW2qafQbxlQxXfgU%2FjsTMeXcgydQrUL7CFMocO9u7IiKHVBZmtfRRrG4352IlqDPWnxv9zoU8iTzFB29L%2FfeeYgS8tx1zhlmaTQ2BpEWWsDM5pyUiv0aDEYlBUDKeUlLWRv5SW78dPAZayoqsVWc0o5St5geK4zd7bA65rLiSRJI%2FSAlQXTxTqiCka%2BoxkpN%2FWqtP39KjmGahrgNGwJwFJOuuXL%2B8KN%2B7RFOApgj2MYNFjcmEp7aWxaZBv7jYBloDBZco2Xe4gSUW0VstN7lZq0FKPAGctAdKly8byfOuGvgNtpGsMSUmBKviHXwEAayqQBMvGTGqRlmoLZ02R06lAtoNIqHwzrjV2OsQY9oTwMU1PQVpK83nGb148D2MwonB9fOzNJrs6OwdPjhZZnf5ZeNCQz5Wk2QSv0V0F4%2FaBdL0i9UHuawh7yIXYPIJcLOYGRvxKKOJ9Cfn%2FjZSgR3x2I1ZxRxX%2FCYawvgOmZs65rFvemrI15nJHHgwUa%2B70XgyEIkv4cCgPVuj5AQyVWRYjAq9VkUqLnBT2IGSqIIbGxrFd5OE23BSX8GYSiGxcUfuY3QTuWyK%2Bx7Ko6R5%2FWCQv1Wf8SHNSaPkA3ZDzjdNLrk26AIcdIiEeu2D%2FxT3S5Eh9xmr6Opc6F2fEgkRIgUh4ah%2BGyXFs2lkydmGU16X5zxaBHA4lQerYVWNrSh1wE8hJYO86pm3HUVBgZFftEIkJ%2FcvwZ46O57QAVWnd7L3VaZf8EiUqkFbcVtynKYpI1fvf8ZhEoiahSZyN4k5BLRJRXXqDcTkH6mD0uUNtyp1tYtxiJolTjJloxwDM9%2BB%2F71TcWx7B3%2Bw9NtBlp7vZ4h5YhTl%2FhjvxTTIZocqrqv6xiQhjVkNgB4i2SqYq7H98c0ass%2Bcp0pZbM7zPqWiLbhmivVZkTn1iQvWP5%2BZIjwc5pl66m7EPTlPsprXyHeK7Pl6G%2FAldU%2FqWyTIPVGIoS1Im0L0wwsAUOrZ9NpsJImV6MGKtu3EZEiJjuwPC0MTygEGj9d8F2l8XbpvRe7bflJC1v43B%2BWfByDgHJAxKmKU0kBqFNbPXUF%2FLabAFi7p7Pqp4KMp0e7cVTXPYN6xOQNnqYd%2Fk1DO6asFfTcP0omRhxOM%2FVGyQr023l2kvNiNh7oszgUIHrffyqnjM%3D&__VIEWSTATEGENERATOR=8EC5B72D&__EVENTVALIDATION=byPaJxiANMr3nwprva91oBel20le9ehOOY7r7RZeF2p%2FTuK57DsBAusAclhrdgH9NQnP03ju89NUupJ03%2FiCqwKEU8Mvkvh4h4HABB4O0kPQGOiW8%2BzJzG%2F0k5r6tLylLkk6sVHJPBOqVIiC5%2B%2FDj9TMK%2F72EQKCvowS7GQ9m2IwiWcA%2FQx7B3J5%2BIrgYhQNYzIgALoFBvPPuXb6OMb9svrFwqhxyB7IQ18rcBjjtA6Fn4Aq3z9bkIKppFWMy2HLTD4VeuOmL6JCgI01bAeOxHaHPw3tsXd9pbEGt%2BnjpfH2s2AoB1%2BLd4x%2F7Zb21CQkx5NRdZBAmHvKc4RRH1KYdCFDPP90HJMjZAYsmu6g8IDr3RQ3%2FsVySmIlKYNPLCc3i0qMIFK%2BB9e2q1fXHKish7sF4dfLoqhmLK4Nx%2FiMzyqVeLSipINvdbUS%2FxtU7vRCD7aWMR2bBBc2YA9qw4giZFnod6cfOXgztL6WyZNObyHB99dbHQ9me5ktkBtzeOn4AjDF71KJz%2FlbtYsXn7B0KtLuje%2FVUNjZ3ucUpSr%2Fp13waJubarLCTTCJHQTQSlDO0kCLlNz%2BsRe2a9ujuPkTEdHSwTlb%2BOyrlvV28w3AjryYMVR9OnyLt5ZANndC4BzkzSNxgo0w0JinLuXmpactGpyUvmkwQuF7wpDUME0wXQFDkJMoYBIYirxuJT%2FpWkUqOW3ohnwNX0FTm1zBf4SfPPKgL%2F0bftNrxgyw2QN3Q%2BzpO0G9YM5%2Fkp3UWYYlYizHhBTpi1EyKzs%2FtYhf%2B9uwN7cmDIMnuhy1zSAkthP6o2AZjz16ZvM4bwKQEO9Aydf%2F9vd7Al8I%2F9ARoQt%2FSYmEs7T5bXPnMZMnEIn2SC5uVJYmUexdWaBz4sNEc0oOt2wTI8YLucfWN5xDzKEtWbeKSDecaz9VIioEPA7YOHJ291Oyb0iSWEnPUGnyz%2FA0fdsy8Ujs35oLX4Xg%2B69U547to1GKuD9fk1Jw3ewlNDI7l%2BWmn6NL6Q%2B7mErfRK9rkTstNOTLoc6hSuLUGtTPXcSk659CUGCtIEfTfFB%2BCesZIlukjxkUtFiW9uwdUyELr7Q62I%2BMBCKwFJ7mtzZlOIt6HDRBPufiW8onagquJP8rI0%2Fb0uCsDy0iOUbawhaj%2FfbHjO2BLxMw4iUP%2BTscldHbK7akbij4qyzjfyphNMfawO5rTCiUItNAs50LnTkdNHAuDNAlzYzRovz3xTulO8xlZbIA0rese7eCKaxL%2Ba5CINGr5PQXQouHBBMALQhHKpT%2F1etvtXSEYUo%2BJxJlHaQxzcMqx8wTGpnpXl7SSu6k5rTRktaMlA%2FNWKPL6Ax6QDTyj7E6Sk6HWkQ73sIjg1feYrpStBgIgZR7cK5RXOSD57arLyvldVKgGPlK%2BgZAaTYZrG03i7ufMZM99a335FtS18%2BrlFL9gEXdWcUxvWR3KPm5rHTAUEX2BXMCj0%2F%2BtEe%2FSzH2%2BYuNuFcieqbrnT%2F5D56nXCWzPd5Gkz68M3x74qPP5dvNwQo0ePlTSF7EFz275cl%2B3iU%2BGsKUEyTzB43erO71qtnI6kXH8EDVI4%2FkGeYFQAIQpdIHQ45ALOoZpktlQtjQ62pM1BPHHQi9HKGiiroR%2BioNcKr5RQyoGPch3sUyEAx7Iap6uQTcKmh1mjx0JE7PRHqU%2B4y%2FeJoylu90t4%2F5zGljoHUyWG2MiYq8ODFKeccnJwUyEbLUXuJRuRXXWSeLxEbg60y45wkzsbWzbCbePNXaxKoRUYfcMW8PfvNbmgG3%2B0Xto3VfqkiYCtBY&__VIEWSTATEENCRYPTED=&__ASYNCPOST=true&',
  ]
  let dataIndex = (pageNumber - 2) / navigateSize;
  dataIndex = Math.max(0, dataIndex);

  return axios({
      method: 'post',
      url: url,
      headers: {
          'Cookie' : 'LobbyCentralOnline=companyID=' + companyID + '&lastProfileCheck=' + lastProfileCheck + '; ASP.NET_SessionId=' + sessionID,
          'Accept' : 'ext/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          'Accept-Encoding' : 'gzip, deflate, br',
          'Cache-Control' : 'no-cache',
          'Connection' : 'keep-alive',
          'Host' : 'login.lobbycentral.com',
          'Origin' : 'https://login.lobbycentral.com',
          'Referer' : 'https//login.lobbycentral.com/admin/' + resource + '.aspx',
          'Sec-Fetch-Mode' : 'cors',
          'Sec-Fetch-Site' : 'same-origin',
          'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36',
          'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      data: datas[dataIndex],
  }).then(function (response) {
      let html_string = response.data.toString();
      let list_array = [];
      // outputResource(list_array, html_string, resource, url, response.status);
      parseResource(list_array, html_string, 'Users');

      console.log(resource + " Page(" + pageNumber + "), " + list_array.length + " records retrieved.");
      return Promise.resolve(list_array);
  })
  .catch(function (error) {
      // ignored
  })
}

module.exports = async (request, response) => {
  let resource = 'Users';
  let route = 'users';

  let raw = false;
  if (request.query.raw) {
    raw = (request.query.raw == 'true');
  }

  if (request.query.page) {
    // fetch by page

    let page = request.query.page;
    let promise = (page == 1) ? 
                  getResources(resource) :
                  queryResourcesByPage(resource, page);
    promise.then(listOfUsers => {
      if (raw) {
        response.status(200).send({
          listOfUsers
        });
      } else {
        response.render(route, {
          listOfUsers
        });
      }
    });

  } else {

    // fetch all
    let wait = (ms) => new Promise((r, j) => setTimeout(r, ms))
    let promises = [];
    let delayInMilliseconds = 2000;
    promises.push(getResources(resource));
    for (let i = 1; i < activePages; i++) {
      await wait(delayInMilliseconds);
      promises.push(queryResourcesByPage(resource, (i + 1)));
    }
    await wait(delayInMilliseconds);

    Promise.all(promises).then( (arrays) => {
      console.log("merging results...");
      let listOfUsers = arrays[0];
      for (let i = 1; i < arrays.length; i++) {
        listOfUsers = listOfUsers.concat(arrays[i]);
      }
      console.log("merged results, " + listOfUsers.length);

      if (raw) {
        response.status(200).send({
          'Status' : 'Active',
          listOfUsers
        });
      } else {
        response.render(route, {
          'Status' : 'Active',
          listOfUsers
        });
      }
    });
  }

};
