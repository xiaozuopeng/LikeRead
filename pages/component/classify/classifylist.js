import Api from '../../../utils/config/api.js'
import myUtils from '../../../utils/util.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    isHidden: true,
    startIndex: 0,
    gender: '',
    major: '',
    classifyList: [],
    isEmpty: true
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
    let gender = options.gender;
    let major = options.major;
    this.setData({
      gender: gender,
      major: major
    });
    this.getClassifyList();
  },

  //获取分类列表
  getClassifyList: function () {
    let _startIndex = this.data.startIndex;
    let _gender = this.data.gender;
    let _major = this.data.major;
    let _classifyList = this.data.classifyList;
    let _isEmpty = this.data.isEmpty;

    let parmas = {
      gender: _gender,
      type: 'hot',
      major: _major,
      minor: '',
      start: _startIndex,
      limit: 20
    };
    Api.getClassifyList(parmas).then((res) => {
      if (res.statusCode == 200 && res.data != null) {
        wx.hideToast();
        let _data = res.data.books;
        _data.forEach(function (value, index, array) {
          value.cover = myUtils.getImgPath(value.cover);
        });
        _classifyList = _isEmpty ? _data : _classifyList.concat(_data);
        // console.log(_data)
        this.setData({
          classifyList: _classifyList,
          isHidden: false,
          startIndex: _startIndex + 20,
          isEmpty: false
        });
      }
      else {
        res.data && res.data.msg && utils.toast("error", res.data.msg);
      }
    })
  },

  scrollToBottom: function () {
    this.getClassifyList();
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