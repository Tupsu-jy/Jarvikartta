const lakeAPI =
    "http://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi"

const map = L.map("map").setView([61.92, 25.74], 6)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

const getLakes = async (lat, long) => {
    console.log("got " + lat + " " + long)
    const latGt = lat - 0.1
    const latLt = lat + 0.1
    const longGt = long - 0.1
    const longLt = long + 0.1

    console.log(
        "latGt " +
            latGt +
            "  latLt " +
            latLt +
            "  longGt " +
            longGt +
            "  longLt " +
            longLt
    )

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
    try {
        const response = await fetch(url)
        const responseJSON = await response.json()
        return responseJSON
    } catch (e) {
        console.log(e)
    }
}
// TODO: remove previous markers b4 adding new ones
const markLakes = async (lat, long) => {
    const lakes = await getLakes(lat, long)
    for (lake of lakes.value) {
        console.log(lake)
        let marker = L.marker([lake.KoordErLat, lake.KoordErLong]).addTo(map)
        marker
            .bindPopup(
                "<div class='popup'>" +
                    "<b>" +
                    lake.Nimi +
                    "</b><br> Kunta: " +
                    lake.KuntaNimi +
                    "<br> Syvyys keskimäärin: " +
                    lake.SyvyysKeski +
                    " m<br> Suurin syvyys: " +
                    lake.SyvyysSuurin +
                    " m<br> Rantaviivaa: " +
                    lake.Rantaviiva10000 +
                    " km<br>Tilavuus: " +
                    lake.Tilavuus +
                    " m³<br> Järven pinta-ala: " +
                    lake.Vesiala10000 +
                    " ha<br><a href='https://maps.google.com/?q=" +
                    lake.KoordErLat +
                    "," +
                    lake.KoordErLong +
                    "' target='!blank'>Google Maps</a>" +
                    "</div>"
            )
            .openPopup()
    }
}

map.on("click", function(e) {
    let coord = e.latlng
    let lat = coord.lat
    let long = coord.lng
    markLakes(lat, long)
})
