<template>
    <div class="footer">
        <div class="version">
            <b>Version</b> {{ $Config.version }}
            <a href="javascript:" target="_blank"><i class="fa fa-github github"></i></a>
        </div>
        <strong>Copyright © 2019 <a href="javascript:">马上到科技</a><a style="margin-left: 20px" target="_blank"
                                                                   href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44060402001463">粤ICP备19078962号-1<img style="margin: 0 5px;width: 16px"
                src="../../assets/images/fbc6f7d7170ee28f5762fbd598f9a4b.png"/>粤公网安备
            44060402001463号</a></strong>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        methods: {}
    }
</script>
<style lang="less">
    .footer {
        width: 100%;
        font-size: 14px;
        background: #fff;
        line-height: 50px;
        padding: 0 12px;
        height: 50px;
        color: #444;
        border-top: 1px solid #d2d6de;
        .version {
            float: right;
            b {
                font-weight: 700;
            }
            .github {
                color: #444;
                font-size: 20px;
                margin-left: 8px;
                &:hover {
                    color: #8BC34A;
                }
            }
        }
    }
</style>
