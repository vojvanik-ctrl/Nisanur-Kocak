# Portrét pro galerii FMK

Hotový soubor: `portrait-stamp.png`.

- Export 1200 × 1500 px, poměr stran 4:5.
- PNG se skutečným alfa kanálem a průhledným pozadím.
- Detailní vícebarevná tisková ilustrace v omezené paletě uhlové, cihlové, břidlicově modré a lesní zelené.
- Výchozí fotografie: `assets/portrait/portrait-original.jpeg` v kořeni webu. Je zachována beze změny.
- Podle následného přání uživatele je portrét odzoomovaný a chybějící temeno a ramena jsou výtvarně doplněné. Obličej vychází z původní fotografie.

Kořenový `portfolio.json` obsahuje:

```json
"photoStamp": "assets/fmk/portrait-stamp.png"
```

Cesta je relativní k veřejnému `portfolio.json`, takže funguje také při publikování v podadresáři GitHub Pages. Portrét je určený pro společnou galerii a nenahrazuje hlavní kresbu ani původní fotografii na osobním webu.
