var fs = require('fs');
var path = require('path');
var request = require('request');

//生成打包后的文件信息列表
function getFileList(dir, fileList) {
    var files = fs.readdirSync(dir);
    
    fileList = fileList || [];

    files.forEach(function(file) {
        var filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            var childList = getFileList(filePath, []);
            fileList.push({
                [file]: childList
            });
        } else {
            fileList.push(file);
        }
    });
    return JSON.stringify(fileList, null, 2);
};

//上传文件
function uploadFile(url,fileList,callback){
	var fd = [];
	for(var i=0;i<fileList.length;i++){
		fd.push({
			key:fileList[i].name,
			value:fs.createReadStream(fileList[i].path)
		});
	}
	request.post({url,fd},function(err,res){
		if(err){
			callback(err);
			return;
		}
		callback();
	})
}

//一个打包完成后，生成文件信息json，并把打包后的文件发布到指定位置的plugin
function AfterEmitHandlePlugin(options){
	this.jsonPath = options.jsonPath;//生成的json文件存放的位置
	this.url = options.url;//发送到该url
}

AfterEmitHandlePlugin.prototype.apply = function(compiler){
	var jsonPath = this.jsonPath;
	var url = this.url;

	//将内存中的assets内容写入到磁盘后触发
	compiler.plugin('after-emit',function(compilation,callback){
		//生成文件信息json
		var distList = getFileList('./dist', []);
        fs.writeFile(jsonPath,distList,{},function(err){
        	if(err) throw err;
        })

        //传输文件
        var fileList = [];
        for(var key in compilation.assets){
        	if(compilation.assets[key].existsAt){
        		fileList.push({name:key,path:compilation.assets[key].existsAt})
        	}
        }
        uploadFile(url,fileList,callback);
	})
}

module.exports = AfterEmitHandlePlugin;