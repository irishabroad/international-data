const fs = require('fs');
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const managers = JSON.parse(fs.readFileSync('../data/managers.json', 'utf-8')).managers;

const getManagerById = (managerId) => managers.find(m => m.id === managerId);

const getManagerByDate = (date) => managers.find(m => {
	date = dayjs.isDayjs(date) ? date : dayjs(date);
	return m.reigns.some(r => {
		const startDate = dayjs(r.startDate + "T12:00:00");
		// If the manager object does not have an endDate attribute (i.e. the current manager)
		// use today as the end date
		const endDate = r.endDate ? dayjs(r.endDate + "T12:00:00") : dayjs();
		return startDate.isSameOrBefore(date) && endDate.isSameOrAfter(date);
	})
});

exports.getManagerById = getManagerById;
exports.getManagerByDate = getManagerByDate;