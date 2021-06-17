# Flomm player - personal audio player

## Where to try?
The project is deployed at: https://flommplayer.herokuapp.com/

## Introduction

This webapp aims to mimic well-known audio players.
It has several features, including custom scrollbar and buttons for handling the audio, shuffle option, editable tracklists, backed up with a PostgreSQL database and global hotkeys to control the player.
The application does not support Internet Explorer.

The application is written in Typescript and vanilla Javascript. The backend uses Express.js.
For reading the mp3 tags and data, I used the following library:

`music-metadata` - https://www.npmjs.com/package/music-metadata

### Global hotkeys

- `SPACE` toggles play / pause
- `N` plays the next track
- `P` plays the previous track
- `ESC` mutes the volume
- `T` toggles dark/light mode
