import { Base } from '../../utils/base.js';

class Category extends Base {

  // 定义构造函数
  constructor() {
    super();
  }

  getCategoryData(callBack) {
    var params = {
      url: 'category/all',
      sCallBack: function (res) {
        callBack && callBack(res);
      }
    };
    this.request(params);
  }

  getCategoryOne(id, callBack) {
    var params = {
      url: 'product/by_category?id=' + id,
      sCallBack: function (res) {
        callBack && callBack(res);
      }
    };
    this.request(params);
  }


}

// 输出该类
export { Category };