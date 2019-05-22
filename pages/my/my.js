import { Address } from '../../utils/address.js';
import { Order } from '../order/order-model.js';
import { My } from '../my/my-model.js';

var address = new Address();
var order = new Order();
var my = new My();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadedAll: false,
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.loadData();
    this.getAddressInfo();
  },

  loadData:function () {
    var that = this;
    my.getUserInfo((data) => {
      this.setData({
        userInfo: data
      });

    });

    // 获取订单
    this.getOrders();
    order.execSetStorageSync(false);  //更新标志位
  },

  /**地址信息**/
  getAddressInfo: function () {
    var that = this;
    address.getAddress((addressInfo) => {
      that.bindAddressInfo(addressInfo);
    });
  },

  /*绑定地址信息*/
  bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

  /*修改或者添加地址信息*/
  editAddress: function () {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };
        if (res.telNumber) {
          that.bindAddressInfo(addressInfo);
          //保存地址
          address.submitAddress(res, (flag) => {
            if (!flag) {
              that.showTips('操作提示', '地址信息更新失败！');
            }
          });
        }
        //模拟器上使用
        else {
          that.showTips('操作提示', '地址信息更新失败,手机号码信息为空！');
        }
      }
    })
  },
  /*订单信息*/
  getOrders: function (callback) {
    var that = this;
    order.getOrders(this.data.pageIndex, (res) => {
      var data = res.data;
      console.log(data);
      that.setData({
        loadingHidden: true
      });
      if (data.length > 0) {
        that.data.orderArr.push.apply(that.data.orderArr, res.data);  //数组合并
        that.setData({
          orderArr: that.data.orderArr
        });
      } else {
        that.data.isLoadedAll = true;  //已经全部加载完毕
        that.data.pageIndex = 1;
      }
      callback && callback();
    });
  },
  // 下拉刷新订单 和onLoad 同等级别方法微信可直接调用
  onReachBottom: function () {
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this.getOrders();
    }
  },
  /*显示订单的具体信息*/
  showOrderDetailInfo: function (event) {
    var id = order.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    });
  },

  /*未支付订单再次支付*/
  rePay: function (event) {
    var id = order.getDataSet(event, 'id'),
      index = order.getDataSet(event, 'index');

    //online 上线实例，屏蔽支付功能
    if (order.onPay) {
      this._execPay(id, index);
    } else {
      this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽');
    }
  },
  /*支付*/
  _execPay: function (id, index) {
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode > 0) {
        var flag = statusCode == 2;

        //更新订单显示状态(付款状态)
        if (flag) {
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          });
        }

        //跳转到 成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my'
        });
      } else {
        that.showTips('支付失败', '商品已下架或库存不足');
      }
    });
  },
  onShow: function () {
    //更新订单,相当自动下拉刷新,只有  非第一次打开 “我的”页面，且有新的订单时 才调用。
    var newOrderFlag = order.hasNewOrder();
    if (this.data.loadingHidden && newOrderFlag) {
      this.onPullDownRefresh();
    }
  },
  /*下拉刷新页面*/
  // 这里是因为购物车下单后，我的订单页面数据没有刷新
  onPullDownRefresh: function () {
    var that = this;
    this.data.orderArr = [];  //订单初始化
    this.getOrders(() => {
      that.data.isLoadedAll = false;  //是否加载完全
      that.data.pageIndex = 1;
      wx.stopPullDownRefresh();
      order.execSetStorageSync(false);  //更新标志位
    });
  },

  /*
     * 提示窗口
     * params:
     * title - {string}标题
     * content - {string}内容
     * flag - {bool}是否跳转到 "我的页面"
     */
  showTips: function (title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {

      }
    });
  },

})