$(document).ready(function () {
    var indiceActual = 0;
    var ultimosPaisesVisitados = [];
    function cargarPaises() {
        var filtroContinente = document.getElementById('continente').dataset.value;
        var filtroLenguaje = document.getElementById('lenguajes').dataset.value;
        var ordenCriterio = document.getElementById('ordenCriterio').dataset.value;
        var listaFiltros = document.getElementById('listaFiltros');
        listaFiltros.innerHTML = '';
        var continenteItem = document.createElement('li');
        switch (filtroContinente) {
            case "Americas":
                continenteItem.textContent = 'Continente: América';
                break;
            case "Africa":
                continenteItem.textContent = 'Continente: África';
                break;
            case "Europe":
                continenteItem.textContent = 'Continente: Europa';
                break;
            case "Oceania":
                continenteItem.textContent = 'Continente: Oceanía';
                break;
            case "Asia":
                continenteItem.textContent = 'Continente: Asia';
                break;
            default:
                continenteItem.textContent = 'Continente: Todos';
                break;
        }
        listaFiltros.appendChild(continenteItem);
        var idiomaItem = document.createElement('li');
        switch (filtroLenguaje) {
            case "English":
                idiomaItem.textContent = 'Idioma: Inglés';
                break;
            case "Spanish":
                idiomaItem.textContent = 'Idioma: Español';
                break;
            case "French":
                idiomaItem.textContent = 'Idioma: Francés';
                break;
            case "Chinese":
                idiomaItem.textContent = 'Idioma: Chino';
                break;
            case "Arabic":
                idiomaItem.textContent = 'Idioma: Árabe';
                break;
            default:
                idiomaItem.textContent = 'Idioma: Todos';
                break;
        }
        listaFiltros.appendChild(idiomaItem);
        var criterioItem = document.createElement('li');
        switch (ordenCriterio) {
            case "name":
                criterioItem.textContent = 'Criterio de ordenación: Alfabético';
                break;
            case "population":
                criterioItem.textContent = 'Criterio de ordenación: Habitantes';
                break;
            default:
                criterioItem.textContent = 'Criterio de ordenación: Alfabético';
        }
        listaFiltros.appendChild(criterioItem);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://restcountries.com/v3.1/all');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                displayCountries(data, filtroContinente, filtroLenguaje, ordenCriterio);
            } else {
                document.getElementById('listaPaises').innerHTML = '<p>Error al cargar los datos.</p>';
            }
        };
        xhr.send();
    }
    function displayCountries(countries, filtroContinente, filtroLenguaje, ordenCriterio) {
        var listaPaises = document.getElementById('listaPaises');
        listaPaises.innerHTML = '';
        indiceActual = 0;
        var filteredCountries = countries.filter(function (country) {
            if (filtroContinente && filtroLenguaje) {
                return country.region === filtroContinente && country.languages && Object.values(country.languages).includes(filtroLenguaje);
            } else if (filtroContinente) {
                return country.region === filtroContinente;
            } else if (filtroLenguaje) {
                return country.languages && Object.values(country.languages).includes(filtroLenguaje);
            } else {
                return true;
            }
        });
        filteredCountries.sort(function (a, b) {
            indiceActual = 0;
            if (ordenCriterio === 'population') {
                return b.population - a.population;
            } else {
                return a.name.common.localeCompare(b.name.common);
            }
        });
        filteredCountries.forEach(function (country) {
            var countryFlag = document.createElement('img');
            countryFlag.className = 'country-flag';
            countryFlag.src = country.flags.png;
            countryFlag.alt = 'Flag of ' + country.name.common;
            countryFlag.dataset.country = JSON.stringify(country);
            countryFlag.addEventListener('click', function () {
                var clickedCountry = JSON.parse(this.dataset.country);
                showCountryInfo(clickedCountry);
            });
            listaPaises.appendChild(countryFlag);
        });
        moverPaises();
    }
    document.getElementById('continente').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            var selectedContinent = event.target.dataset.value;
            document.getElementById('continente').dataset.value = selectedContinent;
            indiceActual = 0;
            cargarPaises();
        }
    });
    document.getElementById('lenguajes').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            var selectedLanguage = event.target.dataset.value;
            document.getElementById('lenguajes').dataset.value = selectedLanguage;
            indiceActual = 0;
            cargarPaises();
        }
    });
    document.getElementById('ordenCriterio').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            var selectedCriteria = event.target.dataset.value;
            document.getElementById('ordenCriterio').dataset.value = selectedCriteria;
            indiceActual = 0;
            cargarPaises();
        }
    });
    function showCountryInfo(country) {
        var countryInfoModal = $('#infoPais');
        countryInfoModal.empty();
        countryInfoModal.append('<h2>' + country.name.common + '</h2>');
        countryInfoModal.append('<p>Capital: ' + (country.capital ? country.capital : 'N/A') + '</p>');
        countryInfoModal.append('<p>Región: ' + country.region + '</p>');
        countryInfoModal.append('<p>Subregión: ' + country.subregion + '</p>');
        countryInfoModal.append('<p>Población: ' + country.population + '</p>');
        addToLastVisitedList(country);
        $('#modal').css('display', 'block');
        $('#modal').on('click', function (e) {
            if (!$(e.target).closest('#infoPais').length) {
                $('#modal').css('display', 'none');
            }
        });
    }
    function addToLastVisitedList(country) {
        ultimosPaisesVisitados = ultimosPaisesVisitados.filter(function (visitedCountry) {
            return visitedCountry.name.common !== country.name.common;
        });
        ultimosPaisesVisitados.unshift(country);
        if (ultimosPaisesVisitados.length > 5) {
            ultimosPaisesVisitados.pop();
        }
        var listaUltimosVisitados = document.getElementById('listaUltimosVisitados');
        listaUltimosVisitados.innerHTML = '';
        for (var i = 0; i < ultimosPaisesVisitados.length; i++) {
            var listItem = document.createElement('li');
            listItem.textContent = ultimosPaisesVisitados[i].name.common;
            listaUltimosVisitados.appendChild(listItem);
        }
    }
    document.getElementById('prevPage').addEventListener('click', function () {
        indiceActual--;
        if (indiceActual < 0) {
            indiceActual = 0;
        }
        moverPaises();
    });
    document.getElementById('nextPage').addEventListener('click', function () {
        indiceActual++;
        moverPaises();
    });
    function moverPaises() {
        var listaPaises = document.querySelector('.lista-pais');
        var distance = -indiceActual * 80;
        listaPaises.style.transform = 'translateX(' + distance + 'px)';
    }
    cargarPaises();
});