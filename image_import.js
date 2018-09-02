var fs = require('fs');
var https = require('https');

var csv = require('csv-parser');
var xml = require('xml-parser');

var TGA = require('tga');
var PNG = require('pngjs').PNG;
var PNGCrop = require('png-crop');


var dataServerPath = 'https://raw.githubusercontent.com/PieceOfPaper/Tree-of-IPF/master/';
var serverCode = 'kr';

// ---------- 이미지 삭제
deleteFolderRecursive('./web/img/raw');
function deleteFolderRecursive(path){
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
          var curPath = path + "/" + file;
          if (fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
}


// ---------- 아이콘 이미지 복사
// if (!fs.existsSync('./web/data/ui.ipf')) fs.mkdirSync('./web/data/ui.ipf');
// if (!fs.existsSync('./web/data/ui.ipf/baseskinset')) fs.mkdirSync('./web/data/ui.ipf/baseskinset');
// if (!fs.existsSync('./web/img')) fs.mkdirSync('./web/img');
// if (!fs.existsSync('./web/img/raw')) fs.mkdirSync('./web/img/raw');
// if (!fs.existsSync('./web/img/raw/skin')) fs.mkdirSync('./web/img/raw/skin');
// if (!fs.existsSync('./web/img/raw/icon')) fs.mkdirSync('./web/img/raw/icon');
// if (!fs.existsSync('./web/img/raw/icon/skill')) fs.mkdirSync('./web/img/raw/icon/skill');
// if (!fs.existsSync('./web/img/raw/icon/skill/wizard')) fs.mkdirSync('./web/img/raw/icon/skill/wizard');
// if (!fs.existsSync('./web/img/raw/icon/skill/archer')) fs.mkdirSync('./web/img/raw/icon/skill/archer');
// if (!fs.existsSync('./web/img/raw/icon/skill/cleric')) fs.mkdirSync('./web/img/raw/icon/skill/cleric');
// if (!fs.existsSync('./web/img/raw/icon/skill/warrior')) fs.mkdirSync('./web/img/raw/icon/skill/warrior');
// if (!fs.existsSync('./web/img/icon')) fs.mkdirSync('./web/img/icon');
// if (!fs.existsSync('./web/img/icon/classicon')) fs.mkdirSync('./web/img/icon/classicon');
// if (!fs.existsSync('./web/img/icon/skillicon')) fs.mkdirSync('./web/img/icon/skillicon');
// if (!fs.existsSync('./web/img/icon/itemicon')) fs.mkdirSync('./web/img/icon/itemicon');
// if (!fs.existsSync('./web/img/icon/monillust')) fs.mkdirSync('./web/img/icon/monillust');
// if (!fs.existsSync('./web/img/icon/mongem')) fs.mkdirSync('./web/img/icon/mongem');

importImage('ui.ipf/baseskinset/classicon.xml', './web/img/icon/classicon', false, function(){
  importImage('ui.ipf/baseskinset/skillicon.xml', './web/img/icon/skillicon', false, function(){
    importImage('ui.ipf/baseskinset/monillust.xml', './web/img/icon/monillust', false, function(){
      importImage('ui.ipf/baseskinset/mongem.xml', './web/img/icon/mongem', false, function(){
        importImage('ui.ipf/baseskinset/baseskinset.xml', './web/img', false, function(){
          importImage('ui.ipf/baseskinset/eventbanner.xml', './web/img/eventbanner', false, function(){
            importImage('ui.ipf/baseskinset/helpimage.xml', './web/img/helpimage', false, function(){
              console.log("IMAGE IMPORT SUCCESS");
            });
          });
        });
      });
    });
  });
});
function importImage(srcPath, dstPath, useCategory, callback){
  autoMkDir('./web/data/' + srcPath);
  var file = fs.createWriteStream('./web/data/' + srcPath);
  var request = https.get(dataServerPath + serverCode + '/' + srcPath, function(response) {
    response.pipe(file).on('close', function(){
      console.log('download ' + srcPath);
      //fs.createReadStream('./web/data/' + srcPath).on('data', function (data) {
      fs.readFile('./web/data/' + srcPath, function(error, data){
        //console.log(data.toString());
        var xmlData = xml(data.toString());
        var dataList = [];
        
        if (xmlData.root === undefined || xmlData.root.children === undefined)
          return;

        //console.log(xmlData.root.name + ' ' + xmlData.root.children.length);
        
        //xml 데이터 세팅
        for (var i = 0; i < xmlData.root.children.length; i ++){
          //console.log(xmlData.root.children[i].name + ' ' + xmlData.root.children[i].children.length);
          for (var j = 0; j < xmlData.root.children[i].children.length; j ++){
            //console.log(xmlData.root.children[i].children[j].name + ' ' + xmlData.root.children[i].children[j].attributes['name'] + ' ' + xmlData.root.children[i].children[j].children.length);
            if (xmlData.root.children[i].name.indexOf('skinlist') > -1){
              for (var k = 0; k < xmlData.root.children[i].children[j].children.length; k ++){
                var data = [];
                if (xmlData.root.children[i].attributes['category'] != undefined && useCategory){
                  data['category'] = xmlData.root.children[i].attributes['category'];
                }
                if (xmlData.root.children[i].children[j].attributes['name'] === undefined || xmlData.root.children[i].children[j].children[k].attributes['name'] === undefined) continue;
                data['name'] = xmlData.root.children[i].children[j].attributes['name'].toString().toLowerCase() + '_' + xmlData.root.children[i].children[j].children[k].attributes['name'].toString().toLowerCase();
                data['file'] = xmlData.root.children[i].children[j].attributes['texture'];
                data['imgrect'] = xmlData.root.children[i].children[j].children[k].attributes['imgrect'];
                dataList.push(data);
              }
            } else {
              var data = [];
              if (xmlData.root.children[i].attributes['category'] != undefined && useCategory){
                data['category'] = xmlData.root.children[i].attributes['category'];
              }
              if (xmlData.root.children[i].children[j].attributes['name'] === undefined) continue;
              data['name'] = xmlData.root.children[i].children[j].attributes['name'].toString().toLowerCase();
              data['file'] = xmlData.root.children[i].children[j].attributes['file'];
              data['imgrect'] = xmlData.root.children[i].children[j].attributes['imgrect'];
              dataList.push(data);
            }
          }
        }
        console.log('data set ' + srcPath + ' ' + dataList.length);

        var dataIndex = -1;
        downloadFunc(function(){
          copyFunc(function(){
            console.log('import success ' + srcPath);
            if (callback != undefined){
              callback();
            }
          });
        });

        //다운로드
        function downloadFunc(nextFunc) {
          dataIndex ++;
          if (dataIndex >= dataList.length){
            dataIndex = -1;
            if (nextFunc != undefined) nextFunc();
            return;
          }
          //console.log('downloadFunc ' + dataIndex);

          if (dataList[dataIndex]['file'] != undefined &&
            dataList[dataIndex]['file'].length != 0 &&
            fs.existsSync(pathMerge('./web/img/raw', dataList[dataIndex]['file'])) == false){

              var rawSrcPath = pathMerge(dataServerPath + serverCode + '/ui.ipf', dataList[dataIndex]['file']);
              var rawFilePath = pathMerge('./web/img/raw', dataList[dataIndex]['file']);

              autoMkDir(rawFilePath);

              var rawFile = fs.createWriteStream(rawFilePath);

              //console.log('downloading ' + dataList[dataIndex]['file']);
              var rawFileReq = https.get(rawSrcPath, function(response) {
                response.pipe(rawFile).on('close', function(){
                  //console.log('downloaded ' + dataList[dataIndex]['file']);
                  
                  var targetPath = pathMerge('./web/img/raw', dataList[dataIndex]['file']);

                  // TGA이면 PNG로 변환
                  if (dataList[dataIndex]['file'].indexOf('.tga') > -1){
                    var buffer = fs.readFileSync(targetPath);
                    if (buffer.byteLength < 100){
                      console.log('invalid byte size ' + dataList[dataIndex]['file'] + ' ' + buffer.byteLength);
                      downloadFunc(nextFunc);
                      return;
                    }
                    var tga = new TGA(buffer);
                    var png = new PNG({
                        width: tga.width,
                        height: tga.height
                    });
                    png.data = tga.pixels;
                    png.pack().pipe(fs.createWriteStream(targetPath + '.png').on('close', function() {
                      //console.log('tga2png ' + dataList[dataIndex]['file']);
                      downloadFunc(nextFunc);
                    }));
                  } else {
                    downloadFunc(nextFunc);
                  }
                });
              });
          } else {
            //console.log('skip ' + dataIndex);
            downloadFunc(nextFunc);
          }
        }

        // 이미지 복사
        function copyFunc(nextFunc){
          dataIndex ++;
          if (dataIndex >= dataList.length){
            dataIndex = -1;
            if (nextFunc != undefined) nextFunc();
            return;
          }
          //console.log('copyFunc ' + dataIndex);

          if (dataList[dataIndex]['file'] != undefined && dataList[dataIndex]['name'] != undefined) {
            var targetPath = pathMerge('./web/img/raw', dataList[dataIndex]['file']);
            var outputPath = dstPath + '/' + dataList[dataIndex]['name'];
            if (dataList[dataIndex]['category'] === undefined){
              outputPath = dstPath + '/' + dataList[dataIndex]['name'];
            } else {
              outputPath = dstPath + '/' + dataList[dataIndex]['category'] + '/' + dataList[dataIndex]['name'];
            }
  
            if (dataList[dataIndex]['file'].indexOf('.tga') > -1){
              targetPath += '.png';
              outputPath += '.png';
              autoMkDir(outputPath);
              if (fs.existsSync(targetPath) && 
                dataList[dataIndex]['imgrect'] != undefined && 
                dataList[dataIndex]['imgrect'].split(' ').length >= 4){
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                var rect = dataList[dataIndex]['imgrect'].split(' ');
                var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
                PNGCrop.crop(targetPath, outputPath, config1, function(err) {
                  if (err) throw err;
                  //console.log('crop ' + dataList[dataIndex]['name']);
                  copyFunc(nextFunc);
                });
              } else {
                console.log('invalid img ' + dataList[dataIndex]['name']);
                copyFunc(nextFunc);
              }
            } else {
              outputPath += '.' + getExtention(targetPath);
              autoMkDir(outputPath);
              if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
              fs.createReadStream(targetPath).pipe(fs.createWriteStream(outputPath).on('close', function() {
                //console.log('copy ' + dataList[dataIndex]['name']);
                copyFunc(nextFunc);
              }));
            }
          } else {
            //console.log('skip ' + dataList[dataIndex]['name']);
            copyFunc(nextFunc);
          }
        }


      });
    });
  });
}


// // ---------- 클래스 아이콘 이미지 복사
// var classiconXmlData;
// var classiconXmlList = [];
// var classiconXmlListIndex = -1;
// //classiconLoad();
// function classiconLoad(){
//   var path = 'ui.ipf/baseskinset/classicon.xml';
//   var file = fs.createWriteStream('./web/data/' + path);
//   var request = http.get(dataServerPath + serverCode + '/' + path, function(response) {
//     response.pipe(file).on('close', function(){
//       console.log('download ' + path);
//       fs.createReadStream('./web/data/' + path).on('data', function (data) {
//         classiconXmlData = xml(data.toString());
//             for (var i = 0; i < classiconXmlData.root.children.length; i ++){
//               for (var j = 0; j < classiconXmlData.root.children[i].children.length; j ++){
//                 //if (classiconXmlData.root.children[i].children[j].attributes['file'].indexOf('.tga') < 0) continue;
//                 classiconXmlList.push(classiconXmlData.root.children[i].children[j]);
//               }
//             }
//             console.log('classiconTGA2PNG Start ' + classiconXmlList.length);
//             classiconXmlListIndex = -1;
//             classiconTGA2PNG();
//       });
//     });
//   });
// }
// function classiconTGA2PNG(){
//   classiconXmlListIndex ++;
//   if (classiconXmlListIndex >= classiconXmlList.length){
//     console.log('classiconTGA2PNG End ' + classiconXmlListIndex);
//     console.log('classiconCrop Start ' + classiconXmlList.length);
//     classiconXmlListIndex = -1;
//     classiconCrop();
//     return;
//   }
//   if (!fs.existsSync('../Tree-of-IPF/kr/ui.ipf' + classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/')) || 
//     fs.existsSync('./web/img' + classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//       console.log('classiconTGA2PNG Skip [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['file']);
//       classiconTGA2PNG();
//     return;
//   }
//   if (classiconXmlList[classiconXmlListIndex].attributes['file'].indexOf('.png') > -1){
//     var inPath = '../Tree-of-IPF/kr/ui.ipf' + classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
//     var outPath = './web/img/icon/classicon/' + classiconXmlList[classiconXmlListIndex].attributes['name'] + '.png';
//     fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
//       console.log('classiconTGA2PNG PNG Copy [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['file']);
//       classiconTGA2PNG();
//     }));
//     return;
//   }
//   var tgapath = classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
//   var png = new PNG({
//       width: tga.width,
//       height: tga.height
//   });
//   png.data = tga.pixels;
//   png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png').on('close', function() {
//     console.log('classiconTGA2PNG Done [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['file']);
//     classiconTGA2PNG();
//   }));
// }
// function classiconCrop(){
//   classiconXmlListIndex ++;
//   if (classiconXmlListIndex >= classiconXmlList.length){
//     console.log('classiconCrop End ' + classiconXmlListIndex);
//     //skilliconLoad();
//     return;
//   }
//   if (!fs.existsSync('./web/img' + classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//     console.log('classiconCrop NoFile [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['file']);
//     classiconCrop();
//     return;
//   }
//   if (classiconXmlList[classiconXmlListIndex].attributes['file'].indexOf('.tga') < 0){
//     console.log('classiconCrop NoTGA [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['file']);
//     classiconCrop();
//     return;
//   }
//   var tgapath = classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var rect = classiconXmlList[classiconXmlListIndex].attributes['imgrect'].split(' ');
//   //console.log(classiconXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
//   var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
//   PNGCrop.crop('./web/img' + tgapath + '.png', './web/img/icon/classicon/' + classiconXmlList[classiconXmlListIndex].attributes['name'] + '.png', config1, function(err) {
//     if (err) throw err;
//     console.log('classiconCrop Done [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['name']);
//     classiconCrop();
//   });
// }


// // ---------- 스킬 아이콘 이미지 복사
// var skilliconXmlData;
// var skilliconXmlList = [];
// var skilliconXmlListIndex = -1;
// //skilliconLoad();
// function skilliconLoad(){
//   fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/skillicon.xml', function(error, data){
//     skilliconXmlData = xml(data.toString());
//     for (var i = 0; i < skilliconXmlData.root.children.length; i ++){
//       for (var j = 0; j < skilliconXmlData.root.children[i].children.length; j ++){
//         //if (skilliconXmlData.root.children[i].children[j].attributes['file'].indexOf('.tga') < 0) continue;
//         skilliconXmlList.push(skilliconXmlData.root.children[i].children[j]);
//       }
//     }
//     console.log('skilliconTGA2PNG Start ' + skilliconXmlList.length);
//     skilliconXmlListIndex = -1;
//     skilliconTGA2PNG();
//   });
// }
// function skilliconTGA2PNG(){
//   skilliconXmlListIndex ++;
//   if (skilliconXmlListIndex >= skilliconXmlList.length){
//     console.log('skilliconTGA2PNG End ' + skilliconXmlListIndex);
//     console.log('skilliconCrop Start ' + skilliconXmlList.length);
//     skilliconXmlListIndex = -1;
//     skilliconCrop();
//     return;
//   }
//   if (!fs.existsSync('../Tree-of-IPF/kr/ui.ipf' + skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/')) || 
//     fs.existsSync('./web/img' + skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//       console.log('skilliconTGA2PNG Skip [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['file']);
//       skilliconTGA2PNG();
//     return;
//   }
//   if (skilliconXmlList[skilliconXmlListIndex].attributes['file'].indexOf('.png') > -1){
//     var inPath = '../Tree-of-IPF/kr/ui.ipf' + skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/');
//     var outPath = './web/img/icon/skillicon/' + skilliconXmlList[skilliconXmlListIndex].attributes['name'] + '.png';
//     fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
//       console.log('skilliconTGA2PNG PNG Copy [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['file']);
//       skilliconTGA2PNG();
//     }));
//     return;
//   }
//   var tgapath = skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
//   var png = new PNG({
//       width: tga.width,
//       height: tga.height
//   });
//   png.data = tga.pixels;
//   png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png').on('close', function() {
//     console.log('skilliconTGA2PNG Done [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['file']);
//     skilliconTGA2PNG();
//   }));
// }
// function skilliconCrop(){
//   skilliconXmlListIndex ++;
//   if (skilliconXmlListIndex >= skilliconXmlList.length){
//     console.log('skilliconCrop End ' + skilliconXmlListIndex);
//     itemiconLoad();
//     return;
//   }
//   if (!fs.existsSync('./web/img' + skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//     console.log('skilliconCrop NoFile [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['file']);
//     skilliconCrop();
//     return;
//   }
//   if (skilliconXmlList[skilliconXmlListIndex].attributes['file'].indexOf('.tga') < 0){
//     console.log('skilliconCrop NoTGA [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['file']);
//     skilliconCrop();
//     return;
//   }
//   var tgapath = skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var rect = skilliconXmlList[skilliconXmlListIndex].attributes['imgrect'].split(' ');
//   //console.log(skilliconXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
//   var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
//   PNGCrop.crop('./web/img' + tgapath + '.png', './web/img/icon/skillicon/' + skilliconXmlList[skilliconXmlListIndex].attributes['name'] + '.png', config1, function(err) {
//     if (err) throw err;
//     console.log('skilliconCrop Done [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['name']);
//     skilliconCrop();
//   });
// }


// // ---------- 아이템 아이콘 이미지 복사
// var itemiconXmlData;
// var itemiconXmlList = [];
// var itemiconXmlListIndex = -1;
// //itemiconLoad();
// function itemiconLoad(){
//   fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/itemicon.xml', function(error, data){
//     itemiconXmlData = xml(data.toString());
//     for (var i = 0; i < itemiconXmlData.root.children.length; i ++){
//       for (var j = 0; j < itemiconXmlData.root.children[i].children.length; j ++){
//         //if (itemiconXmlData.root.children[i].children[j].attributes['file'].indexOf('.tga') < 0) continue;
//         itemiconXmlList.push(itemiconXmlData.root.children[i].children[j]);
//       }
//     }
//     console.log('itemiconTGA2PNG Start ' + itemiconXmlList.length);
//     itemiconXmlListIndex = -1;
//     itemiconTGA2PNG();
//   });
// }
// function itemiconTGA2PNG(){
//   itemiconXmlListIndex ++;
//   if (itemiconXmlListIndex >= itemiconXmlList.length){
//     console.log('itemiconTGA2PNG End ' + itemiconXmlListIndex);
//     console.log('itemiconCrop Start ' + itemiconXmlList.length);
//     itemiconXmlListIndex = -1;
//     itemiconCrop();
//     return;
//   }
//   if (!fs.existsSync('../Tree-of-IPF/kr/ui.ipf' + itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/')) || 
//     fs.existsSync('./web/img' + itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//       console.log('itemiconTGA2PNG Skip [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['file']);
//       itemiconTGA2PNG();
//     return;
//   }
//   if (itemiconXmlList[itemiconXmlListIndex].attributes['file'].indexOf('.png') > -1){
//     var inPath = '../Tree-of-IPF/kr/ui.ipf' + itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
//     var outPath = './web/img/icon/itemicon/' + itemiconXmlList[itemiconXmlListIndex].attributes['name'] + '.png';
//     fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
//       console.log('itemiconTGA2PNG PNG Copy [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['file']);
//       itemiconTGA2PNG();
//     }));
//     return;
//   }
//   var tgapath = itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
//   var png = new PNG({
//       width: tga.width,
//       height: tga.height
//   });
//   png.data = tga.pixels;
//   png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png').on('close', function() {
//     console.log('itemiconTGA2PNG Done [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['file']);
//     itemiconTGA2PNG();
//   }));
// }
// function itemiconCrop(){
//   itemiconXmlListIndex ++;
//   if (itemiconXmlListIndex >= itemiconXmlList.length){
//     console.log('itemiconCrop End ' + itemiconXmlListIndex);
//     monillustLoad();
//     return;
//   }
//   if (!fs.existsSync('./web/img' + itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//     console.log('itemiconCrop NoFile [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['file']);
//     itemiconCrop();
//     return;
//   }
//   if (itemiconXmlList[itemiconXmlListIndex].attributes['file'].indexOf('.tga') < 0){
//     console.log('itemiconCrop NoTGA [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['file']);
//     itemiconCrop();
//     return;
//   }
//   var tgapath = itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var rect = itemiconXmlList[itemiconXmlListIndex].attributes['imgrect'].split(' ');
//   //console.log(itemiconXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
//   var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
//   PNGCrop.crop('./web/img' + tgapath + '.png', './web/img/icon/itemicon/' + itemiconXmlList[itemiconXmlListIndex].attributes['name'] + '.png', config1, function(err) {
//     if (err) throw err;
//     console.log('itemiconCrop Done [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['name']);
//     itemiconCrop();
//   });
// }


// // ---------- 몬스터 아이콘 이미지 복사
// var monillustXmlData;
// var monillustXmlList = [];
// var monillustXmlListIndex = -1;
// //monillustLoad();
// function monillustLoad(){
//   fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/monillust.xml', function(error, data){
//     monillustXmlData = xml(data.toString());
//     for (var i = 0; i < monillustXmlData.root.children.length; i ++){
//       for (var j = 0; j < monillustXmlData.root.children[i].children.length; j ++){
//         //if (monillustXmlData.root.children[i].children[j].attributes['file'].indexOf('.tga') < 0) continue;
//         monillustXmlList.push(monillustXmlData.root.children[i].children[j]);
//       }
//     }
//     console.log('monillustTGA2PNG Start ' + monillustXmlList.length);
//     monillustXmlListIndex = -1;
//     monillustTGA2PNG();
//   });
// }
// function monillustTGA2PNG(){
//   monillustXmlListIndex ++;
//   if (monillustXmlListIndex >= monillustXmlList.length){
//     console.log('monillustTGA2PNG End ' + monillustXmlListIndex);
//     console.log('monillustCrop Start ' + monillustXmlList.length);
//     monillustXmlListIndex = -1;
//     monillustCrop();
//     return;
//   }
//   if (!fs.existsSync('../Tree-of-IPF/kr/ui.ipf' + monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/')) || 
//     fs.existsSync('./web/img' + monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//       console.log('monillustTGA2PNG Skip [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['file']);
//       monillustTGA2PNG();
//     return;
//   }
//   if (monillustXmlList[monillustXmlListIndex].attributes['file'].indexOf('.png') > -1){
//     var inPath = '../Tree-of-IPF/kr/ui.ipf' + monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/');
//     var outPath = './web/img/icon/monillust/' + monillustXmlList[monillustXmlListIndex].attributes['name'] + '.png';
//     fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
//       console.log('monillustTGA2PNG PNG Copy [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['file']);
//       monillustTGA2PNG();
//     }));
//     return;
//   }
//   var tgapath = monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
//   var png = new PNG({
//       width: tga.width,
//       height: tga.height
//   });
//   png.data = tga.pixels;
//   png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png').on('close', function() {
//     console.log('monillustTGA2PNG Done [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['file']);
//     monillustTGA2PNG();
//   }));
// }
// function monillustCrop(){
//   monillustXmlListIndex ++;
//   if (monillustXmlListIndex >= monillustXmlList.length){
//     console.log('monillustCrop End ' + monillustXmlListIndex);
//     mongemLoad();
//     return;
//   }
//   if (!fs.existsSync('./web/img' + monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//     console.log('monillustCrop NoFile [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['file']);
//     monillustCrop();
//     return;
//   }
//   if (monillustXmlList[monillustXmlListIndex].attributes['file'].indexOf('.tga') < 0){
//     console.log('monillustCrop NoTGA [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['file']);
//     monillustCrop();
//     return;
//   }
//   var tgapath = monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var rect = monillustXmlList[monillustXmlListIndex].attributes['imgrect'].split(' ');
//   //console.log(monillustXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
//   var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
//   PNGCrop.crop('./web/img' + tgapath + '.png', './web/img/icon/monillust/' + monillustXmlList[monillustXmlListIndex].attributes['name'] + '.png', config1, function(err) {
//     if (err) throw err;
//     console.log('monillustCrop Done [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['name']);
//     monillustCrop();
//   });
// }


// // ---------- 몬스터 젬 이미지 복사
// var mongemXmlData;
// var mongemXmlList = [];
// var mongemXmlListIndex = -1;
// //mongemLoad();
// function mongemLoad(){
//   fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/mongem.xml', function(error, data){
//     mongemXmlData = xml(data.toString());
//     for (var i = 0; i < mongemXmlData.root.children.length; i ++){
//       for (var j = 0; j < mongemXmlData.root.children[i].children.length; j ++){
//         //if (mongemXmlData.root.children[i].children[j].attributes['file'].indexOf('.tga') < 0) continue;
//         mongemXmlList.push(mongemXmlData.root.children[i].children[j]);
//       }
//     }
//     console.log('mongemTGA2PNG Start ' + mongemXmlList.length);
//     mongemXmlListIndex = -1;
//     mongemTGA2PNG();
//   });
// }
// function mongemTGA2PNG(){
//   mongemXmlListIndex ++;
//   if (mongemXmlListIndex >= mongemXmlList.length){
//     console.log('mongemTGA2PNG End ' + mongemXmlListIndex);
//     console.log('mongemCrop Start ' + mongemXmlList.length);
//     mongemXmlListIndex = -1;
//     mongemCrop();
//     return;
//   }
//   if (!fs.existsSync('../Tree-of-IPF/kr/ui.ipf' + mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/')) || 
//     fs.existsSync('./web/img' + mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//       console.log('mongemTGA2PNG Skip [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['file']);
//       mongemTGA2PNG();
//     return;
//   }
//   if (mongemXmlList[mongemXmlListIndex].attributes['file'].indexOf('.png') > -1){
//     var inPath = '../Tree-of-IPF/kr/ui.ipf' + mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/');
//     var outPath = './web/img/icon/mongem/' + mongemXmlList[mongemXmlListIndex].attributes['name'] + '.png';
//     fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
//       console.log('mongemTGA2PNG PNG Copy [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['file']);
//       mongemTGA2PNG();
//     }));
//     return;
//   }
//   var tgapath = mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
//   var png = new PNG({
//       width: tga.width,
//       height: tga.height
//   });
//   png.data = tga.pixels;
//   png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png').on('close', function() {
//     console.log('mongemTGA2PNG Done [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['file']);
//     mongemTGA2PNG();
//   }));
// }
// function mongemCrop(){
//   mongemXmlListIndex ++;
//   if (mongemXmlListIndex >= mongemXmlList.length){
//     console.log('mongemCrop End ' + mongemXmlListIndex);
//     baseskinsetLoad();
//     return;
//   }
//   if (!fs.existsSync('./web/img' + mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//     console.log('mongemCrop NoFile [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['file']);
//     mongemCrop();
//     return;
//   }
//   if (mongemXmlList[mongemXmlListIndex].attributes['file'].indexOf('.tga') < 0){
//     console.log('mongemCrop NoTGA [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['file']);
//     mongemCrop();
//     return;
//   }
//   var tgapath = mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var rect = mongemXmlList[mongemXmlListIndex].attributes['imgrect'].split(' ');
//   //console.log(mongemXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
//   var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
//   PNGCrop.crop('./web/img' + tgapath + '.png', './web/img/icon/mongem/' + mongemXmlList[mongemXmlListIndex].attributes['name'] + '.png', config1, function(err) {
//     if (err) throw err;
//     console.log('mongemCrop Done [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['name']);
//     mongemCrop();
//   });
// }


// // ---------- UI 이미지 복사
// // 하드코딩이 많으므로 주의 하도록
// var baseskinsetXmlData;
// var baseskinsetXmlList = [];
// var baseskinsetXmlListIndex = -1;
// //baseskinsetLoad();
// function baseskinsetLoad(){
//   fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/baseskinset.xml', function(error, data){
//     baseskinsetXmlData = xml(data.toString());
//     for (var i = 0; i < baseskinsetXmlData.root.children.length; i ++){
//       for (var j = 0; j < baseskinsetXmlData.root.children[i].children.length; j ++){
//         if (baseskinsetXmlData.root.children[i].attributes['texture'] != undefined){
//           baseskinsetXmlData.root.children[i].children[j].attributes['file'] = baseskinsetXmlData.root.children[i].attributes['texture'];
//         }
//         if (baseskinsetXmlData.root.children[i].attributes['name'] != undefined){
//           baseskinsetXmlData.root.children[i].children[j].attributes['folder'] = baseskinsetXmlData.root.children[i].attributes['name'];
//         }
//         baseskinsetXmlList.push(baseskinsetXmlData.root.children[i].children[j]);
//       }
//     }
//     console.log('baseskinsetTGA2PNG Start ' + baseskinsetXmlList.length);
//     baseskinsetXmlListIndex = -1;
//     baseskinsetTGA2PNG();
//   });
// }
// function baseskinsetTGA2PNG(){
//   baseskinsetXmlListIndex ++;
//   if (baseskinsetXmlListIndex >= baseskinsetXmlList.length){
//     console.log('baseskinsetTGA2PNG End ' + baseskinsetXmlListIndex);
//     console.log('baseskinsetCrop Start ' + baseskinsetXmlList.length);
//     baseskinsetXmlListIndex = -1;
//     baseskinsetCrop();
//     return;
//   }
//   if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'] === undefined){
//     console.log('baseskinsetTGA2PNG Skip Undefined[' + baseskinsetXmlListIndex + '] ');
//     baseskinsetTGA2PNG();
//     return;
//   }
//   if (!fs.existsSync(pathMerge('../Tree-of-IPF/kr/ui.ipf', baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'])) || 
//     fs.existsSync(pathMerge('./web/img', baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']) + '.png')){
//       console.log('baseskinsetTGA2PNG Skip [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//       baseskinsetTGA2PNG();
//     return;
//   }
//   if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'].indexOf('.png') > -1){
//     var folder = '';
//     if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['folder'] != undefined)
//       folder = baseskinsetXmlList[baseskinsetXmlListIndex].attributes['folder'];
//     var subfolder = removeFileName(baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//     var inPath = pathMerge('../Tree-of-IPF/kr/ui.ipf', baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//     var outPath = pathMerge(pathMerge(pathMerge('./web/img/', folder), subfolder), baseskinsetXmlList[baseskinsetXmlListIndex].attributes['name']) + '.png';
//     autoMkDir(outPath);
//     fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
//       console.log('baseskinsetTGA2PNG PNG Copy [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//       baseskinsetTGA2PNG();
//     }));
//     return;
//   }
//   if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'].indexOf('.jpg') > -1){
//     var folder = '';
//     if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['folder'] != undefined)
//       folder = baseskinsetXmlList[baseskinsetXmlListIndex].attributes['folder'];
//     var subfolder = removeFileName(baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//     var inPath = pathMerge('../Tree-of-IPF/kr/ui.ipf', baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//     var outPath = pathMerge(pathMerge(pathMerge('./web/img/', folder), subfolder), baseskinsetXmlList[baseskinsetXmlListIndex].attributes['name']) + '.jpg';
//     autoMkDir(outPath);
//     fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
//       console.log('baseskinsetTGA2PNG JPG Copy [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//       baseskinsetTGA2PNG();
//     }));
//     return;
//   }
//   if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'].indexOf('.bmp') > -1){
//     var folder = '';
//     if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['folder'] != undefined)
//       folder = baseskinsetXmlList[baseskinsetXmlListIndex].attributes['folder'] + '/';
//     var subfolder = removeFileName(baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//     var inPath = pathMerge('../Tree-of-IPF/kr/ui.ipf', baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//     var outPath = pathMerge(pathMerge(pathMerge('./web/img/', folder), subfolder), baseskinsetXmlList[baseskinsetXmlListIndex].attributes['name']) + '.bmp';
//     autoMkDir(outPath);
//     fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
//       console.log('baseskinsetTGA2PNG BMP Copy [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//       baseskinsetTGA2PNG();
//     }));
//     return;
//   }
//   if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'].indexOf('.dds') > -1){
//     console.log('baseskinsetTGA2PNG Skip DDS [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//     baseskinsetTGA2PNG();
//     return;
//   }
//   //var tgapath = baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   var tga = new TGA(fs.readFileSync(pathMerge('../Tree-of-IPF/kr/ui.ipf', baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'])));
//   var png = new PNG({
//       width: tga.width,
//       height: tga.height
//   });
//   png.data = tga.pixels;
//   var outputPath = pathMerge('./web/img', baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']) + '.png';
//   autoMkDir(outputPath);
//   png.pack().pipe(fs.createWriteStream(outputPath).on('close', function() {
//     console.log('baseskinsetTGA2PNG Done [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//     baseskinsetTGA2PNG();
//   }));
// }
// function baseskinsetCrop(){
//   baseskinsetXmlListIndex ++;
//   if (baseskinsetXmlListIndex >= baseskinsetXmlList.length){
//     console.log('baseskinsetCrop End ' + baseskinsetXmlListIndex);
//     //baseskinsetLoad();
//     return;
//   }
//   if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'] === undefined){
//     console.log('baseskinsetCrop Skip Undefined[' + baseskinsetXmlListIndex + '] ');
//     baseskinsetCrop();
//     return;
//   }
//   if (!fs.existsSync('./web/img' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
//     console.log('baseskinsetCrop NoFile [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//     baseskinsetCrop();
//     return;
//   }
//   if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'].indexOf('.tga') < 0){
//     console.log('baseskinsetCrop NoTGA [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file']);
//     baseskinsetCrop();
//     return;
//   }
//   var tgapath = baseskinsetXmlList[baseskinsetXmlListIndex].attributes['file'].replace(/\\/g, '/');
//   //var rect = baseskinsetXmlList[baseskinsetXmlListIndex].attributes['imgrect'].split(' ');
//   //console.log(baseskinsetXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
//   //var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
//   var folder = '';
//   if (baseskinsetXmlList[baseskinsetXmlListIndex].attributes['folder'] != undefined)
//     folder = baseskinsetXmlList[baseskinsetXmlListIndex].attributes['folder'] + '/';

//   autoMkDir('./web/img/icon/' + folder);
//   fs.readFile(pathMerge('./web/img', tgapath) + '.png', function (err, data){
//     if (err) throw err;
//     //console.log('baseskinsetCrop 1.Read [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['name']);
//     var rect = baseskinsetXmlList[baseskinsetXmlListIndex].attributes['imgrect'].split(' ');
//     var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
//     PNGCrop.cropToStream(data, config1, function(err, outputStream) {
//       if (err) throw err;
//       //console.log('baseskinsetCrop 2.Crop [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['name']);
//       outputStream.pipe(fs.createWriteStream('./web/img/icon/' + folder + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['name'] + '.png'));
//       console.log('baseskinsetCrop 3.Save [' + baseskinsetXmlListIndex + '] ' + baseskinsetXmlList[baseskinsetXmlListIndex].attributes['name']);
//       baseskinsetCrop();
//     });
//   });
// }







function pathMerge(pathA, pathB){
  if (pathA === undefined || pathA.length === 0)
    return pathB;
  else if (pathB === undefined || pathB.length === 0)
      return pathA;

  pathA = pathA.replace(/\\/g, '/');
  pathB = pathB.replace(/\\/g, '/');
  if (pathA[0] === '/') pathA = pathA.substring(1, pathA.length)
  if (pathB[0] === '/') pathB = pathB.substring(1, pathB.length)
  if (pathA[pathA.length - 1] === '/') pathA = pathA.substring(0, pathA.length - 1)
  if (pathB[pathB.length - 1] === '/') pathB = pathB.substring(0, pathB.length - 1)

  return pathA + '/' + pathB;
}

function removeFileName(filepath){
  if (filepath === undefined || filepath.length === 0)
    return filepath;

    filepath = filepath.replace(/\\/g, '/');
  var splited = filepath.split('/');
  var lastDir = splited[splited.length - 1];
  if (lastDir.indexOf('.') > -1){
    return filepath.substring(0, filepath.length - lastDir.length);
  }
  return filepath;
}

function autoMkDir(filepath){
  if (filepath === undefined || filepath.length === 0)
    return;

  var dirPath = removeFileName(filepath);
  var splited = dirPath.split('/');

  var fullPath = splited[0] + '/';
  for (var i = 1; i < splited.length; i ++){
    fullPath += splited[i];
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath);
    fullPath += '/';
  }
}

function getExtention(filepath){
  if (filepath === undefined || filepath.length === 0)
    return filepath;

  var splited = filepath.split('.');
  return splited[splited.length - 1];
}