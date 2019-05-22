// pages/cart/cart.js
import { Cart } from 'cart-model.js';

var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onHide: function () {
    cart.execSetStorageSync(this.data.cartData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var cartData = cart.getCartDataFromLocal();
    // var countsInfo = cart.getCartTotalCounts(true);
    var cal = this.getTotalAccountAndCounts(cartData);

    this.setData({
      selectedCounts: cal.selectedCounts,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account,
      cartData: cartData,
    })
  },

  // 获取总价格 总数量的计算
  getTotalAccountAndCounts: function(data) {
    var len = data.length,account = 0,selectedCounts = 0,selectedTypeCounts = 0;

    let multiple = 100;

    for (let i = 0; i < len; i++) {
      if (data[i].selectStatus) {
        // 避免浮点数不精确为题
        account += data[i].counts * multiple * Number(data[i].price) * multiple;
        selectedCounts += data[i].counts;
        selectedTypeCounts++;
      }
    }

    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account / (multiple * multiple)
    }
  },

  // 点击单选按钮
  // UI样式的修改
  // cartData里面数据的修改selectStatus
  toggleSelect: function(event) {
    var id = cart.getDataSet(event, 'id');
    var status = cart.getDataSet(event, 'status');
    var index = cart.getDataSet(event, 'index');

    this.data.cartData[index].selectStatus = !status;

    // 调用重新计算关联数据方法
    this.resetCartData();
  },

  // 计算按钮点击之后关联数据变化
  // 全选按钮变化
  // 全选数量变化
  // 全选金额变化
  // 关键点:这个重新计算方法传进的cartData是页面绑定的不是从内存中直接取出的
  resetCartData: function() {
    var newData = this.getTotalAccountAndCounts(this.data.cartData);
    // 重新数据绑定
    this.setData({
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      account: newData.account,
      cartData: this.data.cartData,
    })
  },

  // 全选按钮事件
  toggleSelectAll: function(event) {
    var status = cart.getDataSet(event, 'status') == 'true';

    var data = this.data.cartData;
    var len = data.length;
    for (let i = 0; i < len; i++) {
      data[i].selectStatus = !status;
    }

    // 调用重新计算关联数据方法
    this.resetCartData();
  },

  // 减号和加号
  changeCounts: function(event) {
    var id = cart.getDataSet(event, 'id');
    var index = cart.getDataSet(event, 'index');
    var type = cart.getDataSet(event, 'type');
    var counts = -1;
    
    if (type == 'cut') {
      // 这里的方法修改的是缓存中的数值
      cart.cutCounts(id);
    } else {
      counts = 1;
      // 这里的方法修改的是缓存中的数值
      cart.addCounts(id);
    }

    // 这里就是修改页面绑定数据
    this.data.cartData = wx.getStorageSync("cart");
    // this.data.cartData[index].counts += counts;
    // 调用重新计算关联数据方法 刷新页面绑定数据
    this.resetCartData(); 
  },

  delete: function(event) {
    var id = cart.getDataSet(event, 'id');
    var index = cart.getDataSet(event, 'index');

    this.data.cartData.splice(index, 1); // 删除某一项商品

    // 调用重新计算关联数据方法 刷新页面绑定数据
    this.resetCartData(); 
    // 缓存中删除商品
    cart.delete(id);
  },

  // 跳转到订单页面
  submitOrder: function (event) {
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart',
    })
  }

})