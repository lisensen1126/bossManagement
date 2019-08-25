import FunctionLayout from '@/components/functionSetting/FunctionLayout'
import MangeTopNav from '@/components/functionSetting/MangeTopNav'
import TypeMange from '@/components/functionSetting/TypeManage'
import ProjectMange from '@/components/functionSetting/ProjectManage'
import AddInspection from '@/components/functionSetting/AddInspection'
import MaintenanceCardAdd from '@/components/functionSetting/MaintenanceCardAdd'
import MaintenanceCardAddTwo from '@/components/functionSetting/MaintenanceCardAddTwo'
import MaintenanceCardList from '@/components/functionSetting/MaintenanceCardList'
import MaintenanceCardNav from '@/components/functionSetting/MaintenanceCardNav'
import MaintenanceCardDetail from '@/components/functionSetting/MaintenanceCardDetail'
import MaintenanceTemplateAdd from '@/components/functionSetting/MaintenanceTemplateAdd'
import MaintenanceTemplateList from '@/components/functionSetting/MaintenanceTemplateList'
import VehicleItemList from '@/components/functionSetting/VehicleItemList'

export default {
  path: 'functions',
  component: FunctionLayout,
  children: [{
    name: 'mange',
    path: 'mange',
    component: MangeTopNav,
    meta: {
      module: 'functions',
    },
    children: [{
      name: 'type',
      path: 'type',
      component: TypeMange,
      meta: {
        module: 'functions',
      },
    }, {
      name: 'scene',
      path: 'scene',
      component: ProjectMange,
      meta: {
        module: 'functions',
      },
    }, {
      name: 'project',
      path: 'project',
      component: VehicleItemList,
      meta: {
        module: 'functions',
      },
    }, {
      path: '/',
      redirect: {name: 'type'},
    }],
  }, {
    name: 'addInspec',
    path: 'mange/addInspec',
    component: AddInspection,
    meta: {
      module: 'functions',
    },
  }, {
    name: 'maintenanceCardNav',
    path: 'maintenanceCardNav',
    component: MaintenanceCardNav,
    meta: {
      module: 'functions',
    },
    children: [{
      name: 'maintenanceCardList',
      path: 'maintenanceCardList',
      component: MaintenanceCardList,
      meta: {
        module: 'functions',
      },
    }, {
      name: 'maintenanceTemplateList',
      path: 'maintenanceTemplateList',
      component: MaintenanceTemplateList,
      meta: {
        module: 'functions',
      },
    }, {
      path: '/',
      redirect: {name: 'maintenanceCardList'},
    }],
  }, {
    name: 'maintenanceCardAdd',
    path: 'maintenanceCardNav/maintenanceCardAdd',
    component: MaintenanceCardAdd,
    meta: {
      module: 'functions',
      keepAlive: true
    },
  }, {
    name: 'maintenanceCardAddTwo',
    path: 'maintenanceCardNav/maintenanceCardAddTwo',
    component: MaintenanceCardAddTwo,
    meta: {
      module: 'functions',
      keepAlive: true
    },
  }, {
    name: 'maintenanceTemplateAdd',
    path: 'maintenanceCardNav/maintenanceTemplateAdd',
    component: MaintenanceTemplateAdd,
    meta: {
      module: 'functions',
    },
  }, {
    name: 'maintenanceCardDetail',
    path: 'maintenanceCardNav/maintenanceCardDetail',
    component: MaintenanceCardDetail,
    meta: {
      module: 'functions',
    },
  }, {
    path: '/',
    redirect: {name: 'mange'},
  }],
}
