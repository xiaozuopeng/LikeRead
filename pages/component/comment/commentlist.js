import Api from '../../../utils/config/api.js'
import myUtils from '../../../utils/util.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    isHidden: true,
    bookId: '',
    startIndex: 0,
    commentList: [],
    isEmpty: true// 用于判断commentList数组是不是空数组，默认true，空的数组  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winHeight: res.windowHeight
        });
      }
    });
    let bookId = options.bookId;
    this.setData({
      bookId: bookId
    });
    this.getCommentList();
  },

  getCommentList: function () {
    let _bookId = this.data.bookId;
    let _startIndex = this.data.startIndex;
    let _commentList = this.data.commentList;
    let _isEmpty = this.data.isEmpty;
    let parmas = {
      book: _bookId,
      sort: 'update',
      start: _startIndex,
      limit: 20
    };
    Api.getCommentList(parmas).then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data.reviews;
        _data.forEach(function (value, index, array) {
          value.author.avatar = myUtils.getImgPath(value.author.avatar);
          value.updated = myUtils.getDateDifference(value.updated);
        });
        _commentList = _isEmpty ? _data : _commentList.concat(_data);
        // console.log(_data)
        this.setData({
          commentList: _commentList,
          isHidden: false,
          startIndex: _startIndex + 20,
          isEmpty: false
        });
      }
      else {
        res.data && res.data.msg && wx.showToast({
          title: res.data.msg, icon: 'none', duration: 1000
        });
      }
    })
  },

  scrollToBottom: function () {
    this.getCommentList();
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