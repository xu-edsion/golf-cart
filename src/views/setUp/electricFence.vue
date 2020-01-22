<template>
  <div class="app-container electricFence">
    <el-row class="add-row">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addFence">添加围栏</el-button>
    </el-row>
    <el-table
      :data="dataList"
      border
      style="width: 80%">
      <el-table-column
        prop="hole"
        label="名称"
        width="">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="">
      </el-table-column>
      <el-table-column
        label="状态"
        width="">
        <template slot-scope="scope">
          <el-tag
            type="success"
            size="small"
            v-if="scope.row.state ==1"
            disable-transitions>启用</el-tag>
          <el-tag
            type="warning"
            size="small"
            v-if="scope.row.state ==0"
            disable-transitions>关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加围栏" :visible.sync="addElectricFenceDialog">
      <el-form :model="electricFenceForm">
        <el-row class="fence-name">
          <el-col :span="16">
            <el-form-item label="围栏名称" :label-width="formLabelWidth">
              <el-input v-model="electricFenceForm.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button type="primary" size="small" @click="enterMap">进入地图</el-button>
          </el-col>
        </el-row>
        <el-form-item label="警告类型" :label-width="formLabelWidth">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="进入警告"></el-checkbox>
            <el-checkbox label="离开警告"></el-checkbox>
            <el-checkbox label="警告超时"></el-checkbox>
            <el-checkbox label="计时"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="超时时长" :label-width="formLabelWidth">
              <el-input v-model="electricFenceForm.overTime" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="electricFenceForm.overTime">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" @click="addElectricFenceDialog = false">保存</el-button>
          <el-button @click="addElectricFenceDialog = false">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'electricFence',
    data() {
      return {
        formLabelWidth: '100px',
        addElectricFenceDialog: false,
        electricFenceForm: {
          name: '',
          warnType: '',
          overTime: '',
          remark: ''
        },
        checkList: []
      }
    },
    computed: {
      ...mapState({
        dataList: state => state.cart.cartList
      })
    },
    methods: {
      addFence() {
        this.addElectricFenceDialog = true
      },
      handleEdit(index, row) {
        console.log(index, row)
      },
      handleDelete(index, row) {
        console.log(index, row)
      },
      enterMap() {
        this.$router.push({ path: '/monitor/openlayer' })
      }
    }
  }
</script>
