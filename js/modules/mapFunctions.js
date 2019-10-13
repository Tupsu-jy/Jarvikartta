import getLakes from "../services/jarviAPI.js"
import { map, markerLayer, circleLayer, lakeAPI } from "../main.js"
import { sisaltoToString, setViewAt } from "../helpers/mapHelpers.js"
import { zoomaa, haeReitti } from "./popupFunctions.js"

export const changeSearch = async () => {
    const selectValue = document.getElementById("select").value
    if (selectValue === "Tilavuus") {
        const tilavuusLakes = await markLakes(lakeAPI + "?$top=20&$orderby=Tilavuus desc", "top")
        setViewAt(tilavuusLakes)
    } else if (selectValue === "Syvyys") {
        const syvyysLakes = await markLakes(lakeAPI + "?$top=20&$orderby=SyvyysSuurin desc", "top")
        setViewAt(syvyysLakes)
    } else if (selectValue === "Vesiala") {
        const vesialaLakes = await markLakes(lakeAPI + "?$top=20&$orderby=Vesiala10000 desc", "top")
        setViewAt(vesialaLakes)
    } else if (selectValue === "Rantaviiva") {
        const rantaviivaLakes = await markLakes(lakeAPI + "?$top=20&$orderby=Rantaviiva10000 desc", "top")
        setViewAt(rantaviivaLakes)
    }
}

export const searchLakes = async e => {
    e.preventDefault()
    const searchValue = document.getElementById("input").value
    const url =
        lakeAPI +
        "?$top=10&$filter=tolower(Nimi) eq tolower('" +
        searchValue +
        "')"
    const url2 =
        lakeAPI + "?$top=100&$filter=KuntaNimi eq '" + searchValue + "'"
    const nameLakes = await markLakes(url)
    const municipalityLakes = await markLakes(url2)
    if (nameLakes.value.length > municipalityLakes.value.length) {
        setViewAt(nameLakes)
    } else {
        setViewAt(municipalityLakes)
    }
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
    return lakes
}