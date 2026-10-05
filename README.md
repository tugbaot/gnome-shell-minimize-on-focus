# gnome-shell-minimize-on-focus
I created this as I wanted certain apps that have some transparency to always just show the desktop wallpaper, not be cluttered by other apps in the background.. 

A simple Gnome extension that will minimise all other applications when a specific one is in focus. You can configure which applications trigger this (default is nemo, sakura & vivaldi - but you can easily change in the extension.js `this._triggerApps`)

If there are apps you want to exclude (and not get minimized) just add them in `this._excludedApps` (e.g. I exclude mpv when it's normally running on a second monitor).

## Install
To install, just download the zip and unpack to  `~/local/share/gnome-shell/extensions`




