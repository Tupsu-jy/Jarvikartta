const assert = require("assert")

Feature("MapTest")

Scenario("After clicking on the map, I can see markers and a circle", I => {
    I.amOnPage("http://localhost:5500")
    I.click({ css: "#map" })

    I.waitForElement({ css: "div.popup" }, 5)

    I.waitForElement({ css: "svg.leaflet-zoom-animated g"}, 5)
})

Scenario("Search for municipiality", I => {
    I.amOnPage("http://localhost:5500")
    I.fillField({ css: "#input" }, "Espoo")
    I.click({ css: "div.haku form#form input.button" }) // hae

    I.waitForElement({ css: "div.popup" }, 5)

    I.see("Espoo")
    I.see("Pentalanjärvi")
})

Scenario("Search for a lake", I => {
    I.amOnPage("http://localhost:5500")
    I.fillField({ css: "#input" }, "Saimaa")
    I.click({ css: "div.haku form#form input.button" }) // hae

    I.waitForElement({ css: "div.popup" }, 5)

    I.see("Saimaa")
    I.see("Taipalsaari")
})

Scenario("Top20", I => {
    I.amOnPage("http://localhost:5500")
    I.selectOption({ css: "#select" }, "Tilavuus")

    I.waitForElement({ css: "div.popup" }, 5)

    I.see("Kuopio")
    I.see("Kallavesi")
})

Scenario("Google Maps", async I => {
    I.amOnPage("http://localhost:5500")
    I.click({ css: "#map" })

    I.waitForElement({ css: "div.popup" }, 5)

    I.click(locate({ css: ".button" }).withText("Google Maps"))
    I.wait(2)
    let tabs = await I.grabNumberOfOpenTabs()

    assert.equal(tabs, 2)
})

Scenario("Zoom", async I => {
    I.amOnPage("http://localhost:5500")
    const zoomLevelBefore = await I.grabCssPropertyFrom(
        { css: "div.leaflet-proxy.leaflet-zoom-animated" },
        "transform"
    )
    assert.equal(zoomLevelBefore, "matrix(32, 0, 0, 32, 9363.46, 4577.83)")
    I.click({ css: "#map" })

    I.waitForElement({ css: "div.popup" }, 5)

    I.click(locate({ css: ".button" }).withText("Zoom"))
    const zoomLevelAfter = await I.grabCssPropertyFrom(
        { css: "div.leaflet-proxy.leaflet-zoom-animated" },
        "transform"
    )
    assert.equal(zoomLevelAfter, "matrix(2048, 0, 0, 2048, 599409, 292906)")
})

Scenario("Routing", I => {
    I.amOnPage("http://localhost:5500")
    I.click({ css: "#map" })

    I.waitForElement({ css: "div.popup" }, 5)

    I.click(locate({ css: ".button" }).withText("Hae reitti"))

    I.waitForElement({ css: "div.leaflet-routing-geocoders" }, 5)

    I.fillField({ css: "div.leaflet-routing-geocoder input" }, "Helsinki")
    I.pressKey("Enter")
    I.wait(2)
    I.pressKey("Enter")

    I.waitForElement({ css: "div.leaflet-routing-alt" }, 5)
})
