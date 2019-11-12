<template>
    <div class="running">
        <el-row :gutter="30">
            <el-col :span="6">
                <el-card shadow="never"  style="padding-left:15px;border-radius:unset;">
                    <div class="count">27</div>
                    <div class="title"><span style="color:#58a3f7;">●</span> 在线用户数</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never"  style="padding-left:15px;border-radius:unset;">
                    <div class="count">62/82</div>
                    <div class="title"><span style="color:#fec03d;">●</span> 在线设备数</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never"  style="padding-left:15px;border-radius:unset;">
                    <div class="count">1/23</div>
                    <div class="title"><span style="color:#52c1f5;">●</span> 未处理报警数量</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never"  style="padding-left:15px;border-radius:unset;">
                    <div class="count">7</div>
                    <div class="title"><span style="color:#4bced0;">●</span> 年审过期（台）</div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<style lang="less" scoped>
.running{
    padding: 15px;
    .count{
        font-size: 25px;
    }
    .title{
        color: rgba(0,0,0,.5);
        font-size: 14px;
    }
}
</style>