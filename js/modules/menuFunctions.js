
/*export const modalSaannostely = () => {
    let tiedot="<b>asd</b>"
    new AWN().modal(tiedot);
}*/

export const modalInfo = () => {
    let tiedot="<p style='font-size: large; text-align: center;'>Järvikartta tehtiin Metropolian tieto- ja viestintätekniikan opintojen yhteydessä.<br><br>" +
                "Projekti löytyy <a style='color: blue;' href='https://github.com/Tupsu-jy/Jarvikartta' target='!blank'>Githubista.</a><br><br>" +
                "Projektin toteuttivat: <br>Jaakko Ylinen<br>Jaakko Hotti<br>Matias Mäkelä<br>Nikita Essine</p>"
    new AWN().modal(tiedot);
}

export const modalOhje = () => {
    let tiedot="<p style='font-size: large; text-align: center;'>Voit hakea järviä ja niistä löytyviä tietoja suoran kartalta hiiren painalluksella tai sitten " +
        " voit hakea järviä joko kunnan tai järven nimellä hakukenttää käyttäen.<br><br>"+
                "Top20 valikosta löydät suomen järvistä ne 20 joilla valitsemasi arvo on suurin.<br><br>"+
                "Reitinhakuun pääset käsiksi painamalla \"Hae reitti\"-nappia jonkin järven markkerissa.</p>";
    new AWN().modal(tiedot);
}