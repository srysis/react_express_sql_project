function findDifferenceInSeconds(content_date, current_date) {
	let ms_difference = (current_date.getTime() - content_date.getTime()) / 1000;

	return Math.abs(Math.floor(ms_difference));
}

function findDifferenceInMinutes(content_date, current_date) {
	let ms_difference = (current_date.getTime() - content_date.getTime()) / 1000;
	ms_difference /= 60;

	return Math.abs(Math.floor(ms_difference));
}

function findDifferenceInHours(content_date, current_date) {
	let ms_difference = (current_date.getTime() - content_date.getTime()) / 1000;
	ms_difference /= (60 * 60);

	return Math.abs(Math.floor(ms_difference));
}

function findDifferenceInDays(content_date, current_date) {
	const MS_PER_DAY = 1000 * 60 * 60 * 24;

	const post_date_UTC = Date.UTC(content_date.getFullYear(), content_date.getMonth(), content_date.getDate());
	const current_date_UTC = Date.UTC(current_date.getFullYear(), current_date.getMonth(), current_date.getDate());

	return Math.abs(Math.floor((current_date_UTC - post_date_UTC) / MS_PER_DAY));
}

function findDifferenceInMonths(content_date, current_date) {
	let ms_difference = (current_date.getTime() - content_date.getTime()) / 1000;
	ms_difference /= (60 * 60 * 24 * 7 * 4);

	return Math.abs(Math.floor(ms_difference));
}

function findDifferenceInYears(content_date, current_date) {
	let ms_difference = (current_date.getTime() - content_date.getTime()) / 1000;
	ms_difference /= (60 * 60 * 24);

	return Math.abs(Math.floor(ms_difference / 365.25));
}

function findDifferenceBetweenDates(content_date, current_date) {
	let date_difference = undefined;

	let difference_days = findDifferenceInDays(content_date, current_date);

	if (difference_days > 31) {
		let difference_months = findDifferenceInMonths(content_date, current_date);

		if (difference_months > 12) {
			let difference_years = findDifferenceInYears(content_date, current_date);

			date_difference = difference_years == 1 ? `${difference_years} year ago` : `${difference_years} years ago`;
		} else {
			date_difference = difference_months == 1 ? `${difference_months} month ago` : `${difference_months} months ago`;
		}
	} else if (difference_days <= 0) {
		let difference_minutes = findDifferenceInMinutes(content_date, current_date);

		if (difference_minutes >= 60) {
			let difference_hours = findDifferenceInHours(content_date, current_date);

			date_difference = difference_hours == 1 ? `${difference_hours} hour ago` : `${difference_hours} hours ago`;
		} else if (difference_minutes <= 0) {
			let difference_seconds = findDifferenceInSeconds(content_date, current_date);

			if (difference_seconds != 0) {
				date_difference = difference_seconds == 1 ? `${difference_seconds} second ago` : `${difference_seconds} seconds ago`;
			} else {
				date_difference = 'just now';
			}
			
		} else {
			date_difference = difference_minutes == 1 ? `${difference_minutes} minute ago` : `${difference_minutes} minutes ago`;
		}
	} else {
		date_difference = difference_days == 1 ? `${difference_days} day ago` : `${difference_days} days ago`;
	}

	return date_difference;
}

module.exports = findDifferenceBetweenDates;