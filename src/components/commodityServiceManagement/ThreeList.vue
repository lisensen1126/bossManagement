<template>
  <ul class="tree-menu" style="text-align: left">
    <li v-for="(item, index) in data" :class="{ 'p-20': item.level=='1', 'p-40': item.level=='2', 'p-60': item.level=='3'}">
      <span @click="toggle(item, index)">
        <i :class="['icon', item.children && item.children.length ? folderIconList[index] : 'file-text',]"></i>
        {{ item.category_name }}
      </span>
      <tree-menu v-if="scope[index]" :data="item.children"></tree-menu>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'treeMenu',
    props: {
      data: Array,
      name: String,
    },
    data () {
      return {
        folderIconList: [],
        scope: {},
        child: [
          {
            category_id: 9,
            category_name: '一级分类',
            category_logo: '',
            is_enabled: 1,
            sort_order: 1,
            level: '1',
          },
          {
            category_id: 9,
            category_name: '一级分类',
            category_logo: '',
            is_enabled: 1,
            sort_order: 1,
            level: '1',
          },
        ],
      }
    },
    created () {
      this.data.forEach((item, index) => {
        if (item.children && item.children.length) {
          this.folderIconList[index] = 'folder' // 0,1,2 是文件夹
        }
      })
    },
    methods: {
      doTask (index) {
        this.$set(this.scope, index, !this.scope[index])
        this.folderIconList[index] = this.scope[index] ? 'folder-open' : 'folder' // 判断文件夹是否为打开状态
      },
      toggle (item, index) {
        this.$emit('listenChildEvent', this.child)
        if (item.children && item.children.length) {
          this.doTask(index)
        } else {
        }
      },
    },
  }
</script>

<style scoped>
  .tree-menu {
    list-style: none;
    font-size: 14px;
  }
  .tree-menu li {
    line-height: 2;
  }
  .tree-menu li span {
    cursor: default;
  }
  .icon {
    display: inline-block;
    width: 15px;
    height: 15px;
    background-repeat: no-repeat;
    vertical-align: -2px;
  }
  .icon.folder {
    background: url(../../assets/zx/file.png) no-repeat center;
    background-size: 15px;
  }
  .icon.folder-open {
    background: url(../../assets/zx/file.png) no-repeat center;
    background-size: 15px;
  }
  .icon.file-text {
    background: url(../../assets/zx/file.png) no-repeat center;
    background-size: 15px;
  }
  .icon.loading {
    /*background-image: url(../../src/assets/loading.png);*/
    background-size: 15px;
  }
  .p-20{
    padding-left: 10px;
  }
  .p-40{
    padding-left: 20px;
  }
  .p-60{
    padding-left: 30px;
  }
</style>
