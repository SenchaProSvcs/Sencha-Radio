/**
 * Sencha Blink - Testing
 * @author Jacky Nguyen <jacky@sencha.com>
 */
(function(global) {
    if (typeof Ext === 'undefined') {
        var Ext = global.Ext = {};
    }

    function write(content) {
        document.write(content);
    }

    function meta(name, content) {
        write('<meta name="' + name + '" content="' + content + '">');
    }

    Ext.blink = function(options) {
        var scripts = options.js || [],
            styleSheets = options.css || [],
            i, ln, path, profile;

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

        function filterProfile(profile) {
            var profileMatch = false,
                j, jln;

            for (j = 0, jln = profile.length; j < jln; j++) {
                switch (profile[j]) {
                    case 'phone':
                        profileMatch = isPhone(ua);
                        break;
                    case 'tablet':
                        profileMatch = isTablet(ua);
                        break;
                    case 'desktop':
                        profileMatch = !isPhone(ua) && !isTablet(ua);
                        break;
                    case 'ios':
                        profileMatch = /(iPad|iPhone|iPod)/.test(ua);
                        break;
                    case 'android':
                        profileMatch = /(Android|Silk)/.test(ua);
                        break;
                    case 'blackberry':
                        profileMatch = /(BlackBerry|BB)/.test(ua);
                        break;
                    case 'safari':
                        profileMatch = /Safari/.test(ua);
                        break;
                    case 'chrome':
                        profileMatch = /Chrome/.test(ua);
                        break;
                    case 'ie10':
                        profileMatch = /MSIE 10/.test(ua);
                        break;
                }
                if (profileMatch) {
                    return true;
                }
            }
            return false;
        }

        for (i = 0,ln = styleSheets.length; i < ln; i++) {
            path = styleSheets[i];

            if (typeof path != 'string') {
                profile = path.profile;
                path = path.path;
            }

            if (profile) {
                if (!filterProfile(profile)) {
                    continue;
                }
            }
            write('<link rel="stylesheet" href="'+path+'">');
        }

        for (i = 0,ln = scripts.length; i < ln; i++) {
            path = scripts[i];

            if (typeof path != 'string') {
                profile = path.profile;
                path = path.path;
            }

            if (profile) {
                if (!filterProfile(profile)) {
                    continue;
                }
            }

            write('<script src="'+path+'"></'+'script>');
        }
    }

})(this);
