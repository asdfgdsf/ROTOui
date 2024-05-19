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
      <el-form-item label="款式" prop="pack">
        <el-input
          v-model="queryParams.pack"
          placeholder="请输入款式"
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
      <el-form-item label="店铺名称" prop="shopName">
        <el-input
          v-model="queryParams.shopName"
          placeholder="请输入店铺名称"
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
          v-hasPermi="['system:leaseOrder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaseOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="租赁订单编号" align="center" prop="leaseOrderId" />
      <el-table-column label="租赁商品编号" align="center" prop="leaseId" />
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="商品图" align="center" prop="photoUrl">
        <template slot-scope="scope">
          　　　　<img :src=scope.row.photoUrl width="60" height="60" class="head_pic"/>
          　　</template>
      </el-table-column>
      <el-table-column label="款式" align="center" prop="pack" />
      <el-table-column label="尺码" align="center" prop="size" />
<!--      <el-table-column label="用户名" align="center" prop="userName" />-->
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
      <!--      <el-table-column label="支付状态" align="center" prop="payStatus" />-->
      <!--      <el-table-column label="订单状态" align="center" prop="orderstatus" />-->
      <!--      <el-table-column label="店铺id" align="center" prop="businessId" />-->
      <el-table-column label="支付金额" align="center" prop="pay" />
      <!--      <el-table-column label="数量" align="center" prop="number" />-->
      <!--      <el-table-column label="押金" align="center" prop="deposit" />-->
      <!--      <el-table-column label="押金退还" align="center" prop="depositBack" />-->
      <el-table-column label="店铺名称" align="center" prop="shopName" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改租赁订单对话框 -->
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
import { listLeaseOrder, getLeaseOrder, delLeaseOrder, addLeaseOrder, updateLeaseOrder } from "@/api/LeaseOrder/LeaseOrder";

export default {
  name: "LeaseOrder",
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
      // 租赁订单表格数据
      leaseOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        leaseOrderId: null,
        productName: null,
        pack: null,
        userName: this.$store.state.user.name,
        shotDate: null,
        placeDate: null,
        payStatus: null,
        orderstatus: null,
        businessId: null,
        leaseId: null,
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
    /** 查询租赁订单列表 */
    getList() {
      this.loading = true;
      listLeaseOrder(this.queryParams).then(response => {
        this.leaseOrderList = response.rows;
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
        leaseOrderId: null,
        productName: null,
        pack: null,
        userName: this.$store.state.user.name,
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
        number: null,
        deposit: null,
        depositBack: null,
        leaseId: null,
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
      this.ids = selection.map(item => item.leaseOrderId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加租赁订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const leaseOrderId = row.leaseOrderId || this.ids
      getLeaseOrder(leaseOrderId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改租赁订单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.leaseOrderId != null) {
            updateLeaseOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLeaseOrder(this.form).then(response => {
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
      const leaseOrderIds = row.leaseOrderId || this.ids;
      this.$modal.confirm('是否确认删除租赁订单编号为"' + leaseOrderIds + '"的数据项？').then(function() {
        return delLeaseOrder(leaseOrderIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/leaseOrder/export', {
        ...this.queryParams
      }, `leaseOrder_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
