import MyHttp from '../../../utils/config/wxrequest.js'
import myUtils from '../../../utils/util.js'
import Api from '../../../utils/config/api.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHidden: true,
    isBookSaved: false,
    buttonText: '加追更',
    bookId: '',
    bookDetail: null,
    commentList: null,
    recommendList: null
  },

  clickRecomment: function (e) {
    let bookId = e.currentTarget.id
    let isSaved = false;
    let books = wx.getStorageSync('myBooks') || [];
    if (books && books.length > 0) {
      books.forEach(function (value, index, array) {
        if (value._id == bookId) {
          isSaved = true;
        }
      });
    }

    let btnText = isSaved ? '不追了' : '加追更'
    this.setData({
      bookId: bookId,
      isBookSaved: isSaved,
      buttonText: btnText
    });
    this.getBookDetail();
    this.getRecommendList();
  },

  saveBook: function () {
    let bookId = this.data.bookId;
    let bookDetail = this.data.bookDetail;
    let isSaved = false;
    let _books = wx.getStorageSync('myBooks') || [];
    let _index = 0;
    if (_books && _books.length > 0) {
      for (var i = 0; i < _books.length; i++) {
        let value = _books[i];
        if (value._id == bookId) {
          isSaved = true;
          _index = i;
          console.log('-----111---------')
          break;
        } else {
          isSaved = false;
          console.log('-----222---------')
        }
      }

      if (isSaved) {
        isSaved = false;
        _books.splice(_index, 1);
        wx.removeStorageSync(bookId + 'index');
      } else {
        _books.unshift(bookDetail);
        isSaved = true;
      }

    } else {
      _books.unshift(bookDetail);
      isSaved = true;
    }

    console.log(isSaved)
    wx.setStorageSync('myBooks', _books);
    let btnText = isSaved ? '不追了' : '加追更'
    this.setData({
      isBookSaved: isSaved,
      buttonText: btnText
    });
  },

  readBook: function () {
    let bookId = this.data.bookId
    wx.navigateTo({
      url: '../readbook/readbook?bookId=' + bookId
    })
  },

  moreComments: function () {
    let bookId = this.data.bookId
    wx.navigateTo({
      url: '../comment/commentlist?bookId=' + bookId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let bookId = '5816b415b06d1d32157790b1'
    let bookId = options.bookId
    let isSaved = false;
    let books = wx.getStorageSync('myBooks') || [];
    if (books && books.length > 0) {
      books.forEach(function (value, index, array) {
        if (value._id == bookId) {
          isSaved = true;
        }
      });
    }

    let btnText = isSaved ? '不追了' : '加追更'
    this.setData({
      bookId: bookId,
      isBookSaved: isSaved,
      buttonText: btnText
    });
    this.getBookDetail();
    this.getRecommendList();
  },

  /**
   * 获取书籍详情
   */
  getBookDetail: function () {
    let _id = this.data.bookId;
    new MyHttp({}, 'GET', 'book/' + _id).then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data;
        // console.log(_data)
        _data.cover = myUtils.getImgPath(_data.cover);
        _data.rating ? _data.rating.score = myUtils.formatNum(_data.rating.score, 1) : 0;
        _data.wordCount = myUtils.formatNum(_data.wordCount / 10000, 1);
        _data.updated = myUtils.getDateDifference(_data.updated);
        // console.log(_data)
        this.getCommentList(_data._id);
        this.setData({
          bookDetail: _data,
          isHidden: false
        });

        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      }
      else {
        res.data && res.data.msg && wx.showToast({
          title: res.data.msg, icon: 'none', duration: 1000
        });
      }
    });
  },

  getCommentList: function (bookId) {
    Api.getCommentList({ book: bookId }).then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data;
        _data.reviews.forEach(function (value, index, array) {
          value.author.avatar = myUtils.getImgPath(value.author.avatar);
          value.updated = myUtils.getDateDifference(value.updated);
        });
        // console.log(_data)
        this.setData({
          commentList: _data
        });
      }
      else {
        res.data && res.data.msg && wx.showToast({
          title: res.data.msg, icon: 'none', duration: 1000
        });
      }
    })
  },

  getRecommendList: function () {
    let _id = this.data.bookId;
    let arr = [];
    new MyHttp({}, 'GET', 'book/' + _id + '/recommend').then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data;
        _data.books.forEach(function (value, index, array) {
          value.cover = myUtils.getImgPath(value.cover);
          if (index < 6) {
            arr.push(value);
          }
        });
        // console.log(_data);
        // console.log(arr);
        this.setData({
          recommendList: arr
        });
      }
      else {
        res.data && res.data.msg && wx.showToast({
          title: res.data.msg, icon: 'none', duration: 1000
        });
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