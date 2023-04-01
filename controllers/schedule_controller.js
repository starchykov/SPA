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
            let zoomLink;
            const eDate = this._strToDate(`${el.coupleDate} ${el.coupleTime}:00`);

            if (el.coupleDescription.includes('Чеканова')) zoomLink = 'https://us04web.zoom.us/j/3229302405?pwd=Z2xTWTFLTmJGeFM2OFZEMUM5Q0pFQT09';
            if (el.coupleDescription.includes('Макарова')) zoomLink = 'https://us05web.zoom.us/j/85918007179?pwd=Q2RKdTNkNE9TZUZLaXFVOWo3TkVMZz09';
            if (el.coupleDescription.includes('Семенченко')) zoomLink = 'https://us02web.zoom.us/j/8720394866?pwd=eTdVbVpwZWQwelZnNEtwMzlHYkdJQT09';
            if (el.coupleDescription.includes('Філатова')) zoomLink = 'https://us04web.zoom.us/j/75485462349?pwd=975DZwH1mMQstdY3fP2p1inE86QUYG.1#success';
            if (el.coupleDescription.includes('Тарасенко')) zoomLink = 'https://us04web.zoom.us/j/4111878979?pwd=TjIyMFFVUjZzelZPU0ZQTmp3RjJGZz09';

            events.push({
                uid: `${el.coupeNumber + eDate.toISOString()}`,
                title: el.coupleDescription,
                description: el.coupleDescription,
                location: 'V. N. Karazin Kharkiv National University, Kharkiv, UA',
                url: zoomLink,
                geo: {lat: 50.00422968362318, lon: 36.22794578825089, radius: 100},
                categories: ['event'],
                start: [eDate.getFullYear(), eDate.getMonth() + 1, eDate.getDate(), eDate.getHours(), eDate.getMinutes()],
                duration: {hours: 1, minutes: 20},
                status: 'CONFIRMED',
                productId: 'GENERATOR',
            });
        });

        const getIcs = feedUrl => generateIcs('Schedule AK-11M', events, feedUrl)

        response.header({'content-type': 'text/calendar'});
        response.status(200);
        response.send(getIcs());
    }

    _parseSchedulePage = async (url) => {
        const couplesList = [];

        const response = await axios.get(url, {responseType: "arraybuffer"});

        const html = iconv.decode(response.data, "win1251");

        const $ = cheerio.load(html);



        $('.table').each(function (i, elem) {

            /// Schedule date
            const date = $(elem).closest('div.col-md-6').find('h4').text().split(' ')[0];

            /// Schedule row
            const scheduleTable = $(elem).children();

            const tableRows = scheduleTable.children();

            let couple = {};

            $(tableRows).each(function (i, row) {
                /// Schedule row item number
                const rowItemNumber = $(row).children()[0];
                /// Schedule row item number
                const rowItemDate = $(row).children()[1];
                /// Schedule row item number
                const rowItemCouple = $(row).children()[2];

                /// Set values to the DTO
                couple.coupeNumber = rowItemNumber.children[0].data;
                couple.coupleDate = date;
                couple.coupleTime = rowItemDate.children[0].data;
                couple.coupleDescription = $(rowItemCouple.children).text();
                couplesList.push(couple);
            });

        });

        return couplesList;
    }

    /// Convert from dd.mm.yyyy hh.mm.ss to Date format. Notify that month starts from 0.
    _strToDate = (dtStr) => {
        console.log(dtStr);
        if (!dtStr) return null
        let date = dtStr.split(' ');
        let dateParts = date[0].split('.');
        let timeParts = date[1];
        return new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]} ${timeParts} GMT+0300`);
    }

}

module.exports = new ScheduleController();