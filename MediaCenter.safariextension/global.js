function airplay(url) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://" + safari.extension.settings.airplayHostname + ":7000/play", true, "AirPlay", safari.extension.secureSettings.getItem("airplayPassword"));
	xhr.send("Content-Location:" + url + "\nStart-Position:0\n");
}

function stop() {
   var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://" + safari.extension.settings.airplayHostname + ":7000/stop", true, "AirPlay", safari.extension.secureSettings.getItem("airplayPassword"));
	xhr.send(null);
}

// TODO: airplayImage (currently only in WebKit nightly builds)

function handleContextMenu(event) {
	if(event.userInfo === null) return;
	if(event.userInfo.isLink) {
		if(safari.extension.settings.linksQTP) event.contextMenu.appendContextMenuItem("qtp", OPEN_IN_QUICKTIME_PLAYER);
		if(safari.extension.settings.linksAirPlay) event.contextMenu.appendContextMenuItem("airplay", SEND_VIA_AIRPLAY);
	} else {
		if(safari.extension.settings.mediaDownload) event.contextMenu.appendContextMenuItem("download", event.userInfo.isVideo ? DOWNLOAD_VIDEO : DOWNLOAD_AUDIO);
		if(safari.extension.settings.mediaQTP) event.contextMenu.appendContextMenuItem("qtp", OPEN_IN_QUICKTIME_PLAYER);
		if(safari.extension.settings.mediaAirPlay) event.contextMenu.appendContextMenuItem("airplay", SEND_VIA_AIRPLAY);
	}
}

function doCommand(event) {
	if(event.command === "airplay") airplay(event.userInfo.url);
	else if(event.command === "stop") stop();
	else safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(event.command, event.userInfo.url);
}

safari.application.addEventListener("contextmenu", handleContextMenu, false);
safari.application.addEventListener("command", doCommand, false);