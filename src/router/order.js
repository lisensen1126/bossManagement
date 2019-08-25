import OrderLayout from '@/components/orders/OrderLayout'
import OrderList from '@/components/orders/OrderList'
import OrderDetail from '@/components/orders/OrderDetail'

export default {
  // name: 'order',
  path: 'order',
  component: OrderLayout,
  children: [
    {
      name: 'orderList',
      path: 'orderList',
      component: OrderList,
      meta: {
        module: 'order',
      },
    },
    {
      name: 'orderDetail',
      path: 'orderList/detail/:id',
      component: OrderDetail,
      meta: {
        module: 'order',
      },
    },
    {
      path: '/',
      redirect: {name: 'orderList'},
    },
  ],
}
