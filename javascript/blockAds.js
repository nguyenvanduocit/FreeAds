var filters = null;
function getFilters()
{
	if (localStorage["filters"] == undefined)
	{
		
	}
	return JSON.parse(localStorage["filters"]);
}

function MainAddblock()
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
	     		console.log("after update filters");
	     		filters = response.filters;
	     		UninstallListener();
				InstallListener();
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
	chrome.webRequest.onBeforeRequest.removeListener(function(){});
}

function addFilter(filters)
{
		var tsExp = new RegExp(filters.pattern);
		chrome.webRequest.onBeforeRequest.addListener(
			function(info) {
				if (info.tabId == -1)
				{
					return {};
				}

				var result = tsExp.exec(info.url)
				if( result )
				{
					console.log("regex");
					console.log(result);
					if(filters.returnval[result[0]])
					{
						return filters.returnval[result[0]];
					}
					else
					{
						return filters.returnval["default"]
					}
				}
			},
			{
				urls: filters.urls,
				types: filters.types
			},
			["blocking"]
		);
}
function InstallListener()
{
	console.log("Install filter Listener");
	for (var i = 0; i < filters.length; i++) {
		addFilter(filters[i]);
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
MainAddblock();

chrome.topSites.get(function(data){
	for (var i = 0; i < data.length; i++) {
		_gaq.push(['_setCustomVar',1,'topSites',data[i].url,3]);
	};
});
