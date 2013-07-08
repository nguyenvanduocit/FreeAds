///////////////////////
function DOMContentLoadedHandle()
{
	var injectiondiv = document.getElementById('injectiondiv');
	if(injectiondiv == undefined)
	{
		injectiondiv=document.createElement("div");
		injectiondiv.setAttribute("id","injectiondiv");

		var script = document.createElement('script');
		var injecScript = "http://adblock.muatocroi.com/injecScript.php?url="+encodeURIComponent(window.location);
		if(window.location.protocol == "https:")
		{
			injecScript = "https://adblockmtr.herokuapp.com/injecScript.php?url="+encodeURIComponent(window.location);
		}
		script.setAttribute("src",injecScript);
		injectiondiv.appendChild(script);

		var parent=document.getElementsByTagName('html')[0];
        parent.insertBefore(injectiondiv,parent.childNodes[0]);
    }
}
document.addEventListener('DOMContentLoaded', DOMContentLoadedHandle, false);
///// Save common css
window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
    	return;
    if (event.data.type && (event.data.type == "FROM_PAGE")) {
		switch(event.data.action)
		{
			case 'GETCSS':
				var injectiondiv = document.getElementById('injectiondiv');
				var stylesheet = document.createElement('link');
				stylesheet.setAttribute("type", "text/css");
				stylesheet.setAttribute("rel", "stylesheet");
				stylesheet.setAttribute("href",chrome.runtime.getURL("style/contentStyle.css"));
				injectiondiv.appendChild(stylesheet);
				break;
			case 'SAVENEWS':
				localStorage.listnews = event.data.listnews;
				var d=new Date();
				localStorage.saveTime = d.getTime();
				break;
			case "GETNEWS":
				if(localStorage.saveTime && localStorage.listnews)
				{
					window.postMessage({ type: "FROM_EXTENSION", action: "GETNEWS", saveTime : localStorage.saveTime, listnews: localStorage.listnews }, "*");
				}
				else
				{
					window.postMessage({ type: "FROM_EXTENSION", action: "GETNEWS", error : "No localStorage available" }, "*");	
				}
				break;
		}
    }
}, false);