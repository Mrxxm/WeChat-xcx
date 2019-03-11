// pages/product/product.js
import { Product } from 'product-model.js';
import { Cart } from '../cart/cart-model.js';

var product = new Product();
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    productCounts: 1,
    currentTabsIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.loadData();
  },

  // 获取product信息
  loadData: function () {
    product.getProductOne(this.data.id, (res) => {
      this.setData({
        'productInfo': res,
        'cartTotalCounts': cart.getCartTotalCounts()
      });
    });
  },

  // bindPickerChange 
  bindPickerChange: function(event) {
    var index = event.detail.value;
    var selectedCount = this.data.countsArray[index];
    this.setData({
      productCounts: selectedCount
    })
  },

  // onTabsItemTap 商品详情下半部分选项卡
  onTabsItemTap: function(event) {
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    })
  },

  // 点击购物车
  onAddingToCartTap: function(event) {
    this.addToCart();
    var counts = this.data.productCounts + this.data.cartTotalCounts;
    this.setData({
      cartTotalCounts: counts
    })
  },

  addToCart: function() {
    var tempObj = {};
    var keys = ['id', 'name', 'main_img_url', 'price'];

    for (var key in this.data.productInfo) {
      if (keys.indexOf(key) >= 0) { // key 在 keys中存在
        tempObj[key] = this.data.productInfo[key];
      }
    }

    cart.add(tempObj, this.data.productCounts);
  },

  // 跳转
  onCartTap: function(event) {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  }
})