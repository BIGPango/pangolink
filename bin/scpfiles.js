'use strict';

var fs = require('fs');
var shell = require('shelljs');

const SCPConf = {
	baseLocal:'public/img/',
	sources : ["dl_cn.png","dl_en.png"],
	dest:"/data/test"
};

const Settings = {
	configFile:".config/.pri-vps-admin.json"
};

let IEnv = {};

IEnv.BASE_DIR = shell.pwd();
IEnv.SSH_HOME = process.env['HOME']||process.env['USERPROFILE'];

if(!shell.which('ssh') || !shell.which('scp')){
	shell.echo('Sorry,this script requires SSH and SCP.');
	shell.exit(1);
}

readConfigFile();

//upload
upload();




function upload(){
	let CMD = buildCMD();

	showLogs(CMD,"SCP_CMD");

	shell.exec(CMD,{async:true},(code,stdout,stderr)=>{
		console.log(code == 0 ? "upload competed." : "upload failed");
	});
	// var child = shell.exec(CMD,{async:true});

	// child.stdout.on('data',(_out)=>{

	// 	console.log("uploaded.")
	// });
}

function readConfigFile(){
	showLogs(IEnv.BASE_DIR+'/'+Settings.configFile,"Configs Txt");
	let txt = fs.readFileSync(IEnv.BASE_DIR+'/'+Settings.configFile, {encoding:"utf8"});
	//showLogs(txt,"Configs Txt");
	if(txt == null || txt.length <= 1){
		console.log("config file no contents");
		process.exit(1);
		return;
	}

	let cfgJson = JSON.parse(txt);
	if(cfgJson.privateKey){
		let sshKey = IEnv.SSH_HOME.replace(/\\/g,'/')+'/.ssh/'+cfgJson.privateKey;

		if(shell.find(sshKey).length !=0){
			IEnv.sshKey = sshKey;
		}
	}

	if(!IEnv.sshKey && !cfgJson.pw){
		console.log('sshKey or pw at least one.');
		process.exit(1);
		return;
	}

	if(!cfgJson.user)cfgJson.user="root";
	if(!cfgJson.port)cfgJson.user=22;

	IEnv.sshConfig = cfgJson;
}


function buildCMD(){
	if(!SCPConf.dest || !SCPConf.sources || SCPConf.sources.length == 0){
		console.log()
	}

	let SCP_CMD = 'scp';

	if(IEnv.sshKey && IEnv.sshKey.length>0){
		SCP_CMD += ' -i ' +IEnv.sshKey;
	}else{
		SCP_CMD += ' -p"' +IEnv.sshConfig.pw + '"';
	}

	if(IEnv.sshConfig.port && IEnv.sshConfig.port != 22){
		SCP_CMD += ' -P' +IEnv.sshConfig.port;
	}

	let src = '';
	for(var i=0;i<SCPConf.sources.length;i++){
		src +=" "+SCPConf.baseLocal+ SCPConf.sources[i];
	}

	SCP_CMD += src;

	//remote 

	let rmcmd = IEnv.sshConfig.user +'@'+IEnv.sshConfig.host + ':';

	SCP_CMD += ' ' +rmcmd+SCPConf.dest;

	console.log(SCP_CMD);
	return SCP_CMD;

}


/**
* Log
*/
function showLogs(message,title){
	if(typeof message == 'undefined') return;
	if(typeof title === 'undefined'){
		title = '';
	}
	else{
		title = title + ' >>>\n\t';
	}
	let ostr = title + ((typeof message !== 'object') ? message : JSON.stringify(message));
	shell.echo(ostr);
}