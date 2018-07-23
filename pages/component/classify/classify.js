import Api from '../../../utils/config/api.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHidden: true,
    classifies: []
  },

  /**
   * 获取分类列表
   */
  getClassifies: function () {
    Api.getClassifies().then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data;
        // console.log(_data)
        this.setData({
          classifies: _data,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClassifies();
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