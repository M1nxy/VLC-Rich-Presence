# Universal-Rich-Presence

## Presence Setup
1. Download the appropriate .zip file from the `Releases` section of this page and extract it to a memorable directory.
2. Run the file.

## VLC Setup
1. Create a shortcut with the following target and correct file location for your VLC install:<br>
`C:/Program Files (x86)/VideoLAN/VLC/vlc.exe --extraintf http --http-host localhost --http-password password --http-port 8080`

## Other Platforms
1. Eta S0n

## Getting spotify data working
1. Create an application on the [<ins>Spotify for Developers Dashboard</ins>](https://developer.spotify.com/dashboard/applications)
1. Copy your Client ID and Client Secret then replace the matching values in the `./config.json` file
1. Update the setup value to true (default: false)
