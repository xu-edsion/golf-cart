<template>
  <div class="app-container">
    <el-row style="margin: 10px 0 30px;">
      <el-col :span="16">
        <div>
          <span class="hole hole-title">前九洞</span><span class="hole" :class="{'hole-active': beforeIndex == index}" v-for="(hole, index) in beforeHole" @click="changeBeforeHole(index)">{{hole}}</span>
        </div>
        <div>
          <span class="hole hole-title">后九洞</span><span class="hole" :class="{'hole-active': afterIndex == index}" v-for="(hole, index) in afterHole" @click="changeAfterHole(index)">{{hole}}</span>
        </div>
      </el-col>
    </el-row>
    <!--<el-row class="all-hole">-->
      <!--<el-col :span="24">-->
        <!--<span class="categroy-hole" :class="{'active': clickIndex == index}" v-for="(hole, index) in holeList" :key="index" @click="toggleHole(index)">{{hole.value}}号洞</span>-->
        <!--<span class="to-hole">-->
          <!--从 <el-input type="text" v-model="fromHole"></el-input>至 <el-input type="text" v-model="toHole"></el-input>号洞-->
        <!--</span>-->
        <!--<el-button type="primary" size="mini" @click="toChoose">GO</el-button>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <el-table
      :data="cartClassify"
      :span-method="cellMerge"
      border
      style="width: 100%;">
      <el-table-column
        label="洞数"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.hole}}号洞</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="number"
        label="球车编号">
      </el-table-column>
      <el-table-column
        label="警告提醒">
        <template slot-scope="scope">
          <el-tag
            type="warning"
            size="small"
            v-if=" scope.row.totalTime > 30 && scope.row.totalTime <= 40"
            disable-transitions>超时</el-tag>
          <el-tag
            type="danger"
            size="small"
            v-if="scope.row.totalTime > 40"
            disable-transitions>超时</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="嘉宾姓名">
      </el-table-column>
      <el-table-column
        prop="caddieName"
        label="球童姓名，编号">
        <template slot-scope="scope">
          <span>{{scope.row.caddieName}} {{scope.row.caddieNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalTime"
        label="总用时(min)">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getCartInfo } from '@/api/cart'
  import { fiterCart, compare } from '@/utils/cartManage'
  export default {
    name: 'dataShow',
    data() {
      return {
        beforeIndex: '0',
        afterIndex: null,
        clickIndex: '0',
        holeList: [
          {
            value: '1~3'
          },
          {
            value: '4~6'
          },
          {
            value: '7~9'
          },
          {
            value: '10~12'
          },
          {
            value: '13~15'
          },
          {
            value: '16~18'
          }
        ],
        beforeHole: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        afterHole: [10, 11, 12, 13, 14, 15, 16, 17, 18],
        fromHole: '',
        toHole: '',
        cartList: [],
        cartGroup: [],
        cartClassify: [],
        spanArr: [],
        pos: null
      }
    },
    created() {
      var _this = this
      getCartInfo().then(function(res) {
        _this.cartList = res.Cart.sort(compare('hole'))
        // _this.cartGroup = fiterCart(_this.cartList).allData
        // _this.cartClassify = _this.cartGroup[_this.clickIndex]
        // _this.getSpanArr(_this.cartClassify)
        _this.chooseCart(parseInt(_this.beforeIndex))
        _this.getSpanArr(_this.cartClassify)
      })
    },
    methods: {
      changeBeforeHole(index) {
        this.beforeIndex = index
        this.afterIndex = null
        this.chooseCart(index)
        this.getSpanArr(this.cartClassify)
      },
      changeAfterHole(index) {
        this.afterIndex = index
        this.beforeIndex = null
        this.chooseCart(index + 9)
        this.getSpanArr(this.cartClassify)
      },
      chooseCart(index) {
        var _this = this
        this.spanArr = []
        this.pos = 0
        this.cartClassify = []
        this.cartList.forEach(function(value) {
          if (value.hole === index + 1) {
            _this.cartClassify.push(value)
          }
        })
      },
      toggleHole(index) {
        this.clickIndex = index
        this.cartClassify = this.cartGroup[index]
        this.spanArr = []
        this.pos = 0
        this.getSpanArr(this.cartClassify)
        this.fromHole = ''
        this.toHole = ''
      },
      getSpanArr(data) {
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            this.spanArr.push(1)
            this.pos = 0
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i].hole === data[i - 1].hole) {
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
      },
      cellMerge({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      toChoose() {
        if (this.fromHole && this.toHole) {
          this.spanArr = []
          this.pos = 0
          this.cartClassify = fiterCart(this.cartList, this.fromHole, this.toHole).chooseData
          this.getSpanArr(this.cartClassify)
          this.clickIndex = null
        } else {
          this.$message.warning('请输入洞号')
        }
      }
    }
  }
</script>
