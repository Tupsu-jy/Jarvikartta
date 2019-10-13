import { markLakes, changeSearch, searchLakes } from "./modules/mapFunctions.js"
import { setCurrentPosition } from "./helpers/mapHelpers.js"

export const lakeAPI = "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi"
export const map = L.map("map").setView([61.92, 25.74], 6)
export const markerLayer = L.layerGroup().addTo(map)
export const circleLayer = L.layerGroup().addTo(map)

navigator.geolocation.getCurrentPosition(setCurrentPosition)

document.getElementById("select").addEventListener('change', changeSearch);
document.getElementById("form").addEventListener("submit", searchLakes)

map.on("click", e => {
    let coord = e.latlng
    let lat = coord.lat
    let long = coord.lng
    const latGt = lat - 0.03
    const latLt = lat + 0.03
    const longGt = long - 0.07
    const longLt = long + 0.07

    const url =
        lakeAPI +
        "?$top=100&$filter=KoordErLong gt '" +
        longGt +
        "' and KoordErLong lt '" +
        longLt +
        "' and KoordErLat gt '" +
        latGt +
        "' and KoordErLat lt '" +
        latLt +
        "'"
    circleLayer.clearLayers()
    L.circle([lat, long], { radius: 4400, opacity: 0.3 }).addTo(circleLayer)
    markLakes(url, "click")
})

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)
