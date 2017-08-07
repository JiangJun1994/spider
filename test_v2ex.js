/**
 * Created by jiangjun on 2017/8/4.
 */
var https = require('https');
var fs = require('fs');
var cheerio = require('cheerio');
var i =0;
var url = [];
var baseurl = 'https://www.v2ex.com';

function fetchpage (x){
  startRequest(x);
}

function startRequest(x){
  https.get(x,function(res){
    var html = '';
    res.setEncoding('utf-8');
    res.on('data',function(chunk){
      html += chunk;
    });
    res.on('end',function(){
      var $ = cheerio.load(html);
      var urls = $('.item_title a').each(function(i,elem){
        var x = $(this).attr('href');
        var y = x.substring(0,x.indexOf("#"));
        var z = baseurl + y;
        console.log(z)

            https.get(z, function (res) {
              var html2 = '';
              res.on('data',function(chunk){
                html2 += chunk
                console.log(html2)
              });
              res.on('end',function(){
                var $ = cheerio.load(html2);
                var title = $('.main .header h1').text().trim();
                console.log(title);
              })
            })

      });


      // for(var j = 0;j<urls.length;j++){
      //   var x = urls[j].attr('href').substring(0,urls[j].attr('href').indexOf("#"));
      //   var y = baseurl + x;
      //   console.log(y);
      //   // url.push(x);
      //   setTimeout(function () {
      //     https.get(y, function (res) {
      //       var html2 = '';
      //       res.on('data',function(chunk){
      //         html2 += chunk
      //       });
      //       res.on('end',function(){
      //         var $ = cheerio.load(html2);
      //         var title = $('.main .header h1').text().trim();
      //         console.log(title);
      //       })
      //     })
      //   }, 0)
      // }
    })
  })
}

fetchpage(baseurl);

