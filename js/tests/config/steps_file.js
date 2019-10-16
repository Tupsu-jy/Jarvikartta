const api = require("../mocks/api")
// in this file you can append custom step methods to 'I' object

module.exports = function() {
    return actor({
        // Define custom steps here, use 'this' to access default methods of I.
        // It is recommended to place a general 'login' function here.

        clickOnMap: function(mock = false, lakes) {
            if (mock) {
                if (lakes === 0) {
                    this.mockRequest(
                        "GET",
                        "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi/",
                        api.mockEmptyLake,
                        200
                    )
                } else if (lakes === 1) {
                    this.mockRequest(
                        "GET",
                        "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi/",
                        api.mockOneLake,
                        200
                    )
                }
            }
            this.click({ css: "#map" })
        },

        getCurrentView: async function() {
            const view = await this.grabCssPropertyFrom(
                { css: "div.leaflet-proxy.leaflet-zoom-animated" },
                "transform"
            )
            return view
        }
    })
}
