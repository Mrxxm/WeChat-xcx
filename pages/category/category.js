// pages/category/category.js
import { Category } from 'category-model.js';

var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabIndex: 0,
    categoryData: '',
    currentCategoryId: '',
    loadedData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  loadData: function () {
    // 获取category信息
    category.getCategoryData((categoryData) => {
      this.setData({
        'categoryData': categoryData
      });

      // 在回调函数中进行调用
      // 获取category详情信息
      category.getCategoryOne(categoryData[0].id, (res) => {

        var dataObj = {
          products: res,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        }

        this.setData({
          'categoryInfo': dataObj
        });

        this.data.loadedData[0] = dataObj;
      });

    });
  },

  // tab切换
  onTabsItemTap: function(event) {
    var id = category.getDataSet(event, 'id');
    var index = category.getDataSet(event, 'index');

    this.setData({
      currentCategoryId: id,
      currentTabIndex: index
    });

    if (!this.isLoadedData(index)) {

      category.getCategoryOne(id, (res) => {

        var dataObj = {
          products: res,
          topImgUrl: this.data.categoryData[index].img.url,
          title: this.data.categoryData[index].name
        }

        this.setData({
          'categoryInfo': dataObj
        })

        this.data.loadedData[index] = dataObj;
      })
    } else {
      this.setData({
        'categoryInfo': this.data.loadedData[index]
      })
    }
    
  },

  // 判断当前分类下的商品数据是否已加载
  isLoadedData: function(index) {
    if(this.data.loadedData[index]) {
      return true;
    } 
      return false;
  },

  // 跳转到商品页面id从options中获取
  onProductsItemTap: function (event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

})