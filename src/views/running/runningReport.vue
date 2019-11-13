<template>
    <el-card class="running">
        <el-row :gutter="30" class="online_data">
            <el-col :span="6">
                <el-card shadow="never"  style="padding-left:15px;">
                    <div class="count">27</div>
                    <div class="title"><span style="color:#58a3f7;">●</span> 在线用户数</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never"  style="padding-left:15px;">
                    <div class="count">62/82</div>
                    <div class="title"><span style="color:#fec03d;">●</span> 在线设备数</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never"  style="padding-left:15px;">
                    <div class="count">1/23</div>
                    <div class="title"><span style="color:#52c1f5;">●</span> 未处理报警数量</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never"  style="padding-left:15px;">
                    <div class="count">7</div>
                    <div class="title"><span style="color:#4bced0;">●</span> 年审过期（台）</div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="30" class="Qnew">
             <el-col :span="12">
                <el-card shadow="never">
                    <div class="title">快速新建</div>
                    <div class="content">
                        <div class="grid-content">
                            <i class="iconfont icon-commpany"></i>
                            <div style="margin-top:10px;">
                                新建单位
                            </div>
                        </div>
                        <div class="grid-content">
                            <i class="iconfont icon-user-plus"></i>
                            <div style="margin-top:10px;">
                                新建用户
                            </div>
                        </div>
                        <div class="grid-content">
                            <i class="iconfont icon-elevator"></i>
                            <div style="margin-top:10px;">
                                新建电梯
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
             <el-col :span="12">
                <el-card shadow="never">
                    <div class="title">服务数据</div>
                    <div class="server_data">
                        <el-card shadow="never">
                            <div class="count">2.3/1.8M</div>
                            <div class="name"><span style="color:#81d3f8;">●</span> 网络（出网/入网）</div>
                        </el-card>
                        <el-card shadow="never">
                            <div class="count">27</div>
                            <div class="name"><span style="color:#80ffff;">●</span> CPU使用率（%）</div>
                        </el-card>
                        <el-card shadow="never">
                            <div class="count">3/4</div>
                            <div class="name"><span style="color:#70b603;">●</span> 内存（GiB）</div>
                        </el-card>
                        <el-card shadow="never">
                            <div class="count">234/400</div>
                            <div class="name"><span style="color:#caf982;">●</span> 磁盘（GB）</div>
                        </el-card>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>
<style lang="less" scoped>
.running{
    padding: 15px;
    .online_data{
        .count{
            font-size: 25px;
        }
        .title{
            color: rgba(0,0,0,.5);
            font-size: 14px;
        }
    }
    .el-row{
        margin-bottom: 20px;
    }
    .el-card{
        border-radius: unset;
    }
    .Qnew{
        font-size: 14px;
        /deep/.el-card__body{
            padding: 0;
        }
        .title{
            padding: 15px;
            border-bottom: 1px solid rgba(0,0,0,.1);
            background-color: #f9f9f9;
        }
        .content{
            background-color: #fff;
            display: flex;
            padding: 10px 15px;
            height: 135px;
            .iconfont{
                font-size: 50px;
                color: rgba(102, 102, 102, 0.767);
            }
            .grid-content{
                padding: 15px 25px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                &:hover{
                    cursor: pointer;
                    box-shadow: 0px 0px 1px #666;
                    background-color: #f9f9f9;
                }
            }
        }
        .server_data{
            height: 135px;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            .count{
                font-size: 20px;
            }
            .el-card{
                width: 25%;
                border: unset;
            }
            .name{
                color: #888;
            }
        }
    }
}
</style>