
Feature("Map")

Before((I) => {
    I.amOnPage("http://localhost:5500")
});

Scenario("After clicking on the map, I can see markers and a circle", async I => {
    I.clickOnMap(true)

    I.waitForElement({ css: "div.popup" }, 5)

    I.waitForElement({ css: "svg.leaflet-zoom-animated g"}, 5)
})

Scenario("Search for municipiality", I => {
    I.fillField({ css: "#input" }, "Espoo")
    I.click({ css: "div.haku form#form input.button" }) // hae

    I.waitForElement({ css: "div.popup" }, 5)

    I.see("Espoo")
    I.see("Pentalanjärvi")
})

Scenario("Search for a lake", I => {
    I.fillField({ css: "#input" }, "Saimaa")
    I.click({ css: "div.haku form#form input.button" }) // hae

    I.waitForElement({ css: "div.popup" }, 5)

    I.see("Saimaa")
    I.see("Taipalsaari")
})

Scenario("Top20", I => {
    I.selectOption({ css: "#select" }, "Tilavuus")

    I.waitForElement({ css: "div.popup" }, 5)

    I.see("Kuopio")
    I.see("Kallavesi")
})

