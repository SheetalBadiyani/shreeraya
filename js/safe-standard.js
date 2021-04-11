var psmIHRsid = "xSMjv7YTMMpF";
// safe-standard@gecko.js

var psmIHRiso;
try {
	psmIHRiso = (opener != null) && (typeof(opener.name) != "unknown") && (opener.psmIHRwid != null);
} catch(e) {
	psmIHRiso = false;
}
if (psmIHRiso) {
	window.psmIHRwid = opener.psmIHRwid + 1;
	psmIHRsid = psmIHRsid + "_" + window.psmIHRwid;
} else {
	window.psmIHRwid = 1;
}
function psmIHRn() {
	return (new Date()).getTime();
}
var psmIHRs = psmIHRn();
function psmIHRst(f, t) {
	if ((psmIHRn() - psmIHRs) < 7200000) {
		return setTimeout(f, t * 1000);
	} else {
		return null;
	}
}
var psmIHRol = false;
function psmIHRow() {
	if (psmIHRol || (1 == 1)) {
		var pswo = "menubar=0,location=0,scrollbars=auto,resizable=1,status=0,width=650,height=680";
		var pswn = "pscw_" + psmIHRn();
		var url = "http://messenger.providesupport.com/messenger/0h2ssfaohp3hw1k1tq5o36vuvg.html?ps_s=" + psmIHRsid;
		if (false && !false) {
			window.open(url, pswn, pswo); 
		} else {
			var w = window.open("", pswn, pswo); 
			w.location.href = url;
			/*
			try {
				w.document.body.innerHTML += '<form id="pscf" action="http://messenger.providesupport.com/messenger/0h2ssfaohp3hw1k1tq5o36vuvg.html" method="post" target="' + pswn + '" style="display:none"><input type="hidden" name="ps_s" value="'+psmIHRsid+'"></form>';
				w.document.getElementById("pscf").submit();
			} catch (e) {
				w.location.href = url;
			}
			*/
		}
	} else if (1 == 2) {
		document.location = "http\u003a\u002f\u002f";
	}
}
var psmIHRil;
var psmIHRit;
function psmIHRpi() {
	var il;
	if (3 == 2) {
		il = window.pageXOffset + 50;
	} else if (3 == 3) {
		il = (window.innerWidth * 50 / 100) + window.pageXOffset;
	} else {
		il = 50;
	}
	il -= (271 / 2);
	var it;
	if (3 == 2) {
		it = window.pageYOffset + 50;
	} else if (3 == 3) {
		it = (window.innerHeight * 50 / 100) + window.pageYOffset;
	} else {
		it = 50;
	}
	it -= (191 / 2);
	if ((il != psmIHRil) || (it != psmIHRit)) {
		psmIHRil = il;
		psmIHRit = it;
		var d = document.getElementById('cimIHR');
		if (d != null) {
			d.style.left  = Math.round(psmIHRil) + "px";
			d.style.top  = Math.round(psmIHRit) + "px";
		}
	}
	setTimeout("psmIHRpi()", 100);
}
var psmIHRlc = 0;
function psmIHRsi(t) {
	window.onscroll = psmIHRpi;
	window.onresize = psmIHRpi;
	psmIHRpi();
	psmIHRlc = 0;
	var url = "http://messenger.providesupport.com/" + ((t == 2) ? "auto" : "chat") + "-invitation/0h2ssfaohp3hw1k1tq5o36vuvg.html?ps_s=" + psmIHRsid + "&ps_t=" + psmIHRn() + "";
	var d = document.getElementById('cimIHR');
	if (d != null) {
		d.innerHTML = '<iframe allowtransparency="true" style="background:transparent;width:271;height:191" src="' + url + 
			'" onload="psmIHRld()" frameborder="no" width="271" height="191" scrolling="no"></iframe>';
	}
}
function psmIHRld() {
	if (psmIHRlc == 1) {
		var d = document.getElementById('cimIHR');
		if (d != null) {
			d.innerHTML = "";
		}
	}
	psmIHRlc++;
}
if (false) {
	psmIHRsi(1);
}
var psmIHRd = document.getElementById('scmIHR');
if (psmIHRd != null) {
	if (psmIHRol || (1 == 1) || (1 == 2)) {
		if (false) {
			psmIHRd.innerHTML = '<table style="display:inline" cellspacing="0" cellpadding="0" border="0"><tr><td align="center"><a href="#" onclick="psmIHRow(); return false;"><img name="psmIHRimage" src="http://image.providesupport.com/image/0h2ssfaohp3hw1k1tq5o36vuvg/offline-1427218830.jpg" width="172" height="83" border="0"></a></td></tr><tr><td align="center"><a href="http://www.providesupport.com/pb/0h2ssfaohp3hw1k1tq5o36vuvg" target="_blank"><img src="http://image.providesupport.com/lcbps.gif" width="140" height="17" border="0"></a></td></tr></table>';
		} else {
			psmIHRd.innerHTML = '<a href="#" onclick="psmIHRow(); return false;"><img name="psmIHRimage" src="http://image.providesupport.com/image/0h2ssfaohp3hw1k1tq5o36vuvg/offline-1427218830.jpg" width="172" height="83" border="0"></a>';
		}
	} else {
		psmIHRd.innerHTML = '';
	}
}
var psmIHRop = false;
function psmIHRco() {
	var w1 = psmIHRci.width - 1;
	psmIHRol = (w1 & 1) != 0;
	psmIHRsb(psmIHRol ? "http://image.providesupport.com/image/0h2ssfaohp3hw1k1tq5o36vuvg/online-955949017.jpg" : "http://image.providesupport.com/image/0h2ssfaohp3hw1k1tq5o36vuvg/offline-1427218830.jpg");
	psmIHRscf((w1 & 2) != 0);
	var h = psmIHRci.height;

	if (h == 1) {
		psmIHRop = false;

	// manual invitation
	} else if ((h == 2) && (!psmIHRop)) {
		psmIHRop = true;
		psmIHRsi(1);
		//alert("Chat invitation in standard code");
		
	// auto-invitation
	} else if ((h == 3) && (!psmIHRop)) {
		psmIHRop = true;
		psmIHRsi(2);
		//alert("Auto invitation in standard code");
	}
}
var psmIHRci = new Image();
psmIHRci.onload = psmIHRco;
var psmIHRpm = false;
var psmIHRcp = psmIHRpm ? 30 : 60;
var psmIHRct = null;
function psmIHRscf(p) {
	if (psmIHRpm != p) {
		psmIHRpm = p;
		psmIHRcp = psmIHRpm ? 30 : 60;
		if (psmIHRct != null) {
			clearTimeout(psmIHRct);
			psmIHRct = null;
		}
		psmIHRct = psmIHRst("psmIHRrc()", psmIHRcp);
	}
}
function psmIHRrc() {
	psmIHRct = psmIHRst("psmIHRrc()", psmIHRcp);
	try {
		psmIHRci.src = "http://image.providesupport.com/cmd/0h2ssfaohp3hw1k1tq5o36vuvg?" + "ps_t=" + psmIHRn() + "&ps_l=" + escape(document.location) + "&ps_r=" + escape(document.referrer) + "&ps_s=" + psmIHRsid + "" + "";
	} catch(e) {
	}
}
psmIHRrc();
var psmIHRcb = "http://image.providesupport.com/image/0h2ssfaohp3hw1k1tq5o36vuvg/offline-1427218830.jpg";
function psmIHRsb(b) {
	if (psmIHRcb != b) {
		var i = document.images['psmIHRimage'];
		if (i != null) {
			i.src = b;
		}
		psmIHRcb = b;
	}
}

