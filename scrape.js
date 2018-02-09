var cheerio = require('cheerio');
var vo = require('vo');
var Nightmare = require('nightmare');
var nightmare = Nightmare({
    show: true

});

var urlWeb = "https://www.menu.com.do/#!/s/a:*";
var nombre, tipo, foto, direccion, telefonos, horario, pagos;

var run = function* () {
    yield nightmare.goto(urlWeb)
        .wait('h2');

    var oldHeight, currentHeight = 0;
    var i = 1;
    var count = 25;

    //scroll to end as many times until the pages loads all the items
    //navigates on each card
    while (oldHeight !== currentHeight) {
        oldHeight = currentHeight;
        currentHeight = yield nightmare.evaluate(function () {
            return document.body.scrollHeight;
        });

        for (i; i <= count; i++) {
            var cardSelector = "[class='business-teaser list-item ng-scope']:nth-child(" + i + ") > div > div:nth-child(1) > div > a >img";
            console.log(i);
            yield nightmare.wait(cardSelector).click(cardSelector).wait(2500);

            var body = yield nightmare.evaluate(function () {
                return document.body.innerHTML;
            });

            var $ = cheerio.load(body);
            console.log($('strong').text() === "Sucursal");
            
            yield nightmare.back().wait(1500);
        }

        count += 25;

        yield nightmare.scrollTo(currentHeight, 0).wait(1000);

    }





}



vo(run)(function (err) {
    if (err != null)
        console.error(err);

    console.log('done');
});