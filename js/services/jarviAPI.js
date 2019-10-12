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

export default getLakes