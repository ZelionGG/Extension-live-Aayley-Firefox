var ff_module = false;
if (typeof require !== "undefined") {
    ff_module = true;
}

if (ff_module) {
    var setInter = require("sdk/timers").setInterval;
    var Request = require("sdk/request").Request;
} else {
    var setInter = window.setInterval;
}

var BtnLive = function (chaines, callback, interval, nbCheckOff) {
    if (!Array.isArray(chaines)) {
        chaines = [chaines];
    }
    var l = chaines.length;
    for (var i = 0; i < l; i++) {
        var chaine = chaines[i];
        if (!(
                typeof (chaine) === "object" &&
                ((
                    ("id" in chaine) && ("type" in chaine) && (chaine.type === "twitch")
                ) || (
                    ('url' in chaine) && ('custom' in chaine)
                ))
            )) {
            throw "error in object chaine definition";
        }
    }
    this.chaines = chaines;
    this.__l = l;
    this.callback = callback;
    this.initialNbCheckOff = nbCheckOff;
    this.nbCheckOff = nbCheckOff;
    this.isON = false;
    this.currentChaine = null;
    if (interval > 0) {
        this.check();
        var self = this;
        setInter(function () {
            self.check()
        }, interval);
    }
}

BtnLive.prototype.__dailyParams = ["3d", "access_error", "ads", "allow_comments", "allow_embed", "allowed_in_groups", "allowed_in_playlists", "aspect_ratio", "audience", "auto_record", "available_formats", "bookmarks_total", "broadcasting", "channel", "cleeng_svod_offer_id", "cleeng_tvod_offer_id", "comments_total", "country", "created_time", "description", "duration", "embed_html", "embed_url", "encoding_progress", "end_time", "event_delete", "event_live_offair", "event_live_onair", "event_modify", "explicit", "filmstrip_small_url", "genre", "geoblocking", "geoloc", "id", "isrc", "language", "live_frag_publish_url", "live_publish_url", "mediablocking", "metadata_credit_actors", "metadata_credit_director", "metadata_genre", "metadata_original_language", "metadata_original_title", "metadata_released", "metadata_show_episode", "metadata_show_season", "metadata_visa", "mode", "moderated", "modified_time", "muyap", "onair", "owner", "paywall", "poster", "poster_135x180_url", "poster_180x240_url", "poster_270x360_url", "poster_360x480_url", "poster_45x60_url", "poster_90x120_url", "poster_url", "price_details", "private", "published", "rating", "ratings_total", "recurrence", "rental_duration", "rental_price", "rental_price_formatted", "rental_start_time", "sharing_urls", "soundtrack_info", "sources", "start_time", "status", "strongtags", "svod", "swf_url", "sync_allowed", "tags", "taken_time", "thumbnail_120_url", "thumbnail_180_url", "thumbnail_240_url", "thumbnail_360_url", "thumbnail_480_url", "thumbnail_60_url", "thumbnail_720_url", "thumbnail_url", "title", "tvod", "type", "upc", "url", "views_last_day", "views_last_hour", "views_last_month", "views_last_week", "views_total"];
BtnLive.prototype.__dailyLength = BtnLive.prototype.__dailyParams.length;

BtnLive.prototype.__getUrl = function () {
    return "https://twitch.theorycraft.gg/channel-status";
}

BtnLive.prototype.getDefaultUrl = function (id) {
    return "http://www.twitch.tv/" + id;
}

BtnLive.prototype.getCurrentRedirectUrl = function () {
    var chaine = this.currentChaine;
    if ("redirect" in chaine) {
        return chaine.redirect;
    } else if ("videoId" in chaine) {
        return this.getDefaultUrl(chaine.videoId);
    } else if ("id" in chaine) {
        return this.getDefaultUrl(chaine.id);
    } else {
        return null;
    }
}

BtnLive.prototype.check = function () {
    this.__isON = false;
    this.__nbCheck = 0;
    for (var i = 0; i < this.__l; i++) {
        this.__check(this.chaines[i]);
    }
}

BtnLive.prototype.__check = function (chaine) {
    var self = this;
    var url;
    if ("id" in chaine) {
        var key = "w6k400q2dbmnv8u7ngueb18vp0vdpi";
        if ("key" in chaine) {
            key = chaine.key;
        }
        url = this.__getUrl(chaine.id, key);
    } else {
        url = chaine.url;
    }

    BtnLive.prototype.__get(url, function (data) {
        if ("custom" in chaine) {
            chaine.custom(data, chaine);
        } else {
            console.log(data[chaine.id]);
            var online = (data[chaine.id] !== undefined && data[chaine.id] != null);
            if (online && 'filtre' in chaine) {
                var titre = data[chaine.id].title;
                var r = new RegExp(chaine.filtre, "i");
                online = r.test(titre);
            }
            self.__checkDone(online, chaine);
        }
    })
}

BtnLive.prototype.__get = function (url, callback) {
    var data = JSON.stringify({
        "channels": [
            aayley_params.chaines[0].id
        ]
    });

    var xhr;
    try {
        xhr = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
        try {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e2) {
            xhr = new XMLHttpRequest();
        }
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            responseText = xhr.responseText;
            try {
                var json = JSON.parse(responseText);
                responseText = json;
            } catch (e) {}
            callback(responseText);
        }
    };

    xhr.open("POST", url);

    xhr.setRequestHeader("Client-ID", "7sjt9diwcoz210sdkc9xkokrm8h2ol");
    xhr.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

BtnLive.prototype.__checkDone = function (result, chaine) {
    if (this.__isON) return;
    this.__isON = result;

    if (this.__isON) {
        this.currentChaine = chaine;
        if (this.isON === false) {
            this.isON = true;
            this.nbCheckOff = this.initialNbCheckOff;
            this.callback(true);
        }
    } else {
        this.__nbCheck++;
        if (this.__nbCheck >= this.__l) {
            if (this.isON === true) {
                if (this.nbCheckOff <= 0) {
                    this.currentChaine = null;
                    this.isON = false;
                    this.callback(false);
                } else {
                    this.nbCheckOff--;
                }
            }
        }
    }
}

if (typeof require !== "undefined") {
    exports.BtnLive = BtnLive;
}