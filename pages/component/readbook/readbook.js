import MyHttp from '../../../utils/config/wxrequest.js'
import config from '../../../utils/config/config.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // pageInfo: '',
    pageInfos: [],
    winHeight: 0,
    contentFontSize: 36,
    contentBackground: '#c7edcc',
    showModalStatus: false,
    isChaptersHidden: true,
    isPreDisable: true,
    isNextDisable: false,
    chapterIndex: 0,
    isHiddenContent: true,
    bookId: "",
    chaptersData: null,
    index: 0,
    chapters: null,
    chapterContent: ""
  },

  //显示操作栏
  showModal: function () {
    if (this.data.isChaptersHidden == false) {
      return;
    }
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(200).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 50)
  },

  //隐藏操作栏
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(200).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 50)
  },

  //字体加
  fontAddition: function () {
    let fontSize = this.data.contentFontSize + 2 < 50 ? this.data.contentFontSize + 2 : 50;
    wx.setStorageSync('font-size', fontSize)
    this.setData({
      contentFontSize: fontSize
    })
  },

  //字体减
  fontSubtraction: function () {
    let fontSize = this.data.contentFontSize - 2 > 24 ? this.data.contentFontSize - 2 : 24;
    wx.setStorageSync('font-size', fontSize)
    this.setData({
      contentFontSize: fontSize
    })
  },

  //标准色
  standardColors: function () {
    wx.setStorageSync('font-color', '#ffffff')
    this.setData({
      contentBackground: '#ffffff'
    })
  },

  //护眼色
  protectiveEyeColor: function () {
    wx.setStorageSync('font-color', '#c7edcc')
    this.setData({
      contentBackground: '#c7edcc'
    })
  },

  //上一章
  previousChapter: function () {
    this.hideModal();
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
    this.hideModal();
    this.setData({
      isChaptersHidden: false
    });
  },

  touchChapters: function () {

  },

  //关闭目录
  closeChapters: function () {
    this.setData({
      isChaptersHidden: true
    });
  },

  //下一章
  nextChapter: function () {
    this.hideModal();
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

  //点击章节条目
  clickChapterItem: function (e) {
    let index = parseInt(e.currentTarget.id);
    wx.setStorageSync(this.data.bookId + 'index', index);
    this.setData({
      chapterIndex: index,
      isChaptersHidden: true
    });

    this.getChapterDetail();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winHeight: res.windowHeight - 66 - 52
        });
      }
    });
    let fontSize = wx.getStorageSync('font-size');
    let fontColor = wx.getStorageSync('font-color');
    let bookId = options.bookId;
    let _chapterIndex = wx.getStorageSync(bookId + 'index') || 0;
    this.setData({
      bookId: bookId,
      contentBackground: fontColor,
      contentFontSize: fontSize,
      chapterIndex: _chapterIndex,
      isPreDisable: _chapterIndex > 0 ? false : true
    });
    this.getChaptersData();
  },

  /**
   * 获取章节列表数据
   */
  getChaptersData: function () {
    let _pageInfos = [];
    let chapterIndex = this.data.chapterIndex;
    let _id = this.data.bookId;
    new MyHttp({}, 'GET', 'mix-atoc/' + _id + '?view=chapters').then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data.mixToc;
        // console.log(_data)

        let length = _data.chapters.length / 100;

        for (var i = 0; i < length; i++) {
          _pageInfos.push(i * 100 + 1 + '~' + (i + 1) * 100);
        }

        this.setData({
          isNextDisable: chapterIndex < _data.chapters.length - 1 ? false : true,
          chaptersData: _data,
          chapters: _data.chapters.slice(0, 100),
          pageInfos: _pageInfos,
          // pageInfo: _pageInfos[0]
        });
        this.getChapterDetail();
      }
      else {
        res.data && res.data.msg && utils.toast("error", res.data.msg);
      }
    })
  },

  chooseChapter: function () {

  },

  bindPickerChange: function (e) {
    let _index = parseInt(e.detail.value);
    let chapters = this.data.chaptersData.chapters;
    this.setData({
      index: _index,
      chapters: chapters.slice(_index * 100, (_index + 1) * 100)
    })
  },

  //获取章节内容
  getChapterDetail: function () {
    let chapterIndex = this.data.chapterIndex;
    let chapters = this.data.chapters;
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