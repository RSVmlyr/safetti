(function () {
    'use strict';

    const loadJson = async (url, param = {}) => {
        try {
            const response = await fetch(url, param);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en loadJson:', error);
            throw error;
        }
    }

    document.addEventListener("DOMContentLoaded", async function(){
        console.log("*** DOMContentLoaded ***");
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        const langParam = searchParams.get('lang') || 'es';

        const defaultDataLang = await loadJson(`./js/json/es.json`);
        let dataLang = {};

        if (langParam === 'es') {
            dataLang = defaultDataLang;
        }
        else {
            dataLang = await loadJson(`./js/json/${ langParam }.json`);
        }

        document.querySelectorAll('[data-tkey]').forEach(element => {
            const lang = dataLang[element.dataset.tkey];
            const tAttribute = element.dataset.tattr;
            const translation = lang ?? defaultDataLang[element.dataset.tkey];

            if(tAttribute) {
                element.setAttribute(tAttribute, translation);
            }
            else {
                element.innerHTML = translation;
            }
        });
    });

}());