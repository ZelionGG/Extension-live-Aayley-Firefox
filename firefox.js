var aayleyonline_nav = {
    doNotification: function () {
        browser.notifications.clear('notifyON' + aayleyonline_params.title, function (id) {});
        browser.notifications.create('notifyON' + aayleyonline_params.title, {
            type: "basic",
            title: aayleyonline_params.title,
            message: aayleyonline_params.message,
            iconUrl: "iconon128.png"
        }, function (id) {});
    },
    setIconON: function (on) {
        var status = on ? "on" : "off";
        browser.browserAction.setIcon({
            path: "icon" + status + "48.png"
        });
    },
    goIt: function () {
        if (aayleyonline.isON) {
            browser.tabs.create({
                url: aayleyonline.getCurrentRedirectUrl()
            }, function (tab) {});
        } else {
            browser.tabs.create({
                url: aayleyonline_params.offlineUrl
            }, function (tab) {});
        }
    }
}

browser.browserAction.onClicked.addListener(aayleyonline_nav.goIt);
browser.notifications.onClicked.addListener(function (notificationId) {
    if (notificationId === 'notifyON' + aayleyonline_params.title) {
        browser.tabs.create({
            url: aayleyonline.getCurrentRedirectUrl()
        }, function (tab) {});
    }
});

aayleyonline_nav.setIconON(false);
var aayleyonline = new BtnLive(aayleyonline_params.chaines, function (result) {
    aayleyonline_nav.setIconON(result);
    if (result) {
        aayleyonline_nav.doNotification();
    }
}, 60000, 2);