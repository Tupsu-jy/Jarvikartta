const assert = require("assert")

Feature("Popup")

Before(I => {
    I.amOnPage("http://localhost:5500")
})

Scenario("Routing", I => {
    I.clickOnMap(true, 1)

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
    I.clickOnMap(true, 1)

    I.waitForElement({ css: "div.popup" }, 5)

    I.click(locate({ css: ".button" }).withText("Google Maps"))
    I.wait(5)
    let tabs = await I.grabNumberOfOpenTabs()

    assert.equal(tabs, 2)
})

Scenario("Zoom", async I => {
    I.clickOnMap(true, 1)

    I.waitForElement({ css: "div.popup" }, 5)

    I.click(locate({ css: ".button" }).withText("Zoom"))

    const viewAt = await I.getCurrentView()
    assert.equal(viewAt, "matrix(2048, 0, 0, 2048, 599453, 286038)")
})
