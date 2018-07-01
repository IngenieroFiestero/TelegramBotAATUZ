var TelegramBot = require('node-telegram-bot-api');
var http = require('http'),
    fs = require('fs');
var path = require('path');

var chistes = require("./recursos.json");
var sangabriel = require("./san-gabriel.json");
var neocom = require("./neocom.json");

var chiste = 0;
var playlist = [];

var bot = new TelegramBot(process.env.AATUZ_TOKEN, { polling: true });
var BotTools = require('./bot-tools.js');
var botOpts = {
    reply_markup: BotTools.createCompleteRelpyKeyboard([
        ['👨‍💻/neocom','🧙/charla','🧙/sangabriel'], ['💬/chistes', '❓/help']])
};
/**
 * Comando de ayuda
 */
bot.onText(/\/help/, function (msg, match) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "👨‍💻/neocom Dias que faltan para neocom y charlas disponibles. \n 🧙/charla Proxima charla de NeoCom. \n /chistes Te cuento un chiste friki para Telecos.", botOpts);
});
/**
 * Comando para mostrar la lista de charlas
 */
bot.onText(/\/neocom/, function (msg, match) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, getNeoComFullText(), botOpts);
});
bot.onText(/\/charla/, function (msg, match) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, getNeoComText(), botOpts);
});
bot.onText(/\/sangabriel/, function (msg, match) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, getSanGabrielFull(), botOpts);
});
/**
 * Chiste Teleco
 */
bot.onText(/\/chistes/, function (msg, match) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, chistes.teleco[chiste], botOpts);
    chiste = (chiste + 1) % chistes.teleco.length
});

function getNeoComText(){
    var today = new Date();
    let text = neocom.msg;
    if(neocom.charlas.length > 0){
        var firstDate = new Date(neocom.charlas[0].date);
        if(today.valueOf() < firstDate.valueOf()){
            var diasRestantes = parseInt((firstDate.valueOf() - today.valueOf())/(24*3600*1000));
            if(diasRestantes === 1){
                text += "\nFalta un dia";
            }else{
                text += "\nFaltan " + diasRestantes + " dias";
            }
            if(diasRestantes < 7){//Menos de una semana para neocom
                text += "\nProxima charla: " + neocom.charlas[0].title + " de " + neocom.charlas[0].author;
            }
        }else{
            //In neoCom
            var i = 0;
            var proximaCharla = null;
            for(i = 0; i < neocom.charlas.length; i++){
                firstDate = new Date(neocom.charlas[0].date);
                if(today.getUTCDate() == firstDate.getUTCDate()){
                    proximaCharla = neocom.charlas[i];
                }
            }
            text += "\nProxima charla: " + proximaCharla.title + " de " + proximaCharla.author;
        }
    }
    return text;
}
function getNeoComFullText(){
    var today = new Date();
    let text = neocom.msg;
    if(neocom.charlas.length > 0){
        var firstDate = new Date(neocom.charlas[0].date);
        if(firstDate.valueOf() > today.valueOf()){
            var diasRestantes = parseInt((firstDate.valueOf() - today.valueOf())/(24*3600*1000));
            if(diasRestantes === 1){
                text += "\nFalta un dia";
            }else{
                text += "\nFaltan " + diasRestantes + " dias";
            }
        }
        for(i = 0; i < neocom.charlas.length; i++){
            firstDate = new Date(neocom.charlas[i].date);
            text += "\n" + (firstDate.getUTCHours()) + ":" + (firstDate.getUTCMinutes()) + "-" +(firstDate.getUTCDate()) + "/" + (firstDate.getUTCMonth() + 1) + ": " + neocom.charlas[i].title + " de " + neocom.charlas[i].author;
        }
    }
    return text;
}
function getSanGabrielFull(){
    var today = new Date();
    let text = sangabriel.msg;
    if(sangabriel.actividades.length > 0){
        var firstDate = new Date(sangabriel.actividades[0].date);
        if(firstDate.valueOf() > today.valueOf()){
            var diasRestantes = parseInt((firstDate.valueOf() - today.valueOf())/(24*3600*1000));
            if(diasRestantes === 1){
                text += "\nFalta un dia";
            }else{
                text += "\nFaltan " + diasRestantes + " dias";
            }
        }
        for(i = 0; i < sangabriel.actividades.length; i++){
            firstDate = new Date(sangabriel.actividades[i].date);
            text += "\n" + (firstDate.getUTCHours()) + ":" + (firstDate.getUTCMinutes()) + "-" + (firstDate.getUTCDate()) + "/" + (firstDate.getUTCMonth() + 1) + ": " + sangabriel.actividades[i].title + " en " + sangabriel.actividades[i].lugar;
        }
    }
    return text;
}
