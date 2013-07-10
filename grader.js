#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "dummystring";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    return instr;
};

var assertUrlExists = function(inurl)
{
   var instr = inurl.toString();
   return instr;
}

var cheerioString = function(s)
{
   return cheerio.load(s);
};

var loadChecks = function(checksfile)
{
   return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlString = function(s, checksfile) {
    $ = cheerioString(s);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    var outJson = JSON.stringify(out, null, 4);
    console.log(outJson);
};

var buildfn = function(program_checks)
{
    var checkurl = function(result, response)
    {
	if (result instanceof Error)
	{
	    console.error('Error: ' + util.format(response.message));
	}
	else
	{
	    checkHtmlString(result, program_checks);
	}
    };
    return checkurl;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-u, --url <url_string>', 'url of page', clone(assertUrlExists), URL_DEFAULT)
        .parse(process.argv);

    if (program.url == URL_DEFAULT)
    {
        var s = fs.readFileSync(program.file);
        checkHtmlString(s, program.checks);
    }
    else
    {
        var checkurl = buildfn(program.checks);
        rest.get(program.url).on('complete', checkurl);
    }
}
else
{
    exports.checkHtmlString = checkHtmlString;
}  
