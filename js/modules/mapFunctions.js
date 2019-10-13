import getLakes from "../services/jarviAPI.js"
import { map, markerLayer, circleLayer, lakeAPI } from "../main.js"
import { sisaltoToString } from "../helpers/mapHelpers.js"
import { zoomaa, haeReitti } from "./popupFunctions.js"

export const changeSearch = () => {
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

export const searchLakes = e => {
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

export const markLakes = async (url, method) => {
    const lakes = await getLakes(url)
    if (method !== "click") circleLayer.clearLayers()
    markerLayer.clearLayers()
    let number = 1
    let marker = null
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
                title: lake.Nimi,
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
    if (marker) marker.openPopup()
    if (method === "top") map.setView([61.92, 25.74], 6)
}