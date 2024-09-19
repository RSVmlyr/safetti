'use strict';

const localStorageLangKey = "SafettiLang"
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
const localLang = localStorage.getItem(localStorageLangKey);
export const langParam = searchParams.get('lang') || localLang || 'es';
let defaultDataLang = null;
let dataLang = null;

if(localLang !== langParam) {
    localStorage.setItem(localStorageLangKey, langParam);
}

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

const setDataLang = async () => {
    if(defaultDataLang === null) {
        defaultDataLang = await loadJson(`./js/json/es.json`);
    }

    if(dataLang === null) {
        if (langParam === 'es') {
            dataLang = defaultDataLang;
        }
        else {
            dataLang = await loadJson(`./js/json/${ langParam }.json`);
        }
    }
}

export const getTranslation = (key) => {
    //await setDataLang();
    if(!key) return "err";
    key = key.replaceAll(" ", "_").toLowerCase();

    return dataLang[key] ?? defaultDataLang[key];
}

export const loadTranslations = async () => {
    await setDataLang();

    document.querySelectorAll('[data-tkey]:not(.t-done)').forEach(element => {
        const tAttribute = element.dataset.tattr;
        const translation = dataLang[element.dataset.tkey] ?? defaultDataLang[element.dataset.tkey];

        if(tAttribute) {
            element.setAttribute(tAttribute, translation);
        }
        else {
            element.innerHTML = translation;
        }
        element.classList.add('t-done');
    });
}

document.addEventListener("DOMContentLoaded", async function(){
    await loadTranslations();
});
