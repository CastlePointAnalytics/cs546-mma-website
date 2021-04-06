const usersRoutes = require('./users');
const fightCardsRoutes = require('./fightCards');
const messagesRoutes = require('./messages');
const fightersRoutes = require('./fighters');
const fullCardDistributionsRoutes = require('./fullCardDistributions');

const constructorMethods = (app) => {
	app.use('/users', usersRoutes);
	app.use('/fightCards', fightCardsRoutes);
	app.use('/messages', messagesRoutes);
	app.use('/fighters', fightersRoutes);
	app.use('/fullCardDistributions', fullCardDistributionsRoutes);

	app.use('*', (req, res) => {
		res.status(404).json({ error: 'Not found' });
	});
};

module.exports = constructorMethods;
