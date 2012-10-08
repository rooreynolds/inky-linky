//link to source article (jquery calllback reliable)

//TODO: layout altogrithm could use some work. Assigning to the left or right column based on whether its position on the page, etc.

function loadJQuery(callback) {
    try {
        if(typeof jQuery == "undefined" || typeof jQuery.ui == "undefined") {
            var head= document.getElementsByTagName('head')[0];
            var maxLoadAttempts = 10;
            var jQueryLoadAttempts = 0;
            var script= document.createElement('script');
            script.type= 'text/javascript';
            script.src= 'http://localhost/inkylinky/jquery.js';
            head.appendChild(script);
            checkjQueryLoaded = setInterval(function() {             
                if(typeof jQuery != "undefined") {
                } else if(maxLoadAttempts < jQueryLoadAttempts) {
                    window.clearInterval(checkjQueryLoaded);
                }
                jQueryLoadAttempts++;
            },300);
            jQueryLoadAttempts = 0;  
            checkLoaded = setInterval(function() {             
                if(typeof jQuery != "undefined") {
                    window.clearInterval(checkLoaded);
                    callback(true);
                } else if(maxLoadAttempts < jQueryLoadAttempts) {
                    window.clearInterval(checkLoaded);
                    callback(false);
                }
                jQueryLoadAttempts++;
            },500);
        }
    }
    catch(exception) {
        alert("Error: " + exception);
        callback(false);
    }
}

loadJQuery(function(loadSuccess) {
    if(loadSuccess) {
        $('body').append('<div id="linkbarL">');
        $('body').append('<div id="linkbarR">');
        var items = $("a[href*='http']");
        var minoffsetA = 0;
        var minoffsetB = 0;
        var leftoffset = 0;
        var lastrulerheight = 0;
        var switchcolumns = false;
        
        items.each(function() {
            var linktopoffset = $(this).offset().top;
            var linkleftoffset = $(this).offset().left;
            var linkheight = $(this).height();
            var url = this.href.replace(/^http:\/\//, "").replace(/\/$/, ""); // strip leading http:// and trailing /
            var encodedurl = encodeURIComponent(url);
            rulerheight = linktopoffset + linkheight;
            if (rulerheight <= lastrulerheight) { rulerheight = lastrulerheight + 2; }
            if (switchcolumns || ((rulerheight >= minoffsetA)) && (minoffsetB >= minoffsetA))  {
                //left column
                //TODO: go back to using real QR code images - src="http://qr.kaywa.com/?s=3&d=' + encodedurl + '"
                $('#linkbarL').append('<div class="linkbox" style="border-right:1px dotted red;color:red; position:absolute; top:' + (Math.max(minoffsetA, linktopoffset - 78)) + 'px;"><div class="linkimg"><img height="81" width="81" src="http://qr.kaywa.com/?s=3&d=' + encodedurl + '"/></div><div class="linktext">' + url + '</div></div>');
                $(this).css("border", "1px dotted red");
                switchcolumns = false;
                newbox = $('#linkbarL').children().last();
                minoffsetA = newbox.offset().top + newbox.height() + 5;
                console.log("fudge factor 2");
                var foo = ($('body').append('<div class="ruler2" style="border-bottom: 1px dotted red;width:' + ($(this).position().left - $('body').offset().left + 2 + $(this).width()) + 'px;position:absolute;top:' + rulerheight + 'px;left:' + ($('body').offset().left - 2) + 'px;"></div>'));
            } else {
                //right column
                //TODO: go back to using real QR code images - src="http://qr.kaywa.com/?s=3&d=' + encodedurl + '"
                $('#linkbarR').append('<div class="linkbox" style="border-left:1px dotted blue; color:blue; position:absolute; top:' + (Math.max(minoffsetB, linktopoffset - 78)) + 'px;"><div class="linkimg"><img height="81" width="81" src="http://qr.kaywa.com/?s=3&d=' + encodedurl + '"/></div><div class="linktext">' + url + '</div></div>');
                $(this).css("border", "1px dotted blue");
                switchcolumns = true;
                newbox = $('#linkbarR').children().last();
                leftoffset = newbox.offset().left + newbox.width() + 5;
                minoffsetB = newbox.offset().top + newbox.height() + 5;
                $('body').append('<div class="ruler2" style="border-bottom: 1px dotted blue;width:' + (newbox.offset().left - linkleftoffset) + 'px;position:absolute;top:' + rulerheight + 'px;left:' + linkleftoffset + 'px;"></div>');
            }
            lastrulerheight = rulerheight;
        });
    } else {
        alert('Couldn\'t load jQuery  ');    
    }
});