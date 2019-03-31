import { Config } from 'config.js';

class Token{

  constructor(){
    this.verifyUrl = Config.restUrl + 'token/verify';
    this.tokenUrl = Config.restUrl + 'token/user';
  }

  verify() {
    var token = wx.getStorageSync('token');
    if (!token) {
      this.getTokenFromServer();
    } else {
      this.verifyFromServer(token);
    }
  }

  getTokenFromServer(callBack) {
    var that = this;
    
    wx.login({
      success: function (res) {
        wx.request({
          url: that.tokenUrl + '?XDEBUG_SESSION_START=12772',
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (res) {
            wx.setStorageSync('token', res.data.token);
            callBack && callBack(res.data.token);
          }
        })
      }
    })
  }

  verifyFromServer(token) {
    var that = this;
    wx.request({
      url: that.verifyUrl + '?XDEBUG_SESSION_START=12772',
      method: 'POST',
      data: {
        token: token
      },
      success: function (res) {
        var valid = res.data.isValid;
        if (!valid) {
          that.getTokenFromServer();
        }
      }
    })
  }

}

export { Token };