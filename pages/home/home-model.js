import {Base} from '../../utils/base.js';

class Home extends Base{

  // 定义构造函数
  constructor(){
    super();
  }

  getBannerData(id, callBack){
    var params = {
      url: 'banner/' + id,
      sCallBack: function(res) {
        callBack && callBack(res.items);
      }
    };
    this.request(params);
  }

  getThemeList(ids, callBack){
    var params = {
      url: 'theme?ids=' + ids,
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    };
    this.request(params);
  }

  getProductRecent(callback) {
    var params = {
      url: 'product/recent',
      sCallBack: function(res) {
        callback && callback(res);
      }
    };
    this.request(params);
  }
}

// 输出该类
export {Home};