// pages/theme/theme.js
import { Theme } from 'theme-model.js';

var theme = new Theme();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.name,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.data.name = options.name;
    this.loadData();
  },

  // 获取banner信息
  loadData: function () {
    console.log(this.data.id);
    theme.getThemeOne(this.data.id, (res) => {
      this.setData({
        'themeInfo': res
      });
    });
  },

  // 跳转
  onProductsItemTap: function (event) {
    var id = theme.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  }

})