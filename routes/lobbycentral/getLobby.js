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

function parseLobby(list_array, html_string) {
  const $ = cheerio.load(html_string);

  let listOfCaseCheckedIn = [];
  let listOfCaseInService = [];

  // TODO: parse 
  // $('tr', '#' + tableId).each(function () {
  //   let tds = $(this).find('td');
  //   if (tds.length === columns) {
  //       let obj = {};
  //       obj.serviceName = formatText($(tds[0]).text());
  //       obj.kioskName = formatText($(tds[1]).text());
  //       obj.isKioskDefault = formatText($(tds[2]).text());
  //       obj.category = formatText($(tds[3]).text());
  //       obj.status = formatText($(tds[4]).text());
  //       list_array.push(obj);
  //   }
  // });

  console.log("Lobby: checked-in(" + listOfCaseCheckedIn.length + "), in-service(" + listOfCaseInService.length + ")");

  list_array.push(listOfCaseCheckedIn);
  list_array.push(listOfCaseInService);

  return list_array;
}

function queryLobby() {
  let url = hostname + '/Lobby.aspx';
  return axios({
      method: 'post',
      url: url,
      headers: {
          'Cookie': 'LobbyCentralOnline=companyID=' + companyID + '&lastProfileCheck=' + lastProfileCheck + '; ASP.NET_SessionId=' + sessionID,
          'Accept' : 'ext/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          'Accept-Encoding' : 'gzip, deflate, br',
          'Host' : 'login.lobbycentral.com',
          'Referer' : 'https//login.lobbycentral.com/Lobby.aspx',
          'Sec-Fetch-Mode' : 'navigate',
          'Sec-Fetch-Site' : 'same-origin',
          'Sec-Fetch-User' : '?1',
          'Upgrade-Insecure-Request' : '1',
          'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36',
          'Content-Type' : 'application/x-www-form-urlencoded',
      },
      data: 'ctl00%24ScriptManager1=ctl00%24ContentPlaceHolder1%24UpdatePanelQueues%7Cctl00%24ContentPlaceHolder1%24lstQueues&__EVENTTARGET=ctl00%24ContentPlaceHolder1%24lstQueues&__EVENTARGUMENT=mnuSelectQueue%244&__LASTFOCUS=&__VIEWSTATE=%2BqOOMVlQ8p4XDcIs51v38UBj6lKbY%2BNnRdn3QNWd3eK0xq1Y8p6etk3byoNh7XZibfe0hSqhDvSxuf7M9Wg7qR4wrdX%2BLs7YTxn%2FX3pEcpvZgoA3EEje8w5ggx9lpq0rj1x8H8nUnsEYnu3VkC9GeahzyEW6GtWdd%2BT75stcmT92CRy8IoZpiwL9YRdQ%2FVAOgLuel9xnn1xmwubBuf7a%2FJW6eiA3rppGuLtBXS715MBDrnEUcm9Oo5E7%2BijaRJtoLqPpehZZlhJviB56bq0JlE6wGlky17rxpkE2j%2B4h8lEEADp86VnIC6eAw04iGtQdTZrVxn8TZMCNhOhtcRsJLEp%2FPb0KgwJ%2FR1nOAydn9hqdsSV0UXelxMGNMdkVF7a5TMsJSykhmtRmLB%2BInT7L%2FenkbFctvAQWJOQNnzMRte61O4v8j2qWNmEQJama%2BTFMprm0LPyQjvCGU93G7ObB5A29%2FvYbxeqr8RixtCj2%2FYXzT%2F78gXM3eI8yrtp7uWLdlUNuwqhYG77s4TjFqNJ0W4Vh%2F6lOh5ZiWjLlfaWtVmU0fwiMH5JevVweN0kBurUubv48Myb%2B%2FAn9he3DNwzkP391NWLR0vApZkCvDARdWahhjl5j8Z1RymG6tFAC%2BEATKYybnmRoZaU46zDfgWmqOXOqQVxEZtLD5CstN3pXBqZGuVppDCQFsB4qwASdLxvVMhKk%2BdMZJJQt%2Fd2pWkba4VhUpUAS0Io4Y3FhYxqxY1BGrN57DM8NdY8EXerbeEf%2FneXczrHXeHPVk3nTpNOznpaQXbGpASExgqjLJXyv43%2FANXJ4NttY2cq3e233Ze%2FSnJ%2FedkxGPqF46IFV5CAjXAOunT2t4%2FtnM7eSN61%2FTAWKsjvsjoDxukf%2FymSbvKlJTFjEcVyMVr8QQEtjlgvx1RdysfX2wU1R1BgCpVh9yqfYW69YKVgVLAMkDRqU4OPOwzYh3dem1uCZq3ufzN%2F14vT14HzJU1PVc8Er8PxMw8VPFSQ2w0q3dpQro3Vbgyuqoi5%2Fb6E5QvXKM%2F5ATmnlTUaCuHbBTNqg%2FWqLIAbClQQGkb%2BlWAx1B82G52Y3WRTH12%2BO8QdIQEPA6TeJBJbydYrut%2F7UuZlkRRZpsWVaImrGhhIyWq32QV70xSx1ABnxJdlx2ujUweSXpUB47WxfWe6JaTVq%2B6BfQCAiAQ0Ss2Q9NTJsF5Vv93IJUVOOJXX5AOQQUGZVNtJPptsEG9Xg16anB4odOp4HOeaKjrcUiNdaNVUjm41%2BiALaZzIDvtIdEEdcaxMNzJjxuAiZCwGDS07r8xDEbFTcH2SVepKs903UWeA7nUfM%2BIQe%2BG1TIkYkqSTkPMsMMMeD2B8AO4JbOiGMCSxnB2VpEPTyRnjkC7Fu3jpW9BkIHcENTuj%2F68dWaNG0qiGvXlMJQjmFLdhYbBk31AjeP1TsPlfKz7L396E7K9EwLiIpum6XdDnx0XRCaMWsQCNYLIXKUSRewEIoTFqjF45BDs6CQT67GHLj4UKTE6rkCHvbiFWNWdUn1NOMDoT8ui%2B0NlrY53%2B2N3bqzFpZBfhsq9F%2F9584QTMXBv9PCW6FEPGw5wT5hce3jWTGl5gIyRQ%2BgAt%2BnXK3a2H75r7eXhKC3QCb%2Bpq8A%2F%2Fxbbp5kNx%2Bs8PnedQ4NUwjy25Hw4i1M4%2FmkGBmbtLw782S4IZxAB4xKfe8aVRLoj9Zg5JPVxgHCIKCdQGMwt%2FvX%2B%2FJxHhPp36sIwfjfU5ZpqmGo8MT15NHj3C4hPsSq1ZlaEDK%2FHbcfbahE6VNdT4O7d4QH%2BiWVwhbAw9b4E%2B38CVHbI0Y6Pi2SRTDKp5WdMGAV%2BIo94Xtp%2FiYTu6iu%2FRZcHscqbQGQCeWL3bJ1OlqNkazZFCRmzmG43c%2FFLgfpCkbie59T%2FY91WRqjRHNnTpg%2FPxLbJaOPKZZC2iicKk0BGYvqOGAuY3D%2FB%2BRQ4%2FyxJQAT0zyttjxJBNyc0C%2Fo%2Fveq23pv30M8ZRvezvKefJFSo0jTGNuUD8qvpBUPr1HY6WU6caLN%2BjwDwyXw5M38l99ErF3BGPRZbhUsidilaWfSjyhsWf9zEb%2Fqk1fsPXTa5JmTaU%2BttFwS3Y5YeeuNJgY9T8GzhwuieDmogjdgrX6X8Pll1zoUao5BdaOVs%2F45RLstJV9D73f1%2Bl4Yj0eNaxY6kt0ZucJIyk5gfuy3JLJulHvz5LuqiMafg4t2Fyv1MebYxfbdkoWKxWki0CkLJO7BKtiTwddPPxW4BYnz23qXR%2FLZj8kQIfp6Zn3wTXHVUd8hMx1PlxdizDSl4DYAoOUIFthrvoeyFA%2BRP2EkQLkBzkQQKsleEoIpIafV65Y3e8SIOditQXVET1yj5FWQbo%2Bo3DoaM2BGoQ6D4og%2Fr1Z9zIr99ESFqNZN4g%2B%2B79bhLrVRw6LG9GJffUOzHo6ObVr5sDb4xYVJFcxUJox0VcyN1mTvVQ7KOoSkvaXwDRxTaiOAMSXFOeqhUgSTGE5Ah2%2Bw42N8VFiGpEe4Y64SbZGgACdBe6cVBzdlZqcMbdU12k2blomi8VUjxsWwmc3iZz9xCd7cdEkMMJQrcfNeekSFTuZQGgrsAMTzvYPSvILWAwRgI2KVYsQ%2BK8fqsuV4f3JNSPy7y%2Bu02RnExTxzBZAZFLrDbpYIzF7RSOZASzi6xCNAW0COKvWgtxrL7om25trhFtkvP1eIgmA%2FYD6eLYEE0gS5nJwr9x8lhfrVDbR3ps5K5%2BcQCIvh%2FUdldR34ZPmMr6Pzvz%2F1QzRe3XrGvcB8viDBNk0Vs%2BmTyqIDH54I31iOUKnwwT4mNlbBAu6Nss4efrSNcLm2m4D0qcGexARcAXNi9Q7ogv%2FMt6FEeUBkEqZV2VkGSoqI93%2FDnYRwFpOhQdeSJQMfDpf4x6R%2FNuwfRtBfCjiybLaiQaP3jEMk9ISGNU3Zkz21d5LXk1WG7l098kQoJXmXLauRgSmaPbClTYbqHDF92YAWDfA8F5fF%2BICcQG6qZrFN%2Bd1YtI5nTRkQ8dU2RoQAYkNKHW2PxAZWa%2FWSKfYs1WWPG12GGjzB3KTWHCWmB8wHmIoC2e%2BbydyD5wJo28FIJ2QbmYZNwuxpPs7U5cZYpNlnUmI%2FDoVKBjncNv3sd1HbNgKtYDd9ckXVTgCMfVfrTT%2B9H14ofO3%2F8YUIMbhHV3BXJ5mA9ynCanrVxZImzwT7CYK06ob%2BlR85HlkMfRI4F7elsdCyh590pVgThlhEq9yKATrTpePTBPyS9PDVJcbcASVDpksUV4qNsKMe0%2FMMVkCpDe3dQv11is69OcgLvJ%2F2Q6vA2%2FVTG%2F%2FBiqwX3tDKdvoi4aH1dwdNDdxe1HrOUA9RD9oJz6kObpBfNTHCGtfGeEqzQu%2B6sXPcqwbHgpIjGPzs5vEiq8HRthVCrPpqa4VgP4jJ60819c879mSnAMXc3i73dpFLK1w9ejmfUsT82GpugfprdnPclp%2F2vgPQ9L%2BnhaP56Pb2LmNX7J1ywCg3Qp6oT1gSWNY%2BnxzoqE6bvPnAnnLMyeUlPBQu3BDHCe0DXt9vw7VJdYUuUBAY83vI6YyXPt%2Bc6eUMJEvqSDmaogLUjftLcSCUkEgtySqgT8irUfM1%2Fsg8Vl1BxtXWTIjOHIvdO939K0xDJxKQ2d7VPZ0LhMYEEkXrlkMwBGpnsTBHCvw5wtSmjXLlifQISugjk4iwbY34JXRaxambtaJRAGhd652FrOe22ei1T7rxvqhHBNM7ebkdOQZEPOon7c9kX0DOXhCdtHso88f4BLQe5ifMTHKVbdXKijdR5%2FNPbX2%2FmLHP4QbtCnkZGw1wcDPhgJp2FPd7%2Bz2WA87vrk4TwUBPDLT67tPFFNh3CtPhahEZsSm%2F%2BHOrXGdjWcjwSu4TlhaGuc%2F1HF52fQoGQ%2FH61SzZSmXmrmGCZBTODeSHoTbP4AQVivInOYrIvU2lvy3G6lgGe4qhVps%2Fjb35Je5QX0UVY5Q0HceujHFJeJBC6iVZ%2FZ%2FOLWfBCj%2FlfII1XOKW0R5sChAuBKZMDYaAdA0YGtjkvfxGyqhg4JRhRQ37%2B7N4KFx9tlyKQXVWlmlqWxZZ3kKANHB1xHXFRv6V1KSq6dD6ooZmZ20rxj%2BQtijjy2WUVeA%2BU6AyYVViY8QKOKZKBqeCkvoNvW%2BZdV5VqibT2H7VOr1UCx8%2FYeisnOFNKKGMnGLfH7%2F8lNpU01lvDKgcHKatMNKN5p06z15x5zhFqHLpm79hBsXZeVmibx0w%2FSgBGrTryFlXZem4YZuCg4RDRx7cPPF%2BVBvqdUn%2F9JFvNcTNBdwqvOasHM7lVcD20OmRoTJiuoWEX57QoM2mtair%2BXBvAtnItjiEkQWlzUCEfgihBZcot3gHr8CyC7ldhW05Lg0RfT%2BZoS0p6yplaAmcjH7qFvtzBsCpJ%2FXhzFzOQRdm1wLRguLIZm5EvJPDa%2BUGrfPZ5R2zHV4iKptaDpmPMZgyJ729khAUXyfFsUKKQ2S1UFkipuYn2zpRUthF1%2BHRaJZZfNtNqUrBqGFMtj7uz4lfUbvNJilAg8S5lvkancfxwoqqS7bu34nnEqQL%2FaxfdogCA%2BKliKjQagmcQYmsvSyQCgvR%2BG1Bu22LltbCOWvCjK8P9vPzeaqPS32jsZIZYFUXqmw9fr22moHbFdEJ%2Bbbi8niC4fqSlIbnhfb7kNHHW8PWj3CHqsp1xJ6UjytFbbO0WVpk1a8JwRo6PmEEeuqNQKxK%2FVXIsUi7Tt9XNVAN71dMfBnyxVAUvAQgxlHcMwCj8RMj%2FXJlaxuOo5ZlDlKBb3efpSa9mW4HEgbmra6uUnutpgGRNfM7JxTwhX6hFW4FfAGtfW5bZkPduJdSfs%2BhxU7PwFmJceZkH6wZjSc0zJXjvWteKFRm4k0SewCuLARmZ8zpVDR0APfnvLd6Fw13oiAbNh%2FWzb9BE3yqjrPDjXVosHFgb%2FdbjZm1tZJflimiKme91EVc8uQEKAU3aSskmQjn6KGun6%2Bk%2BUrvB7iGHKahaQ2ZHpd3uIQ122BcQK4bphZoEcqie6%2BkwXy8NPmEh74PHqS%2BhtRCT0ZIjV0HAybxVuowXiDPD%2BneFvijYxVl1KrCpzYCgWXh72e4ZafTm%2BYDd8gtBUhPDKBxv53zRhyNh%2BIYStkHMe6K0VLGoRLs%2Ba73anWYumdFkcwpsySChtS4B7omWWG8MMtIeP5qDozxv%2BxKEObisylzKktua8rViu3SiODoW%2Fy4fNrtzEgx41jhfP0vB8WT4NImiXlpZNMEEijKle38GWYjmrmdytAtfmPJ8Zie8l4NaXh4e83bRgRoELCD7Bqj7Qe78Zrb4AJInnZqbA4zmZ32VIZTOeJFO3UqdntObQ0UqJ3aXchqjJkB8c5xrADc3yeGCfvgnsLkNdAfnWMykFTN2TP2j983ZbjuROaVFLyXkHC5yz6LXwUag17vqd1MhsLUHGmTAxUmOv7mOjqi4YmGdRQbQTQ0TAz9G9VJRwbdQrXzyxUHyJp2f0zkH7jsUMej7VotE%2B5qfRaeGzVKd%2FVfAXG3LC8Rv7kduGV4HdGclECddSIL9R%2FDVu8z0%2FJGfCf4mboCWq3Q1S729GVwbU4%2BT9XsMqarxFCl6%2F1q39KJ%2FPaEqyICZLXvK23VlW4K0RkU98JBQcg%2FOSjjjHsYkzMCOvRUA1rP3G%2F3GJyV1TnrNtzCT4xY6mVkqjMfqwulOWLhhRzq9LjAAHLyZ9385V6cUGslFpCDK7KFclxxDvJNRsb8O45pnND0JwhOYdFsLGkLCUvOhkH3Fkq4eTGlD0sP7Vj5%2BC05OpssUqBNwfbERJRxtwvs%2B%2FIZ%2BHZMShz9cFradQX8gYRnR7iKJrVHZXzAvZR5rRLtuWItNTnKJxmHk0BByBrkFSMkfXceHR1SisM1P%2FqKNTjHEvLIE9C9OPffUaiAOimtixk%2FzQBRl%2BQWdlJOiU%2FAxajoQvOaF%2FVDNmx6Q8QbbK1AxosqoJvjtFH0nUEOckcRK%2B3rTw6ViwVSEDxchymDdG6AjtVlEvcs%2BRgB1ZYkXetvJrzwAOLBwro2qr8xiBpMDl4H%2F1hW0%2F6eaXweHccaF70xsPu6UPNNwezPjFILLdpS9z4IPlfSi7Or9kRFdeQEnV%2BoRZlDgDVxX%2BvSB7gFZtYWTgihvAyXsrqvUkgoJTFFYAHWVUZKu92%2BivJqiYQ0o932eKwlrY26N8vyrnx5fLL%2Fpwn6XfvKK3D1kuz3aujKWtq5nXdkvNVU6Cn6xU8PaO2E86X%2BmoO6DxlQrJ2N8LtIiLYlytEWXmiMhzD03%2BsB8%2Fka4IQTRjzIHMucCbLsCjaRLA6Uwmhyk46Z2u4kqOvoEURaTHb4ybsxWoO4sdWbfuiU45%2BfyyzLB5R9oJH1khmb3f7qQn7Lsm0SdbXT3oRC7uenow%2FjEzaAqooglSP5JM5Cd8Ub10Puv%2B4xb7ZBPe6Xbs%2Bb0Au%2FsdJ%2FmHsd%2FfbOym70ajlPJ1Vix3VPVwyImNnThI31W%2BzH5%2F6AgPPp0cPxDNLqM2FMcAIRCKGc%2FnHlfpdbsRuWmxa0wYOMUt%2FVaQ70t%2FuqtZis1kWGZcXjJ5nG913zQpSNqdNWvSadFYwxEOKPBpAF6Vzu%2F3qv2eIz4uIira%2FfKCYJOCJR1vlY5UDlBGES0%2FfhceFuW6RU4fgEXG4r9AZe5mxFuBeiBWhEF5qC7h8gDHxtk1EJtMzEDXVfzQz0EN1gjypohuSOKfxVaO2wmglGVHthHyIOKNJ1rvxWpsVWMzbdyIIcLQRuBwT7IW%2BUIn134Y6UxHbkJwyr9adbjZoqytUD9ZkTRWk57RUftgd5dCKSiZ4uxlBYZqnq5CsY77prYgC4R8jhkU%2FHndvO9lcW6fDySm7%2BT0iLkkMR6YzplQEr7ovEcH92Xf49AY5n9oypGX5g0JIZwgOJ1m9FhjbvvsmugcZwQyWbVrXsfkr7mypcwCN1ayAjt8jjr0twwj4tbs1gJdaEvoNmFI7SUA%2Bn978Ble2swx0MHo2n3DrwRZks%2FlQNty62mGroBXBTepI5LqSKGpZNQ%2BMCCExCuVfMluiwiTz4BMqcYrJrhMdRwnmwJwsTH39z2E8FEoEP4pB4i%2BGHa%2FTCzk%2Fzy%2FY4VJ8HN0Hk3KpeLYOsUwl8Uv4%2F38hCUVM262zuVNCN70WAAk2sBnjxxiNC99NpW3kHrmKufJwXIx3MBj8izotwdbwAxMWfOBSdq0et54%2Fn3Ah1z2HjO5%2Flcl4owRgimgJZdVRESaxm3%2F6Z0vSsseVnkfXD6n07nIzu%2F9ByiJwg6UzkAY9KEvb7StQorFGu67%2BhLVzelnsjgPeHFXzAEZTnR5G6oz2Eg%2ByrJoL4FwSJdtoy0UArJdzNxxQWncHxPdvtlbWW1Jfz33e5j4glmzpeWnc2GdAFxClu1eOJFiEtzFM7gtm6NETNl8gEbg0G8yu4wzce3WMczb8UG7Ry%2BLCU4qGZm1qTurd%2FDX7EqoCo3bKjIJqlyBvUQ3O8jGcAWFZkf9OHaw9%2BlVbb58UdWPvggfeMGe3qeOmvRluJOpRaxdc77DCWlxAMcVmpD3IkWXc3QSGbHWLFb7tsmJSqwWGDTQjUFIK939imA0LTIyP5rEj0yWHBhUHzDyzMqLd42f7B9E8HFTpVjx1vDIXdI%2F1Sy5cXtM8GtzGPMrVbg9kH3hgXd6BVfzDu60OTiLLsLVGQgPjvBrPgmnh46K2%2FAQ5ixoFoX77JG0CZPJn2%2BWD%2FeVV%2BmGH29ybyM6T7%2BlZmIA9LsfImOt2kqKJYV8vXvZrHKA9NnIxOqt4d7ugqDtJPUVzwQ5%2BMTXhgl3rQ2pp8FURsgZ5W9FVYbwfl54T%2FNQMNR1eZEWSx5zQV24a7wLlPEy7Th8RwCX3ejDDUTO6%2FIxJueQemyQlTEPFQIbuZFLRusGnrhm%2BV96iwcpNbc90oUXrrU8oWBP9XTr3BX7ocAaeyfTWuG1rM9K6S1OY9xfGc92%2FHyTlJQmNgaUbpu2ap1B4RkGe%2FCp6VkIRveJ%2FPXAEkGd%2FHrLOF97cWbB8PHuqBU4GYXkK0D6pBQ8sko%2BdLaiqcpeEtFS0YQa3Upmh4IZiwyKYtar9fs5jRhFH5WCy4lNbsus0ayr08jkyNjd%2Buh%2FmK54w%2BundjLn3%2FNisZtR1DGrh%2Bf3ieBhYez5iDi6xfZLdROoXhNh4eVOMp%2BBfIwT9fqblfyM3Gl5h9sYnC2%2B0I861vH75sfFdEI7Tcg%2FilV8mfapbonIafnp3%2Bhebj0hNlzKIe5P%2FviDUx0Pkc9NzAXe7w9EZA6xEFnp4aFIoWIAwPyONYB%2FKniLhXV5XqCQ8a3mrw%2F1w01onbpB9EX7tgXlnJ0Sg6qHHDzOoGl3WtI0w0371hTz6kaQxzIf2tMnAbUBZ2PEA7uIsh3raBEC32USdVs0PZcqpuKct9OoVvDzC41BO0lZKWcKGdwlz7DBtpIwlODJ5xoOAzfB38B%2F%2FsbYoiPnxAl5IMmBSzVe3ObvaoHVDp7GWyBqnKIeFjbh1Ekdmeu5cs2mkioULQlhfIfpgqK%2BMpt%2BAeHchiO4MjsFuLNmk405Ugnj5GjsiLtYJ07jur2iwj%2B7U9fzgPiNDr6LQdqz8fk4Dh%2B%2BTDwFbNQHLct3GtATuGE3Jd8mNCVadBayC9nSp3s4o8nnen0Qs8cMAfiJEGMz5RpvHjWO63IH5BXXi4zPBfDg2HIpMSQ%2BCCphtBI%2BVG7jFMGYGgfJEYyYXgyhOxTyoEnbsbqwDOchONWxHNkCSPmBTnQ2Xx8c3q%2F7ALLDZo2kTmpuA3YelN9tNBa84mz1i2IDxgtrb6LHrJ9e5NdsWnsKy8CIv%2BNCWD5wn0Hv50nfUl%2Bti7iMlMBFKfBdFpFxTaWTO3%2BWQz9deYYKOUq0FXfeRaRXLk0NpiU5b9x1mLYxgEDcXlgBquBrI6ubasOSGozWkacw2FtIv5cm%2FEN6aNMO%2B3jCb4JQTQMU7MaUDmOJc8DTb%2BktHDsAEU%2Bu4aQW05gtC4K3xQzWKGGEgDbvUyhD9oEnjMSQPvsJOMuh0OZnz%2FXbk%2FS9yUsjXW0WZucEH3De1V%2BKyqldv3v8%2BvToQzGxnRKzzKAmn2o%2FKs2BXA%2FqyRzg90Bv7hkwv0DlAuFzWDL%2BXb%2Fx8C%2FLK3%2Fbe8d5NZJJeRIn0hZ%2F5Z22dyEvpeE4uvcBFYU%2FcILlNSid6ul5vZgAIOEpJmWy3fpkzLtp%2B5kyEKUI6M996o6bK8AXZGZMOdlb5cQN7%2BxrUkQcPyq6U%2FCLC%2B22l51h6L5Mf7xP%2B6LwCHhtXJOSQL6QGBbth9D5u7oc4I2axPBJemn%2Fgc0q9HMbjPuxnQm1%2B5BmQuPc6MTc1HhSgTVrG8JAW4Dtn4e9yBsoQ%2FpZW%2FXVjAnLIGrPUT7%2BTJzuCG%2FnPNz759QE2%2FhWa97VlXZhw3LBf6lkjjMw9qcXNWoxYrjM4AymHsO%2B4WpZVuDKauuoexwh94hfTD3XnoUk%2Bqq2Ft%2B%2BvK5jeHKBELiNJqgcZyjU7PBV%2BNPGCx7ilMCW5a67xFjy9qg9%2FuOg%2FffdKEd4BLvIc4ePdadLEO3pP%2Fnx8hblpt8qcBhW5KCYOSUUT4OczVLagKpUYfAMeSsXNuQOWJ8%2BMVT1VHxyuGKFYRaVdCRRaEsctyTnSjcG5%2BYGiznINESItsNUsAxW%2F16mJOlPIsqIKogr%2Fvbu3zZSjGEiBCKwvLcyjkiBqRoDTMNKvEJJzF7i4ZJQE3LE8rvdVtQ4GoIzKpEE6WP8Md18cPf6v%2BP2kgjP7d6BkVzoG3bVvB5gzg%2FOWGeLQ8cjU7EWR53IKgrXOjIq%2F8nT%2BIK84KcQJ3XTY2yF7Ouv%2FaSHitgFUL79aooO5TBYOO%2FuQI94Qyvom6CAYbMGp2I1ayu%2Bsdl7g6n3jHzMMUkp8dRf%2FOLQViksPJ6mqynXziZZs6Omi%2Bs4MDhS7D53kX6OR2lEZqFxn8DKLiN2WKrOhoyOHwufEVIIUz4ZfEpdKCOo5u9Fv61HPghClxjLXu%2BNqrVZN5QmIUDcGjfcDT8afLb%2B%2BRu%2F5HPPjBewNpIeCUgVRJp34EeV607RxI8fQt%2BfBIqwi0%2BlOqjhnW05YX%2BvuqwgrvXttMKiV63N44ziJJNLs5IxjYZK6victSUlZzI8JoQ7%2F9UY7bXvXoIo3suAD1ssRfu%2BUxLzmsCogxfmyO6SdWTifUq4Ll1k5PkKybXiV3nGC7UB8D5qPYTDH7uzajFVwTiccS6ZS0h1ziDNB89%2FuhgocVW7S83lv81GQovkvke7haIPP6m3Stz3xgNM8PcCVbBOjJNGU7vPnLXEmchD7aRdjA9pHYVTdGfN8Ywr%2BH4K%2BxJQN2IFGEGO5zOM1LfIS1hAcaO7UgmZa16N9DZ6P6puITGrcoVCW9EjxY6SGIpAWP3lbkQe%2B0g3%2BaeWqlIuraEKYhywwUqB9LncSjAGlak%2FXAUWUL6CdWt4S1Bh0tQ9Y6KFdhKZ3ObRDvPYe76NbsZc25b5RcGrauafzzCTH3dFAMRbiX2D7Y%2F6IS4UP4ggszNuAkx14O1Kkqm2fJq0beWMHvmzlWV5vz6IyaiX0kdZmBJj0ObiLIWNllEfQ97FfZQGs9I7Aj2w2Sq%2FL685OVkggBZjpFSmWoaLXJ2H36J9tRhcQN0X8qRHl0TUy6dRnYu3HyNHiqgZfXMjjwvyBqV8gHgqcTzCIo6t46lQ15cXdqe0ts9UQfk3tXW%2FmdCOqEekzJA4OazcnUeQjxIAEWrXITPzv9Tu8%2FwjgHBgGxZYHy3SuCx9woOZObGmiiRNWitLSpoApqeMcrdVn%2FRLa8fzDlOOKXktyR37rpneDf93tK27kWWLwzDmbcLoZAQbEhd6YHHRC99MDi%2FtC9WxJjiP7x6uTvh09VQSQwUoJX2rrgw%2FjcN%2FdUKbFSXJ4p7FzeRrhVfB%2BuN3g0VQJW6RQsPKmPsU7%2BbOsduQ%2F5UisgsoQ%2BDHF0u%2BULmCxwhZimvldUYpsp9z%2FUZh0Kg%2B8L2L0HTY5ZK061AVLzNk6%2FyNUuGkzE0kc4rSSSH4x%2B4lzKgOHNYnVNcUi2snNYIzBRXjx3Baloagt6%2FMTrO0OXmvuWjHFMzDlVhs2lCX0DBJFo6eKLYOMdQaz4JWv1VrwMXB3%2FLrrJlHt6lBA9xGvt9kjp9Hafjk2RlkhiaN6gt%2F%2BWhO8dozuW9MjlgycBnJV18%2FqKKMe8FZysI79skt47wjs8lNywhvurSFBTMQ9Rjo2HOUIHN4DdUZCcZxW43OQRwLlkv7wNHPS8yFtgCbpZokJ1WpXSQF93V%2B7ukhnF9b3CZ0WQtx0%2BuDrtQf6rIaAjS6XlG9eZtAs14DZ0yUHxgEpJzHaRIbDn7YfldM%2F40Wfw5zauDs2D2ay6SfwR10ba%2BeF%2FudrS5CoayWH%2BWnf1sCvzQ5sc249Qw1KO4ijkd%2FIhRxXUKyrmLY1H16WwvRSc7O7g4aYisGO16SsFnvEClli3F8i8geu4vlVKPha3f747UXEJULgazcBx7B9kRAAT6rAsO25QyAcOZb09St%2BkIiks73WksVp6%2FriKMCUCiu4FX%2BLiVv69c8QQFw7mYP4BHFInnvW3C1x5eoKMivuQ53XVHoA3OHjefWZVHyMhgjJs1LwlIa4ipdWM1MYKlU6TLSbQ40PqT1su4F5%2FPsti1usYPhTvRJRBtT8miyuvvrMyoo8hd%2B4%2B2roY8gemRtiT3Jw7y0%2BaSlkW0V6EK2JJZ0vIyMR0lFf937xVFNaj8vleWSCyO%2B1BTDrWBn06tY3RfXwdot5F5tfOzX4xPe4%2F%2Fhh5NH3aDm37SIYWD%2FqKuTLHEdSX3WWfimJPUVi8FYtCPMWsE705OzRXgS9yFgDh17I1ZEcuA083A%2FpXpqmQDmtto6RZSHJmXVD2LwHyPQuP13MDd9K6Z3zuJ0ov6cNvqZQs6GUP9pMj%2BvjO6gbrqiWxP1bQVltru71gfJf6p%2BVWHMK2zgMIKQcCho5SDjlaORU0ExWjy0BrmYk2V6%2FJhq0knik8EIJQbxsbC1%2BwAEMbABVOIM%2FvdO53H3swgKbdcjqTSquHHyhrzSwFmHY6Kk9mx3K7Iou%2FR9Vgt%2BD9HuALQI18GypjgqEw7taWkYCrN67S8bhSDQH2l0JaOTf3liXbqlBRP498ALxL%2FLhzkSir%2FB03wXdQXSotT9MSv5cDZUwwzd21y07lf0KqLOuBSFnTnhlzTzKqNevfxsQ9PQ8zeFdnyvcucw2EzRUlJsBEJh%2FnM6fR%2FRsCW%2FcpOYZOl2t0ohJ9l8LdkmFUMKnLsjeaZgtVN6rVQ5nRW0CQnOBryvXfi1A4slU%2FeDvclQ2FS%2BGFAc1GqnMAd9%2FAkdxeVAtEgFDl1YcuT1IRJXRkqPHo81JtCUAbXo%2BmgEKwmZzqru%2FIT7GE4rCRABvmXqFnKbnV5jtjn4l%2BVnMTJeWs5XrJOeACsmrP2bBivJUria7YCS%2B1PK7iztuV0bydlfD26lhPJ%2B8VK2ObUbeObOMeys5wULwT3UeLY2HAgt4%2Fowxdi5VIjGKlB%2BmVLSP7TDycgIMMUyfZegkPiKnqn1Ng7LJaHe9iE8TLljPpP0rMrltarTkNXEu4pp4dTvA8s5vrHP2UcoA74UEVdYku0sbavt%2BNHGBAjtyzXRcie5%2Bq00BOHxBHyOaRA5LN7HZl2GrukQNz5Vug0ZkFLeFlSbzyeV%2FiyJaIkyH2iWQYlEtyCYxQYJOt9kriYM6VtTD%2FcDTtY9rNq9LqAZt4GjI9IyT%2B0heT7LvT4vsnkfMnDMWOXs0iPojcQUmJs2IfD9%2FOPQVvKGRc5BDZPcUwzG8pKYeNV6AmfEsS5HPJxuHaUdDHonW1UrsJQqK11INcmVmbwmECfMZ0iCiA1q10xjviZkfylINhuhxkdBCWAee5sEzdIWiX808mKEHBvRsoQjR0HXAkRzNMfDhFeMn78abmhFNQPqCVJ9yN6d2Rm2AK7HZbSabOJ83s5AbT0OJKVwKFdm%2FUMvJ6s5lnXBxGTWsC%2F1vaOzfZoQYc13gAKR2mCa5tiLt5C6woBbPMuUmt6k0NN8fNKV7DpN1NBlTLHcb6LtOy3R%2FqvryISgWcONQ9aeSnw%2FANOYp6N5TQYlNpn%2F8PWOjADzb5RrQufk%2BhrMFeyv6Xtcj9alozLMfBSaJ%2FXG%2FAanKSQxYemQlhWDp5og9owz8hkgx9IlVKOUF7NAxrPiDM%2FITyh39xCziMho%2B8b%2Fr2A%2FPG6L67iacK1qVfaH4LYJhZPCEvrdw4P7L7ZFUqJYYPPkuZkwkuJ71AmCUR6UEcszpchD0SY%2FIVUu4DDQNpy0GR%2BPz%2FuTLq0fmnOVTotqPDXrSIgPNBUj64pkGKOihBBKCVSCWzPBXhaO2255r5d6bLuCc7teNcXGcj8YjLe0awMSPKlZe64FcJB2uc1NZyPPW9KGUpFUuWNYqLkHXDZW2jXKLFUW%2B%2BFksIktBb0WGGcR3zJerQlCFqTjyUf0qc0WGQPiBKeYmaMNA9R6GxxkYgepvRaRfMCIxJszc18J9SIqEbs%2FoR%2BJuV%2FvQvceFO2NKOHCp1%2F4UtZC9vFvmsNSNoZmlXrSNQl4BrqPaRW4ryhc0%2F2LebwJM1yeXqVBALfsfiej1A%2FrnnJLbEMwplrSR6zXoCe%2F7LdiXeDGggRyrE8H%2BAxrNzHQbpqetI5YrvJndvLYEoqlJrjAqamizR3ePi%2BlTNXgQME%2BThL01LfuOHjI33wIHyt26qP6KneAOBKPWYTo7q7AMwya2bB65dspZSWDrQQL0VkhZL%2FDuV4leCS9%2BBzA4CavXNosUda1W6q52%2BV317TiplHUNpu%2FJRuxCigYT0MLW6DZhZ7pwWEJQrZH9KBIDvfclqj96thPHXMBaK9OVQbL7YtMfp0tu14nEHfo4cDSiDvf20n6TcWrucToiM9WEPhDhtLh1EmKpqXgdYNE2B3yCVBcRnj%2BYyHU%2FqB5P0N0WFL6ntepgtQHwy%2BbTjc19Lvj3YH4F%2BxwUwPlaRllicm9I1%2FAMVJvTa39H8afM8897hhGVhd58hIoPie04xxH4474Zm6JL1U7UZUtgeAf5ogA%2FFYJr1HGxyemE1M1Cae5hYxzcfLAWVuH8L6HsuSquY3zeqZq6AAKC0ufRaF8LDWG2FMls9bkIkibVlVfAk9%2BTYmwU0J%2BjOXgkJhAbZEHadPgq%2F2svg8o4VX16mp66FwmfDnAAf%2Fc5mqXgpGQ1rZ0nLIacMr0tdn%2BXxVIcI7CVAFf5KvhKpFB9igJ0rxwcGbLOasiJFBIr2%2Bg8859wMQIQ2oZ0SxDjpnYYxqiv60mSdRoEz8pyjdZ9MSmYtTkN5vejDKpMVDn5tklVhhjwiPBmZ2PjaTTmmX%2FtmQUBl1PiQnFM3HhC3dEVogrNIY6HWvCbBJgiQY0YuIg19zituYyuvx%2BBMSpOCtkDEEY56x6Bo1NBBwN6QtxfyKjy16I92BJbjeirwZQUaMvRHmEuO%2Bt9PmQwg7D8z79HsSFyBrJJU6CIZmsmY7PdQfMGqpOftuD5JZ03Y2NYR6eaQnDP%2BZ1m0ay8%2FuYeEZcyzjD98glcJ9dER%2BbEW7FNEYrkPkqZz2f0a9oZEytGKTwH5CLdxKLhRfqtLtXwEyS1CjqFqTI7CZbPhH7qMoVwotJypCKPAI7se3SUaGAhN%2Fv0v%2BbENr%2FgHmK5g5QIB%2FEqfqNYv0dIo9FtMc%2BrANdR%2Fb89ce9qzUzIxxk%2FFys7Jd2kKZrcMpZGCQqtd%2FME4XYFxPGySHYd0r7s5FzF%2B1LF1lnT8oClKTbQ37D8e%2F25Sy9vqsTntxZmVX2wRw0vDxNZx13KL%2Bn1aoVKroGed03QJ3VCNApKguEO2%2BohAToByZC466LOR1whvuhW%2FWgAHkFMRuOV8LtoU89Bpr4DGG89qDRphWMDtKakiKrULcjQbRds6FXKtqx9nGHPLSOCgoNyVwPYGf2lkkRaxC0d1EiA3hNFpKgtHSG0n7AmDyjd7B1Xznqzw2Pjgj2Qz%2BHoGfDzd%2FmtKhtfAsVA5JaoS4VsP0Tp3VJN1htdEwBKZwXEE5Yj%2BXiNmuUdbqhztSyHEIeEEagj8pJYon5vlsywRbBr4Mz3xm0Wk5maXb09z5vwR2LV2cTwwyep%2FXMCezDrcyKAq71rOhUZbn5h5x7RN6LUMmAnE%2BEhABRsIguj6KS21zE%2BDmK8zvq%2FcjCjNUO25f1zVYXsAe1JvWAjeJUTvwQqgXv6lTYdfh81b8HJk4JfZV%2ByC4htq6U7MUuDDmQLF%2B7p8Bj34dKFKnfATaqxuR8REAmKkLGsNxhufXBqKTqBKPF8P9ENPsNpd9aVfifhcoeg0sqss8iMy07UqQqGm6BzcqSddYANU8xyHT2X7PTo45hi5eLIgC6s2Xcyc4kD09bYLNbgXA%2BCuFabBI%2Bc5t0EEZTFXfreVUPwz%2BkwnCfMqidYXWTmFUZ9z1cEZt%2BDADVgfsOcqSy1Z1IC69vT8JBSKznidk3tbS6l8j0sX4EUSGrIU2XUq3OG4jB7bHG51YdoNQgbnf7zVJmibM7mL%2BZizIRTUyaktEtooEVJUGCn3LnQFgXFThA8RQji09Cxi5rQ%2BwvShHHUUPBVTcx1bY5OJenO0rmCGySKYMf4SawUGYlU2RboC17%2BAtVUn6tMQ0ZIjhRo3lIuw26X2rTv5rzt%2F6ktQ%2BFNOZlV40R5H6jgFpNVB6MZOOQG9q7wuKs2AJOgHKVEdQtrLfk8fc%2FmCcqFgQ20qNZDyd7DRTV%2B%2FVxNRWTcX8LcCkE53WE8At8lm9Ff1xl8GylSUllKzJGzU39zrUsWFzPr%2F3U9yeI1kauna5rIl1D3fxEXMQg4ev6rpPnadM2r41LTb9d436IIV8Z0JjO9N4lZ5o4F01QKq0q39jCpG0eTsgHULIPD3eYzafgQV35lEbkwPPTuALJpIEv4kNYdVeTwV6%2F6nMI41%2F05t2dKLyoe7gM6ZcU2PC7AhwQdlVAt3GEaawWEd2rjDx6qpbvVuBEOkh9VIptWvg2Ri1ATYnBGHU9WxrMCTcAErAO1sJ1URFnpqnb2bw1fxL2Rzb5GRotIoMLD9iAVv%2F2vrpyH4Mzip0mNV1dtc7Yk4CGV1XzRaxp0rTn2flf7pYnRMTJttMmrDfUzel%2BJ0fyYLun1gn0GBxrH91DWKeaaGH0lwRZjGcqkuzxxcYCc02XzmQUEqPV%2B0i1Ou3RB6lyJISXQzEiGXGoBF2L7mnr2S9MI%2FfXUlkeefHMh5IxXWqXDUvNapMcG%2Fdof8jBTIPqIEEXNPo3YBb7ueZUgiGjj0D4ogpvGnKWounxoRyrudocFy%2BltUS95tXrSNSNvKwreYkS0%2BpdydSK38eooEJfscCpZNScok3d1a5deW6ficWJ8gE1n58xZ2jEnv02L3%2FBQRhkb0Nr9Nj3kCY%2Ftq5T7pFbO%2FcvCaQlskb6ChfJC7RB1OyrJKcmp4mSr2wLa5ghRxgQiLkUvV4VQKrcVoWdj9Y3XZHSi4keNl151E9RMaToc85F91A9b7tDhRVdVtU%2BrBesZfcV19dnsa0Wl4Z4w%2FOrSXGUmvd5ldGdO2NGLJNoQXdRpufDINdmeB8eFM3zKsXbdImGnDvJslXXTQCI8wn0TglW6bSsTQ9PGW0A5R9NRO9YEbbsehCaShKUn2%2FWMJJDC0TZ9wZC4JPq569WesGulB2oKogAKh%2F%2FSvUYQUTRdsjtHHZSwfIx4y6u%2BdrmZhW854MJQILtJ9D%2F1rWUHT2vVJI5E2TItA6UPkvRFGtEpwlIVKdvRBmwc9lkBe43QGLKcmdsgjosXjLFsNtz%2B5o31U4RUEIo8dAd0GK%2BGuBX%2BT3g2C61zsC85gSZyhjkbMHVxtPUTp5QqQ13DlAhJFQPEOgeCBf3SkU%2B5LEaKx6McAlz20E0LUJu%2FTHBRn3Hrf9bgBLuKeD0Ral74jTR8wdImXgGTgMui6rPC%2Bi%2F7cYMZ4Yr3LQBjj9fgI%2Bh5RzkjYvbPQ6TC%2B9nD6SVXI1TxL3yONOuDf09aRa7QX5hzrdHmyGMnCgDZNh525UoOLglMFknl9KyB5BytzftripE%2B2IyBLVdSGveayTCb0jOei11X3RlUPJIrlDy7fKYRYLcbh%2FCLqr3EO85cRjEolBbtxbnWZQAg6H%2BDW7cs8jrh4fkfCOlPusIy6HuOsMf9%2BLX3jxqQFaLVUbpRPIN0vN8nVAX32Ff59%2BL47I%2FdPQvASTURKkruWrP1tvex55WKsZtNM9mmGvuXRLlZuaBA9v%2BWYrc8ZUGCG2LBQHjgJNdfFTx%2BGe7nDFJqbXx2SslgEDJ3PH5Tqa89FWcQRrXxu4pqXjoCCmy0z9W4NaEH48J3S%2BbogPbO3ESo7bsnCkQuAoSu1F0RZMhko0S0DbbgboYx95Z6WYOOl5QUGTqRlZLF8xy6GDsTd3V6BQ236Pxuc9gyBNYsCCKoQP1u%2BvGSGN4SwmmO60L7UW%2BccXHEgOAjjBLGygKkW6hE6mhEoNXPRWdrpu3FqWgpNqJZNmeVGtV9i1uLXmFKky3PJ%2BkI%2BJ0f7vLW%2B4Aq6LfvIGshcUTr5l40xqmg%2Foic5ACMYwZKSV4OsMml7HX%2F5h75AwtG81i%2B9BAXhGtLCtg5jd3ZAcGEww4keXytm2vTTzYQIt2Tz5YB7NT9dyYxfdNZxyRhKnuiCD5DOHdp0RsVWwgkaZzMiAVWWDZJpHSx6ttQXeK2x6o4%2BpQg%2BKzgeTutu5QUK30lyDTQhYL1x66Yf7C51PpLGq6Se8qN1EORfUKpH%2FwhXCp4iDMG8FgRJWfjLS%2B8wqbfkV1hvUDH8cnuQoO8CWuovlnBX8Flj7vKcyMkzWbViVVtfnuo7fNnzSs5UmrGAgHisK%2BJd68g7Z0PxJKRtNg5k%2BecVLW9iqi19uEPdln06hmIPP%2FG6bTHpduCN%2B16%2BlakkF5nu68XATMf4EVGW9nKv7kvgqqKSrVxhhx5FJdf3zgGico7hzh3WgqOn75h7Lqss4NngiD8I07gr32SGrVLkjMuDjwTcfAo1PSAMqx2OKmXh%2FayeMMjo%2FRDxx1VJbmfAiK8QgUhiWwzVJwE%2FTh6Nf7eCIMq3y1zhDUpotRtqXIwOnaznpQFnz9MyvOxAWFidUiN5DK2iyE98rpJ8a7EZ4Ub1lIKS%2FbvpdjPdHuguofGPTFjcE%2FeN5m5GwNey4BubM0aI0e0gDc%2BvxA97uJ3JW8TgjjXbcihiVPm7Acx5p9TKkOtAUSvWRS0JGyThUxErR7wgtX%2BLgbDPjwf5EcBwHgeaK4iHq0gM9FcpgnW0hc45hrpbWxsQXBtO0xnInxlvcg8DHOn9V4FNu%2B%2BSBbxgDI4L1IefmSRtB1x51ajjqJztm4NzT9zBviMH8p4texiOVCcBlcYRkpE79%2BQyopQ1moh%2BQBxa1f%2BWAJZ6hzSt6IAHOBgyp9%2F7JNwUZuTZfCXcwOxVzS0LSvQAhTrIA%2BG0uQd0rqlq8khFlS11RXqbMkE4apzMVNklwXHGyLyikV3xsElz2SI1cwUSJRP2utVvMZslTJw%2B19q7HWBjcr%2F34H6J4ZoFMq32xAOcOz7iU1UGsPduFbk2WHIuk0YkFjvtEF5Yn1CU0Y92o5Q%2FfEGbd3ylMMvWmKMJzTl%2FS922tmRDPVF2vNqeP1DS7rKvy2vqMXsrB82JBROkaLsDbtUFrICcx9f4AFpFRH5A5XYhc5xcNAjJvR3HepVbzBP3gi0ZcT3Qoudt%2Bz7qn0fsnQ9s3GDoLMRoSNtRNXwUXrw%2FkkkRNSzGisufgaBRwRRPE1tfyjRbiwPg7fBm%2B%2BHXOdebYfodbcdOOd0fuK63MjshyWRM1ZCUr6oY05l9HLQdNgJZENmNJLfeWzm54F88Lw99L8oFO5JAOsqgJTxgAv9%2BAiAuXF6TYiecJQwUvmNvqRKPT1AKrOnvWzIMlpcrmCPuvzg3pQBzx8uASdMgbosFVQ3UxN5eHTJDC8wa91Ih9bXdcModnqDhSYGvj%2F2uuwvG%2FrO%2BKHPT%2F%2B%2B2dVKNXR6TuyT%2F4CYid3piNb0WUcHNXiYpXhA%2FI1j6Iv5nGy5ywLEejh4WgnCpkI%2F5RuLbm7dOfuENYM3oV0fz0QucMKnRo5Ndwyii9HZp1EU8taW5%2FiHK5ngPETbaWomaOy1y0frO21Qfp8%2FZpTwIRKQKI%2FaGKlJrsBsrI9lmV6IRUI75LDHoqxgUHHtMKERzRBeyAeCMls9XrbpCYhj4TmBYOtg700v23T5mZ5zKSvNP6fGSotBxh0%2BILjP4n1aTu2eHvYTWrsCl5wFD%2BfeuNFXx8fOG6UelpV0ToFbCtop7z93vvmMRWkWNIwFnKigXl%2F5AedZLKhtkUprNwTcTb8mWpIRIVmKUHr%2BjxF79mZ%2BhH64xRnP42D6hP4aeSck5Z87O%2F3SBoaYhx4rmfhdms36L86q0eXpqq%2FjWQzt9oiczrBBatNChpv1M2UJFgNGzqFMhXvmKZ46koQvXK%2FbMwZB4mR18OxQ4WVf0Q7YreSDyKFHs54QnF7BHHkK9%2B83CVCYSFnAZvaGPx54nX5uTdmvWi1QfwFU8vbtD0vc2rYRR9efamFeJlabdOPys%2Bynmyr%2FLJ7D2QLL5x%2FDXptT865eRVuMMO36EezujscODguIwXcqa8NdqVGIT4cLwCFosuoEH8tGznvcUCG93O1r1Esy4MttF6yQsI1T5xSuKcs65ufHb3cn85EbHwjzU9nEw2PI4vXah4vDYhCAoVv3gGi21rGD1NqINRbYepnPMWrfUYSb46KiNulj9QyrUeSdakvT3Yzno5hatrdTYgYLSI7JIfmaZ3JwORrem3XuAdvNj1B9WS%2Fg9jTQn9p3zrqlNwyiuTsDE4Fol8pvXXowcnKqI%2Bxcg7xtGRwdptexghWixwKADMqbHmC2nwmBXf9Cb8MlDJWd3UUzafmMwLnB2mwHm0ZmaW3hoyHY5ZK7R%2ByvamPELFxP%2B9s%2FagGYp8pKNCqMUe8LgMFoMaGv1BlZAW9K20MH9mOgTfWfsRxxGheUz9%2F2LUIpKx9nIc%2FH93%2BHCSnh6zuQF%2BZmkRdwLpY%2FHXoyfunzbnjx2p5uLG%2BH%2BusUpiE6kXNbkVJpKnq%2BlMmH70cAFuDFvKPSNkmtzF8SuzHf1CFB0Ynsfn%2B9Y%2BobZ%2FzZdvBOB%2BQdO%2BlnsCRGovJ%2BNSPI7WoUneM%2BRfD9nhJyzR2EfVcG8TmOkPsBV5Wh%2F%2BiuM9Yf1DU8fnDh%2F5yZS2Mv%2FEv3vGSNUMPQ4cNktGj5KTod8aFURbSIbpJW970DQTICWE13MFYLIi%2Fgg9EG%2BgHNu07H1zzDcYBFjDDzcY5PnWqHDUkc1Dr1CVvS0TPjEbECBdY%2B9aTeG4ENhNN9yoitZmA2nCLwsprbp%2FjFlLWNJIpfqYXextslHwwrXR2R1I2iyHfOFR4oymJfiht6FnP2%2BEJYzib5r1mlIUU5FZQuORbDJGRMhfAWDh4ZFC%2BPD6hZBV6jy7DSy9bjMmyJ9%2FYDF7juXsbEhhTncx8uNy3CEX6D3phRwPi8rFr7%2FPJ26iFHVASZtyTmdi%2BuE4lus9AkxoafpCnhYdkB58gd0T9kwN2DG2v7BifBZqV40t9oWa0MWrIOjxsF%2FG53eMWMR5Mn0shXzPuk7tFUw26DA5OUDlyStnuNjV9a2tIkXP5WtB0U3ng%2B2EgyT9lavyn7ZCBfsuRDIJA3nz9fVVJKfzdqWvqw1fmqiUXzB71hWERB3z9Dj97a3WsHpDtZb7Mi28175hU8LT9z99xpHBqAtnEJWVjHdY5qKdj9lwQ4O66ch4ykykNTR0MPqA65x1Fj46%2BzuvrW6CHdzrTWk6%2FIDclu%2FGXRaVhwWxKd4arVh8nfTOHs5JLxtr1rZj3YSqYzJM8mQo5dxa%2B2t4Fy6GnrljyPNLZaYp81Q9UWCRNATNe3G88DqKYEFaxoo5%2FzOEiZPvg9EECF9766XH2d0c7%2BkZi196lVgxZHl%2BsurT2vkN100entO3pNKmnGR2skZ61SFuvugp8f66Py9lTqcByK4KOwre83%2BLlZuEz4ygL6JFQN%2FclQL0%2FHj0zmwsLwAGBtHeev0Rhzz%2F%2FXNuYvXvekQhAZlsEbaXy8f7fQ0xGBNEcl0puXWKdzhzS9HyKs1BGDLpz67BcQCDaf%2BnYP1IBgrlBfOYkod7aEaHcMIxB8H0IUUsVv8bTVztEOp679iv92a9SO9racsTRPys7zM7DZ1YrVRgwpQxxMMkFOkCDcWcJIbwRWr6hXVP43b1rFz1DfT3AIXV3zTa67VVdHDA9ykPAmw2e5lmrrHGx4pmpTqwLf3IcSNuCY%2Bc5ZmWa%2FfNJvonx0EEnzE9djq3HwgLwBFYYeuHaMUmiqDrhM3ABcNq5UMcCFBIScvNNN7Bpmy5cdT%2FrGr5DdxCbCaSv4TGyNcC0DSV9i%2FuZzAbPZQlIcFwayeRp1vVtUxA7K%2BzpK2U4l8IFw8i83kOWBBNsfSYCjrsnmZ%2FYUOp%2BwiLfclF3GrgtGmGuzoCu3aKl7r1aA9uXOzj%2FMpRm79EOVNE9PqdIQg%2FqtnLUkzdq5MCxrWRTxf0am5xwNPiwc1jWQ7lDR9q49LPqpryaYhVbNX4lz6QZFgam4XSshKV8tq4HORSi6bB3%2BUX7Kxeb3La6Of1rHuLQv89ks2Wehpviobg1hie1EOK9KkovdS1yiCJS3rivqhRp9MYr1jWtpO9Rx0PqbOzbLYKbPhm9wheFHh%2Fsnqp1132N8Ek6C6CUvzN%2Bd5eEcsttVaSwsbFCFu%2F0cJbkBHgNM0JG4kk3ZGOcxyadRpBpUC1dd1XR74KuWhDWeSpbu4f94HKanalfawImJANe%2BhgSUNqgR5wZJk3hnq57HwB7pFys9XGjaFjxzz2vTrYefEsoASUVbAjZMghHvq5fivJes3MGiG9pMYgO5uuFhDaRM5eChKzd4JEA2f2tCULQcHfMCGKyKObfEKGsy%2Buc9aSbSVpiizQxoBJwDHbF8OhiVHXMHmnYgu2NfWriztekdURWWh9xVqZ9TTaDGUKRtqecxDcvGmwqhBd1%2Bvt82UtJGm4kFZ0hI3GZYXnGrPZolaKu6cH%2F4PsZP4qv5KAywSmhSjy50c7BXVzI3Il9VzwYZJojLPG0fNwzJK16nNUv5uOZ5MCnSHg95h6y6CwOcZ3rxX6iCj%2FgfXWxWVJ2mJEeJ%2F0dd3wZ8tg%2FP3VNcUcDEJAi%2BWMVPSoasrg7KakAvra6KX1FZGa7ycPfnz5DVzRWI9Y%2BHE826nlmlgsT95bOObPvne8qpSfb%2B4DXyKHgpOvbOoXkDQH9I8L%2FYF8ETarI8GfnJwC2fb85VhcdaT97UtLkYO6y1WwzyPP3GnHEwY9rQNCNIh%2BTlfhKG%2FSIgy1nSw61koylRCIqCf9dmfee8q0kGoCZyv%2Fc91zBGGcmVb%2BxKGi1vcNwl24mjNzxB5bstaWFqBwT%2Fb4p57qqnIWgF7E%2FrNBsvi7o8nQ1Vm9RxEmh9uXR%2FB8fGMoHHA9vL%2F73Yv67YWsBw0%2B%2B%2FDM3dyYf6YCYqZAQhWA%2BHzJIIMcZb4bgVkd%2F9f4D8VqusgMIg7CB5Q1%2FmpGIfxNZyA5yoPmmpECqawaMbOTMqMDYyGDe9iLtb2%2BrD41VEmxyRnFbvzRJl4%2F%2BjRDInOmABmLmLrWRxkdrJRT%2BhyAOeceEMC%2BvOYBY5bdJuINixGIDgnurdeYYqJdwDhvqw658hjRfF%2FNMW6aB4960z746A10lssIXPXuDUWGW7USEcs1o0GavDwB%2FieTHFSeQYtEux5bscNbvmvL2Fjbu5hRLfrx%2BZJXfD3vHGV0rZjPkdfFusnNuMQKGE5WLRnPdVHWrUrL0mXItp83qq2dZjzPQdCSYXcdP6SfBH8sde4feVChm1MoP7B1UifYa2KYltHRk%2B2O7AZAiB6qWimeoWkQnAv9ZU9VSTlQkdExuEvpmtJ0mRH5RuNAUjf7VLvRRxc1hFxsLTypD83Zr4MUTq4WTxIdDU0oBYFfuX6JrRhLUqmCdCxeds0%2F%2FHN30lyqFRZh7izsu4HZl3uZN9bsjdTytqTgTEKFMeb8mjz80Sh%2Bxb0G%2B7H1ZRaRxL65zuEVA8CQ01KkMrOvle0dDb7DP9AUYmTSTWS7LTGTwoK5zQ4xhKBCwUjWiQbzmL3MQBP3CPMMnF78XdkT3hNJ7obTMe5IvHWDOfX2cGraJcozlvsK6UwJgBZAAwIyCZOs8cedOYlMc9m%2Bqc4KQNFz14dQvt8Mj3xJ0r8Y2QXLXcqe4rU6gkjoQi77VfrnwWc8hiXZoDqPa2KS6pAFf9D1V1SKz%2FpOdtgfR1jMdrGx6Be6dKCBRd037SFSBgvIf%2BykI%2BYW7kS9oVWXxuX4j7WPsZkBfBE14tl1ZGreTsSMYv62h7eJpmhdJ%2BOJzXdhKA2dtuYWMyX%2FUhrGIMi5%2BDqJBP7KzJ2jLBJyWXa1Pkljl2wgErQv%2F2lpyTRT2ssKYloIQ%2BfDpEqoDDAgxAgdZIdXA9FzO66dlGMZeFyWNya6lAJu9ttIUiJvoji5aHDSfA04cpNI1lQvg4vaGQMyc9fQDnYMVa4qMsgti3KeL7kNFLanfNAUJoowgQsfkZCuy2w%2Byv5zRKs0X9PQD%2FY6v8CmGsn3lOctT1lv%2BiSQOR7r4Kc4I1op%2FoDGSpQ3ePIdIh1Bmfo22jNu3THWu5kTGO4U%2FJfD3Xo0q02Ac4MrQGC9QBK%2F9V9XeQ2EPO0j9eugsunbIVJLLCAJ2JhVNtq8VDvjUhKQd7TEu7gENnRxasMvBxJ2Vsz%2FlHFmWosrELzJHuMndyNtyp8lOOGI7Ai%2FbZWs%2FJ%2Bv4vJhDC9npwjEwn8Z4BwuPwdMIGx9nPLXPhJHvkK95BXACSNtXDnjmeeow17PyzNhSo27FuzbaOzpDgS7CF3qrvc7%2B4NCptJ%2B9pmfE25Gmlxn%2BP1fw6qpTt1do0b3lydKJa64FtsMadCS0%2FOkgK6ItBNWMpDo%2FfZcQTm72FMupgQls4G%2F639DgjJcoeqYBrZH4tHSLkZhhLrRL6qY41mlJu2XbJr26x2GesZ9ZVbnERdCu7XbdqQKn4vxJ1RFyJakfSIGvMVkDQFNdKtNMz4bxmH5%2FEmOeCnMLAl06hyYNb%2FLXeQ1cvJrXpK6ZGncpTw0ft9tL3koT%2FDJWSoGPNHSmZaHYKsuh0mCe%2BjED4wL9RTd8hIQ%2BRDDpJdyvjiht4I2idYnzcfi%2FAVXsDghZt0wX96MMh%2BIhR1p%2FeyDOe9XMFx0JuvLRY6%2B1PugRh3xW7jFxuVBmzKh1IgBy5i8yg%2FV3p5RjCqfWydJXx5N0JQYZfUgA7fq3kr7%2FxiaVUPyMNr8mE67QoQzfobeuM2yBrfiD7UzPjsB7lLFW5PZhHWfz7uZZ2rVQOF0VMBaRMTM5%2FsBG0FCzfsheYFJ4MFRyXq2OAvX2PPtn8B31I%2B2797rSBPpkzACoAlFa6JGO6ZqWat%2B0vJ3%2FgKrEEXKIRB9J2pxVakhlwIfriDuVRF1VRhriDYAKLv2cDnQ8bn1%2FHwfCj5zoycndami%2Bj6oWJ4G1%2BqYqGj5RZdGUic6qjI%2FmogFm2gt3BEGLGUkzIH4SfueafzRY9QDv%2FU4qFpBHCLxX4e9Sb5CDWWtIC9AN8hhmjJY4WqyOc%2BJdTU%2BfT%2FtYwIHdFVwJ5UXcXnqUqjH0zMBmTSzu0gqlrdcXfSYcnHu3FDIA%2FyQgWa8cYm2c%2FVysRgkjhyzCc8Y%2FhlCmKQrcz6YD6eGqkZwWFGia1QW7ABuObRMBn3MdI%2Bko%2Bphpv3P5vjWFMvwpySaU3YDD8M%2BA1GqnoGpTLH6Ijb9OSO39%2BMFhQojsGjzAUHLUHcCwFrC%2B8BsUe%2FBE91PPPwG%2BrQmUJXo9i23Rwp4XdsAXAYkhzvGlrdewQfFhnOFHHXHmopYypecOXO9nFQnnhj5%2BU9n998%2FEQGqPzQKT3cn3vHxBLAl0gsGwMlmwzA0NHdAenofpyg5H6UIML7lvlUbWYIEH6VB6JZwwvYWGvIGscTocohzuJb7TfPYagF08%2F2SpePiITzuzxpknJO50ACj%2BJ6Y0RgaJqj5hpJyFxto5x8MD5gJ9R5HaiLZk9eOyD5VJw%2BiPexXpzBnV1EFJ0dagggjySnxS7d%2F9chnygZ%2BmkvvDu6Zt2uiTQGFKh8jS8lBfe62tUaVvv%2FXoXUhdS4lgbQFp1ejlnvyt8OpoJF82ru5eZghQ%2BXeltoXWMYiQW1MgGHuxxpW%2BXw%2BmTDw6Blq75VSMh%2FR5g15uzOLG3gzVF89hlAmMmNAcV%2F3x%2BpfUMDIURcIsrwi4jB7iInVfG2Bg1AGg2bg2hJxMeA8F2Mtc09fG0oDigNDtnfdK3JtwdtvmxMsTNu8Byx7YE3bMOEzW9ge71mQIKH38DeWSgcSBcMx%2B1danmtLAoaCR7AIYyff8R50P7FInEH%2FnNS%2FYD%2FqiONsrD60QWZT1PG1%2FAc2gk4HUXRLGJ6hPz4t8Y1v%2FWADSibV9rCYR1fGOymNdKLbYSqXvDg4yYhNx1qevCLKfqtwQtNaGHya6SFTQ2aS9ScLldvaAgZSMOZewbg4XZ3O9yoAjwgQ7QHm9g7yoPn6E507OuBx7pAGtpeupfEZV1D03FflaJr4038LwOjS5UGQe00M8gi5dC93L%2BNW%2F6lhk0tSyDc6meHVfpDjgMaMTGpbpXQavKDIajbCaimg2na3z19b0y21SXA6HikWmZw4V3dVMyY%2B3V4wur8SWNINxwJyuo39q4AvxEa55BAP22JVNfQHcETx6bilMIidP%2BescGcs16EaBcUKNjQMDPdJTL0uu%2F30zMroeubZSDDhP3JBxY6Kwx&__VIEWSTATEGENERATOR=5C4E379B&__VIEWSTATEENCRYPTED=&ctl00%24HiddenFields%24actionID=&ctl00%24HiddenFields%24pendingCustomFields=%5B%7B%22FieldID%22%3A24%2C%22ScreenID%22%3A0%7D%2C%7B%22FieldID%22%3A28%2C%22ScreenID%22%3A0%7D%2C%7B%22FieldID%22%3A29%2C%22ScreenID%22%3A0%7D%2C%7B%22FieldID%22%3A33%2C%22ScreenID%22%3A0%7D%5D&ctl00%24HiddenFields%24inserviceCustomFields=%5B%7B%22FieldID%22%3A33%2C%22ScreenID%22%3A0%7D%5D&ctl00%24HiddenFields%24pendingCustomFieldsCount=4&ctl00%24HiddenFields%24inserviceCustomFieldsCount=1&ctl00%24HiddenFields%24targetQueueID=&ctl00%24ContentPlaceHolder1%24status=1&ctl00%24ContentPlaceHolder1%24statusMsg=&ctl00%24ContentPlaceHolder1%24lstPendingPageIndex=&ctl00%24ContentPlaceHolder1%24lstInServicePageIndex=&__ASYNCPOST=true&',
  }).then(function (response) {
      let html_string = response.data.toString();

      let list_array = [];
      parseLobby(list_array, html_string);

      return Promise.resolve(list_array);
  })
}

module.exports = async (request, response) => {
  let route = 'lobbycentral/lobby';

  let raw = false;
  if (request.query.raw) {
    raw = (request.query.raw == 'true');
  }

  let promise = queryLobby();
  promise.then(listOfCases => {
    let listOfCaseCheckedIn = listOfCases[0];
    let listOfCaseInService = listOfCases[1];

    if (raw) {
      response.status(200).send({
        listOfCaseCheckedIn,
        listOfCaseInService
      });
    } else {
      response.render(route, {
        listOfCaseCheckedIn,
        listOfCaseInService
      });
    }
  });

};
