var HOST = "https://wxapi.hotapp.cn/proxy/?appkey=hotapp11377340&url=";
var BASEURL = "https://api.zhuishushenqi.com/";
var CHAPTERURL = "https://chapter2.zhuishushenqi.com/";//章节HOST
var CHAPTERURL2 = "https://chapterup02.zhuishushenqi.com/";//章节HOST

var config = {
  GLOBAL_HOST: HOST,
  GLOBAL_BASE: BASEURL,
  GLOBAL_NET_IMAGE: HOST + 'http://statics.zhuishushenqi.com',
  GLOBAL_API_DOMAIN: HOST + BASEURL,
  GLOBAL_CHAPTER_DOMAIN: CHAPTERURL,
  GLOBAL_CHAPTER_DOMAIN2: CHAPTERURL2,
  db_prefix: "xzp_wx_gbl_"
};

module.exports = config;