<template>
  <el-row v-show="show">
    <el-table
      :data="dueCarts"
      border
      style="width: 100%">
      <el-table-column
        prop="number"
        label="球车编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="嘉宾姓名"
        width="">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="嘉宾手机号"
        width="">
      </el-table-column>
      <el-table-column
        label="球童姓名，编号"
        width="">
        <template slot-scope="scope">
          <span>{{scope.row.caddieName}} {{scope.row.caddieNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="caddiePhone"
        label="球童手机号"
        width="">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag
            type="success"
            size="small"
            v-if="scope.row.state ==1"
            disable-transitions>待收车</el-tag>
          <el-tag
            type="warning"
            size="small"
            v-if="scope.row.state ==0"
            disable-transitions>待发车</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.state == 1">收车</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.state == 0">发车</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'cartList',
    props: {
      dueCarts: {
        type: Array
      }
    },
    data() {
      return {
      }
    },
    computed: {
      ...mapState({
        show: state => state.cart.show
      })
    },
    methods: {
    }
  }
</script>
