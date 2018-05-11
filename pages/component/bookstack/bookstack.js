import MyHttp from '../../../utils/config/wxrequest.js'
import myUtils from '../../../utils/util.js'
import Api from '../../../utils/config/api.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    isHidden: true,
    isAddHidden: false,
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
            bookList: _books,
            isHidden: _books.length > 0 ? false : true,
            isAddHidden: _books.length > 0 ? true : false
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  clickAdd: function () {
    wx.switchTab({
      url: '../../../../../ranking/ranking',
    })
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
    // this.getMyBookList();
  },

  getMyBookList: function () {
    let that = this;
    let books = wx.getStorageSync('myBooks') || [];
    books.forEach(function (value, index, array) {
      that.getBookUpdate(array, value);
    });
    if (books && books.length > 0) {
      this.setData({
        bookList: books,
        isHidden: false,
        isAddHidden: true
      });
    }
  },

  getBookUpdate: function (array, value) {
    // console.log(array)
    let bookId = value._id;
    let parmas = {
      view: 'summary',
      book: bookId
    };
    Api.getBookUpdate(parmas).then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data;
        // console.log(_data[0].lastChapter)
        array.forEach(function (value, index, arr) {
          if (value._id == bookId) {
            value.lastChapter = _data[0].lastChapter
          }
        });
        this.setData({
          bookList: array
        });
        // wx.setStorageSync('myBooks', array);
        wx.setStorage({
          key: 'myBooks',
          data: array,
        });
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