var fs			= require('fs');
var os			= require('os'); os.tmpDir = os.tmpdir;
var request		= require('request');
var async		= require('async');
var download	= require('image-downloader');

var uploads	= './uploads/';

var myFile = fs.readFileSync('./import/file').toString().split("\n");
var myList = [];

// Get all ID of page
for (i in myFile) { if (myFile[i].split("/c/")[1]) myList.push(myFile[i].split("/c/")[1]);}

if (myList.length < 1)
	return console.log('Put yours links in the /import/file');
// Create dir Uploads
if (!fs.existsSync(uploads)) { fs.mkdirSync(uploads); }

// Create array of 30 ids
var id = [];
for (var i = 0; i < 100; i++) { id.push(i); }

async.forEachOf(myList, function (idImg, keyId, next_id) {

	async.forEachOf(id, function (myId, myKey, next_picture) {
		if (!fs.existsSync(uploads+idImg)) { fs.mkdirSync(uploads+idImg); }
		var uri = "https://contestimg.wish.com/api/webimage/"+idImg+"-"+myId+"-contest?cache_buster=1";
		var options = { url: uri, dest: uploads+idImg+'/'+myId+'.png' }

		download.image(options).then(function (filename, image) {
			console.log('New file saved - ' + myId);
			next_picture();
		}).catch(function (err) {});

	}, function (err) { return next_id(); })
}, function (err) {
	console.log('--- END ----');
})
