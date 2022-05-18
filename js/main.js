/* main.js
JavaScipt for assignment 2

AUTHOR: Sahej Kaur
DATE: March 2, 2022
Email: kausahej@sheridancollege.ca, sahejpreetkaur2001@gmail.com
*/
provinces = ["Canada", "Ontario", "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Prince Edward Island", "Quebec", "Saskatchewan"];
province = provinces[0];
date = "yyyy-MM-dd";
dailyNumber = "0";
totalNumber = "0";
dates = [];
dateIndex = 0;
chartDaily = null;
chartDeath = null;
chartTotal = null;
dailyValues = [];
totalValues = [];
deathValues = [];
testValues = [];
covid19Json = [];
const MS_PER_DAY = 24 * 60 * 60 * 1000;
provData = [];
// global vars
go = {};
document.addEventListener("DOMContentLoaded", main);
const URL = "http://ejd.songho.ca/ios/covid19.json";
function main() {
    Logger.open();
    log("page is loaded");
    initProvincesDropDown();
    //load JSON and parse
    fetch(URL)
        .then(response => response.json())
        .then(json => {
            covid19Json = json;
            parseData();
            changeProvince();
        })
        .catch(e => {
            console.log(e);
        });
}

function parseData() {
    let firstTime = new Date(covid19Json[0].date).getTime();
    let lastTime = new Date(covid19Json[covid19Json.length - 1].date).getTime();
    let dateCount = (lastTime - firstTime) / MS_PER_DAY + 1;
    log("First Date: " + covid19Json[0].date);
    log("Last Date : " + covid19Json[covid19Json.length - 1].date);
    log("Date Count: " + dateCount);
    for (let a = firstTime; a <= lastTime; a += MS_PER_DAY) {
        let e = new Date(a).toISOString().substring(0, 10);
        dates.push(e);
    }
    dateIndex = dates.length - 1;
    date = dates[dateIndex];
    dailyValues = new Array(dateCount);
    totalValues = new Array(dateCount);
    deathValues = new Array(dateCount);
    testValues = new Array(dateCount);
}
function changeProvince() {
    provData = covid19Json.filter(e => e.prname == province);
    let count = dates.length;
    for (let n = 0; n < count; ++n) {
        let date = dates[n];
        let data = provData.find(t => t.date == date);
        if (data) {
            dailyValues[n] = data.numtoday;
            deathValues[n] = data.numdeathstoday;
        } else {
            dailyValues[n] = 0;
            deathValues[n] = 0;
        }
    }
    updateConfirmedCases();
    drawDailyChart(dates, dailyValues);
    drawDeathChart(dates, deathValues);
    updateTable();
    log("Province: " + province);
    log("Prov Data Count: " + provData.length);
}
function prevDate() {
    dateIndex--;
    dateIndex < 0 && (dateIndex = 0);
    date = dates[dateIndex];
    var dateElement = document.getElementById("date");
    dateElement.innerHTML = date;
    updateConfirmedCases();
}
function nextDate() {
    dateIndex++;
    dateIndex >= dates.length && (dateIndex = dates.length - 1);
    date = dates[dateIndex];
    var dateElement = document.getElementById("date");
    dateElement.innerHTML = date;
    updateConfirmedCases();
}
function updateConfirmedCases() {
    let e = covid19Json.find(e => e.prname == province && e.date == date);
    var numdaily = document.getElementById("numdaily");
    var numtotal = document.getElementById("numtotal");
    numdaily.innerHTML = e.numtoday.toLocaleString();
    numtotal.innerHTML = e.numtotal.toLocaleString();
}
function drawDailyChart(e, t) {
    chartDaily && chartDaily.destroy();
    let n = document.getElementById("chartdaily");
    if (!n) return;
    let r = n.getContext("2d");
    if (go.dailyChart)
        go.dailyChart.destroy();

    go.dailyChart = new Chart(r, {
        type: "line",
        data: {
            labels: e,
            datasets: [{
                data: t,
                fill: !0,
                lineTension: 0,
                borderWidth: 1,
                pointRadius: 2,
                borderColor: "rgb(0, 122, 255)",
                backgroundColor: "rgba(0, 122, 255, 0.3)",
                hoverBackgroundColor: "rgba(0, 122, 255, 0.7)"
            }]
        },
        options: {
            maintainAspectRatio: !1,
            plugins:
            {
                title: {
                    display: !0,
                    text: "Daily Confirmed Cases",
                    fontSize: 16
                },
                legend: {
                    display: !1
                }
            }
        }
    })
}
function drawDeathChart(e, t) {
    chartDeath && chartDeath.destroy();
    let n = document.getElementById("chartdeath");
    if (!n) return;
    let r = n.getContext("2d");
    if (go.chartDeath)
        go.chartDeath.destroy();

    go.chartDeath = new Chart(r, {
        type: "line",
        data: {
            labels: e,
            datasets: [{
                data: t,
                fill: !0,
                lineTension: 0,
                borderWidth: 1,
                pointRadius: 2,
                borderColor: "rgb(153, 102, 255)",
                backgroundColor: "rgba(153, 102, 255, 0.3)",
                hoverBackgroundColor: "rgba(153, 102, 255, 0.7)"
            }]
        },
        options: {
            maintainAspectRatio: !1,
            plugins:
            {
                title: {
                    display: !0,
                    text: "Daily Deaths",
                    fontSize: 16
                },
                legend: {
                    display: !1
                }
            }
        }
    })
}
function updateTable() {
    let html = "";
    for (let n = provData.length - 1; n >= 0; --n) {
        let t = provData[n];
        html += "<tr><td>" + t.date + "</td><td>" + t.numtoday + "</td><td>" + t.numtotal + "</td><td>" + t.numteststoday + "</td><td>" + t.numtests + "</td><td>" + t.numdeathstoday + "</td><td>" + t.numdeaths + "</td></tr>"
    }
    let t = document.getElementById("tablebody");
    t && (t.innerHTML = html)
}

function initProvincesDropDown() {
    let html = "";
    for (var n = 0; n < provinces.length; n++) {
        let t = provinces[n];
        html += "<option value='" + t + "'>" + t + "</option>"
    }
    let t = document.getElementById("comboprov");
    t && (t.innerHTML = html)
}

function onProvincesChange() {
    var comboprov = document.getElementById("comboprov");
    province = comboprov.value;
    var title = document.getElementById("pageTitle");
    title.innerHTML = "COVID-19 "+ province;
    changeProvince();
}
