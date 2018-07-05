<template>
    <div>
        <div class="announcement-header">

            <span class="switch">
                <el-switch
                        v-model="showPreview"
                        active-text="显示预览"
                        inactive-text="隐藏预览">
                </el-switch>
            </span>
            <span class="switch">
                <el-switch
                        v-model="sideBySide"
                        active-text="左预览右编辑"
                        inactive-text="上预览下编辑">
                </el-switch>
            </span>
        </div>

        <div :class="{'side-by-side':sideBySide}">
            <div class="preview-container" v-if="showPreview">
                <h2>详情预览</h2>
                <el-tabs v-model="selectedPreviewLang">
                    <el-tab-pane v-for="(lang,index) in langs" :label="lang.label" :key="lang.key"
                                 :name="''+index"></el-tab-pane>
                </el-tabs>
                <div class="article">
                    <h1>{{announcement['title_'+ langs[selectedPreviewLang].key] || 'no title'}}</h1>
                    <div class="announcement"
                         v-html="(announcement['detail_'+ langs[selectedPreviewLang].key] || 'no content')"></div>
                </div>
            </div>
            <div class="edit-container" :class="{'with-preview':showPreview}">
                <h2>编辑公告</h2>
                <div>
                    <div class="">
                        <el-tabs v-model="selectedLang">
                            <el-tab-pane v-for="(lang,index) in langs" :label="lang.label" :key="lang.key"
                                         :name="''+index"></el-tab-pane>
                        </el-tabs>
                    </div>
                    <p>编辑标题</p>
                    <el-input
                            placeholder="请输入标题"
                            v-model="announcement['title_'+ langs[selectedLang].key]"
                            clearable>
                    </el-input>
                    <p>编辑正文</p>
                    <no-ssr>
                        <div class="announcement">
                            <div class="quill-editor"
                                 v-model="announcement['detail_'+ langs[selectedLang].key]"
                                 v-quill:announcementEditor="editorOption">
                            </div>
                        </div>
                    </no-ssr>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import {languages} from "../common/constants";

  export default {
    data() {
      return {
        langs: languages,
        selectedLang: 0,
        selectedPreviewLang: 0,
        editorOption: {
          placeholder: '在此输入公告内容'
        },
        showPreview: true,
        sideBySide: false,
      }
    },
    props: ['announcement']
  }
</script>
<style lang="scss" scoped>
    .announcement-header {
        font-size: 20px;
        display: flex;
        align-items: center;
        .switch {
            margin-right: 2rem;
        }
    }

    .side-by-side {
        display: flex;
        .preview-container {
            width: 50%;
            padding-right: 5px;
        }
        .edit-container.with-preview {
            width: 50%;
            padding-left: 5px;
        }
    }

    .preview-container {
        margin-top: 50px;
        .article {
            padding: 0 14px;
            max-height: 500px;
            overflow-y: scroll;
            border: 1px solid #ddd;
        }
    }

    .edit-container {
        margin-top: 50px;
        width: 100%;
    }
</style>