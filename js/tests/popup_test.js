const assert = require("assert")
const api = require("./mocks/api") // Mocks are used when the actual result of a call is irrelevant

Feature('Popup');

Before((I) => {
    I.amOnPage("http://localhost:5500")
});

Scenario("Routing", I => {
    I.clickOnMap(true)

    I.waitForElement({ css: "div.popup" }, 5)

    I.click(locate({ css: ".button" }).withText("Hae reitti"))

    I.waitForElement({ css: "div.leaflet-routing-geocoders" }, 5)

    I.fillField({ css: "div.leaflet-routing-geocoder input" }, "Helsinki")
    I.pressKey("Enter")
    I.wait(2)
    I.pressKey("Enter")

    I.waitForElement({ css: "div.leaflet-routing-alt" }, 5)
})

Scenario("Google Maps", async I => {
    I.clickOnMap(true)

    I.waitForElement({ css: "div.popup" }, 5)

    I.click(locate({ css: ".button" }).withText("Google Maps"))
    I.wait(3)
    let tabs = await I.grabNumberOfOpenTabs()

    assert.equal(tabs, 2)
})

Scenario("Zoom", async I => {
    I.clickOnMap(true)
    const zoomLevelBefore = await I.grabCssPropertyFrom(
        { css: "div.leaflet-proxy.leaflet-zoom-animated" },
        "transform"
    )
    assert.equal(zoomLevelBefore, "matrix(32, 0, 0, 32, 9363.46, 4577.83)")

    I.waitForElement({ css: "div.popup" }, 5)

    I.click(locate({ css: ".button" }).withText("Zoom"))

    const zoomLevelAfter = await I.grabCssPropertyFrom(
        { css: "div.leaflet-proxy.leaflet-zoom-animated" },
        "transform"
    )
    assert.equal(zoomLevelAfter, "matrix(2048, 0, 0, 2048, 599453, 286038)")
})

