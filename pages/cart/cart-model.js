import { Base } from '../../utils/base.js';

class Cart extends Base {

  // 定义构造函数
  constructor() {
    super();
    this._storageKeyName = 'cart';
  }

  /**
   * 加入到购物车
   * 如果没有这样商品，则直接添加一条新纪录，数量为counts
   * 如果有则将相应数量 + counts
   * @params
   * item - {obj} 商品对象
   * counts - {int} 商品数目
   */
  add(item, counts) {
    var cartData = this.getCartDataFromLocal();

    var isHasInfo = this.isHasThatOne(item.id, cartData);

    if (isHasInfo.index == -1) {
      item.counts = counts;
      item.selectStatus = true; // 设置选中状态
      cartData.push(item);
    } else {
      cartData[isHasInfo.index].counts += counts;
    }

    wx.setStorageSync(this._storageKeyName, cartData);
  }

  /**
   * 从缓存中读取购物车数据
   */
  getCartDataFromLocal(flag) {
    var res = wx.getStorageSync(this._storageKeyName);
    if (!res) {
      res = [];
    }

    // 在下单的时候过滤不下单的商品
    if (flag) {
      var newRes = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].selectStatus) {
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }

    return res;
  }

  /**
   * 判断某个商品是否已经被添加到购物车中 
   * 并且返回这个商品数据和所在数组中的序号
   */
  isHasThatOne(id, arr) {
    var item,result = {index: -1};
    for (let i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item.id == id) {
        result = {
          index: i,
          data: item
        };

        break; 
      }
    }

    return result;
  }

  /**
   * 计算购物车中所有商品的总和
   * flag true 要考虑商品的选择状态
   */
  getCartTotalCounts(flag) {
    var data = this.getCartDataFromLocal();
    var counts = 0;

    for (let i = 0; i < data.length; i++) {
      if (flag) {
        if (data[i].selectStatus) {
          counts += data[i].counts;
        }
      } else {
        counts += data[i].counts;
      }
    }
    
    return counts;
  }

  /**
   * 修改商品数量对缓存的操作
   * params
   * id 商品id
   * counts 数目
   */
  changeCounts(id, counts) {
    var cartData = this.getCartDataFromLocal();
    var hasInfo = this.isHasThatOne(id, cartData);
    if (hasInfo != -1) {
      if (hasInfo.data.counts > 1) {
        cartData[hasInfo.index].counts += counts;
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData) // 更新本地缓存
  }

  /**
   * 增加商品数量
   */
  addCounts(id) {
    this.changeCounts(id, 1);
  }

  /**
   * 减少商品数量
   */
  cutCounts(id) {
    this.changeCounts(id, -1);
  }

  /**
   * 删除商品 缓存层面
   */
  delete(ids) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    var cartData = this.getCartDataFromLocal();
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this.isHasThatOne(ids[i], cartData);
      if (hasInfo != -1) {
        cartData.splice(hasInfo.index, 1); // 删除数组某一项  
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData) // 更新本地缓存
  }

  /**
   * 本地缓存更新保存
   */
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
  }

}

// 输出该类
export { Cart };