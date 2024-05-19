<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="租赁商品名称" prop="leaseName">
        <el-input
          v-model="queryParams.leaseName"
          placeholder="请输入租赁商品名称"
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
          v-hasPermi="['system:leaseGoogs:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaseGoogsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="租赁商品编号" align="center" prop="leaseId" />
      <el-table-column label="商品图" align="center" prop="photoUrl">
        <template slot-scope="scope">
          　　　　<img :src=scope.row.photoUrl width="80" height="80" class="head_pic"/>
          　　</template>
      </el-table-column>
      <el-table-column label="租赁商品名称" align="center" prop="leaseName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-custom"
            @click="business(scope.row)"
            v-hasPermi="['ruoyi-product:product:remove']"
          >选择商家</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-management"
            @click="package(scope.row)"
            v-hasPermi="['ruoyi-product:product:remove']"
          >选择款式</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="orderGenerate(scope.row)"
            v-hasPermi="['ruoyi-product:product:remove']"
          >下单</el-button>
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
    <!--    商家对话框-->
    <el-dialog title="选择商家" :visible.sync="businessDialog">
      <el-table :data="businessList">
        <el-table-column property="leaseName" label="商品名称" width="250"></el-table-column>
        <el-table-column property="shopName" label="店铺名称" width="250"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="businessSelect(scope.row)"
              v-hasPermi="['system:shotGoods:edit']"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--    套餐对话框-->
    <el-dialog title="选择款式" :visible.sync="packageDialog">
      <el-table :data="packageList">
        <el-table-column property="applicableProduct" label="商品编号" width="150"></el-table-column>
        <el-table-column property="styleName" label="款式名称" width="150"></el-table-column>
        <el-table-column property="size" label="款式尺码" width="100"></el-table-column>
        <el-table-column property="price" label="款式价格" width="100"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="packageSelect(scope.row)"
              v-hasPermi="['system:shotGoods:edit']"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--    确认订单信息-->
    <el-dialog title="请确认订单信息" :visible.sync="orderFormVisible">
      <el-form :model="orderParams">
        <el-form-item label="商品编号" :label-width="formLabelWidth">
          <el-input v-model="orderParams.leaseId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <img :src=orderParams.photoUrl width="60" height="60" class="head_pic"/>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="orderParams.productName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="款式名称" :label-width="formLabelWidth">
          <el-input v-model="orderParams.pack" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="款式尺码" :label-width="formLabelWidth">
          <el-input v-model="orderParams.size" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input v-model="orderParams.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="orderParams.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="店铺名称" :label-width="formLabelWidth">
          <el-input v-model="orderParams.shopName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="租赁日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="orderParams.shotDate"
            type="date"
            placeholder="请选择租赁日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="orderCancle">取消</el-button>
    <el-button type="primary" @click="orderSubmit">下单</el-button>
  </span>
    </el-dialog>
    <!-- 添加或修改租赁产品对话框 -->
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
import { listLeaseGoogs, getLeaseGoogs, delLeaseGoogs, addLeaseGoogs, updateLeaseGoogs,listLeaseStyle,listBusiness,addLeaseOrder } from "@/api/LeaseGoods/LeaseGoods";


export default {
  name: "LeaseGoogs",
  data() {
    return {
      formLabelWidth: '120px',
      orderFormVisible:false,
      orderParams:{
        userName:"",
        pack:"",
        size:"",
        price:"",
        productName:"",
        shopName:"",
        leaseId:"",
        photoUrl:"",
        shotDate:""
      },
      //款式对话框
      packageDialog:false,
      packageQuery:{
        applicableProduct:"",
      },
      //商家对话框
      businessDialog:false,
      businessQuery:{
        applicableProduct:"",
      },
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
      leaseGoogsList: [],
      // 预约跟拍商家表格数据
      businessList: [],
      // 预约跟拍套餐表格数据
      packageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        leaseName: null,
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
    orderCancle(){this.orderFormVisible=false},
    orderSubmit(){
      this.orderFormVisible=false
      addLeaseOrder(this.orderParams).then(response =>{
        this.$modal.msgSuccess("下单成功");
      })
    },
    orderGenerate(row){
      // this.orderRset()
      if ((this.orderParams.productName!=row.leaseName)||(this.orderParams.leaseId!=row.leaseId)){
        this.orderParams.userName="";
        this.orderParams.pack = "";
        this.orderParams.price= "";
        this.orderParams.size="";
        this.orderParams.productName="";
        this.orderParams.shopName = "";
        this.orderParams.leaseId= "";
        this.orderParams.userName="";
        this.orderParams.photoUrl = "";
        this.orderParams.shotDate = "";
      }
      var userName = this.$store.state.user.name;
      console.log("userName"+userName);
      this.orderParams.userName=userName;
      this.orderParams.photoUrl= row.photoUrl;
      this.orderFormVisible=true;
    },
    packageSelect(row){
      // this.packageRest()
      this.orderParams.price=row.price;
      this.orderParams.pack=row.styleName;
      this.orderParams.size=row.size;
      this.orderParams.leaseId=row.applicableProduct;
      this.packageDialog=false;
    },
    businessSelect(row){
      // this.businessRest()
      this.orderParams.productName=row.leaseName;
      this.orderParams.shopName=row.shopName;
      this.businessDialog=false;
    },
    business(row){
      this.businessQuery.applicableProduct= row.leaseId
      listBusiness(this.businessQuery).then(response =>{
        this.businessList=response.rows;
        console.log("this.businessList"+this.businessList)
        this.businessDialog=true;
      })
    },
    package(row){
      this.packageQuery.applicableProduct = row.leaseId
      listLeaseStyle(this.packageQuery).then(response =>{
        this.packageList=response.rows;
        console.log("this.packageList"+this.packageList)
        this.packageDialog=true;
      })
    },
    /** 查询租赁产品列表 */
    getList() {
      this.loading = true;
      listLeaseGoogs(this.queryParams).then(response => {
        this.leaseGoogsList = response.rows;
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
      this.open = true;
      this.title = "添加租赁产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const leaseId = row.leaseId || this.ids
      getLeaseGoogs(leaseId).then(response => {
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
            updateLeaseGoogs(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLeaseGoogs(this.form).then(response => {
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
      const leaseIds = row.leaseId || this.ids;
      this.$modal.confirm('是否确认删除租赁产品编号为"' + leaseIds + '"的数据项？').then(function() {
        return delLeaseGoogs(leaseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/leaseGoogs/export', {
        ...this.queryParams
      }, `leaseGoogs_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
