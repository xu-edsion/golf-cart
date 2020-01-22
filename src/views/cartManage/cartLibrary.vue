<template>
  <div class="app-container cart-library">
    <el-row class="cart-search">
      <el-col :span="5">
        <el-input v-model="cartType"  suffix-icon="el-icon-search" placeholder="请输入球车型号进行搜索"></el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary" size="small" @click="addCart">添加球车</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="cartListEnd"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号"
        width="100">
      </el-table-column>
      <el-table-column
        label="球车图片"
        width="">
        <template slot-scope="scope">
          <img :src="'http://'+ scope.row.picture" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="carmodel"
        label="型号"
        width="">
      </el-table-column>
      <el-table-column
        prop="peoplenumber"
        label="乘坐人数"
        width="">
      </el-table-column>
      <el-table-column
        prop="carinfo"
        label="备注"
        width="">
      </el-table-column>
      <el-table-column
        prop="carnumber"
        label="关联设备号"
        width="">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag
            type="primary"
            size="small"
            v-if="scope.row.carstuta ==1"
            disable-transitions>已出库</el-tag>
          <el-tag
            type="info"
            size="small"
            v-if="scope.row.carstuta ==0"
            disable-transitions>在库</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="delCart(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin:20px auto"
      @size-change="carSizeChange"
      @current-change="carPageChange"
      :background="true"
      :current-page="cartPage"
      :page-sizes="[ 6, 7, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="cartTotal">
    </el-pagination>

    <el-dialog title="添加球车" :visible.sync="cartVisible">
      <el-row>
        <el-col :span="6" class="up-avatar">
          <div class="avatar-container" @click="fileClick">
            <img v-if="imageUrl" :src="imageUrl" class="avatar-up">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <input type="file" @change="fileChange($event)" id="avatar-input" style="display: none;" accept="image/*">
          </div>
          <span class="add-photo">添加图片</span>
        </el-col>
        <el-col :span="12">
          <el-form :model="cartForm" status-icon :rules="rules" ref="cartForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="球车设备号" prop="number">
              <el-input type="text" v-model="cartForm.number" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="型号" prop="type">
              <el-input type="text" v-model="cartForm.type" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="乘坐人数" prop="sitMember">
              <el-input type="text" v-model="cartForm.sitMember" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="text" v-model="cartForm.remark" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="state" v-show="false">
              <el-input type="text" v-model="cartForm.state" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="confirmAdd('cartForm')">确定</el-button>
              <el-button size="small" @click="cartVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      :visible.sync="delVisible"
      width="30%">
      <span>确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getCartList, uploadPicture, addCart, delBallCart } from '@/api/cart'
  import { validateCarNumber, validateType, validateSitMember } from '@/utils/validate'
  export default {
    name: 'cartLibrary',
    data() {
      return {
        cartType: '',
        flag: false,
        cartList: [],
        cartListEnd: [],
        filterListEnd: [],
        cartTotal: 0,
        cartVisible: false,
        delVisible: false,
        carId: '',
        carIndex: '',
        cartPage: 1,
        pageSize: 6,
        imageUrl: '',
        onlineUrl: '',
        cartForm: {
          number: '',
          type: '',
          sitMember: '',
          remark: '',
          state: ''
        },
        rules: {
          number: [{ validator: validateCarNumber, trigger: 'blur' }],
          type: [{ validator: validateType, trigger: 'blur' }],
          sitMember: [{ validator: validateSitMember, trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getCart()
    },
    watch: {
      cartType: function() {
        this.doFilter()
      }
    },
    methods: {
      getCart() {
        var _this = this
        getCartList().then(function(res) {
          console.log(res)
          _this.cartList = res
          _this.cartTotal = _this.cartList.length
          if (_this.cartTotal > _this.pageSize) {
            for (let i = 0; i < _this.pageSize; i++) {
              _this.cartListEnd.push(_this.cartList[i])
            }
          } else {
            _this.cartListEnd = _this.cartList
          }
        })
      },
      addCart() {
        this.cartVisible = true
        this.flag = false
      },
      fileClick() {
        document.getElementById('avatar-input').click()
      },
      fileChange(e) {
        var _this = this
        var file = document.getElementById('avatar-input').files[0]
        var reader = new FileReader()
        reader.vue = this
        reader.readAsDataURL(file)
        reader.onload = function() {
          reader.vue.imageUrl = this.result
        }
        uploadPicture(file).then(function(res) {
          _this.onlineUrl = res
          console.log(_this.onlineUrl)
        })
      },
      confirmAdd(formName) {
        var _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var pictrue = this.onlineUrl
            var carmodel = this.cartForm.type
            var peoplenumber = this.cartForm.sitMember
            var carinfo = this.cartForm.remark
            var carnumber = this.cartForm.number
            if (pictrue) {
              addCart(pictrue, carmodel, peoplenumber, carinfo, carnumber).then(function(res) {
                if (res === 1) {
                  _this.$message.success('添加成功')
                  _this.cartVisible = false
                  _this.cartListEnd = []
                  _this.cartPage = 1
                  _this.getCart()
                }
              })
            } else {
              _this.$message.warning('请添加图片')
            }
          } else {
            return false
          }
        })
      },
      delCart(row, index) {
        this.carId = row.id
        this.carIndex = index
        this.delVisible = true
      },
      confirDel() {
        var _this = this
        delBallCart(this.carId).then(function(res) {
          console.log(res)
          if (res === 1) {
            _this.$message.success('删除成功')
            _this.delVisible = false
            var index = _this.carIndex + (_this.cartPage - 1) * _this.pageSize
            _this.cartListEnd.splice(_this.carIndex, 1)
            _this.cartList.splice(index, 1)
            _this.cartTotal = _this.cartTotal - 1
            _this.currentChangePage(_this.cartList)
          }
        })
      },
      carSizeChange(val) {
        this.pageSize = val
        this.carPageChange(this.cartPage)
      },
      carPageChange(val) {
        this.cartPage = val
        if (!this.flag) {
          this.currentChangePage(this.cartList)
        } else {
          this.currentChangePage(this.filterListEnd)
        }
      },
      currentChangePage(list) {
        let from = (this.cartPage - 1) * this.pageSize
        const to = this.cartPage * this.pageSize
        this.cartListEnd = []
        for (; from < to; from++) {
          if (list[from]) {
            this.cartListEnd.push(list[from])
          }
        }
      },
      doFilter() {
        this.cartListEnd = []
        this.filterListEnd = []
        this.cartList.forEach((value) => {
          if (value.carmodel) {
            if (value.carmodel.indexOf(this.cartType) >= 0) {
              this.filterListEnd.push(value)
            }
          }
        })
        this.cartPage = 1
        this.cartTotal = this.filterListEnd.length
        this.currentChangePage(this.filterListEnd)
        this.flag = true
      }
    }
  }
</script>
