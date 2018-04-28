import { myStore } from '../tools/store';
import Api from '../config/api';
var config = require('../config/config.js');

class Tool {

  constructor() {

  }

  getImgPath(value) {
    return config.HOST + 'http://statics.zhuishushenqi.com' + value;
  }

}

export let tools = new Tool();