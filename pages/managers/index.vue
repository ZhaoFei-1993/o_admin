<template>
    <div class="main-content page-users">
        <h1> 管理员管理
            <template v-if="isSuperAdmin">
                <el-button type="primary" style="margin-left: 10px;" @click="addManager()">添加管理员</el-button>
            </template>
        </h1>
        <el-row>
            <el-col :md="24" :lg="12">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="24" :lg="12">
                <el-row type="flex" justify="end">
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.role"
                                   clearable
                                   @change="getFilters"
                                   placeholder="身份权限">
                            <el-option
                                    v-for="(status,index) in adminRoles.slice(1)"
                                    :key="index"
                                    :label="status.text"
                                    :value="status.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-table
                class="with-margin-top"
                :data="resources"
                style="width: 100%"
                @sort-change="sortChange">
            <el-table-column v-for="(column, index) in itemColumns.slice(0,6)"
                             v-if="column.link && !column.hidden"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :formatter="column.formatter"
                             :class-name="column.className"
                             :sortable="column.sortable"
                             :sort-method="column.sortMethod"
                             :min-width="column.width">
                <template slot-scope="scope">
                    <router-link :to="column.link+'/'+(column.text?scope.row[column.prop]['id']:scope.row['id'])">
                        {{column.text?scope.row[column.prop][column.text]:scope.row[column.prop]}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column v-else-if="!column.hidden"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :formatter="column.formatter"
                             :sortable="column.sortable"
                             :class-name="column.className"
                             :sort-method="column.sortMethod"
                             :min-width="column.width">
            </el-table-column>
            <el-table-column
                    key="action"
                    label="操作"
                    min-width="90"
                    v-if="isSuperAdmin">
                <template slot-scope="scope">
                    <el-button type="primary" class="view-detail" @click="modifyAuth(scope.row)">更改权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="addOrModify==='add'?'添加管理员':'更改权限'" :visible.sync="dialogVisible" @close="clearData">
            <el-row v-if="addOrModify==='add'">
                <el-col :span="14">
                    <el-input placeholder="输入 用户名/用户ID/手机号 查询" clearable v-model="userSearch"
                    @clear="getUserData" @keyup.enter.native="getUserData" size="medium">
                        <el-button slot="append" icon="el-icon-search" @click="getUserData"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <template v-if="userData">
                <VerticalTable :data="[userData]" :properties="itemColumns" :itemCount="1" class="modify-dialog"></VerticalTable>
                <div style="margin: 20px 0 10px;">身份权限</div>
                <el-select v-model="currentRole"
                           clearable
                           placeholder="身份权限">
                    <el-option
                            v-for="(role,index) in changeRoles"
                            :key="index"
                            :label="role.text"
                            :value="role.value">
                    </el-option>
                </el-select>
            </template>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>

        <no-ssr>
            <el-pagination
                    class="with-margin-top"
                    background
                    layout="prev, pager, next"
                    @current-change="changePage"
                    :current-page.sync="pageNum"
                    :total="totalNum">
            </el-pagination>
        </no-ssr>
    </div>
</template>
<script>
  import {adminRoles, kycStatusTypes, userStatusTypes, merchantAuthStatusTypes} from '~/common/constants';
  import VerticalTable from '~/components/VerticalTable';
  import {timeToLocale} from '~/common/utilities';

  export default {
    layout: 'default',
    components: {
      VerticalTable
    },
    data() {
      return {
        addOrModify: 'add',
        dialogVisible: false,
        userData: null,
        userSearch: '',
        adminRoles,
        changeRoles: [],
        currentRole: '',
        userStatusTypes,
        kycStatusTypes,
        merchantAuthStatusTypes,
        itemColumns: [{
          prop: 'id',
          label: 'ID',
          width: 36,
          link: '/users'
        }, {
          prop: 'role',
          label: '身份权限',
          width: 72,
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, adminRoles);
          },
        }, {
          prop: 'name',
          label: '昵称',
          width: 80,
        }, {
          prop: 'kyc_name',
          label: '姓名',
          width: 80,
          formatter: (row, column, cellValue) => {
            return cellValue || '未实名';
          },
        },  {
          prop: 'mobile',
          label: '手机',
          width: 120,
          formatter: (row, column, cellValue) => {
            return cellValue || '--';
          },
        }, {
          prop: 'email',
          label: '邮箱',
          width: 160,
        }, {
          prop: 'status',
          label: '状态',
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, userStatusTypes);
          },
        }, {
          prop: 'create_time',
          label: '账号激活时间',
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue);
          },
          className: 'time',
        }],
      };
    },
    mounted() {
      this.getManagers();
    },
    methods: {
      getManagers() {
        this.initResources('users/admin', () => {
          this.resources.map(resource => {
            if (resource.user_kyc.first_name && resource.user_kyc.last_name) {
              resource.kyc_name = resource.user_kyc.last_name + resource.user_kyc.first_name;
            }
          });
          if (this.resources && this.resources.length === 1) {
            this.$router.push(`/users/${this.resources[0].id}`);
          }
        }, {
          user_search: this.$route.query.user_search
        });
      },
      getFilters() {
        this.pageNum = 1;
        this.getFilteredResources();
      },
      getUserData() {
        if (this.userSearch === '') {
          this.userData = null;
          return;
        }
        this.$axios.get(`/users/search?user_search=${this.userSearch}`)
          .then(response => {
            if (Object.keys(response.data.data).length !== 0) {
              this.userData = response.data.data;
              this.currentRole = this.userData.role;
            } else {
              this.userData = null;
            }
          });
      },
      addManager() {
        this.dialogVisible = true;
        this.addOrModify = 'add';
        this.changeRoles = this.adminRoles.slice(1);
      },
      confirm() {
        if (this.currentRole === this.userData.role) return;
        this.changeUserAuth(this.userData.id);
        this.clearData();
      },
      clearData() {
        this.dialogVisible = false;
        this.userSearch = '';
        this.userData = null;
      },
      modifyAuth(item) {
        this.dialogVisible = true;
        this.addOrModify = 'modify';
        this.changeRoles = this.adminRoles;
        this.userData = item;
        this.currentRole = item.role;
      },
      changeUserAuth(id) {
        this.$axios.post(`/users/admin/${id}`, {
          role: this.currentRole
        }).then(response => {
          this.$message({message: '权限已修改', type: 'success'});
          this.getManagers();
        });
      }
    }
  };
</script>

<style lang="scss">
    .page-users {
        .view-detail {
            width: 80px;
            padding: 12px;
        }
    }
    .modify-dialog {
        .el-row {
            border: 1px solid #ebeef5;
            border-collapse: collapse;
            &:nth-of-type(2n+1) {
                background-color: #efefef;
            }
        }
    }

</style>
