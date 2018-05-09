import MyHttp from './request.js';
import { myStore } from '../tools/store';

//所有的请求
const ALL_API = {
  getRankingCategory: { //获取排行榜分类
    method: 'GET',
    url: 'ranking/gender'
  },
  getRankingList: { //获取排行榜列表
    method: 'GET',
    url: 'rank'
  },
  getCommentList: { //获取热门书评列表
    method: 'GET',
    url: 'post/review/best-by-book'
  },
  getBookUpdate: {//获取书籍更新
    method: 'GET',
    url: 'btoc'
  },
  getClassifies: {//获取分类列表
    method: 'GET',
    url: 'cats/lv2/statistics'
  },
  getClassifyList: {//获取子分类列表
    method: 'GET',
    url: 'book/by-categories'
  }
}



const Api = new MyHttp({}, ALL_API);

export default Api;