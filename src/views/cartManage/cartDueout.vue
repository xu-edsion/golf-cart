<template>
  <div class="app-container">
    <el-row class="cart-search">
      <el-col :span="5">
        <el-input v-model="cartInfo"  suffix-icon="el-icon-search" placeholder="请输入球车编号"></el-input>
      </el-col>
      <!--<el-col :span="19" class="one-key">-->
        <!--<el-button type="primary" size="small" @click="dueOut">一键发车</el-button>-->
      <!--</el-col>-->
    </el-row>
    <order :dueCarts="order" @getInfo="getOrderInfo"></order>
  </div>
</template>

<script>
  import { getOrder } from '@/api/cart'
  import order from '@/components/cartList/order'
  export default {
    name: 'dueOut',
    data() {
      return {
        cartInfo: '',
        order: []
      }
    },
    components: { order },
    created() {
      this.getOrderInfo()
    },
    methods: {
      getOrderInfo() {
        var _this = this
        getOrder().then(function(res) {
          console.log(res)
          _this.order = res
        })
      },
      dueOut() {
      }
    }
  }
</script>
