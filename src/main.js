var localStorage = require('localStorage');
var JsonStorage = require('json-storage').JsonStorage;
var store = JsonStorage.create(localStorage, 'temps', { stringify: true });

var $, jQuery = require('jquery');
var sugar = require("sugar");
var chart = require("chart.js");
var ipcRenderer = require('electron').ipcRenderer;

var wdata = null;
var fdata = null;
var hdata = null;

var color = null;

window.onload = function ()
{
    init();
    
    refreshWeather();

    loadEventListener();

};

var loadEventListener = function() {

    jQuery('#details .content').click(toggleDetails);

    showDate();
    refreshInfo();

    jQuery('input#city').keypress(function (e) {
        if (e.which == 13) {
            setCity(jQuery('input#city').val());
            refreshWeather();
            toggleSettings();
            return false;    //<---- Add this line
        }
    });

    jQuery('input#apikey').keypress(function (e) {
        if (e.which == 13) {
            setApiKey(jQuery('input#apikey').val());
            refreshWeather();
            toggleSettings();
            return false;    //<---- Add this line
        }
    });
    
    jQuery('input[type="radio"][name="format"]').change(function () {
         setFormat(jQuery(this).val());
        refreshWeather();
    });

    jQuery('input[type="checkbox"][name="mb-info"]').change(function () {
        var bool =jQuery('input[type="checkbox"][name="mb-info"]:checked').length > 0;
        setMbInfo(bool);
        if (getMbInfo()) {
            refreshWeather();
        } else {
            console.log('send');
            ipcRenderer.send('no-title');
        }
    });

    jQuery('.location').click(function () {
        toggleSettings();
        jQuery('input#city').delay(600).focus().select();
    });

    jQuery('#main:not(div.settings)').click(function () {
        refreshWeather();
    });

    jQuery('#main .settings img').click(function() {
        toggleSettings();
    });
    
    jQuery('#settings .close').click(function() {
        ipcRenderer.send('close');
    });

    ipcRenderer.on('show', function() {
        console.log('show');
        refreshWeather();
    });
};

var init = function() {
    if (store.get('actual-city')) {
        setCity(store.get('actual-city'));
    }  else {
        setCity('Dresden, DE');
    }

    if (store.get('format')) {
        setFormat(store.get('format'));
    }  else {
        setFormat('metric');
    }

    if (store.get('apikey')) {
        setApiKey(store.get('apikey'));
    }  else {
        showErrorMessage('No api key.')
    }

    if (store.get('mb-info') != null) {
        setMbInfo(store.get('mb-info'));
    }  else {
        setMbInfo(true);
    }
};