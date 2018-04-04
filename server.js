const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

app.get("/", (request, response) => {
	response.sendFile(__dirname + '/views/index.html');
});

app.get('/:date', (req, res) => {
	/**
	 * Converts month index to string.
	 * @param {number} number - month index.
	 * @return {string} month name.
	 */
	function getMonthName(number) {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];
		return months[number];
	}
	/**
	 * Converts month name to index.
	 * @param {string} name - name of month.
	 * @return {number} month number.
	 */
	function getMonthIndex(name) {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];
		return months.indexOf(name);
	}
	/**
	 * Timestamp microservice.
	 * @param {number|string} input - formatted date or timestamp.
	 * @return {object} object with unix timestamp and natural language date.
	 */
	function timestampMicroservice(input) {

		// If input is string
		if (typeof input === 'string') {
			let year = input.split(' ')[2];
			let month = input.split(' ')[0];
			let date = input.split(' ')[1];
			// 	If string date return unix timestamp and natural date.
			const yearPresent = year && year.match(/\d{4}/);
			const monthPresent = month && String(getMonthIndex(month)).match(/\d{1,2}/);
			const dayPresent = date && String(date).match(/\d{1,2}/);
			if (yearPresent && monthPresent && dayPresent) {
				const unixTime = new Date(`${year}-${month}-${date.replace(',','')}`).getTime() / 1000;
				return {
					unix: unixTime,
					natural: input
				};
			}
		}
		// 	If unix timestamp passes return unix timestamp and natural date.
		const validTimestamp = (new Date(+input)).getTime() > 0;

		if (validTimestamp) {
			const dateString = new Date(input * 1000);
			return {
				unix: input,
				natural: `${getMonthName(dateString.getMonth())} ${dateString.getDate()}, ${dateString.getFullYear()}`
			};
		}
		// 	If neither a valid string or a timestamp is provided, return nulls.
		return {
			unix: null,
			natural: null
		};
	}
	res.json(timestampMicroservice(req.params.date));
});

const listener = app.listen(process.env.PORT, () => {
	console.log(`Your app is listening on port ${listener.address().port}`);
});
