import MyHttp from '../../../utils/config/wxrequest.js'
import myUtils from '../../../utils/util.js'
import Api from '../../../utils/config/api.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: null
  },

  longTapItem: function (e) {
    let that = this;
    let bookId = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '是否删除该小说？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let _books = wx.getStorageSync('myBooks') || [];
          console.log(bookId, _books)
          if (_books && _books.length > 0) {
            _books.forEach(function (value, index, array) {
              if (value._id == bookId) {
                _books.splice(index, 1);
                wx.removeStorageSync(bookId + 'index')
              }
            });
          }
          wx.setStorageSync('myBooks', _books);
          that.setData({
            bookList: _books
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyBookList();
  },

  getMyBookList: function () {
    let books = wx.getStorageSync('myBooks') || [];
    this.setData({
      bookList: books
    });
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
    this.getMyBookList();
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