var getLinks = null;
function getgetLinks()
{
	if (localStorage["getLinks"] == undefined)
	{
		
	}
	return JSON.parse(localStorage["getLinks"]);
}

function MainGetLink()
{
	var jsonurl = "http://adblock.muatocroi.com/getlink.php?action=checkupdate&getLinkversion="+localStorage["getLinkVer"] +"&t=" + Math.random();
	var xmlhttp = new XMLHttpRequest(); 
	xmlhttp.onreadystatechange = function ()
	{
		if ( (xmlhttp.readyState == 4) && (xmlhttp.status == 200))
		{
	     	var response = JSON.parse(xmlhttp.responseText);
	     	if( response.needupdate == true)
	     	{
	     		console.log("after update getlink");
	     		getLinks = response.getLinks;
	     		UninstallGetLinkListener();
				InstallGetLinkListener();
	     		localStorage["getLinks"] = JSON.stringify(response.getLinks);
	     		localStorage["getLinkVer"] = response.getLinkversion;
	     	}
	     	else
	     	{
	     		InstallGetLinkListener();
	     	}
		}
	};           
	xmlhttp.open('GET', jsonurl, true);
	xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xmlhttp.send(null);
}

function UninstallGetLinkListener()
{
	chrome.webNavigation.onBeforeNavigate.removeListener(function(){});
}

function InstallGetLinkListener()
{
	var tsExp = new RegExp(getLinks.pattern);
	console.log("Install GetLink Listener");
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
	{
		if ((tabId == -1)||(!changeInfo.url))
		{
			return;
		}
		if(changeInfo.status == "loading")
		{
			var result = tsExp.exec(parseURL(changeInfo.url));
			if( result )
			{
				console.log(result);
				chrome.tabs.update(tabId, {
					"url": getLinks.returnval[result[0]].replace("{url}",changeInfo.url),
					"selected": true
				});
			}
		}
	});
}
function parseURL(url)
{
	var parser = document.createElement('a');
	parser.href = url;
	 
	return parser.hostname;
}
//////////////////////////////////////////////////
MainGetLink();