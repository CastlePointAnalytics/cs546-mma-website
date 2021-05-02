const usersRoutes = require("./users");
const fightCardsRoutes = require("./fightCards");
const messagesRoutes = require("./messages");
const fightersRoutes = require("./fighters");
const fullCardDistributionsRoutes = require("./fullCardDistributions");
const data = require("../data");
const fightersData = data.fighters;
const fightCardsData = data.fightCards;

const constructorMethods = (app) => {
    app.use("/users", usersRoutes);
    app.use("/fightCards", fightCardsRoutes);
    app.use("/messages", messagesRoutes);
    app.use("/fighters", fightersRoutes);
    app.use("/fullCardDistributions", fullCardDistributionsRoutes);

    app.get("/", async (req, res) => {
        try {
            // get fighters
            let fighters = await fightersData.getAllFighters();
            // get most recent fightCard
            let mostRecentFightCard = await fightCardsData.getMostRecentFightCard();
            // get 5 closest upcoming fights
            let upcomingFights = await fightCardsData.getUpcomingFightCards();
            // renders the landing page using handlebars
            res.render("landings/fighters", {
                fighters: await fighters.toArray(),
                mostRecent: mostRecentFightCard,
                upcoming: upcomingFights,
            });
        } catch (e) {
            console.log(e);
            res.status(403).json({
                error: "Could not load data from endpoint.",
            });
        }
    });

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethods;
