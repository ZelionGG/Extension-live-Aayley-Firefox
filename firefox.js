var aayley_nav = {
    doNotification: function () {
        browser.notifications.clear('notifyON' + aayley_params.title, function (id) {});
        browser.notifications.create('notifyON' + aayley_params.title, {
            type: "basic",
            title: aayley_params.title,
            message: aayley_params.message,
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
        if (aayley.isON) {
            browser.tabs.create({
                url: aayley.getCurrentRedirectUrl()
            }, function (tab) {});
        } else {
            browser.tabs.create({
                url: aayley_params.offlineUrl
            }, function (tab) {});
        }
    }
}

browser.browserAction.onClicked.addListener(aayley_nav.goIt);
browser.notifications.onClicked.addListener(function (notificationId) {
    if (notificationId === 'notifyON' + aayley_params.title) {
        browser.tabs.create({
            url: aayley.getCurrentRedirectUrl()
        }, function (tab) {});
    }
});

aayley_nav.setIconON(false);
var aayley = new BtnLive(aayley_params.chaines, function (result) {
    aayley_nav.setIconON(result);
    if (result) {
        aayley_nav.doNotification();
    }
}, 60000, 2);