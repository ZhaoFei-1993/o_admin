<template>
    <div class="table">
        <el-row :md="24" :lg="12" type="flex" justify="space-around" align="middle" v-for="(property, index) in properties" :key="index">
            <el-col :span="24/(itemCount+1)" class="prop-name">
                {{property.label}}
            </el-col>
            <el-col :span="24/(itemCount+1)" v-for="(item, i) in data" :key="i" class="prop-value">
                <template v-if="property.link">
                    <router-link :to="property.link+'/'+(property.text?item[property.prop]['id']:item['id'])" append>
                        {{property.text?item[property.prop][property.text]:item[property.prop]}}
                    </router-link>
                </template>
                <template v-else>
                    {{getPropertyValue(property, item)}}
                </template>
            </el-col>
        </el-row>
    </div>

</template>

<script>
  export default {
    props: ['data', 'properties', 'itemCount'],
    methods: {
      getPropertyValue(property, item) {
        const value = item[property.prop];
        if (property.formatter) {
          return property.formatter(undefined, undefined, value);
        }
        return value;
      }
    }
  };
</script>

<style>
    .prop-name {
        padding-left: 10px;
    }
    .prop-value {
        display: flex;
        align-items: center;
        padding-left: 10px;
    }

</style>
