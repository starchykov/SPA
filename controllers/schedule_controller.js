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
            const eDate = this._strToDate(`${el.coupleDate} ${el.coupleTime}:00`);

            events.push({
                uid: `${el.coupeNumber + eDate.toISOString()}`,
                title: el.coupleDescription,
                description: el.coupleDescription,
                location: 'V. N. Karazin Kharkiv National University, Kharkiv, UA',
                url: 'https://online.karazin.ua:1443/cgi-bin/timetable.cgi?n=700&group=5750',
                geo: {lat: 50.00422968362318, lon: 36.22794578825089, radius: 100},
                categories: ['event'],
                start: [eDate.getFullYear(), eDate.getMonth() + 1, eDate.getDate(), eDate.getHours(), eDate.getMinutes()],
                duration: {hours: 1, minutes: 20},
                status: 'CONFIRMED',
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
            //console.log("Couple data: " + date)

            /// Schedule row
            const row = $(elem).closest('tr');

            /// Schedule row item number
            const rowItemNumber = $(row).children()[0];
            //console.log("Couple number: " + rowItemNumber.children[0].data)

            /// Schedule row item number
            const rowItemDate = $(row).children()[1];
            //console.log("Start: " + rowItemDate.children[0].data)

            /// Schedule row item number
            const rowItemCouple = $(row).children()[2];
            //console.log("Couple: " + $(rowItemCouple.children).text().split('Дистанційно')[1])

            let couple = {};
            couple.coupeNumber = rowItemNumber.children[0].data;
            couple.coupleDate = date;
            couple.coupleTime = rowItemDate.children[0].data;
            couple.coupleDescription = $(rowItemCouple.children).text().split('Дистанційно')[1];

            couplesList.push(couple);
        });

        return couplesList;
    }

    /// Convert from dd.mm.yyyy hh.mm.ss to Date format. Notify that month starts from 0.
    _strToDate = (dtStr) => {
        if (!dtStr) return null
        let date = dtStr.split(' ');
        let dateParts = date[0].split('.');
        let timeParts = date[1];
        return new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]} ${timeParts} GMT+0200`);
    }

}

module.exports = new ScheduleController();