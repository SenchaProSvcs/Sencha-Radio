/**
 * Sencha Blink - Development
 * @author Jacky Nguyen <jacky@sencha.com>
 */
(function() {
    function write(content) {
        document.write(content);
    }

    function meta(name, content) {
        write('<meta name="' + name + '" content="' + content + '">');
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'app.json', false);
    xhr.send(null);

    var options = eval("(" + xhr.responseText + ")"),
        scripts = options.js || [],
        styleSheets = options.css || [],
        i, ln, path, profile, j, jln;

    meta('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no');
    meta('apple-mobile-web-app-capable', 'yes');
    meta('apple-touch-fullscreen', 'yes');

    var ua = navigator.userAgent;

    function isPhone(ua) {
        var isMobile = /Mobile(\/|\s)/.test(ua);

        // Either:
        // - iOS but not iPad
        // - Android 2
        // - Android with "Mobile" in the UA

        return /(iPhone|iPod)/.test(ua) ||
                  (!/(Silk)/.test(ua) && (/(Android)/.test(ua) && (/(Android 2)/.test(ua) || isMobile))) ||
                  (/(BlackBerry|BB)/.test(ua) && isMobile) ||
                  /(Windows Phone)/.test(ua);
    }

    function isTablet(ua) {
        return !isPhone(ua) && (/iPad/.test(ua) || /Android/.test(ua) || /(RIM Tablet OS)/.test(ua) ||
            (/MSIE 10/.test(ua) && /; Touch/.test(ua)));
    }

    window.Ext = {};
    var filterPlatform = window.Ext.filterPlatform = function(platform) {
        var platformMatch = false,
            j, jln;

        for (j = 0, jln = platform.length; j < jln; j++) {
            switch (platform[j]) {
                case 'phone':
                    platformMatch = isPhone(ua);
                    break;
                case 'tablet':
                    platformMatch = isTablet(ua);
                    break;
                case 'desktop':
                    platformMatch = !isPhone(ua) && !isTablet(ua);
                    break;
                case 'ios':
                    platformMatch = /(iPad|iPhone|iPod)/.test(ua);
                    break;
                case 'android':
                    platformMatch = /(Android|Silk)/.test(ua);
                    break;
                case 'blackberry':
                    platformMatch = /(BlackBerry|BB)/.test(ua);
                    break;
                case 'safari':
                    platformMatch = /Safari/.test(ua);
                    break;
                case 'chrome':
                    platformMatch = /Chrome/.test(ua);
                    break;
                case 'ie10':
                    platformMatch = /MSIE 10/.test(ua);
                    break;
            }
            if (platformMatch) {
                return true;
            }
        }
        return false;
    };


    for (i = 0,ln = styleSheets.length; i < ln; i++) {
        path = styleSheets[i];

        if (typeof path != 'string') {
            platform = path.platform;
            path = path.path;
        }

        if (platform) {
            if (!filterPlatform(platform)) {
                continue;
            }
        }

        write('<link rel="stylesheet" href="'+path+'">');
    }

    for (i = 0,ln = scripts.length; i < ln; i++) {
        path = scripts[i];

        if (typeof path != 'string') {
            platform = path.platform;
            path = path.path;
        }

        if (platform) {
            if (!filterPlatform(platform)) {
                continue;
            }
        }

        write('<script src="'+path+'"></'+'script>');
    }

})();
