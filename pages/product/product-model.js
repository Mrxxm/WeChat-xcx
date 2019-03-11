import { Base } from '../../utils/base.js';

class Product extends Base {

  // 定义构造函数
  constructor() {
    super();
  }

  getProductOne(id, callBack) {
    var params = {
      url: 'product/' + id,
      sCallBack: function (res) {
        callBack && callBack(res);
      }
    };
    this.request(params);
  }


}

// 输出该类
export { Product };