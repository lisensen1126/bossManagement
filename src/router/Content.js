import ContentLayout from '@/components/content/ContentLayout'
import ContentList from '@/components/content/ContentList'
import RegistrationUser from '@/components/content/RegistrationUser'
import ContentCreate from '@/components/content/ContentCreate'
import ContentEdit from '@/components/content/ContentEdit'
import NoticeClassifyList from '@/components/content/NoticeClassifyList'
import NoticeList from '@/components/content/NoticeList'
import NoticeAdd from '@/components/content/NoticeAdd'

export default {
  path: 'content',
  component: ContentLayout,
  children: [{
    name: 'contentList',
    path: 'contentList',
    component: ContentList,
    meta: {
      module: 'content',
      keepAlive: true,
      isBack: false,
    },
  }, {
    name: 'registrationUser',
    path: 'contentList/registrationUser/:id',
    component: RegistrationUser,
    meta: {
      module: 'content',
    },
  }, {
    name: 'contentCreate',
    path: 'contentCreate',
    component: ContentCreate,
    meta: {
      module: 'content',
    },
  }, {
    name: 'contentEdit',
    path: 'contentEdit',
    component: ContentEdit,
    meta: {
      module: 'content',
    },
  }, {
    name: 'noticeClassifyList',
    path: 'noticeClassifyList',
    component: NoticeClassifyList,
    meta: {
      module: 'content',
    },
  }, {
    name: 'noticeList',
    path: 'noticeClassifyList/noticeList/:id',
    component: NoticeList,
    meta: {
      module: 'content',
      keepAlive: true,
      isBack: false,
    },
  }, {
    name: 'noticeAdd',
    path: 'noticeClassifyList/noticeAdd',
    component: NoticeAdd,
    meta: {
      module: 'content',
    },
  }, {
    path: '/',
    redirect: {name: 'contentList'},
  }],
}
