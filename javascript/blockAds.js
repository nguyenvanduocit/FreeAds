
var defaultFilters ="http://admicro2-hcm.vcmedia.vn/*,http://admicro1.vcmedia.vn/*,http://da.vcdn.vn/*,http://b.123c.vn/*,http://ad.zing.vn/*,http://affiliate.123.vn/*,http://ads-by.madadsmedia.com/*,http://phim3s.net/ad/*,*://123linkad.vn/*,http://ads.beonline.com.vn/*,*://click.uniad.vn/*,*://e.eclick.vn/*,*://st.polyad.net/*,http://*/imgqc*,http://ads.nhaccuatui.com/*,http://mp3.zing.vn/xml/adv/song,http://*.vietad.vn/*,*://*.doubleclick.net/*,*://*.googleadservices.com/*";

function setFilters(newFilters) {
	if (newFilters instanceof String)
	{
		localStorage["filters"] = newFilters;
	}
}
function getFilters()
{
	if (localStorage["filters"] == undefined)
	{
		setFilters(defaultFilters);
	}
	var filter = String(localStorage["filters"]);
	return filter.split(',');
}

function updateFilter(callback)
{
	var jsonurl = "http://muatocroi.com/addition/googlechromeEx/removeads/filter.php?action=getfilter&t=" + Math.random();
	var req = new XMLHttpRequest(); 
	req.onreadystatechange = function (aEvt) {
		if (req.readyState == 4) {
		     if(req.status == 200)
		     {
		     	var response = JSON.parse(req.responseText);
		     	localStorage["filters"] = response.filters;
		     	callback();
		     }
		  }
	};           
	req.open('GET', jsonurl, true);
	req.send(null);
}

function Main()
{
	var jsonurl = "http://muatocroi.com/addition/googlechromeEx/removeads/filter.php?action=getversion&t=" + Math.random();
	var req = new XMLHttpRequest(); 
	req.onreadystatechange = function (aEvt) {
		if (req.readyState == 4) {
		     if(req.status == 200)
		     {
		     	var response = JSON.parse(req.responseText);
		     	if( (localStorage["filterVer"] == undefined) || (parseInt(localStorage["filterVer"]) < response.version) )
		     	{
		     		updateFilter(function(){
		     			localStorage["filterVer"] = response.version;
		     			UninstallListener();
		     			console.log("after update");
						InstallListener();
		     		});
		     	}
		     	else
		     	{
		     		InstallListener();
		     	}
		     }
		  }
	};           
	req.open('GET', jsonurl, true);
	req.send(null);
	
}

function UninstallListener()
{
	chrome.webRequest.onBeforeRequest.removeListener();
}

function InstallListener()
{
	var allFilters = getFilters();
	console.log("filter : "+allFilters);
	chrome.webRequest.onBeforeRequest.addListener(
		function(info) {
			console.log(info);
			return {cancel: true};
		},
	  // filters
		{
			urls: allFilters,
			types: ["main_frame","sub_frame", "script","object","stylesheet","image"]
		},
		["blocking"]
	);
}
//////////////////////////////////////////////////
Main();