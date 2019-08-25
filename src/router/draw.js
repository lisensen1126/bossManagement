import DrawAdd from '@/components/draw/DrawAdd'
import AddPoster from '@/components/draw/AddPoster'
import EditPoster from '@/components/draw/EditPoster'
import DrawLayout from '@/components/draw/DrawLayout'
import DrawList from '@/components/draw/DrawList'
import PosterList from '@/components/draw/PosterList'
import Prizes from '@/components/draw/Prizes'
import EventDetail from '@/components/draw/EventDetail'
import GroupPurchaseList from '@/components/groupPurchase/GroupPurchaseList'
import GroupPurchaseDetail from '@/components/groupPurchase/GroupPurchaseDetail'
import GroupPurchaseCreate from '@/components/groupPurchase/GroupPurchaseCreate'
import GroupPurchaseStoreList from '@/components/groupPurchase/GroupPurchaseStoreList'
import GroupPurchaseEdit from '@/components/groupPurchase/GroupPurchaseEdit'
import GroupStorePurchaseList from '@/components/groupPurchase/GroupStorePurchaseList'
import PurchasePageSetting from '@/components/groupPurchase/PurchasePageSetting'
import MessageNav from '@/components/draw/MessageNav'
import PosterTopNav from '@/components/draw/PosterTopNav'
import MessageTemplateList from '@/components/draw/MessageTemplateList'
import MessageAdd from '@/components/draw/MessageAdd'
import MessageAdmin from '@/components/draw/MessageAdmin'
import MessageSend from '@/components/draw/MessageSend'
import MessageSendDetail from '@/components/draw/MessageSendDetail'
import MessageStatistic from '@/components/draw/MessageStatistic'
import PayReduceNav from '@/components/draw/PayReduceNav'
import PayReduceList from '@/components/draw/PayReduceList'
import PayReduceStatistics from '@/components/draw/PayReduceStatistics'
import PayReduceDetail from '@/components/draw/PayReduceDetail'

export default {
  path: 'draw',
  component: DrawLayout,
  children: [
    {
      name: 'drawList',
      path: 'drawList',
      component: DrawList,
      meta: {
        module: 'draw',
        keepAlive: true,
        isBack: false,
      },
    },
    {
      name: 'drawAdd',
      path: 'drawList/add',
      component: DrawAdd,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'prizes',
      path: 'prizes',
      component: Prizes,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'eventDetail',
      path: 'drawList/eventDetail',
      component: EventDetail,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'purchasePageSetting',
      path: 'purchasePageSetting',                // 活动管理
      component: PurchasePageSetting,
      meta: {
        module: 'draw',
      },
      children: [
        {
          name: 'groupPurchaseList',
          path: 'groupPurchaseList',                // 活动管理
          component: GroupPurchaseList,
          meta: {
            module: 'draw',
          },
        },
        {
          name: 'groupStorePurchaseList',
          path: 'groupStorePurchaseList',                // 活动管理
          component: GroupStorePurchaseList,
          meta: {
            module: 'draw',
          },
        },
        {
          path: '/',
          redirect: { name: 'groupPurchaseList' },
        },
      ],
    },
    {
      name: 'groupPurchaseDetail',
      path: 'purchasePageSetting/groupPurchaseDetail',             // 活动详情
      component: GroupPurchaseDetail,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'groupPurchaseCreate',
      path: 'purchasePageSetting/groupPurchaseCreate',              // 新建团购
      component: GroupPurchaseCreate,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'groupPurchaseStoreList',
      path: 'purchasePageSetting/groupPurchaseStoreList',              // 新建团购
      component: GroupPurchaseStoreList,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'groupPurchaseEdit',
      path: 'purchasePageSetting/groupPurchaseEdit',             // 编辑团购
      component: GroupPurchaseEdit,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'messageNav',
      path: 'messageNav',                // 短信管理
      component: MessageNav,
      meta: {
        module: 'draw',
      },
      children: [
        {
          name: 'messageTemplateList',
          path: 'messageTemplateList', // 短信模板列表
          component: MessageTemplateList,
          meta: {
            module: 'draw',
          },
        }, {
          name: 'messageAdmin',
          path: 'messageAdmin', // 短信模板列表
          component: MessageAdmin,
          meta: {
            module: 'draw',
          },
        }, {
          name: 'messageStatistic',
          path: 'messageStatistic', // 短信模板列表
          component: MessageStatistic,
          meta: {
            module: 'draw',
          },
        }, {
          path: '/',
          redirect: { name: 'messageTemplateList' },
        },
      ],
    },
    {
      name: 'addPoster',
      path: 'posterTopNav/addPoster',
      component: AddPoster,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'editPoster',
      path: 'posterTopNav/editPoster',
      component: EditPoster,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'posterTopNav',
      path: 'posterTopNav',
      component: PosterTopNav,
      meta: {
        module: 'draw',
      },
      children: [
        {
          name: 'posterList',
          path: 'posterList',
          component: PosterList,
          meta: {
            module: 'draw',
          },
        }, {
          path: '/',
          redirect: { name: 'posterList' },
        },
      ],
    },
    {
      name: 'messageSend',
      path: 'messageNav/messageSend', // 短信模板列表
      component: MessageSend,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'messageSendDetail',
      path: 'messageNav/messageSendDetail', // 短信模板列表
      component: MessageSendDetail,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'messageAdd',
      path: 'messageAdd',  // 新建模板
      component: MessageAdd,
      meta: {
        module: 'draw',
      },
    },
    {
      name: 'PayReduceNav',
      path: 'PayReduceNav',
      component: PayReduceNav,
      meta: {
        module: 'draw',
      },
      children: [
        {
          name: 'PayReduceList',
          path: 'paylist',
          component: PayReduceList,
          meta: {
            module: 'draw',
          },
        },
        {
          name: 'PayReduceStatistics',
          path: 'statistics',
          component: PayReduceStatistics,
          meta: {
            module: 'draw',
          },
        },
        {
          path: '/',
          redirect: { name: 'PayReduceList' },
        },
      ],
    },
    {
      name: 'PayReduceDetail',
      path: 'PayReduceNav/paydetail',
      component: PayReduceDetail,
      meta: {
        module: 'draw',
      },
    },
    {
      path: '/',
      redirect: { name: 'drawList' },
    },
  ],
}
