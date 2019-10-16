const assert = require("assert")

Feature("Map")

Before(I => {
    I.amOnPage("http://localhost:5500")
})

Scenario(
    "After clicking on the map, I can see markers and a circle",
    async I => {
        I.clickOnMap(true, 1)

        I.waitForElement({ css: "div.popup" }, 5)

        I.waitForElement({ css: "svg.leaflet-zoom-animated g" }, 5)
    }
)

Scenario("Search for municipiality", async I => {
    I.fillField({ css: "#input" }, "Espoo")
    I.click({ css: "div.haku form#form input.button" }) // hae

    I.waitForElement({ css: "div.popup" }, 7) // 7s bcos there's alot of popup's to render

    I.see("Espoo")
    I.see("Pentalanjärvi")

    const viewAt = await I.getCurrentView()
    assert.equal(viewAt, "matrix(128, 0, 0, 128, 37228.1, 18848.2)")
})

Scenario("Search for a lake", async I => {
    I.fillField({ css: "#input" }, "Saimaa")
    I.click({ css: "div.haku form#form input.button" }) // hae

    I.waitForElement({ css: "div.popup" }, 5)

    I.see("Saimaa")
    I.see("Taipalsaari")

    const viewAt = await I.getCurrentView()
    assert.equal(viewAt, "matrix(128, 0, 0, 128, 37956.3, 18472.7)")
})

Scenario("Top20", I => {
    I.selectOption({ css: "#select" }, "Tilavuus")

    I.waitForElement({ css: "div.popup" }, 5)

    I.see("Kuopio")
    I.see("Kallavesi")
})

Scenario("Error is shown if no lakes were found", I => {
    I.clickOnMap(true, 0)
    I.see("Järviä ei löytynyt")
})
