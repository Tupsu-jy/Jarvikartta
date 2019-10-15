const getSaannostely = async lake => {
    ///api/jarvirajapinta/1.0/odata/JarviSaannostely(Jarvi_Id=1,Saannostely_Id=245)/Saannostely
    //https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi

    let url = "https://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/JarviSaannostely(Jarvi_Id="+lake.Jarvi_Id+",Saannostely_Id="+lake.JarviSaannostely[0].Saannostely_Id+")/Saannostely"

    try {
        const response = await fetch(url)
        const responseJSON = await response.json()
        return responseJSON
    } catch (e) {
        console.log(e)
    }
}

export default getSaannostely