<template>
  <div class="app-container electricFence">
    <el-row class="add-row cart-search">
      <el-col :span="5">
        <el-input v-model="caddieName" suffix-icon="el-icon-search" placeholder="请输入球童姓名搜索"></el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addCaddie">添加球童</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="caddiesEnd"
      border
      style="width: 50%">
      <el-table-column
        prop="boynumber"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="boyname"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="boyphone"
        label="电话号码"
        width="200">
      </el-table-column>
      <el-table-column
        label="状态"
        width="100">
        <template slot-scope="scope">
          <el-tag
            type="info"
            size="small"
            v-if="scope.row.stuta ==1"
            disable-transitions>已选中</el-tag>
          <el-tag
            type="primary"
            size="small"
            v-if="scope.row.stuta ==0"
            disable-transitions>空闲</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="delCaddie(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px;"
      background
      @size-change="caddieSizeChange"
      @current-change="caddiePageChange"
      :current-page="caddiePage"
      :page-sizes="[10, 12, 15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="caddiesTotal">
    </el-pagination>
    <el-dialog title="添加球童" :visible.sync="caddiesVisible" width="30%">
      <el-row>
        <el-col :span="18" :offset="1">
          <el-form :model="caddieForm" :rules="rules" ref="caddieForm">
            <el-form-item label="编号" :label-width="formLabelWidth" prop="boynumber">
              <el-input v-model="caddieForm.boynumber"></el-input>
            </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="boyname">
              <el-input v-model="caddieForm.boyname"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" :label-width="formLabelWidth" prop="boyphone">
              <el-input v-model="caddieForm.boyphone"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <el-button type="primary" @click="confirmAdd('caddieForm')">确 定</el-button>
              <el-button @click="caddiesVisible = false">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      :visible.sync="delVisible"
      width="30%">
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelCaddy">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { getCaddiesInfo, addCaddie, delCaddie } from '@/api/caddies'
  import { validateName, validateNumber, validatePhone } from '@/utils/validate'
  export default {
    name: 'caddies',
    data() {
      return {
        caddieName: '',
        caddies: [],
        caddiesEnd: [],
        filterListEnd: [],
        flag: false,
        caddiePage: 1,
        pageSize: 10,
        caddiesTotal: 0,
        caddiesVisible: false,
        delVisible: false,
        formLabelWidth: '120px',
        caddieId: '',
        caddieIndex: '',
        caddieForm: {
          boyname: '',
          boynumber: '',
          boyphone: ''
        },
        rules: {
          boyname: [{ validator: validateName, trigger: 'blur' }],
          boynumber: [{ validator: validateNumber, trigger: 'blur' }],
          boyphone: [{ validator: validatePhone, trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getCaddies()
    },
    watch: {
      caddieName: function() {
        this.doFilter()
      }
    },
    methods: {
      getCaddies() {
        var _this = this
        getCaddiesInfo().then(function(res) {
          console.log(res)
          _this.caddies = res
          _this.caddiesTotal = _this.caddies.length
          if (_this.caddiesTotal > _this.pageSize) {
            for (let i = 0; i < _this.pageSize; i++) {
              _this.caddiesEnd.push(_this.caddies[i])
            }
          } else {
            _this.caddiesEnd = _this.caddies
          }
        })
      },
      addCaddie() {
        this.caddiesVisible = true
        this.flag = false
      },
      confirmAdd(formName) {
        var _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var boynumber = this.caddieForm.boynumber
            var boyname = this.caddieForm.boyname
            var boyphone = this.caddieForm.boyphone
            addCaddie(boynumber, boyname, boyphone).then(function(res) {
              if (res === 1) {
                _this.$message.success('添加成功')
                _this.caddiesVisible = false
                _this.caddiesEnd = []
                _this.caddiePage = 1
                _this.getCaddies()
              }
            })
          } else {
            return false
          }
        })
      },
      delCaddie(row, index) {
        this.delVisible = true
        this.caddieId = row.id
        this.caddieIndex = index
      },
      confirmDelCaddy() {
        var _this = this
        delCaddie(this.caddieId).then(function(res) {
          if (res === 1) {
            _this.$message.success('删除成功')
            _this.delVisible = false
            var index = _this.caddieIndex + (_this.caddiePage - 1) * _this.pageSize
            _this.caddies.splice(index, 1)
            _this.caddiesEnd.splice(_this.caddieIndex, 1)
            _this.caddiesTotal = _this.caddiesTotal - 1
            _this.currentChangePage(_this.caddies)
          }
        })
      },
      caddieSizeChange(val) {
        this.pageSize = val
        this.caddiePageChange(this.caddiePage)
      },
      caddiePageChange(val) {
        this.caddiePage = val
        if (!this.flag) {
          this.currentChangePage(this.caddies)
        } else {
          this.currentChangePage(this.filterListEnd)
        }
      },
      currentChangePage(list) {
        let from = (this.caddiePage - 1) * this.pageSize
        const to = this.caddiePage * this.pageSize
        this.caddiesEnd = []
        for (; from < to; from++) {
          if (list[from]) {
            this.caddiesEnd.push(list[from])
          }
        }
      },
      doFilter() {
        this.caddiesEnd = []
        this.filterListEnd = []
        this.caddies.forEach((value) => {
          if (value.boyname) {
            if (value.boyname.indexOf(this.caddieName) >= 0) {
              this.filterListEnd.push(value)
            }
          }
        })
        this.caddiePage = 1
        this.caddiesTotal = this.filterListEnd.length
        this.currentChangePage(this.filterListEnd)
        this.flag = true
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
