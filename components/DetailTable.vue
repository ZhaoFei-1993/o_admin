<template>
    <el-row>
        <el-col :md="24" :lg="12" v-for="(property,index) in properties" :key="index" v-if="!property.hidden"
                class="prop-container">
            <el-row>
                <el-col :span="6" class="prop-name">
                    {{property.label||property.labelFormatter(detailResource)}}
                </el-col>
                <el-col :span="18" class="prop-value" v-if="property.link">
                    <router-link
                            :to="property.link+'/'+(property.text?detailResource[property.prop]['id']:detailResource['id'])"
                            append>
                        {{property.text?detailResource[property.prop][property.text]:detailResource[property.prop]}}
                    </router-link>
                </el-col>
                <el-col :span="18" class="prop-value" v-else-if="property.suffixLink">
                    <router-link :to="property.suffixLink" append>{{property.text}}</router-link>
                </el-col>
                <el-col :span="18" class="prop-value" v-else>
                    {{getPropValue(property)}}
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>
<script>
  export default {
    props: ['properties', 'detailResource'],
    methods: {
      getPropValue(property) {
        const prop = this.detailResource[property.prop];
        if (property.formatter) {
          return property.formatter(prop, this.detailResource);
        }
        if (property.options) {
          return property.options[prop - (property.startIndex || 0)];
        }
        return prop;
      }
    }
  }
</script>
<style lang="scss" scoped>
    .prop-container {
        position: relative;
        .prop-name {
            background-color: #eee;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-collapse: collapse;
        }
        .prop-value {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-collapse: collapse;
        }
    }


</style>