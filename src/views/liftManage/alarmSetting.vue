<template>
    <div>
        <el-card style="border-radius: 0;">
            <div slot="header">
                <span>{{liftName}}</span>
                <el-button type="primary" icon="el-icon-check" size="small" style="float: right">保存</el-button>
            </div>
            <div style="margin-bottom: 15px;color: #3C8DBC;">
                <div style="display: flex">
                    <div style="margin-right: 15px">APP推送
                        <el-switch v-model="APPpush"></el-switch>
                    </div>
                    <div>短信通知
                        <el-switch v-model="note"></el-switch>
                    </div>
                </div>
                <transition name="slide-fade">
                    <div v-show="note" class="noteSetting">
                        <el-card shadow="never">
                            <div slot="header">
                                <span>短信通知配置</span>
                                <el-checkbox-group v-model="checkList">
                                    <el-checkbox label="物业"></el-checkbox>
                                    <el-checkbox label="维保"></el-checkbox>
                                    <el-checkbox label="管理员"></el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <div>
                                <el-tag
                                        :key="tag"
                                        v-for="tag in dynamicTags"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input
                                        placeholder="请输入手机号"
                                        class="input-new-tag"
                                        v-show="inputVisible"
                                        v-model="inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm"
                                        @blur="handleInputConfirm">
                                </el-input>
                                <el-button icon="el-icon-plus" v-show="!inputVisible" class="button-new-tag" size="small" @click="showInput">添加指定用户
                                </el-button>
                            </div>
                        </el-card>
                    </div>
                </transition>
            </div>
            <div class="cardContainer">
                <el-card>
                    <div slot="header">
                        <span>湿度超标报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                    <div class="body-item">
                        <span>阈值(%)</span>
                        <el-input style="width: 50%"></el-input>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>温度超标报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                    <div class="body-item">
                        <span>阈值(℃)</span>
                        <el-input style="width: 50%"></el-input>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>噪声超标报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                    <div class="body-item">
                        <span>阈值(db)</span>
                        <el-input style="width: 50%"></el-input>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>电机温度超标报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                    <div class="body-item">
                        <span>阈值(℃)</span>
                        <el-input style="width: 50%"></el-input>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>电柜温度超标报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                    <div class="body-item">
                        <span>阈值(℃)</span>
                        <el-input style="width: 50%"></el-input>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>安全回路报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>不平层报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>开门行车报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>门区外停车报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>门区外行车报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>呼叫按钮按下</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>积水超标报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>超速报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                    <div class="body-item">
                        <span>最大阈值(m/s)</span>
                        <el-input style="width: 50%"></el-input>
                    </div>
                    <div class="body-item">
                        <span>最小阈值(m/s)</span>
                        <el-input style="width: 50%"></el-input>
                    </div>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>超时不开门报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                    <div class="body-item">
                        <span>阈值(s)</span>
                        <el-input style="width: 50%"></el-input>
                    </div>
                    <el-time-picker
                            class="body-item"
                            is-range
                            v-model="value4"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围">
                    </el-time-picker>
                </el-card>
                <el-card>
                    <div slot="header">
                        <span>超时不关门报警</span>
                        <el-switch></el-switch>
                    </div>
                    <div class="body-item">短信通知
                        <el-checkbox></el-checkbox>
                    </div>
                    <div class="body-item">
                        <span>阈值(s)</span>
                        <el-input style="width: 50%"></el-input>
                    </div>
                    <el-time-picker
                            class="body-item"
                            is-range
                            v-model="value4"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围">
                    </el-time-picker>
                </el-card>
            </div>
        </el-card>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                APPpush: true,
                note: true,
                hasSave: false,
                liftName: 'xxx电梯',
                value4: '',
                checkList: [],
                dynamicTags: [],
                inputVisible: false,
                inputValue: ''
            }
        },
        methods: {
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                    console.log(this.dynamicTags);
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        },
        beforeRouteLeave(to, from, next) {
            if (this.hasSave === false) {
                next(false);
                this.$confirm('内容未保存, 是否继续退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    next();
                }).catch(() => {
                });
            }
        },
        components: {}
    }
</script>
<style scoped lang="less">
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 24px;
        line-height: 22px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        height: 24px;
        line-height: 22px;
        width: 200px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .noteSetting {
        margin-top: 15px;
        width: 100%;
        font-size: 14px;
    }

    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .5s ease;
    }

    .slide-fade-leave-active {
        transition: all .5s ease;
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(30%);
        opacity: 0;
    }
</style>

