<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="套餐名称" prop="packageName">
        <el-input
          v-model="queryParams.packageName"
          placeholder="请输入套餐名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="套餐价格" prop="packagePrice">
        <el-input
          v-model="queryParams.packagePrice"
          placeholder="请输入套餐价格"
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
          v-hasPermi="['product:package:add']"
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
          v-hasPermi="['product:package:edit']"
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
          v-hasPermi="['product:package:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['product:package:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="packageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="套餐id" align="center" prop="packageId" />
      <el-table-column label="套餐名称" align="center" prop="packageName" />
      <el-table-column label="套餐价格" align="center" prop="packagePrice" />
      <el-table-column label="适用产品id" align="center" prop="applicableProduct" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['product:package:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['product:package:remove']"
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

    <!-- 添加或修改跟拍套餐对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
<!--        <el-form-item label="适用产品id" prop="applicableProduct">-->
<!--          <el-input v-model="form.applicableProduct" placeholder="请输入适用产品id" />-->
<!--        </el-form-item>-->
        <el-form-item label="套餐名称" prop="packageName">
          <el-input v-model="form.packageName" placeholder="请输入套餐名称" />
        </el-form-item>
        <el-form-item label="套餐价格" prop="packagePrice">
          <el-input v-model="form.packagePrice" placeholder="请输入套餐价格" />
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
import { listPackage, getPackage, delPackage, addPackage, updatePackage } from "@/api/package";

export default {
  name: "Package",
  data() {
    return {
      addOrUpdate:null,
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
      // 跟拍套餐表格数据
      packageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        packageName: null,
        packagePrice: null,
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
        isdeleted: null,
        applicableProduct: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    if (this.$route.query.id!= null){
      console.log("this.$route.query.id为:"+this.$route.query.id)
      this.queryParams.applicableProduct = this.$route.query.id;
    }
    this.getList();
  },
  methods: {
    /** 查询跟拍套餐列表 */
    getList() {
      this.loading = true;
      listPackage(this.queryParams).then(response => {
        this.packageList = response.rows;
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
        packageId: null,
        packageName: null,
        packagePrice: null,
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
        isdeleted: null,
        applicableProduct: null
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
      this.ids = selection.map(item => item.packageId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加跟拍套餐";
      this.addOrUpdate = "add";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const packageId = row.packageId || this.ids
      getPackage(packageId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改跟拍套餐";
        this.addOrUpdate = "update";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.applicableProduct = this.queryParams.applicableProduct;
          if (this.addOrUpdate == "update") {
            updatePackage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.addOrUpdate = null;
            });
          } else if (this.addOrUpdate == "add") {
            addPackage(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              this.addOrUpdate = null;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const packageIds = row.packageId || this.ids;
      this.$modal.confirm('是否确认删除跟拍套餐编号为"' + packageIds + '"的数据项？').then(function() {
        return delPackage(packageIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('product/package/export', {
        ...this.queryParams
      }, `package_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
