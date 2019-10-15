const api = require("../mocks/api") // Mocks are used when the actual result of a call is irrelevant
// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.

    clickOnMap: function (mock = false) {
        if (mock) this.mockRequest('GET', 'https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi/', api.mockLake, 200)
        this.click({ css: "#map" })
    }

  });
}
