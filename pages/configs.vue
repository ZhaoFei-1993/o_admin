<template>
    <div class="main-content page-config">
        <h1>动态配置</h1>
        <el-row class="with-margin-top">
            <el-select v-model="resourceFilters.project"
                       @change="getFilteredResources"
                       placeholder="配置项目">
                <el-option
                        v-for="(project,index) in configProjectTypes"
                        :key="index"
                        :label="project.text"
                        :value="project.value">
                </el-option>
            </el-select>
            <el-button type="primary" @click="createConfig">添加配置</el-button>
        </el-row>
        <el-table class="with-margin-top"
                  :data="resources"
                  style="width: 100%"
                  @sort-change="sortChange">
            <el-table-column v-for="(column, index) in configColumns"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :formatter="column.formatter"
                             :class-name="column.className"
                             :sortable="column.sortable"
                             :sort-method="column.sortMethod"
                             :min-width="column.width">
            </el-table-column>
            <el-table-column key="action"
                             label="操作"
                             min-width="160">
                <template slot-scope="scope">
                    <el-button type="primary" @click="editConfig(scope.row)">查看/编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
                title="创建配置"
                :visible.sync="createConfigDialogVisible"
                width="30%">
            <p class="warning">以下内容将不可更改，请谨慎输入</p>
            <el-input class="with-margin-top" placeholder="配置名称(字母数字下划线组成)"
                      v-model="currentConfig.name"/>
            <el-input class="with-margin-top" v-model="currentConfig.path"
                      :placeholder="currentConfig.name||'配置路径(默认用配置名)'">
                <template slot="prepend">/{{resourceFilters.project}}/</template>
            </el-input>
            <el-input class="with-margin-top" placeholder="配置描述"
                      v-model="currentConfig.description"/>

            <div slot="footer" class="dialog-footer">
                <el-button @click="createConfigDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmCreateConfig"
                           :disabled="invalidName">确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="修改配置"
                :visible.sync="editConfigDialogVisible"
                width="720px">
            <p>修改配置'{{currentConfig.name}}'</p>
            <el-input
                    type="textarea"
                    :rows="20"
                    placeholder="请输入内容"
                    v-model="currentConfig.detail">
            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editConfigDialogVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="!isValidJson(currentConfig.detail)" @click="formatJson">格式化
                </el-button>
                <el-button type="primary" :disabled="!isValidJson(currentConfig.detail)" @click="confirmEditConfig">保存修改
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {configProjectTypes} from '~/common/constants';
  import {timeToLocale} from '~/common/utilities';

  export default {
    components: {},
    data() {
      return {
        configProjectTypes,
        currentConfig: {},
        configColumns: [{
          prop: 'id',
          label: 'ID',
          width: 36,
        }, {
          prop: 'project',
          label: '配置项目',
          width: 96,
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, configProjectTypes);
          },
        }, {
          prop: 'name',
          label: '配置名称',
          width: 96,
        }, {
          prop: 'path',
          label: '路径',
          width: 80,
        }, {
          prop: 'create_time',
          label: '创建时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue);
          },
          className: 'time',
        }, {
          prop: 'update_time',
          label: '更新时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue);
          },
          className: 'time',
        }],
        createConfigDialogVisible: false,
        editConfigDialogVisible: false,
      };
    },
    mounted() {
      this.getConfigs();
    },
    computed: {
      invalidName() {
        return !this.currentConfig.name || !!this.currentConfig.name.match(/[^a-zA-Z_0-9]/)
      }
    },
    methods: {
      getConfigs() {
        this.initResources('system/config', null, {project: 'web'});
      },
      createConfig() {
        this.currentConfig = {
          project: this.resourceFilters.project,
        }
        this.createConfigDialogVisible = true;
      },
      editConfig(config) {
        this.currentConfig = config;
        if (typeof config.detail === 'string') {
          this.formatJson();
        }
        this.editConfigDialogVisible = true;
      },
      confirmCreateConfig() {
        this.currentConfig.path = this.currentConfig.path || this.currentConfig.name;
        this.currentConfig.description = this.currentConfig.description || '';
        this.currentConfig.detail = '{}';
        this.updateConfig().then(res => {
          this.createConfigDialogVisible = false;
          this.getConfigs();
        });
      },
      confirmEditConfig() {
        this.updateConfig().then(res => {
          this.editConfigDialogVisible = false;
        });
      },
      updateConfig() {
        return this.$axios.post('/system/config', this.currentConfig);
      },
      isValidJson(json) {
        try {
          JSON.parse(json);
          return true;
        } catch (e) {
          return false;
        }
      },
      formatJson() {
        this.currentConfig.detail = JSON.stringify(JSON.parse(this.currentConfig.detail), null, 4);
      }
    }
  };
</script>
<style lang="scss" scoped>
    .page-config {

    }
</style>