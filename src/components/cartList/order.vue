<template>
  <el-row>
    <el-table
      :data="dueCarts"
      border
      style="width: 100%">
      <el-table-column
        label="序号"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="OrderNo"
        label="订单号"
        width="">
      </el-table-column>
      <el-table-column
        prop="ContactName"
        label="嘉宾姓名"
        width="">
      </el-table-column>
      <el-table-column
        prop="TtimeDate"
        label="TeeTime"
        width="">
      </el-table-column>
      <el-table-column
        prop="Holes"
        label="洞号"
        width="">
      </el-table-column>
      <el-table-column
        label="操作（选择球童/球车）">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="choose(scope.row, scope.$index)" v-if="scope.row.carstuta !== 1" v-show="scope.row.carstuta !== 2">选择</el-button>
          <el-button type="warning" size="mini" @click="dueIn(scope.row)"  v-if="scope.row.carstuta == 1">收车</el-button>
          <el-button type="success" size="mini" @click=""  v-if="scope.row.carstuta == 2" >已收车</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-dialog :visible.sync="chooseForm" width="40%">
        <el-row>
          <el-col :span="12" :offset="2">
            <el-form :model="form">
              <el-form-item label="订单号：" :label-width="formLabelWidth">
                <span>{{form.orderNumber}}</span>
              </el-form-item>
              <el-form-item label="嘉宾姓名：" :label-width="formLabelWidth">
                <span>{{form.guestName}}</span>
              </el-form-item>
              <el-form-item label="选择球车：" :label-width="formLabelWidth">
                <el-select v-model="carValue" filterable placeholder="请选择或输入球车号" @change="selectCar">
                  <el-option
                    v-for="item in form.car"
                    :key="item.id"
                    :label="item.carnumber"
                    :disabled = "item.carstuta == 1"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择球童：" :label-width="formLabelWidth">
                <el-select v-model="caddieValue" filterable placeholder="请选择或输入球童姓名" @change="selectCaddie">
                  <el-option
                    v-for="item in form.caddies"
                    :key="item.id"
                    :label="item.boyname"
                    :disabled = "item.stuta == 1"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注：" :label-width="formLabelWidth" v-show="false">
                <el-row>
                  <el-col :span="24">
                    <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请输入内容"
                      v-model="form.remark">
                    </el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <el-button type="primary"  @click="dueOutCar">发车</el-button>
                <el-button @click="chooseForm = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-dialog>
    </el-row>
    <el-dialog
      :visible.sync="dueInVisible"
      width="30%">
      <span>确定要收车吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDueIn">确 定</el-button>
        <el-button @click="dueInVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import { getCartList, dueCar } from '@/api/cart'
  import { getCaddiesInfo } from '@/api/caddies'
  export default {
    name: 'order',
    props: {
      dueCarts: {
        type: Array
      }
    },
    data() {
      return {
        form: {
          orderNumber: '',
          guestName: '',
          car: [],
          caddies: [],
          remark: ''
        },
        carValue: '',
        caddieValue: '',
        chooseForm: false,
        dueInVisible: false,
        dueInCarId: '',
        dueInCaddieId: '',
        formLabelWidth: '120px'
      }
    },
    created() {
      this.getCarts()
      this.getCaddies()
    },
    methods: {
      getCarts() {
        var _this = this
        getCartList().then(function(res) {
          _this.form.car = res
        })
      },
      getCaddies() {
        var _this = this
        getCaddiesInfo().then(function(res) {
          _this.form.caddies = res
        })
      },
      choose(row, index) {
        this.chooseForm = true
        this.carValue = ''
        this.caddieValue = ''
        this.form.orderNumber = row.OrderNo
        this.form.guestName = row.ContactName
        console.log(index)
      },
      selectCar() {
        console.log(this.carValue)
      },
      selectCaddie() {
        console.log(this.caddieValue, this.form.remark)
      },
      dueOutCar() {
        var _this = this
        var orderNo = this.form.orderNumber
        var carid = this.carValue
        var batboyid = this.caddieValue
        var stuta = 1
        if (carid && batboyid) {
          dueCar(orderNo, carid, batboyid, stuta).then(function(res) {
            if (res === 1) {
              _this.$message.success('发车成功')
              _this.chooseForm = false
              _this.$emit('getInfo')
            }
          })
        } else {
          _this.$message.warning('请选择球车和球童')
        }
      },
      dueIn(row) {
        this.dueInVisible = true
        this.dueInCarId = row.ballcarid
        this.dueInCaddieId = row.batboyid
        this.form.orderNumber = row.OrderNo
        console.log(this.dueInCarId, this.dueInCaddieId, this.form.orderNumber)
      },
      confirmDueIn() {
        var _this = this
        var orderNo = this.form.orderNumber
        var carid = this.dueInCarId
        var batboyid = this.dueInCaddieId
        var stuta = 0
        dueCar(orderNo, carid, batboyid, stuta).then(function(res) {
          if (res === 1) {
            _this.$message.success('收车成功')
            _this.dueInVisible = false
            _this.$emit('getInfo')
          } else {
            _this.$message.danger('收车失败')
          }
        })
      }
    }
  }
</script>
