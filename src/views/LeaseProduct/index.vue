<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="租赁产品名称" prop="leaseName">
        <el-input
          v-model="queryParams.leaseName"
          placeholder="请输入租赁产品名称"
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
          v-hasPermi="['system:leaseProduct:add']"
        >上架</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:leaseProduct:edit']"
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
          v-hasPermi="['system:leaseProduct:remove']"
        >下架</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:leaseProduct:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaseProductList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="租赁产品编号" align="center" prop="leaseId" />
      <el-table-column label="租赁产品名称" align="center" prop="leaseName" />
      <el-table-column label="产品图" align="center" prop="photoUrl">
        <template slot-scope="scope">
          　　　　<img :src=scope.row.photoUrl width="80" height="80" class="head_pic"/>
          　　</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:leaseProduct:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:leaseProduct:remove']"
          >下架</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-custom"
            @click="business(scope.row)"
            v-hasPermi="['ruoyi-product:product:remove']"
          >商家</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-management"
            @click="package(scope.row)"
            v-hasPermi="['ruoyi-product:product:remove']"
          >款式</el-button>
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

    <!-- 添加或修改租赁产品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="租赁产品" prop="leaseName">
          <el-input v-model="form.leaseName" placeholder="请输入租赁产品名称" />
        </el-form-item>
        <el-form-item label="商品图" prop="photoUrl">
          <el-upload
            class="avatar-uploader"
            action="http://localhost/dev-api/common/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<script>
import { listLeaseProduct, getLeaseProduct, delLeaseProduct, addLeaseProduct, updateLeaseProduct } from "@/api/LeaseProduct/LeaseProduct";

export default {
  name: "LeaseProduct",
  data() {
    return {
      imageUrl: '',
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
      // 租赁产品表格数据
      leaseProductList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        leaseId: null,
        leaseName: null,
      },
      // 表单参数
      form: {
        photoUrl:null
      },
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询租赁产品列表 */
    getList() {
      this.loading = true;
      listLeaseProduct(this.queryParams).then(response => {
        this.leaseProductList = response.rows;
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
        leaseId: null,
        leaseName: null,
        publishStatus: null,
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
        isdeleted: null,
        photoUrl: null,
        publishTime: null
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
      this.ids = selection.map(item => item.leaseId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.imageUrl=null;
      this.open = true;
      this.title = "上架租赁产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.imageUrl=null;
      const leaseId = row.leaseId || this.ids
      getLeaseProduct(leaseId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改租赁产品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.leaseId != null) {
            updateLeaseProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLeaseProduct(this.form).then(response => {
              this.$modal.msgSuccess("上架成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const leaseIds = row.leaseId || this.ids;
      this.$modal.confirm('是否确认下架租赁产品编号为"' + leaseIds + '"的数据项？').then(function() {
        return delLeaseProduct(leaseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("下架成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/leaseProduct/export', {
        ...this.queryParams
      }, `leaseProduct_${new Date().getTime()}.xlsx`)
    },
    business(row){
      this.$router.push({
        path:'/leaseProduct/leaseProductBusiness',
        query:{
          id:row.leaseId,
          productName:row.leaseName
        }
      })
    },
    package(row){
      this.$router.push({
        path:'/leaseProduct/leaseProductStyle',
        query:{
          id:row.leaseId,
          productName:row.leaseName
        }
      })
    },
    handleAvatarSuccess(res, file) {
      console.log("file"+file)
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.photoUrl=res.url
      console.log("this.form.photoUrl为："+this.form.photoUrl)
    }
  }
};
</script>
