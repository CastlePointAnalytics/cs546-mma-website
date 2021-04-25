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
            // get most recent fightCards
            let mostRecentFightCard = await fightCardsData.getMostRecentFightCard();
            let upcomingFights = await fightCardsData.getUpcomingFightCards();
            res.render("landings/fighters", {
                fighters,
                mostRecent: mostRecentFightCard,
                upcoming: upcomingFights,
            });
        } catch (e) {
            console.log(e);
        }
    });

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethods;
