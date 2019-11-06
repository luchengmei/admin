<template>
    <div>
        <el-card style="border-radius: 0">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="总体情况" name="all" style="margin: 10px">
                    <el-date-picker
                        v-model="date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="margin-right: 10px">
                    </el-date-picker>
                    <el-button type="primary" size="medium">查询</el-button>
                    <el-button type="primary" size="medium">重置</el-button>
                    <el-button type="primary" size="medium">刷新</el-button>
                    <span class="update">更新时间:</span>
                    <div class="countBox">
                        <div>
                            <p class="title">当前离线台数</p>
                            <p class="count">12</p>
                        </div>
                        <div>
                            <p class="title">累计离线台数</p>
                            <p class="count">12</p>
                        </div>
                        <div>
                            <p class="title">累计离线时长</p>
                            <p class="count">10h</p>
                        </div>
                    </div>
                    <div class="offline">

                    </div>
                </el-tab-pane>
                <el-tab-pane label="单台情况" name="single">单台情况</el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script>
export default{
    data () {
        return {
            activeName:'all',
            date:''
        }
    }
}
</script>
<style lang="less" scoped>
    .update{
        display: inline;
        margin-left: 10px;
        font-size: 14px;
    }
    .countBox{
        display: flex;
        color: #acacac;
        div{
            display: flex;
            flex-direction: column;
            margin: 30px 20px 0 0;
            .title{
                font-size: 14px;
            }
            .count{
                text-align: center;
                display: block;
                padding-top: 20px;
                color: #666;
                font-size: 30px;
            }
        }
    }
</style>