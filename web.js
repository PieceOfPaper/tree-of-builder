var express = require('express');
var fs = require('fs');
var csv = require('csv-parser');
var xml = require('xml-parser');

var TGA = require('tga');
var PNG = require('pngjs').PNG;
var PNGCrop = require('png-crop');

var app = express();
var port = 3000;


// ---------- 테이블 데이터 불러오기
var tableData = [];
tableData['job'] = [];
fs.createReadStream('../Tree-of-IPF/kr/ies.ipf/job.ies').pipe(csv()).on('data', function (data) {
  tableData['job'].push(data);
});
tableData['skill'] = [];
fs.createReadStream('../Tree-of-IPF/kr/ies.ipf/skill.ies').pipe(csv()).on('data', function (data) {
  tableData['skill'].push(data);
});


// ---------- 아이콘 이미지 복사
if (!fs.existsSync('./web/img')) fs.mkdirSync('./web/img');
if (!fs.existsSync('./web/img/skin')) fs.mkdirSync('./web/img/skin');
if (!fs.existsSync('./web/img/icon')) fs.mkdirSync('./web/img/icon');
if (!fs.existsSync('./web/img/icon/classicon')) fs.mkdirSync('./web/img/icon/classicon');
if (!fs.existsSync('./web/img/icon/skillicon')) fs.mkdirSync('./web/img/icon/skillicon');
if (!fs.existsSync('./web/img/icon/itemicon')) fs.mkdirSync('./web/img/icon/itemicon');
if (!fs.existsSync('./web/img/icon/monillust')) fs.mkdirSync('./web/img/icon/monillust');
if (!fs.existsSync('./web/img/icon/mongem')) fs.mkdirSync('./web/img/icon/mongem');

// copyIconImage('../Tree-of-IPF/kr/ui.ipf/icon');
// function copyIconImage(path) {
//   fs.readdir(path, function(error, files) {
//     if (files === undefined || files.length === 0)
//       return;

//     for (var i = 0; i < files.length; i ++) {
//       if (files[i].indexOf('.png') > -1 || files[i].indexOf('.PNG') > -1) {
//         var inStr = fs.createReadStream(path + '/' + files[i]);
//         var outStr = fs.createWriteStream('./web/img/icon/' + files[i]);
//         inStr.pipe(outStr);
//       } else {
//         copyIconImage(path + '/' + files[i])
//       }
//     }
//   });
// }


// ---------- 클래스 아이콘 이미지 복사
var classiconXmlData;
var classiconXmlList = [];
var classiconXmlListIndex = -1;
classiconLoad();
function classiconLoad(){
  fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/classicon.xml', function(error, data){
    classiconXmlData = xml(data.toString());
    for (var i = 0; i < classiconXmlData.root.children.length; i ++){
      for (var j = 0; j < classiconXmlData.root.children[i].children.length; j ++){
        //if (classiconXmlData.root.children[i].children[j].attributes['file'].indexOf('.tga') < 0) continue;
        classiconXmlList.push(classiconXmlData.root.children[i].children[j]);
      }
    }
    console.log('classiconTGA2PNG Start ' + classiconXmlList.length);
    classiconXmlListIndex = -1;
    classiconTGA2PNG();
  });
}
function classiconTGA2PNG(){
  classiconXmlListIndex ++;
  if (classiconXmlListIndex >= classiconXmlList.length){
    console.log('classiconTGA2PNG End ' + classiconXmlListIndex);
    console.log('classiconCrop Start ' + classiconXmlList.length);
    classiconXmlListIndex = -1;
    classiconCrop();
    return;
  }
  if (!fs.existsSync('../Tree-of-IPF/kr/ui.ipf' + classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/')) || 
    fs.existsSync('./web/img' + classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
      console.log('classiconTGA2PNG Skip [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['file']);
      classiconTGA2PNG();
    return;
  }
  if (classiconXmlList[classiconXmlListIndex].attributes['file'].indexOf('.png') > -1){
    var inPath = '../Tree-of-IPF/kr/ui.ipf' + classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
    var outPath = './web/img/icon/classicon/' + classiconXmlList[classiconXmlListIndex].attributes['name'] + '.png';
    fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
      console.log('classiconTGA2PNG PNG Copy [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['file']);
      classiconTGA2PNG();
    }));
    return;
  }
  var tgapath = classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
  var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
  var png = new PNG({
      width: tga.width,
      height: tga.height
  });
  png.data = tga.pixels;
  png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png').on('close', function() {
    console.log('classiconTGA2PNG Done [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['file']);
    classiconTGA2PNG();
  }));
}
function classiconCrop(){
  classiconXmlListIndex ++;
  if (classiconXmlListIndex >= classiconXmlList.length){
    console.log('classiconCrop End ' + classiconXmlListIndex);
    skilliconLoad();
    return;
  }
  if (!fs.existsSync('./web/img' + classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
    console.log('classiconCrop NoFile [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['file']);
    classiconCrop();
    return;
  }
  if (classiconXmlList[classiconXmlListIndex].attributes['file'].indexOf('.tga') < 0){
    console.log('classiconCrop NoTGA [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['file']);
    classiconCrop();
    return;
  }
  var tgapath = classiconXmlList[classiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
  var rect = classiconXmlList[classiconXmlListIndex].attributes['imgrect'].split(' ');
  //console.log(classiconXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
  var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
  PNGCrop.crop('./web/img' + tgapath + '.png', './web/img/icon/classicon/' + classiconXmlList[classiconXmlListIndex].attributes['name'] + '.png', config1, function(err) {
    if (err) throw err;
    console.log('classiconCrop Done [' + classiconXmlListIndex + '] ' + classiconXmlList[classiconXmlListIndex].attributes['name']);
    classiconCrop();
  });
}


// ---------- 스킬 아이콘 이미지 복사
var skilliconXmlData;
var skilliconXmlList = [];
var skilliconXmlListIndex = -1;
//skilliconLoad();
function skilliconLoad(){
  fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/skillicon.xml', function(error, data){
    skilliconXmlData = xml(data.toString());
    for (var i = 0; i < skilliconXmlData.root.children.length; i ++){
      for (var j = 0; j < skilliconXmlData.root.children[i].children.length; j ++){
        //if (skilliconXmlData.root.children[i].children[j].attributes['file'].indexOf('.tga') < 0) continue;
        skilliconXmlList.push(skilliconXmlData.root.children[i].children[j]);
      }
    }
    console.log('skilliconTGA2PNG Start ' + skilliconXmlList.length);
    skilliconXmlListIndex = -1;
    skilliconTGA2PNG();
  });
}
function skilliconTGA2PNG(){
  skilliconXmlListIndex ++;
  if (skilliconXmlListIndex >= skilliconXmlList.length){
    console.log('skilliconTGA2PNG End ' + skilliconXmlListIndex);
    console.log('skilliconCrop Start ' + skilliconXmlList.length);
    skilliconXmlListIndex = -1;
    skilliconCrop();
    return;
  }
  if (!fs.existsSync('../Tree-of-IPF/kr/ui.ipf' + skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/')) || 
    fs.existsSync('./web/img' + skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
      console.log('skilliconTGA2PNG Skip [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['file']);
      skilliconTGA2PNG();
    return;
  }
  if (skilliconXmlList[skilliconXmlListIndex].attributes['file'].indexOf('.png') > -1){
    var inPath = '../Tree-of-IPF/kr/ui.ipf' + skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/');
    var outPath = './web/img/icon/skillicon/' + skilliconXmlList[skilliconXmlListIndex].attributes['name'] + '.png';
    fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
      console.log('skilliconTGA2PNG PNG Copy [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['file']);
      skilliconTGA2PNG();
    }));
    return;
  }
  var tgapath = skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/');
  var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
  var png = new PNG({
      width: tga.width,
      height: tga.height
  });
  png.data = tga.pixels;
  png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png').on('close', function() {
    console.log('skilliconTGA2PNG Done [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['file']);
    skilliconTGA2PNG();
  }));
}
function skilliconCrop(){
  skilliconXmlListIndex ++;
  if (skilliconXmlListIndex >= skilliconXmlList.length){
    console.log('skilliconCrop End ' + skilliconXmlListIndex);
    itemiconLoad();
    return;
  }
  if (!fs.existsSync('./web/img' + skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
    console.log('skilliconCrop NoFile [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['file']);
    skilliconCrop();
    return;
  }
  if (skilliconXmlList[skilliconXmlListIndex].attributes['file'].indexOf('.tga') < 0){
    console.log('skilliconCrop NoTGA [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['file']);
    skilliconCrop();
    return;
  }
  var tgapath = skilliconXmlList[skilliconXmlListIndex].attributes['file'].replace(/\\/g, '/');
  var rect = skilliconXmlList[skilliconXmlListIndex].attributes['imgrect'].split(' ');
  //console.log(skilliconXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
  var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
  PNGCrop.crop('./web/img' + tgapath + '.png', './web/img/icon/skillicon/' + skilliconXmlList[skilliconXmlListIndex].attributes['name'] + '.png', config1, function(err) {
    if (err) throw err;
    console.log('skilliconCrop Done [' + skilliconXmlListIndex + '] ' + skilliconXmlList[skilliconXmlListIndex].attributes['name']);
    skilliconCrop();
  });
}


// ---------- 아이템 아이콘 이미지 복사
var itemiconXmlData;
var itemiconXmlList = [];
var itemiconXmlListIndex = -1;
//itemiconLoad();
function itemiconLoad(){
  fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/itemicon.xml', function(error, data){
    itemiconXmlData = xml(data.toString());
    for (var i = 0; i < itemiconXmlData.root.children.length; i ++){
      for (var j = 0; j < itemiconXmlData.root.children[i].children.length; j ++){
        //if (itemiconXmlData.root.children[i].children[j].attributes['file'].indexOf('.tga') < 0) continue;
        itemiconXmlList.push(itemiconXmlData.root.children[i].children[j]);
      }
    }
    console.log('itemiconTGA2PNG Start ' + itemiconXmlList.length);
    itemiconXmlListIndex = -1;
    itemiconTGA2PNG();
  });
}
function itemiconTGA2PNG(){
  itemiconXmlListIndex ++;
  if (itemiconXmlListIndex >= itemiconXmlList.length){
    console.log('itemiconTGA2PNG End ' + itemiconXmlListIndex);
    console.log('itemiconCrop Start ' + itemiconXmlList.length);
    itemiconXmlListIndex = -1;
    itemiconCrop();
    return;
  }
  if (!fs.existsSync('../Tree-of-IPF/kr/ui.ipf' + itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/')) || 
    fs.existsSync('./web/img' + itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
      console.log('itemiconTGA2PNG Skip [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['file']);
      itemiconTGA2PNG();
    return;
  }
  if (itemiconXmlList[itemiconXmlListIndex].attributes['file'].indexOf('.png') > -1){
    var inPath = '../Tree-of-IPF/kr/ui.ipf' + itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
    var outPath = './web/img/icon/itemicon/' + itemiconXmlList[itemiconXmlListIndex].attributes['name'] + '.png';
    fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
      console.log('itemiconTGA2PNG PNG Copy [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['file']);
      itemiconTGA2PNG();
    }));
    return;
  }
  var tgapath = itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
  var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
  var png = new PNG({
      width: tga.width,
      height: tga.height
  });
  png.data = tga.pixels;
  png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png').on('close', function() {
    console.log('itemiconTGA2PNG Done [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['file']);
    itemiconTGA2PNG();
  }));
}
function itemiconCrop(){
  itemiconXmlListIndex ++;
  if (itemiconXmlListIndex >= itemiconXmlList.length){
    console.log('itemiconCrop End ' + itemiconXmlListIndex);
    monillustLoad();
    return;
  }
  if (!fs.existsSync('./web/img' + itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
    console.log('itemiconCrop NoFile [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['file']);
    itemiconCrop();
    return;
  }
  if (itemiconXmlList[itemiconXmlListIndex].attributes['file'].indexOf('.tga') < 0){
    console.log('itemiconCrop NoTGA [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['file']);
    itemiconCrop();
    return;
  }
  var tgapath = itemiconXmlList[itemiconXmlListIndex].attributes['file'].replace(/\\/g, '/');
  var rect = itemiconXmlList[itemiconXmlListIndex].attributes['imgrect'].split(' ');
  //console.log(itemiconXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
  var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
  PNGCrop.crop('./web/img' + tgapath + '.png', './web/img/icon/itemicon/' + itemiconXmlList[itemiconXmlListIndex].attributes['name'] + '.png', config1, function(err) {
    if (err) throw err;
    console.log('itemiconCrop Done [' + itemiconXmlListIndex + '] ' + itemiconXmlList[itemiconXmlListIndex].attributes['name']);
    itemiconCrop();
  });
}


// ---------- 몬스터 아이콘 이미지 복사
var monillustXmlData;
var monillustXmlList = [];
var monillustXmlListIndex = -1;
//monillustLoad();
function monillustLoad(){
  fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/monillust.xml', function(error, data){
    monillustXmlData = xml(data.toString());
    for (var i = 0; i < monillustXmlData.root.children.length; i ++){
      for (var j = 0; j < monillustXmlData.root.children[i].children.length; j ++){
        //if (monillustXmlData.root.children[i].children[j].attributes['file'].indexOf('.tga') < 0) continue;
        monillustXmlList.push(monillustXmlData.root.children[i].children[j]);
      }
    }
    console.log('monillustTGA2PNG Start ' + monillustXmlList.length);
    monillustXmlListIndex = -1;
    monillustTGA2PNG();
  });
}
function monillustTGA2PNG(){
  monillustXmlListIndex ++;
  if (monillustXmlListIndex >= monillustXmlList.length){
    console.log('monillustTGA2PNG End ' + monillustXmlListIndex);
    console.log('monillustCrop Start ' + monillustXmlList.length);
    monillustXmlListIndex = -1;
    monillustCrop();
    return;
  }
  if (!fs.existsSync('../Tree-of-IPF/kr/ui.ipf' + monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/')) || 
    fs.existsSync('./web/img' + monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
      console.log('monillustTGA2PNG Skip [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['file']);
      monillustTGA2PNG();
    return;
  }
  if (monillustXmlList[monillustXmlListIndex].attributes['file'].indexOf('.png') > -1){
    var inPath = '../Tree-of-IPF/kr/ui.ipf' + monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/');
    var outPath = './web/img/icon/monillust/' + monillustXmlList[monillustXmlListIndex].attributes['name'] + '.png';
    fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
      console.log('monillustTGA2PNG PNG Copy [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['file']);
      monillustTGA2PNG();
    }));
    return;
  }
  var tgapath = monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/');
  var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
  var png = new PNG({
      width: tga.width,
      height: tga.height
  });
  png.data = tga.pixels;
  png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png').on('close', function() {
    console.log('monillustTGA2PNG Done [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['file']);
    monillustTGA2PNG();
  }));
}
function monillustCrop(){
  monillustXmlListIndex ++;
  if (monillustXmlListIndex >= monillustXmlList.length){
    console.log('monillustCrop End ' + monillustXmlListIndex);
    mongemLoad();
    return;
  }
  if (!fs.existsSync('./web/img' + monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
    console.log('monillustCrop NoFile [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['file']);
    monillustCrop();
    return;
  }
  if (monillustXmlList[monillustXmlListIndex].attributes['file'].indexOf('.tga') < 0){
    console.log('monillustCrop NoTGA [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['file']);
    monillustCrop();
    return;
  }
  var tgapath = monillustXmlList[monillustXmlListIndex].attributes['file'].replace(/\\/g, '/');
  var rect = monillustXmlList[monillustXmlListIndex].attributes['imgrect'].split(' ');
  //console.log(monillustXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
  var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
  PNGCrop.crop('./web/img' + tgapath + '.png', './web/img/icon/monillust/' + monillustXmlList[monillustXmlListIndex].attributes['name'] + '.png', config1, function(err) {
    if (err) throw err;
    console.log('monillustCrop Done [' + monillustXmlListIndex + '] ' + monillustXmlList[monillustXmlListIndex].attributes['name']);
    monillustCrop();
  });
}


// ---------- 몬스터 젬 이미지 복사
var mongemXmlData;
var mongemXmlList = [];
var mongemXmlListIndex = -1;
//mongemLoad();
function mongemLoad(){
  fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/mongem.xml', function(error, data){
    mongemXmlData = xml(data.toString());
    for (var i = 0; i < mongemXmlData.root.children.length; i ++){
      for (var j = 0; j < mongemXmlData.root.children[i].children.length; j ++){
        //if (mongemXmlData.root.children[i].children[j].attributes['file'].indexOf('.tga') < 0) continue;
        mongemXmlList.push(mongemXmlData.root.children[i].children[j]);
      }
    }
    console.log('mongemTGA2PNG Start ' + mongemXmlList.length);
    mongemXmlListIndex = -1;
    mongemTGA2PNG();
  });
}
function mongemTGA2PNG(){
  mongemXmlListIndex ++;
  if (mongemXmlListIndex >= mongemXmlList.length){
    console.log('mongemTGA2PNG End ' + mongemXmlListIndex);
    console.log('mongemCrop Start ' + mongemXmlList.length);
    mongemXmlListIndex = -1;
    mongemCrop();
    return;
  }
  if (!fs.existsSync('../Tree-of-IPF/kr/ui.ipf' + mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/')) || 
    fs.existsSync('./web/img' + mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
      console.log('mongemTGA2PNG Skip [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['file']);
      mongemTGA2PNG();
    return;
  }
  if (mongemXmlList[mongemXmlListIndex].attributes['file'].indexOf('.png') > -1){
    var inPath = '../Tree-of-IPF/kr/ui.ipf' + mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/');
    var outPath = './web/img/icon/mongem/' + mongemXmlList[mongemXmlListIndex].attributes['name'] + '.png';
    fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath).on('close', function() {
      console.log('mongemTGA2PNG PNG Copy [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['file']);
      mongemTGA2PNG();
    }));
    return;
  }
  var tgapath = mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/');
  var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
  var png = new PNG({
      width: tga.width,
      height: tga.height
  });
  png.data = tga.pixels;
  png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png').on('close', function() {
    console.log('mongemTGA2PNG Done [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['file']);
    mongemTGA2PNG();
  }));
}
function mongemCrop(){
  mongemXmlListIndex ++;
  if (mongemXmlListIndex >= mongemXmlList.length){
    console.log('mongemCrop End ' + mongemXmlListIndex);
    //mongemLoad();
    return;
  }
  if (!fs.existsSync('./web/img' + mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/') + '.png')){
    console.log('mongemCrop NoFile [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['file']);
    mongemCrop();
    return;
  }
  if (mongemXmlList[mongemXmlListIndex].attributes['file'].indexOf('.tga') < 0){
    console.log('mongemCrop NoTGA [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['file']);
    mongemCrop();
    return;
  }
  var tgapath = mongemXmlList[mongemXmlListIndex].attributes['file'].replace(/\\/g, '/');
  var rect = mongemXmlList[mongemXmlListIndex].attributes['imgrect'].split(' ');
  //console.log(mongemXmlList[i].attributes['name'] + ' ' + rect[0] + ' ' + rect[1] + ' ' + rect[2] + ' ' + rect[3]);
  var config1 = {width: rect[2], height: rect[3], top: rect[1], left: rect[0]};
  PNGCrop.crop('./web/img' + tgapath + '.png', './web/img/icon/mongem/' + mongemXmlList[mongemXmlListIndex].attributes['name'] + '.png', config1, function(err) {
    if (err) throw err;
    console.log('mongemCrop Done [' + mongemXmlListIndex + '] ' + mongemXmlList[mongemXmlListIndex].attributes['name']);
    mongemCrop();
  });
}


// ---------- 페이지 세팅
app.use(express.static('web'));
 
app.get('/', function (req, response) {
    fs.readFile('index.html', function(error, data){
        if (error) {
            console.log(error);
            // 페이지를 찾을 수 없음
            // HTTP Status: 404 : NOT FOUND
            // Content Type: text/plain
            response.writeHead(404, {'Content-Type': 'text/html'});
         }else{	
            // 페이지를 찾음	  
            // HTTP Status: 200 : OK
            // Content Type: text/plain
            response.writeHead(200, {'Content-Type': 'text/html'});	
            
            // 파일을 읽어와서 responseBody 에 작성
            response.send(data);	
         }
    });
});

var skillPage = require('./web_script/web_skill')(app, tableData);
app.use('/Skill', skillPage);

var testPage = require('./web_script/web_test')(app, tableData);
app.use('/Test', testPage);



// ---------- ON!
app.listen(port, function (){
  console.log("Server Open! port:" + port);
});