const fs = require('fs');
const args = process.argv.slice(2);

if (args.length < 3) {
  console.error("Please provide parameters: filename -d date (YYYY-MM-DD)");
  return;
}

const fileNamePrompt = args[0], datePrompt = args[2];

fs.readFile(fileNamePrompt, 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  var mostActiveCookies = getMostActiveCookies(data);

  for (var i = 0; i < mostActiveCookies.length; i++) {
    console.log(mostActiveCookies[i]);
  }
});

function getMostActiveCookies(data) {
  var map = new Map();
  var cookies = parseCookies(data);
  var maxFrequency = 0;
  var mostFrequentCookies = [];
  const userDate = new Date(datePrompt);

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].cookie, cookieDate = new Date(cookies[i].date);

    if (isSameDay(cookieDate, userDate)) {
      var cookieFrequency = (map.get(cookie) === undefined ? 0 : map.get(cookie)) + 1;

      if (cookieFrequency > maxFrequency) {
        maxFrequency = cookieFrequency;
      }

      map.set(cookie, cookieFrequency);
    }
  }

  map.forEach((value, key) => {
    if (value == maxFrequency) {
      mostFrequentCookies.push(key);
    }
  });

  return mostFrequentCookies;
}

function isSameDay(cookieDate, userDate) {
  return cookieDate.getUTCFullYear() == userDate.getUTCFullYear() 
    && cookieDate.getUTCMonth() == userDate.getUTCMonth() 
    && cookieDate.getUTCDay() == userDate.getUTCDay();
}

function parseCookies(csvData) {
  const arr = csvData.split("\r\n");
  var parsedData = [];

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == '') continue;

    var j = 0;
    while (arr[i][j] != '"') j++;

    const csvLineSplitted = arr[i].substring(j + 1, arr[i].length - 1).split(",");

    const _cookie = csvLineSplitted[0], _date = csvLineSplitted[1];

    const cookieObject = {
      cookie: _cookie,
      date: _date
    }

    parsedData.push(cookieObject);
  }

  return parsedData;
}