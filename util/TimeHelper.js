// helper for prettifying dates
const prettifyDate = (date) => {
	const months = [
	 'January',
	 'February',
	 'March',
	 'April',
	 'May',
	 'June',
	 'July',
	 'August',
	 'September',
	 'October',
	 'November',
	 'December'
	]
	
	date = new Date(date);
	return `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
} 


// helper for calculating time, days, months, years its has been since a date
const timeSinceDate = (date) => {
	d1 = new Date(date);
	d2 = new Date();
	let time;

	const DateDiff = { 
		inSeconds: function (d1, d2) {
		 let t2 = d2.getTime()
		 let t1 = d1.getTime()
		 return parseInt((t2-t1)/1000)
		},
		inMinutes: function (d1, d2) {
		 let t2 = d2.getTime()
		 let t1 = d1.getTime()
		 return parseInt((t2-t1)/(60*1000))
		},
		inHours: function (d1, d2) {
		 let t2 = d2.getTime()
		 let t1 = d1.getTime()
		 return parseInt((t2-t1)/(60*60*1000))
		},
		inDays: function(d1, d2) { 
			let t2 = d2.getTime(); 
			let t1 = d1.getTime(); 
			return parseInt((t2-t1)/(24*3600*1000)); 
		}, 
		inWeeks: function(d1, d2) { 
			let t2 = d2.getTime(); 
			let t1 = d1.getTime(); 
			return parseInt((t2-t1)/(24*3600*1000*7)); 
		}, 
		inMonths: function(d1, d2) {
			d1 = new Date(d1)
			d2 = new Date(d2)
			let d1Y = d1.getFullYear(); 
			let d2Y = d2.getFullYear(); 
			let d1M = d1.getMonth(); 
			let d2M = d2.getMonth(); 
			return (d2M+12*d2Y)-(d1M+12*d1Y); 
		}, 
		inYears: function(d1, d2) { 
			d1 = new Date(d1)
			d2 = new Date(d2)
			return d2.getFullYear()-d1.getFullYear(); 
		} 
	}
	
	if (!time && DateDiff.inSeconds(d1, d2) < 60) {
	 time = DateDiff.inSeconds(d1, d2) > 1 ? DateDiff.inSeconds(d1, d2) + ' seconds' : 'a second';
	}
	
	if (!time && DateDiff.inMinutes(d1, d2) < 60) {
		time = DateDiff.inMinutes(d1, d2) > 1 ? DateDiff.inMinutes(d1, d2) + ' minutes' : 'a minute';
	}
	
	if (!time && DateDiff.inHours(d1, d2) < 24) {
		time = DateDiff.inHours(d1, d2) > 1 ? DateDiff.inHours(d1, d2) + ' hours' : 'an hour';
	}
	
	if (!time && DateDiff.inDays(d1, d2) < 7) {
		time = DateDiff.inDays(d1, d2) > 1 ? DateDiff.inDays(d1, d2) + ' days' : 'a day';
	}
	
	if (!time && DateDiff.inWeeks(d1, d2) < 4) {
		time = DateDiff.inWeeks(d1, d2) > 1 ? DateDiff.inWeeks(d1, d2) + ' weeks' : 'a week';
	}
	
	if (!time && DateDiff.inMonths(d1, d2) < 12) {
		time = DateDiff.inMonths(d1, d2) > 1 ? DateDiff.inMonths(d1, d2) + ' months' : 'a month';
	}
	
	if (!time && DateDiff.inYears(d1, d2)) {
		time = DateDiff.inYears(d1, d2) > 1 ? DateDiff.inYears(d1, d2) + ' years' : 'a year';
	}
	
	return time;
}

exports.prettifyDate = prettifyDate;
exports.timeSinceDate = timeSinceDate;