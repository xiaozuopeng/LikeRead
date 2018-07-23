import Api from '../../../utils/config/api.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    hotKeys: [],
    hotKeyWords: [],
    historyWords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let historyWords = wx.getStorageSync('search') || [];
    this.setData({
      historyWords: historyWords
    });
    this.getHotKeys();
  },

  searchSubmit: function (e) {
    let keyWord = e.detail.value;
    let historyWords = wx.getStorageSync('search') || [];
    if (historyWords && historyWords.length > 0) {
      let index = historyWords.indexOf(keyWord);
      if (index > 0) {
        historyWords.splice(index, 1);
      } else {
        historyWords.unshift(keyWord);
      }
    } else {
      historyWords.unshift(keyWord);
    }
    wx.setStorageSync('search', historyWords);
    if (historyWords.length > 0) {
      this.setData({
        historyWords: historyWords.slice(0, 6)
      });
    } else {
      this.setData({
        historyWords: historyWords
      });
    }

    wx.navigateTo({
      url: '../search/searchlist?keyWord=' + keyWord,
    })
  },

  //刷新
  refreshKeys: function () {
    let _hotKeyWords = this.data.hotKeyWords;
    let result = this.randomArray(_hotKeyWords);
    this.setData({
      hotKeys: result
    });
  },

  //清空
  deleteHistory: function () {
    wx.removeStorageSync('search')
    this.setData({
      historyWords: []
    });
  },

  getHotKeys: function () {
    Api.getHotKeys().then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data.newHotWords;
        let result = this.randomArray(_data);
        this.setData({
          hotKeyWords: _data,
          hotKeys: result
        });
      }
      else {
        res.data && res.data.msg && wx.showToast({
          title: res.data.msg, icon: 'none', duration: 1000
        });
      }
    })
  },

  randomArray: function (array) {
    let result = array;

    for (var i = result.length - 1; i >= 0; i--) {

      var randomIndex = Math.floor(Math.random() * (i + 1));
      var itemAtIndex = result[randomIndex];

      result[randomIndex] = result[i];
      result[i] = itemAtIndex;
    }
    return result.slice(0, 6);
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
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