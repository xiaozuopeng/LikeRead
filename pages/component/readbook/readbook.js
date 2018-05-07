import MyHttp from '../../../utils/config/wxrequest.js'
import config from '../../../utils/config/config.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChaptersHidden: true,
    isPreDisable: true,
    isNextDisable: false,
    chapterIndex: 0,
    isHiddenContent: true,
    bookId: "",
    chaptersData: null,
    chapterContent: ""
  },

  //上一章
  previousChapter: function () {
    let chapters = this.data.chaptersData.chapters;
    let _chapterIndex = this.data.chapterIndex;
    wx.setStorageSync(this.data.bookId + 'index', _chapterIndex - 1)
    this.setData({
      chapterIndex: _chapterIndex - 1,
      isPreDisable: _chapterIndex - 1 > 0 ? false : true,
      isNextDisable: _chapterIndex - 1 < chapters.length - 1 ? false : true
    });

    this.getChapterDetail();
  },

  //目录
  catalogue: function () {
    this.setData({
      isChaptersHidden: false
    });
  },

  touchChapters:function(){

  },

  //关闭目录
  closeChapters: function () {
    this.setData({
      isChaptersHidden: true
    });
  },

  //下一章
  nextChapter: function () {
    let chapters = this.data.chaptersData.chapters;
    let _chapterIndex = this.data.chapterIndex;
    wx.setStorageSync(this.data.bookId + 'index', _chapterIndex + 1)
    this.setData({
      chapterIndex: _chapterIndex + 1,
      isPreDisable: _chapterIndex + 1 > 0 ? false : true,
      isNextDisable: _chapterIndex + 1 < chapters.length - 1 ? false : true
    });

    this.getChapterDetail();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let bookId = options.bookId;
    let _chapterIndex = wx.getStorageSync(bookId + 'index') || 0;
    console.log(_chapterIndex)
    this.setData({
      bookId: bookId,
      chapterIndex: _chapterIndex,
      isPreDisable: _chapterIndex > 0 ? false : true
    });
    this.getChaptersData();
  },

  /**
   * 获取章节列表数据
   */
  getChaptersData: function () {
    let chapterIndex = this.data.chapterIndex;
    let _id = this.data.bookId;
    new MyHttp({}, 'GET', 'mix-atoc/' + _id + '?view=chapters').then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data.mixToc;
        // console.log(_data)
        this.setData({
          isNextDisable: chapterIndex < _data.chapters.length - 1 ? false : true,
          chaptersData: _data
        });
        this.getChapterDetail();
      }
      else {
        res.data && res.data.msg && utils.toast("error", res.data.msg);
      }
    })
  },

  getChapterDetail: function () {
    let chapterIndex = this.data.chapterIndex;
    let chapters = this.data.chaptersData.chapters;
    let _link = encodeURIComponent(chapters[chapterIndex].link);
    new MyHttp({}, 'POST', 'chapter/' + _link, config.GLOBAL_CHAPTER_DOMAIN).then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data.chapter;
        _data.title = chapters[chapterIndex].title;
        // console.log(_data)
        this.setData({
          chapterContent: _data,
          isHiddenContent: false
        });
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      }
      else {
        res.data && res.data.msg && utils.toast("error", res.data.msg);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})