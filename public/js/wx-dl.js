const DLCnst ={
  isWxBrowser:false,
  isQQInstall:false,
  isQQBrowser:false,
  gitRelease:"https://github.com/BIGPango/pangolink/releases/download/",
  gitVersion:"v1.2",
  apkGithub:"pangolin-release.apk",
  tips: {
  	open_cn:"",
  	open_en:""
  },
  clsVaribles : {
	aBtn:'dl-btn',
	imgCls:'qrcode-img',
	dlTip:'dl-tips'
  }
};

function initBrowserType(){
	var ua = navigator.userAgent.toLowerCase();
	if(ua.indexOf(' qq')>-1 && ua.indexOf('mqqbrowser') <0 ){
		//inner QQ
		DLCnst.isQQInstall = true;
		return;
	}

	if(ua.indexOf('mqqbrowser') >-1 && ua.indexOf(' qq')<0){
		DLCnst.isQQBrowser = true;
		return;
	}

	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		DLCnst.isWxBrowser = true;
		return;
	}
}

function getDownloadUrl(){
	return DLCnst.gitRelease + DLCnst.gitVersion + "/" +DLCnst.apkGithub;
}

function Initialize(){
	initBrowserType();
	let url = getDownloadUrl();
	let $mainEL = $("#android");
	fillBtn(url);
	if(DLCnst.isWxBrowser || DLCnst.isQQInstall || DLCnst.isQQBrowser){
		$('div.'+DLCnst.clsVaribles.dlTip).removeClass('d-none');
		$mainEL.find('p.'+DLCnst.clsVaribles.dlTip).removeClass('d-none');
		$mainEL.find('a.'+DLCnst.clsVaribles.aBtn).addClass('d-none');

	}else{
		$('div.'+DLCnst.clsVaribles.dlTip).addClass('d-none');
		$mainEL.find('p.'+DLCnst.clsVaribles.dlTip).addClass('d-none');
		$mainEL.find('a.'+DLCnst.clsVaribles.aBtn).removeClass('d-none');
		let href = _getAttFileUrl('android');
		//console.log(href);
		if(href)$mainEL.find('a.'+DLCnst.clsVaribles.aBtn).attr('href',href);
	}


}

function fillBtn(url){
	$("a.apk-btn").attr('href',url);
	$("p.p-dlurl").text(url);
}
