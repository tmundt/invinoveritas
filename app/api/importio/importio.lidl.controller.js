/**
 * Created by thomasmundt on 06.02.16.
 */
//  Logic for calls /api/wine
var endpointUrl = require('../../config').importio.endpointUrl;
exports.show = function(req, res) {
    //var sort = req.param('sort');
    //var taste = req.param('taste');
    //var price = req.param('price');
    //var country = req.param('country');
    var search = req.param('id');

    //console.log('SERVER/importio-contr, price: '+ price);



    //console.log('SERVER, search from client: sort' + sort +', taste: '+taste+', price: '+price+',country: '+ country);
    var urlLidl = "http%3A%2F%2Fwww.lidl.de%2Fde%2Fsearch%3Fquery%3D*%26filterType%3DProdukte%26filterCategoryPathROOT%2FLebensmittel%2B%26%2BDrogerie%3DWeine%26";
    //var urlLidl = 'https://api.import.io/store/connector/_magic?url=http%3A%2F%2Fwww.lidl.de%2Fde%2Fsearch%3Fquery%3D*%26filterType%3DProdukte%26filterCategoryPathROOT%252FLebensmittel%2B%2526%2BDrogerie%3DWeine%26';
    var urlLidl2 = "http%3A%2F%2Fwww.lidl.de%2Fde%2Fsearch%3Fquery%3D*%26filterType%3DProdukte%26filterCategoryPath%E2%80%A6ne%26";
    //var urlLidl2 = "http://www.lidl.de/de/search?query=*&filterType=Produkte&ffilterCategoryPath%E2%80%A6ne";
    //var urlLidl3 = 'http://www.lidl.de/de/search?query=*&filterType=Produkte&filterPrice=%3C+2.50&filterCategoryPathROOT%2FLebensmittel+%26+Drogerie=Weine&filterWeinart=Rotwein&filterGeschmacksrichtung=trocken&filterHerkunft=Spanien&channel=mgm_de_DE&followSearch=9815&log=eci-proxy';
    console.log('SERVER, importio.controller');
    //var url = urlLidl+'filterWeinart%3DRotwein%26filterGeschmacksrichtung%3Dtrocken%26filterHerkunft%3DDeutschland&format=JSON&js=false&_apikey=cdfc002b8e8e4127b04fe0a8ceb5c4276d6d5270149272e905d1fe5fd89a53c1ad36ade8c2918268acc013a09a6a586c523acaa2d8593d64eb68d16b1b433f76c9f63901cfb73a2ad7c548aea0bb761e';
    //var url = 'filterWeinart%3D'+sort;
    //if(taste != undefined||null||"0") {
    //    url += '%26filterGeschmacksrichtung%3D'+taste;
    //}
    //if(price != undefined) {
    //    url += '%26filterPrice%3D'+price;
    //}
    //if(country != undefined) {
    //    url += '%26filterHerkunft%3D'+country;
    //}

    //console.log("SERVER, assembled request url: " + url);
    console.log('SERVER, search is: '+ search);
    search = search.replace(/=/g,"%3D");
    search = search.replace(/&/g,"%26");
    search = search.replace(/ß/g,"%C3%9F");
    search = search.replace(/é/g,"%C3%A9");
    search = search.replace(/Ö/g,"%C3%96");
    search = search.replace(/</g, "%3C");
    //search = search.replace(/\+/g, "%2B");
    search = search.replace(/>/g, "%3E");


    console.log('SERVER, url is now: '+ search);
    var request = require('request');
    console.log('SERVER, REQUEST would be: ' + endpointUrl+'url='+urlLidl+search);
    request(endpointUrl+'url='+ urlLidl+search, function (error, response, body) {
        //request(endpointUrl+'url='+ urlLidl3, function (error, response, body) {
        //request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body)
            //console.log('SERVER: response von import.io: ' + response);
        }
        if (response) {
            res.json(body);
        }
    })

}
