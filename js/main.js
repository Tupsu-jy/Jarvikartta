const lakeAPI =
    "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi"

const map = L.map("map").setView([61.92, 25.74], 6)
const markerLayer = L.layerGroup().addTo(map)

let haku = null
let onkokartta = false

let currentLat = null
let currentLong = null

let form = document.getElementById("form")

const setCurrentPosition = position => {
    currentLat = position.coords.latitude
    currentLong = position.coords.longitude
}

const zoomaa = (lat, lng) => {
    let nyk = map.getCenter()
    if (nyk.lat == lat && nyk.lng == lng) {
        map.setView([61.92, 25.74], 6)
    } else {
        map.setView([lat, lng], 12)
    }
}

navigator.geolocation.getCurrentPosition(setCurrentPosition)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

const changeSearch = () => {
    const selectValue = document.getElementById("select").value
    if (selectValue === "Tilavuus") {
        markLakes(lakeAPI + "?$top=20&$orderby=Tilavuus desc", "top")
    } else if (selectValue === "Syvyys") {
        markLakes(lakeAPI + "?$top=20&$orderby=SyvyysSuurin desc", "top")
    } else if (selectValue === "Vesiala") {
        markLakes(lakeAPI + "?$top=20&$orderby=Vesiala10000 desc", "top")
    } else if (selectValue === "Rantaviiva") {
        markLakes(lakeAPI + "?$top=20&$orderby=Rantaviiva10000 desc", "top")
    }
}

const getLakes = async url => {
    url += "&$expand=JarviSaannostely"
    try {
        const response = await fetch(url)
        const responseJSON = await response.json()
        return responseJSON
    } catch (e) {
        console.log(e)
    }
}

const searchLakes = e => {
    e.preventDefault()
    const searchValue = document.getElementById("input").value
    const url =
        lakeAPI +
        "?$top=10&$filter=tolower(Nimi) eq tolower('" +
        searchValue +
        "')"
    markLakes(url)
    const url2 =
        lakeAPI + "?$top=100&$filter=KuntaNimi eq '" + searchValue + "'"
    /*console.log(lakeAPI + "?$top=100&$filter=KuntaNimi eq '" + searchValue+"'")*/
    markLakes(url2)
}

form.addEventListener("submit", searchLakes, true)

const markLakes = async (url, method) => {
    const lakes = await getLakes(url)
    let number = 1
    let marker = null
    markerLayer.clearLayers()
    for (lake of lakes.value) {
        if (method === "top") {
            let icon = L.divIcon({
                className: "top",
                html: "<div>" + number + ".</div>"
            })
            marker = L.marker([lake.KoordErLat, lake.KoordErLong], {
                icon
            }).addTo(markerLayer)
            number++
        } else {
            marker = L.marker([lake.KoordErLat, lake.KoordErLong], {title: lake.Nimi}).addTo(
                markerLayer
            )
        }

        let sisalto = sisaltoToString(lake)

        let popup = L.responsivePopup({ autoPanPadding: [15, 15] }).setContent(
            sisalto
        )

        marker.bindPopup(popup).openPopup()
    }
}

const sisaltoToString = lake => {
    let sisalto =
        "<div class='popup'>" +
        "<b>" +
        lake.Nimi +
        "</b><br>Kunta: " +
        lake.KuntaNimi +
        "<br><br><details><summary class='summary'><b>Yleinen info</b></summary>" +
        "Järven pinta-ala: " +
        lake.Vesiala10000 +
        " ha<br>" +
        "Rantaviivaa: " +
        lake.Rantaviiva10000 +
        " km<br>"

    if (lake.SyvyysKeski)
        sisalto += "Syvyys keskimäärin: " + lake.SyvyysKeski + " m<br> "
    if (lake.SyvyysSuurin)
        sisalto += "Suurin syvyys: " + lake.SyvyysSuurin + " m<br>"
    if (lake.Tilavuus) sisalto += "Tilavuus: " + lake.Tilavuus + " m³"

    sisalto += "</details>"

    if (lake.JarviSaannostely[0]) {
        saannostelyObj = lake.JarviSaannostely[0]
        let saannostelyStr = ""

        if (saannostelyObj.Tarkoitus)
            saannostelyStr += "Tarkoitus: " + saannostelyObj.Tarkoitus

        if (saannostelyObj.VuosiAlku && !saannostelyObj.VuosiAlku.trim() === "")
            saannostelyStr +=
                "<br>Säännöstelyn aloitusvuosi: " + saannostelyObj.VuosiAlku

        if (saannostelyObj.AsteikkoQ)
            saannostelyStr +=
                "<br>Virtaamahavaintoasteikko: " + saannostelyObj.AsteikkoQ

        if (saannostelyObj.AsteikkoW)
            saannostelyStr +=
                "<br>Vedenkorkeushavaintoasteikko: " + saannostelyObj.AsteikkoW

        if (saannostelyObj.Lisatieto)
            saannostelyStr += "<br>Lisatietoa: " + saannostelyObj.Lisatieto

        if (saannostelyStr !== "")
            sisalto +=
                "<details><summary class='summary'><b>Säännöstely</b></summary>" +
                saannostelyStr +
                "</details>"
    }

    sisalto +=
        "<br><div class='button'><a href='https://maps.google.com/?q=" +
        lake.KoordErLat +
        "," +
        lake.KoordErLong +
        "' target='!blank'>Google Maps</a></div>" +
        '<br><button class="button" type="button" onclick="haeReitti(lake.KoordErLat, lake.KoordErLong)">Hae reitti</button>' +
        '<br><button class="button" type="button" onclick="zoomaa(lake.KoordErLat, lake.KoordErLong)">Zoomaa</button>' +
        "</div>"
    return sisalto
}

map.on("click", function(e) {
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
    markLakes(url)
})
Helsinkilat = 60.192059
Helsinkilon = 24.945831
let start = new Date().getTime()

const haeReitti = (Llat, Llon) => {
    while (start + 3000 > new Date().getTime()) {}
    start = new Date().getTime()
    if (onkokartta == false) {
        haku = L.Routing.control({
            waypoints: [
                L.latLng(currentLat, currentLong),
                L.latLng(Llat, Llon)
            ],
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim()
        }).addTo(map)
    } else {
        haku.setWaypoints([
            L.latLng(currentLat, currentLong),
            L.latLng(Llat, Llon)
        ])
    }
    onkokartta = true
}
