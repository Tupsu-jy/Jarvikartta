import getLakes from "../services/jarviAPI.js"
import map from "../main.js"
import { sisaltoToString, setCurrentPosition, currentLat, currentLong } from "../helpers/mapHelpers.js"

navigator.geolocation.getCurrentPosition(setCurrentPosition)

const lakeAPI =
    "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi"

const markerLayer = L.layerGroup().addTo(map)

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
    markLakes(url)
})

const zoomaa = e => {
    let nyk = map.getCenter()
    if (nyk.lat == e.popup._latlng.lat && nyk.lng == e.popup._latlng.lng) {
        map.setView([61.92, 25.74], 6)
    } else {
        map.setView([e.popup._latlng.lat, e.popup._latlng.lng], 12)
    }
}

const haeReitti = async e => {
    let start = new Date().getTime()
    let haku = null
    let onkokartta = false

    while (start + 3000 > new Date().getTime()) {}

    start = new Date().getTime()

    if (onkokartta == false) {
        haku = L.Routing.control({
            waypoints: [
                L.latLng(currentLat, currentLong),
                L.latLng(e.popup._latlng.lat, e.popup._latlng.lng)
            ],
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim()
        }).addTo(map)
    } else {
        haku.setWaypoints([
            L.latLng(currentLat, currentLong),
            L.latLng(e.popup._latlng.lat, e.popup._latlng.lng)
        ])
    }
    onkokartta = true
}

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

document.getElementById("select").addEventListener('change', changeSearch);

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

document.getElementById("form").addEventListener("submit", searchLakes, true)

const markLakes = async (url, method) => {
    const lakes = await getLakes(url)
    let number = 1
    let marker = null
    markerLayer.clearLayers()
    for (let lake of lakes.value) {
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
            marker = L.marker([lake.KoordErLat, lake.KoordErLong], {
                title: lake.Nimi
            }).addTo(markerLayer)
        }

        let sisalto = sisaltoToString(lake)

        let popup = L.responsivePopup({ autoPanPadding: [15, 15] }).setContent(
            sisalto
        )

        marker.bindPopup(popup).on("popupopen", e => {
            document
                .getElementById("haeReitti")
                .addEventListener("click", () => haeReitti(e))
            document
                .getElementById("zoomaa")
                .addEventListener("click", () => zoomaa(e))
        })
    }
    marker.openPopup()
}
