const loginRoutes = require("./login");
const logoutRoutes = require("./logout");
const signupRoutes = require("./signup");
const userRoutes = require("./user");
const fightCardsRoutes = require("./fightCards");
const messagesRoutes = require("./messages");
const fightersRoutes = require("./fighters");
const fullCardDistributionsRoutes = require("./fullCardDistributions");
const data = require("../data");
const userData = data.users;
const fightersData = data.fighters;
const fightCardsData = data.fightCards;

const constructorMethods = (app) => {
    app.use("/login", loginRoutes);
    app.use("/logout", logoutRoutes);
    app.use("/signup", signupRoutes);
    app.use("/user", userRoutes);
    app.use("/fightCards", fightCardsRoutes);
    app.use("/messages", messagesRoutes);
    app.use("/fighters", fightersRoutes);
    app.use("/fullCardDistributions", fullCardDistributionsRoutes);

	app.get('/', async (req, res) => {
		try {
			let notLogged = true;
			if(req.session.user){
				notLogged = false;
			}
			// get fighters
			let fighters = await fightersData.getAllFighters();
			// get most recent fightCard
			let mostRecentFightCard = await fightCardsData.getMostRecentFightCard();
			// get 5 closest upcoming fights
			let upcomingFights = await fightCardsData.getUpcomingFightCards();
			// renders the landing page using handlebars
			let globalUserStats = await userData.getGlobalUserStats();
			//console.log(globalUserStats);
			res.render('landings/fighters', {
				fighters: await fighters.toArray(),
				mostRecent: mostRecentFightCard,
				upcoming: upcomingFights,
				globalUserStats: globalUserStats,
				css: 'landing.css',
				notLoggedIn: notLogged
				// js: 'landing/globalUserStat.js',
			});
		} catch (e) {
			console.log(e);
			res.status(403).json({
				error: 'Could not load data from endpoint.',
			});
		}
	});

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethods;
