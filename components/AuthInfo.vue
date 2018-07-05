<template>
    <div class="auth-info-container">
        <template v-if="show!=='only-bank'">
            <div class="basic-info info-line">
                <span><b>用户ID:</b></span>
                <span>{{record.user_id || 'NA'}}</span>
                <span><b>认证类型:</b></span>
                <el-tag :type="aType.type">{{aType.text}}</el-tag>
                <span><b>审核状态:</b></span>
                <el-tag :type="aStatus.type">{{aStatus.text}}</el-tag>
                <span><b>提交时间:</b></span>
                <span>{{record.create_time | formatTime }}</span>
            </div>
            <div class="info-block" v-if="record.auth_type===1">
                <p class="title">身份信息</p>
                <div class="info-line">
                    <span><b>姓名:</b></span>
                    <span>{{record.real_name || 'NA'}}</span>
                    <span><b>身份证号:</b></span>
                    <span>{{record.id_card_no || 'NA'}}</span>
                    <span><b>电话:</b></span>
                    <span>{{record.phone_country_code + ' '+ record.phone}}</span>
                </div>
                <div class="info-line">
                    <span><b>地址:</b></span>
                    <span>{{address}}</span>
                </div>
                <div class="info-name">身份证照片</div>
                <img class="id-photo" :src="record.id_card_front_photo_url"/>
                <img class="id-photo" :src="record.id_card_back_photo_url"/>
            </div>
            <template v-else>
                <div class="info-block">
                    <p class="title">企业信息</p>
                    <div class="info-line">
                        <span><b>企业名称:</b></span>
                        <span>{{record.enterprise_name || 'NA'}}</span>
                        <span><b>营业执照编号:</b></span>
                        <span>{{record.business_license_no || 'NA'}}</span>
                    </div>
                    <div class="info-line">
                        <span><b>地址:</b></span>
                        <span>{{address}}</span>
                    </div>
                    <div class="info-name">营业执照照片</div>
                    <img class="id-photo" :src="record.business_license_photo_url"/>
                </div>
                <div class="info-block">
                    <p class="title">法人信息</p>
                    <div class="info-line">
                        <span><b>法人姓名:</b></span>
                        <span>{{record.legal_name || 'NA'}}</span>
                        <span><b>法人身份证号:</b></span>
                        <span>{{record.legal_id_card_no || 'NA'}}</span>
                    </div>
                    <div class="info-name">法人身份证照片</div>
                    <img class="id-photo" :src="record.legal_id_card_front_photo_url"/>
                    <img class="id-photo" :src="record.legal_id_card_back_photo_url"/>
                </div>
                <div class="info-block">
                    <p class="title">联系人信息</p>
                    <div class="info-line">
                        <span><b>联系人姓名:</b></span>
                        <span>{{record.contact_name || 'NA'}}</span>
                        <span><b>联系人身份证号:</b></span>
                        <span>{{record.contact_id_card_no || 'NA'}}</span>
                    </div>
                    <div class="info-name">联系人身份证照片</div>
                    <img class="id-photo" :src="record.contact_id_card_front_photo_url"/>
                    <img class="id-photo" :src="record.contact_id_card_back_photo_url"/>
                </div>
            </template>
        </template>
        <div class="info-block" v-if="show !== 'only-auth'">
            <p class="title">银行账户</p>
            <div class="info-line">
                <span><b>收款人姓名:</b></span>
                <span>{{record.payee_name || 'NA'}}</span>
                <span><b>开户银行:</b></span>
                <span>{{record.bank_info?(record.bank_info.cn_name||record.bank_info.en_name) : 'NA'}}</span>
                <span><b>银行卡号:</b></span>
                <span class="card-no">{{record.bank_card_no || 'NA'}}</span>
            </div>
        </div>
    </div>
</template>
<script>
  import {authTypes, authStatus} from "../common/constants";
  import {getAddressByCodes} from "../common/utilities";

  export default {
    props: ['record', 'show'],
    computed: {
      aType() {
        return Object.values(authTypes).find(t => t.value === this.record.auth_type) || authTypes.NONE;
      },
      aStatus() {
        return Object.values(authStatus).find(t => t.value === this.record.status) || authTypes.NONE;
      },
      address() {
        return getAddressByCodes(this.record.address_country_code, this.record.address_province_code, this.record.address_city_code) + this.record.address_detail
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "~assets/style/global";

    .auth-info-container {
        .basic-info {

        }
        .info-line {
            * {
                margin-right: 0.5rem;
            }
            span:nth-child(2n) {
                margin-right: 3rem;
            }
        }
        .info-block {
            border: 1px solid #6f6f6f;
            border-radius: 5px;
            margin: 1rem 0;
            padding: 0.5rem 3rem;
            position: relative;
            overflow: hidden;
            .title {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
            }
            .card-no {
                color: $color-primary;
            }
            .info-name {
                margin: 1rem 0 0.5rem;
                font-weight: bold;
            }
            .id-photo {
                width: 100%;
                display: block;
                max-height: 100%;
                margin-bottom: 0.5rem;
            }
        }
    }
</style>