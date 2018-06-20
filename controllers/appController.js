var axios = require('axios')
var db = require('../models')

var exports = module.exports = {}


exports.search = function (req, res) {

	db.jobs.findAll({ where: { saved: false, user: req.user.id } }).then(data => {
		var resObj = {
			url: "/search",
			results: data
		}
		res.send(resObj)
	})

}

exports.saved = function (req, res) {
	console.log("___________________")
	db.jobs.findAll({ where: { saved: true, user: req.user.id } }).then(data => {
		var resObj = {
			url: "/saved",
			results: data
		}
		res.send(resObj)
	})

}

exports.tasks = function (req, res) {
	var job = req.query.job
	db.tasks.findAll({ where: { job: job } }).then(data => {
		res.send(data)
	})

}

exports.submitSearch = function (req, res) {
	db.jobs.destroy({ where: { saved: false, user: req.user.id } }).then(function () {
		var search = req.query.q;
		axios
			.get(`https://authenticjobs.com/api/?api_key=7aa3eac14c96fe5c4fe58dc504d956e0&method=aj.jobs.search&keywords=${search}&format=json`)
			.then(({
				data: {
					listings
				}
			}) => {
				var results = []
				for (var i = 0; i < listings.listing.length; i++) {
					var job = listings.listing[i]
					var job_id = parseInt(job.id)
					var jobs = []
					db.jobs.findOrCreate({
						where: { job_id: job_id, user: req.user.id }, defaults: {
							title: job.title,
							description: job.description,
							post_date: job.post_date,
							company_name: job.company_name,
							company_state: job.company_state,
							keywords: job.keywords,
							apply_url: job.apply_url,
							company_url: job.company_url,
							user: req.user.id,
							job_id: job_id,
						}
					}).then(newJob => {
						jobs.push(newJob)
						console.log(`title ${newJob.title}, with id ${newJob.id} has been created.`);
						if (jobs.length == listings.listing.length) {
							res.send()
						}
					});
				}
			})
			.catch(err => res.status(422).json(err));
	})
}

exports.noUserSearch = function (req, res) {
	var search = req.query.q;
	console.log("!")
	axios
		.get(`https://authenticjobs.com/api/?api_key=7aa3eac14c96fe5c4fe58dc504d956e0&method=aj.jobs.search&keywords=${search}&format=json`)
		.then(function(data) {res.send(data.data.listings.listing)})
		.catch(err => res.status(422).json(err));
}

exports.saveJob = function (req, res) {
	var id = req.query.id
	db.jobs.update({ saved: true }, { where: { id: id } }).then((data) => {
		res.send(data)
	})
}

exports.deleteJob = function (req, res) {
	var id = req.query.id
	db.jobs.update({ saved: false }, { where: { id: id } }).then((data) => {
		var resObj = {
			url: "/search",
			results: data
		}
		res.send(resObj)
	})
}

exports.addTask = function (req, res) {
	var task = req.query.task
	var job = req.query.job
	db.tasks.create({ task: task, job: job }).then((data) => { res.send(data) })
}

exports.removeTask = function (req, res) {
	var id = req.query.id
	db.tasks.destroy({ where: { id: id } }).then(() => { res.send() })
}

exports.logout = function (req, res) {
	req.logout()
	req.session.destroy(function (err) {
		res.send()
	});
}