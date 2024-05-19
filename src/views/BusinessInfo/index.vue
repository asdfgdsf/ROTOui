<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="店铺名称" prop="shopName">
        <el-input
          v-model="queryParams.shopName"
          placeholder="请输入店铺名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="businessName">
        <el-input
          v-model="queryParams.businessName"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店铺地址" prop="businessAddress">
        <el-input
          v-model="queryParams.businessAddress"
          placeholder="请输入店铺地址"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:bussinessInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:bussinessInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:bussinessInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:bussinessInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bussinessInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家id" align="center" prop="businessId" />
      <el-table-column label="店铺名称" align="center" prop="shopName" />
      <el-table-column label="用户名" align="center" prop="businessName" />
      <el-table-column label="法人身份证" align="center" prop="legalNum" />
      <el-table-column label="营业执照编号" align="center" prop="license" />
      <el-table-column label="店铺联系方式" align="center" prop="businessPhone" />
      <el-table-column label="店铺地址" align="center" prop="businessAddress" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:bussinessInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:bussinessInfo:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改商家信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="form.shopName" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="用户名" prop="businessName">
          <el-input v-model="form.businessName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="店铺地址" prop="businessAddress">
          <el-input v-model="form.businessAddress" placeholder="请输入店铺地址" />
        </el-form-item>
        <el-form-item label="法人身份证" prop="legalNum">
          <el-input v-model="form.legalNum" placeholder="请输入法人身份证" />
        </el-form-item>
        <el-form-item label="营业执照编号" prop="license">
          <el-input v-model="form.license" placeholder="请输入营业执照编号" />
        </el-form-item>
        <el-form-item label="店铺联系方式" prop="businessPhone">
          <el-input v-model="form.businessPhone" placeholder="请输入店铺联系方式" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBussinessInfo, getBussinessInfo, delBussinessInfo, addBussinessInfo, updateBussinessInfo } from "@/api/BusinessInfo/BusinessInfo";

export default {
  name: "BussinessInfo",
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
      // 商家信息表格数据
      bussinessInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        businessId: null,
        shopName: null,
        businessName: null,
        legalNum: null,
        license: null,
        businessPhone: null,
        businessAddress: null,
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
    /** 查询商家信息列表 */
    getList() {
      this.loading = true;
      listBussinessInfo(this.queryParams).then(response => {
        this.bussinessInfoList = response.rows;
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
        businessId: null,
        shopName: null,
        businessName: null,
        legalNum: null,
        license: null,
        businessPhone: null,
        businessAddress: null,
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
        isdeleted: null,
        relationId: null,
        approveStatus: null,
        approveTime: null
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
      this.ids = selection.map(item => item.businessId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商家信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const businessId = row.businessId || this.ids
      getBussinessInfo(businessId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商家信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.businessId != null) {
            updateBussinessInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBussinessInfo(this.form).then(response => {
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
      const businessIds = row.businessId || this.ids;
      this.$modal.confirm('是否确认删除商家信息编号为"' + businessIds + '"的数据项？').then(function() {
        return delBussinessInfo(businessIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/bussinessInfo/export', {
        ...this.queryParams
      }, `bussinessInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
