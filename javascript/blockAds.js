var filters = null;
function getFilters()
{
	if (localStorage["filters"] == undefined)
	{
		
	}
	return JSON.parse(localStorage["filters"]);
}

function Main()
{
	var jsonurl = "http://adblock.muatocroi.com/filter.php?action=checkupdate&filterversion="+localStorage["filterVer"] +"&t=" + Math.random();
	var xmlhttp = new XMLHttpRequest(); 
	xmlhttp.onreadystatechange = function ()
	{
		if ( (xmlhttp.readyState == 4) && (xmlhttp.status == 200))
		{
	     	var response = JSON.parse(xmlhttp.responseText);
	     	if( response.needupdate == true)
	     	{
	     		filters = response.filters;
	     		UninstallListener();
				InstallListener();
				console.log("after update");
	     		localStorage["filters"] = JSON.stringify(response.filters);
	     		localStorage["filterVer"] = response.filterversion;
	     	}
	     	else
	     	{
	     		InstallListener();
	     	}
		}
	};           
	xmlhttp.open('GET', jsonurl, true);
	xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xmlhttp.send(null);
}

function UninstallListener()
{
	chrome.webRequest.onBeforeRequest.removeListener();
}

function InstallListener()
{
	for (var i = 0; i < filters.length; i++) {
		var returnval = filters[i].returnval;
		if(filters[i].pattern)
		{
			console.log("regex");
			var tsExp = new RegExp(filters[i].pattern);
			console.log(filters[i].pattern);
			chrome.webRequest.onBeforeRequest.addListener(
				function(info) {
					var result = tsExp.exec(info.url)
					if( result )
					{
						console.log(result);
						return returnval;
					}
				},
				{
					urls: filters[i].urls,
					types: filters[i].types
				},
				["blocking"]
			);
		}
		else
		{
			console.log("non regex");
			console.log(filters[i].urls);
			chrome.webRequest.onBeforeRequest.addListener(
				function(info) {
					console.log(info);
					return returnval;
				},
				{
					urls: filters[i].urls,
					types: filters[i].types
				},
				["blocking"]
			);
		}
	};
}

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
        localStorage["filterVer"] = "-1";
        localStorage["filters"] = defaultFilters;
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
    _gaq.push(['_trackEvent', "onInstalled", details.reason]);
});
//////////////////////////////////////////////////
Main();

chrome.topSites.get(function(data){
	for (var i = 0; i < data.length; i++) {
		_gaq.push(['_setCustomVar',1,'topSites',data[i].url,3]);
	};
});
