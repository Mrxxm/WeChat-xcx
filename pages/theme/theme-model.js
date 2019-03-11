import { Base } from '../../utils/base.js';

class Theme extends Base {

  // 定义构造函数
  constructor() {
    super();
  }

  getThemeOne(id, callBack) {
    var params = {
      url: 'theme/' + id,
      sCallBack: function (res) {
        callBack && callBack(res);
      }
    };
    this.request(params);
  }

  
}

// 输出该类
export { Theme };