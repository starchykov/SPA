const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const generateIcs = require('ics-service/generate-ics')

class ScheduleController {

    /// Get schedule JSON data parsed from HTML page from request parameters.
    getScheduleJSON = async (request, response) => {
        const url = 'https://online.karazin.ua:1443/cgi-bin/timetable.cgi?n=700&group=5750';
        const data = await this._parseSchedulePage(url);

        response.status(200)
        response.json({message: "Couples elements", couples: data});
    }

    /// Get schedule STREAM ICS data parsed from HTML page from request parameters.
    getScheduleStream = async (request, response) => {


        const url = 'https://online.karazin.ua:1443/cgi-bin/timetable.cgi?n=700&group=5750';
        const data = await this._parseSchedulePage(url);
        let events = [];
        data.forEach((el) => {
            const inputDate = this._strToDate(`${el.coupleDate} ${el.coupleTime}:00`);
            const date = new Date(inputDate);
            events.push({
                uid: el.coupeNumber + el.coupleTime,
                title: el.coupleDescription,
                description: el.coupleDescription,
                location: 'V. N. Karazin Kharkiv National University, Kharkiv, UA',
                url: 'https://online.karazin.ua:1443/cgi-bin/timetable.cgi?n=700&group=5750',
                geo: {lat: 37.774703, lon: -122.432642, radius: 20},
                categories: ['event'],
                start: [date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes()],
                duration: {hours: 1, minutes: 30},
                status: 'CONFIRMED',
                sequence: 1,
                productId: 'GENERATOR',
            })
        });

        const getIcs = feedUrl => generateIcs('TITLE', events, feedUrl)

        response.header({'content-type': 'text/calendar'})
        response.status(200)
        response.send(getIcs());
    }

    _parseSchedulePage = async (url) => {
        const couplesList = [];

        const response = await axios.get(url, {responseType: "arraybuffer"})

        const html = iconv.decode(response.data, "win1251")

        const $ = cheerio.load(html);

        $('.remote_work').each(function (i, elem) {

            /// Schedule date
            const date = $(elem).closest('div.col-md-6').find('h4').text().split(' ')[0];
            console.log("Couple data: " + date)

            /// Schedule row
            const row = $(elem).closest('tr');

            /// Schedule row item number
            const rowItemNumber = $(row).children()[0];
            console.log("Couple number: " + rowItemNumber.children[0].data)

            /// Schedule row item number
            const rowItemDate = $(row).children()[1];
            console.log("Start: " + rowItemDate.children[0].data)

            /// Schedule row item number
            const rowItemCouple = $(row).children()[2];
            console.log("Couple: " + $(rowItemCouple.children).text().split('Дистанційно')[1])

            let couple = {};
            couple.coupeNumber = rowItemNumber.children[0].data;
            couple.coupleDate = date;
            couple.coupleTime = rowItemDate.children[0].data;
            couple.coupleDescription = $(rowItemCouple.children).text().split('Дистанційно')[1];

            couplesList.push(couple);
        });

        return couplesList;
    }

    _strToDate = (dtStr) => {
    if (!dtStr) return null
    let dateParts = dtStr.split(".");
    let timeParts = dateParts[2].split(" ")[1].split(":");
    dateParts[2] = dateParts[2].split(" ")[0];
    // month is 0-based, that's why we need dataParts[1] - 1
    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
}

}

module.exports = new ScheduleController();