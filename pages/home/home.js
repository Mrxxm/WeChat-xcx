// pages/home/home.js
import {Home} from 'home-model.js';

var home = new Home();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 页面初始化生命周期函数
  onLoad: function() {
    this.loadData();
  },

  // 获取banner信息
  loadData: function() {
    var id = 1;
    home.getBannerData(id, (res)=>{
      this.setData({
        'bannerArr':res
      });
    }); 

    var ids = "1,2,3";
    home.getThemeList(ids, (res)=>{
      this.setData({
        'themeArr':res
      });
    });

    home.getProductRecent((res)=>{
      this.setData({
        'productsArr':res
      });
    });
  },

  // 跳转到商品页面id从options中获取
  onProductsItemTap:function(event) {
    var id = home.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  // 跳转到主题页面id和name从options中获取
  onThemesItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    var name = home.getDataSet(event, 'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name,
    })
  }

})