# Nisanur Koçak | Portfolio

Statický web bez sestavení a instalace závislostí. Všechny obrázky i fonty jsou součástí balíčku.

## Nahrání na GitHub Pages

1. Rozbalte ZIP a nahrajte jeho obsah do složky, ze které již publikujete web. Soubor `index.html` musí být přímo v jejím kořeni. Nenahrávejte pouze samotný ZIP.
2. Zachovejte adresáře `assets/`, `css/`, `fonts/`, `js/` a `projects/` i kořenový `portfolio.json`.
3. Použijte stávající nastavení publikování. Web nepotřebuje nový hosting ani databázi.
4. Po zveřejnění otevřete `portfolio.json` na veřejné adrese vedle `index.html`, například přidáním `portfolio.json` za koncové lomítko skutečné adresy webu. Adresa zahrnuje také případný podadresář repozitáře.

## Profil pro společnou galerii FMK

`portfolio.json` je společný zdroj jména, studijního oboru a původní fotografie. Web ho načítá při otevření a přebírá jméno do záhlaví, zápatí, popisků portrétů a titulku stránky, obor do záhlaví a původní fotografii do sekce About. Statické HTML obsahuje výchozí hodnoty pro případ nedostupného JSONu. Při jejich ruční změně může být vhodné aktualizovat i výchozí HTML, které používají některé roboty a náhledy bez JavaScriptu.

Krátký anglický `bio` patří galerii; delší text About zůstává samostatný. Texty projektů a jejich ilustrace se nemění.

Vyplněno: jméno, studijní obor, anglický popisek, země (`countryCode`: `TR`), adresa v galerii (`portfolioUrl`: https://studentifmk.work/nisanur-kocak/), původní fotografie a hotový razítkový portrét.

Obor i popisek jsou anglicky, stejně jako celý web.

Razítkový portrét pro galerii je v `assets/fmk/portrait-stamp-v2.png` a je zapojený v `photoStamp`. Má 1200 × 1500 px, poměr 4:5 a skutečně průhledné pozadí. Podrobnosti jsou v `assets/fmk/README.md`. Původní fotografie, první verze portrétu a kreslený portrét webu jsou zachovány.

## Lokální ověření

Z kořene projektu spusťte:

```sh
python3 -m http.server 8000
```

Otevřete `http://localhost:8000/` a `http://localhost:8000/portfolio.json`. Při otevření samotného HTML ze souborového systému může prohlížeč blokovat načtení JSONu; na webovém serveru ani na GitHub Pages to není potřeba řešit.

Balíček byl ověřen lokálně přes HTTP také v podadresáři. Zveřejněný web nebyl touto úpravou měněn ani kontrolován.
