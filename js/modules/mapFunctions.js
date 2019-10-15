import getLakes from "../services/jarviAPI.js"
import getSaannostely from "../services/saannostelyAPI.js"
import { markerLayer, circleLayer, lakeAPI } from "../main.js"
import { sisaltoToString, setViewAtLakesAvg } from "../helpers/mapHelpers.js"
import { zoomaa, haeReitti } from "./popupFunctions.js"
import merge from "../libraries/lodash_merge.js"

export const changeSearch = async () => {
    const selectValue = document.getElementById("select").value
    if (selectValue === "Tilavuus") {
        const tilavuusLakes = await getLakes(
            lakeAPI + "?$top=20&$orderby=Tilavuus desc"
        )
        markLakes(tilavuusLakes, "top")
        setViewAtLakesAvg(tilavuusLakes)
    } else if (selectValue === "Syvyys") {
        const syvyysLakes = await getLakes(
            lakeAPI + "?$top=20&$orderby=SyvyysSuurin desc"
        )
        markLakes(syvyysLakes, "top")
        setViewAtLakesAvg(syvyysLakes)
    } else if (selectValue === "Vesiala") {
        const vesialaLakes = await getLakes(
            lakeAPI + "?$top=20&$orderby=Vesiala10000 desc"
        )
        markLakes(vesialaLakes, "top")
        setViewAtLakesAvg(vesialaLakes)
    } else if (selectValue === "Rantaviiva") {
        const rantaviivaLakes = await getLakes(
            lakeAPI + "?$top=20&$orderby=Rantaviiva10000 desc"
        )
        markLakes(rantaviivaLakes, "top")
        setViewAtLakesAvg(rantaviivaLakes)
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
    const nameLakes = await getLakes(url)
    const municipalityLakes = await getLakes(url2)
    const mergedLakes = merge(nameLakes, municipalityLakes)
    markLakes(mergedLakes)
    setViewAtLakesAvg(mergedLakes)
}

export const markLakes = async (lakes, method) => {
    if (method !== "click") circleLayer.clearLayers()
    markerLayer.clearLayers()
    let number = 1
    let marker = null
    let saannostely = null
    for (let lake of lakes.value) {
        if (lake.JarviSaannostely[0]) saannostely = await getSaannostely(lake)

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

        let sisalto = sisaltoToString(lake, saannostely)

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
}
