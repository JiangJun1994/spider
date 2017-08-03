/**
 * Created by jiangjun on 2017/8/3.
 */
var http = require ("http");
var fs = require ('fs');
var cheerio = require('cheerio'); //jquery 库
var request = require('request'); //爬图片用
var i = 0;
var url = "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391";

function fetchPage(x){
  startRequest(x);
}

function startRequest(x){
  //using http to give an get request
  http.get(x,function(res){
    var html = '';  //to save html content of requesting url
    var titles = [];
    res.setEncoding('utf-8');   //防止中文乱码
    // monitor data, fetch some data each time
    res.on('data',function(chunk){
      html += chunk;
    });
    //monitor end event,if all data of html is fetched finally, to carry out callback function.
    res.on('end',function(){
      var $ = cheerio.load(html); //use cheerio to analyse html
      var time = $('.article-info a:first-child').next().text().trim();
      var news_item = {
        //get title, published time, url, i: the num of articles
        title:$('div.article-title a').text().trim(),
        time:time,
        link:'http://www.ss.pku.edu.cn'+$("div.article-title a").attr('href'),
        author:$('[title=供稿]').text().trim(),
        i:i = i+1
      };
      console.log(news_item);
      var news_title = $('div.article-title a').text().trim();
      savedContent($,news_title);
      // savedImg($,news_title);

      // url of next article
      var nextLink = 'http://www.ss.pku.edu.cn'+ $('li.next a').attr('href');
      str1 = nextLink.split('-');//去除URL后面的中文
      str = encodeURI(str1[0]);
      if(i <= 10){
        fetchPage(str);
      }

    })
  }).on('err',function(err){
    console.log(err)
  });

}

function savedContent($,news_title){
  $('.article-content p').each(function(index,item){
    var x = $(this).text();
    // var y = x.substring(0,2).trim();
    // if( y == '' ){
      x = x + '\n';
      fs.appendFile(news_title + '.txt',x,'utf-8',function(err){
        if(err){
          console.log(err);
        }
      });
    // }
  })
}

function saveImg($,news_title){
  $('.article-content img').each(function(index,item){
    var img_title = $(this).parent().next().text().trim(); //get title of img
    if(img_title.length>35 || img_title == ""){
      img_title = "Null";
    }
    var img_filename = img_title + '.jpg';
    var img_src = 'http://www.ss.pku.edu.cn'+$(this).attr('src'); //get url og img
    //send request to server to get img resource
    request.head(img_src,function(err,res,body){
      if(err){
        console.log(err)
      }
    })
    request(img_src).pipe(fs.createWriteStream(news_title+'---'+img_filename))
  })
}

// Change directory to data folder.
process.chdir('./data');
fetchPage(url);
