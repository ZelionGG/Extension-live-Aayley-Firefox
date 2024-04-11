const clientId = '7sjt9diwcoz210sdkc9xkokrm8h2ol';
let streamerName = 'monodie';
let url = 'https://www.twitch.tv/' + streamerName;

browser.alarms.create({ periodInMinutes: 1 });
browser.alarms.onAlarm.addListener(getLiveStatus);

async function getLiveStatus() {
    const isLiveTwitch = await getTwitchStatus();
    console.log(isLiveTwitch);

    if (!isLiveTwitch)
        return false;

    return true;
}

async function getTwitchStatus() {
    try {
        var raw = JSON.stringify({
            "channels": [
                streamerName
            ]
        });

        const response = await fetch('https://twitch.theorycraft.gg/channel-status', {
            method: 'POST',
            headers: {
                'Client-ID': clientId,
            },
            body: raw
        });

        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }
        const data = await response.json();
        const streamData = data[streamerName];
        if (streamData && streamData.type === 'live') {
            if (this.notification != true)
                browser.notifications.create('notifyON Aayley', { type: "basic", title: 'Aayley', message: 'Aayley est en live', iconUrl: "images/iconon128.png" }, function (id) { });

            this.notification = true;
            browser.browserAction.setIcon({ path: "images/iconon48.png" });
            return true;
        } else {
            this.notification = false;
            browser.browserAction.setIcon({ path: "images/iconoff48.png" });
        }
    } catch (error) {
        console.log(error);
    }
    return false;
}

browser.notifications.onClicked.addListener(function (notificationId) {
    if (notificationId === 'notifyON Aayley') {
        browser.tabs.create({ url: url }, function (tab) { });
        browser.notifications.clear("notifyON Aayley");
    }
});

browser.browserAction.onClicked.addListener(async () => {
    browser.tabs.create({ url });
});

const keepAlive = () => setInterval(browser.runtime.getPlatformInfo, 20e3);
browser.runtime.onStartup.addListener(keepAlive);
keepAlive();

getLiveStatus();
