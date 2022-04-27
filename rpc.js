let RPC = require('discord-rpc')
const Spotify = require('node-spotify-api');
const { getLinks } = require('songlink-api');

let previousPresence = {
    presence: {
        state: '',
        details: ''
    }
}

let client = new RPC.Client({transport: 'ipc'})
void client.login({clientId:'966390762310868992'});


module.exports.updatePresence = async function updatePresence(vlc){
    let status = await vlc.status()
    if (await vlc.isPaused()) {
        return {
            state: 'Paused',
            details: 'Nothing is playing',
            largeImageKey: 'vlc',
            largeImageText: 'VLC Media Player',
            smallImageKey: 'paused',
            smallImageText: 'paused',
            instance: true
        }
    }
    else {
        const {meta} = status.information.category;
        const output = {
            details: meta.title || meta.filename,
            state: '',
            partySize: 0,
            partyMax: 0,
            largeImageKey: 'vlc',
            largeImageText: 'VLC Rich Presence',
            smallImageKey: status.state,
            smallImageText: `By M1nx + Zemyoro`,
            startTimestamp: 1,
            endTimestamp: 1,
            buttons: [{
                label: 'Checkout project',
                url: 'https://github.com/Zemyoro/VLC-Presence'
            }]
        };

        if (vlc.config.alternativeAlbumView) {
            if (meta.artist) {
                output.state = meta.artist;
                if (meta.album) output.state += ` - ${meta.album}`;
                if (meta.track_number && meta.track_total && vlc.config.displayTrackNumber) {
                    output.partySize = parseInt(meta.track_number, 10);
                    output.partyMax = parseInt(meta.track_total, 10);
                }
            } else {
                output.state = status.state;
            }
        } else {
            if (meta.artist) {
                output.details += ` - ${meta.artist}`;
                if (meta.album) output.state = meta.album;
                if (meta.track_number && meta.track_total && vlc.config.displayTrackNumber) {
                    output.partySize = parseInt(meta.track_number, 10);
                    output.partyMax = parseInt(meta.track_total, 10);
                }
            } else {
                output.state = status.state;
            }
        }

        const end = Math.floor(Date.now() / 1000 + ((status.length - status.time) / status.rate));

        if (status.state === 'playing' && status.length !== 0) {
            output.endTimestamp = end;
        }

        if (meta.title && meta.artist && vlc.config.spotifyEnabled) {

            let spotify = new Spotify({id: vlc.config.spotifyID, secret: vlc.config.spotifySecret});

            try {
                let songData = await spotify.search({
                    type: 'track',
                    query: `${meta.title} ${meta.artist.replace(' ft. ', ' ')}`
                });
                if (!songData) return;

                if (songData.tracks) {
                    if (songData.tracks.items[0]) {
                        let song = songData.tracks.items[0]
                        let songLink
                        try {
                            songLink = await getLinks({url: song.external_urls.spotify})
                        } catch (e) {
                            verboseLog('VLC', 'Failed to fetch song.link data')
                        }

                        if (songLink?.pageUrl) {
                            output.buttons.unshift({
                                label: `View on Songlink`,
                                url: songLink.pageUrl
                            });
                        }

                        if (song.album.images && song.album.images.length > 0) {
                            output.largeImageKey = song.album.images[0].url
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }

        return output
    }
}

module.exports.setPresence = async function setPresence(presence){
    return await client.setActivity(presence)
}
module.exports.clearPresence = async function clearPresence(){
    return await client.clearActivity()
}
