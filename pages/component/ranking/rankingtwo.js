import MyHttp from '../../../utils/config/wxrequest.js'
import myUtils from '../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHidden: true,
    rinkingId: '',
    rankingList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let rankingId = options.rankingId
    this.setData({
      rinkingId: rankingId
    });
    this.getRankingData();
  },

  /**
   * 获取排行列表数据
   */
  getRankingData: function () {
    let _id = this.data.rinkingId;
    new MyHttp({}, 'GET', 'ranking/' + _id).then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data.ranking.books;
        _data.forEach(function (value, index, array) {
          value.cover = myUtils.getImgPath(value.cover);
        });
        // console.log(_data)
        this.setData({
          rankingList: _data,
          isHidden: false
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
    this.getRankingData();

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