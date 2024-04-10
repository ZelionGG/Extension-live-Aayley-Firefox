const clientId = '7sjt9diwcoz210sdkc9xkokrm8h2ol';
const clientSecret = 'new38yo7mh9tc2d6huuxlip1f24ali';
let accessToken;
let url = 'https://www.twitch.tv/aayley';

browser.alarms.create({ periodInMinutes: 1 });
browser.alarms.onAlarm.addListener(getLiveStatus);

async function getLiveStatus() {
    const isLiveTwitch = await getTwitchStatus();

    if (!isLiveTwitch)
        return false;

    return true;
}

async function getTwitchStatus() {
    try {
        const response = await fetch('https://api.twitch.tv/helix/streams?user_login=skyyart', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-ID': clientId
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                getTwitchToken();
                return false;
            }
            throw new Error(`Error! Status: ${response.status}`);
        }
        const data = await response.json();
        const streamData = data.data[0];
        if (streamData && streamData.type === 'live') {
            if (this.notification != true)
                browser.notifications.create('notifyON Aayley', { type: "basic", title: 'Aayley', message: 'Aayley est en live', iconUrl: "images/iconon128.png" }, function (id) { });

            this.notification = true;
            browser.action.setIcon({ path: "images/iconon48.png" });
            return true;
        } else {
            this.notification = false;
            browser.action.setIcon({ path: "images/iconoff48.png" });
        }
    } catch (error) {
        console.log(error);
    }
    return false;
}

async function getTwitchToken() {
    try {
        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
        });
        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }
        const data = await response.json();
        accessToken = data.access_token;
    } catch (error) {
        console.log(error);
    }
    getLiveStatus();
}

browser.notifications.onClicked.addListener(function(notificationId){
    if (notificationId === 'notifyON Aayley') {
        browser.tabs.create({url:url},function(tab){});
    }
});

browser.action.onClicked.addListener(() => {
    browser.tabs.create({ url });
});

getLiveStatus();
