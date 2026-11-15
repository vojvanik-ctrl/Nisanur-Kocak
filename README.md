# Nisanur Koçak | Portfolio

Statický web bez sestavení a instalace závislostí. Všechny obrázky i fonty jsou součástí balíčku.

## Nahrání na GitHub Pages

1. Rozbalte ZIP a nahrajte jeho obsah do složky, ze které již publikujete web. Soubor `index.html` musí být přímo v jejím kořeni. Nenahrávejte pouze samotný ZIP.
2. Zachovejte adresáře `assets/`, `css/`, `fonts/`, `js/` a `projects/` i kořenový `portfolio.json`.
3. Použijte stávající nastavení publikování. Web nepotřebuje nový hosting ani databázi.
4. Po zveřejnění otevřete `portfolio.json` na veřejné adrese vedle `index.html`, například přidáním `portfolio.json` za koncové lomítko skutečné adresy webu. Adresa zahrnuje také případný podadresář repozitáře.

## Profil pro společnou galerii FMK

`portfolio.json` je společný zdroj jména, studijního oboru a původní fotografie. Web ho načítá při otevření a přebírá jméno do záhlaví, zápatí, popisků portrétů a titulku stránky, obor do záhlaví a původní fotografii do sekce About. Statické HTML obsahuje výchozí hodnoty pro případ nedostupného JSONu. Při jejich ruční změně může být vhodné aktualizovat i výchozí HTML, které používají některé roboty a náhledy bez JavaScriptu.

Krátký český `bio` patří galerii; delší anglický text About zůstává samostatný. Texty projektů a jejich ilustrace se nemění.

Vyplněno: jméno, studijní obor, český popisek a skutečně existující původní fotografie.

Čeká na doplnění:

- `countryCode`: země, kterou chce autorka v galerii zobrazovat. Bez potvrzení zůstává `null`.
- `portfolioUrl`: skutečná veřejná HTTPS adresa včetně případného podadresáře. Bez potvrzení zůstává `null`.
- `photoStamp`: čeká na novou fotografii s celou hlavou. Stávající zdroj má oříznuté temeno a nesplňuje zadání pro ořez. Není vytvořen neexistující odkaz ani použitá jiná ilustrace jako náhrada.

Budoucí razítkový portrét patří do `assets/fmk/portrait-stamp.png`. Podrobnosti jsou v `assets/fmk/README.md`. Původní fotografie a kreslený portrét webu jsou zachovány.

## Lokální ověření

Z kořene projektu spusťte:

```sh
python3 -m http.server 8000
```

Otevřete `http://localhost:8000/` a `http://localhost:8000/portfolio.json`. Při otevření samotného HTML ze souborového systému může prohlížeč blokovat načtení JSONu; na webovém serveru ani na GitHub Pages to není potřeba řešit.

Balíček byl ověřen lokálně přes HTTP také v podadresáři. Zveřejněný web nebyl touto úpravou měněn ani kontrolován.
