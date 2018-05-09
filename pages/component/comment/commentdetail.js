import Api from '../../../utils/config/api.js'
import myUtils from '../../../utils/util.js'
import MyHttp from '../../../utils/config/wxrequest.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    isLoadMore: false,
    isHidden: true,
    commentId: '',
    startIndex: 0,
    commentDetail: null,
    commentBest: null,
    totalComments: [],
    isEmpty: true// 用于判断totalComments数组是不是空数组，默认true，空的数组  
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
    let commentId = options.commentId;
    this.setData({
      commentId: commentId
    });
    this.getCommentDetail();
    this.getCommentBest();
    this.getTotalComments();
  },

  getCommentDetail: function () {
    let _id = this.data.commentId;
    new MyHttp({}, 'GET', 'post/review/' + _id).then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data.review;
        _data.author.avatar = myUtils.getImgPath(_data.author.avatar);
        _data.updated = myUtils.getDateDifference(_data.updated);
        console.log(_data)
        this.setData({
          commentDetail: _data,
          isHidden: false
        });
      }
      else {
        res.data && res.data.msg && utils.toast("error", res.data.msg);
      }
    })
  },

  getCommentBest: function () {
    let _id = this.data.commentId;
    new MyHttp({}, 'GET', 'post/' + _id + '/comment/best').then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data.comments;
        _data.forEach(function (value, index, array) {
          value.author.avatar = myUtils.getImgPath(value.author.avatar);
          value.created = myUtils.getDateDifference(value.created);
        });
        console.log(_data)
        this.setData({
          commentBest: _data,
          isHidden: false
        });
      }
      else {
        res.data && res.data.msg && utils.toast("error", res.data.msg);
      }
    })
  },

  getTotalComments: function () {
    let _id = this.data.commentId;
    let _startIndex = this.data.startIndex;
    let _totalComments = this.data.totalComments;
    let _isEmpty = this.data.isEmpty;
    let parmas = {
      start: _startIndex,
      limit: 20
    }
    new MyHttp(parmas, 'GET', 'post/review/' + _id + '/comment').then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data.comments;
        _data.forEach(function (value, index, array) {
          value.author.avatar = myUtils.getImgPath(value.author.avatar);
          value.created = myUtils.getDateDifference(value.created);
        });
        _totalComments = _isEmpty ? _data : _totalComments.concat(_data);
        // console.log(_totalComments)
        this.setData({
          totalComments: _totalComments,
          isHidden: false,
          startIndex: _startIndex + 20,
          isEmpty: false
        });
      }
      else {
        res.data && res.data.msg && utils.toast("error", res.data.msg);
        this.setData({
          isLoadMore: false
        });
      }
    })
  },

  scrollToBottom: function () {
    this.setData({
      isLoadMore: true
    });
    this.getTotalComments();
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