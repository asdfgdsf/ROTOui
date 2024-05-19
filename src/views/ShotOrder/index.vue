<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="套餐" prop="pack">
        <el-input
          v-model="queryParams.pack"
          placeholder="请输入套餐"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input
          v-model="queryParams.price"
          placeholder="请输入单价"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="拍摄日期" prop="shotDate">
        <el-date-picker clearable
                        v-model="queryParams.shotDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择拍摄日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="下单时间" prop="placeDate">
        <el-date-picker clearable
                        v-model="queryParams.placeDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择下单时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="商品编号" prop="shotId">
        <el-input
          v-model="queryParams.shotId"
          placeholder="请输入商品编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店铺名" prop="shopName">
        <el-input
          v-model="queryParams.shopName"
          placeholder="请输入店铺名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:shotOrder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shotOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="跟拍订单编号" align="center" prop="shotOrderId" />
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="套餐" align="center" prop="pack" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="单价" align="center" prop="price" />
      <el-table-column label="拍摄日期" align="center" prop="shotDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.shotDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" prop="placeDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.placeDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center" prop="pay" />
      <el-table-column label="商品编号" align="center" prop="shotId" />
      <el-table-column label="店铺名" align="center" prop="shopName" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改跟拍订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listShotOrder, getShotOrder, delShotOrder, addShotOrder, updateShotOrder } from "@/api/ShotOrder/ShotOrder";

export default {
  name: "ShotOrder",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 跟拍订单表格数据
      shotOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productName: null,
        pack: null,
        userName: null,
        price: null,
        shotDate: null,
        placeDate: null,
        payStatus: null,
        orderstatus: null,
        businessId: null,
        shotId: null,
        shopName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询跟拍订单列表 */
    getList() {
      this.loading = true;
      listShotOrder(this.queryParams).then(response => {
        this.shotOrderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        shotOrderId: null,
        productName: null,
        pack: null,
        userName: null,
        userPhone: null,
        price: null,
        shotDate: null,
        placeDate: null,
        payStatus: null,
        orderstatus: null,
        businessId: null,
        photographerId: null,
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
        isdeleted: null,
        pay: null,
        shotId: null,
        shopName: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.shotOrderId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加跟拍订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const shotOrderId = row.shotOrderId || this.ids
      getShotOrder(shotOrderId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改跟拍订单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.shotOrderId != null) {
            updateShotOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShotOrder(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const shotOrderIds = row.shotOrderId || this.ids;
      this.$modal.confirm('是否确认删除跟拍订单编号为"' + shotOrderIds + '"的数据项？').then(function() {
        return delShotOrder(shotOrderIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/shotOrder/export', {
        ...this.queryParams
      }, `shotOrder_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

