const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	if (req.session.user) {
		const userFullName = `${req.session.user.firstName} ${req.session.user.lastName}`;
		req.session.destroy();
		res.render('user/logout', { user: userFullName });
	} else {
		res.status(403).render('user/login');
	}
});

module.exports = router;
