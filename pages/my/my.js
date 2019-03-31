import { Address } from '../../utils/address.js';
import { Order } from '../order/order-model.js';
import { My } from '../my/my-model.js';

// var address = new Address();
var order = new Order();
var my = new My();

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

    this.loadData();

  },

  loadData:function () {
    var that = this;
    my.getUserInfo((data) => {
      this.setData({
        userInfo: data
      });

    });
  },

})