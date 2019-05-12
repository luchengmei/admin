<!--
如何使用？
1.导入并添加components, import ToolBar from '~/components/ToolBar/ToolBar.vue',
2.绑定你的api、参数和数据处理函数，会自动生成分页
<Paginate
    api="postList"
    :params="params"
    :refresh="refresh"
    @val-change="PaginateData"
    >
</Paginate>
3.当你再次改动参数时，执行 refresh=!refresh 即可刷新。用于搜索。

-->

<template>
    <div class="pagination">
        <div class="total">共有{{total}}条数据，当页有{{currentDataLength}}条数据。</div>
        <el-pagination
                background
                layout="sizes, prev, pager, next"
                :current-page.sync="current"
                :page-sizes="[10, 25, 50, 100,200]"
                :page-size.sync="size"
                @current-change="change"
                :total="total">
        </el-pagination>
    </div>
</template>
<script>
    export default {
        name: 'Paginate',
        props: {
            api: String,
            params: Object,
            refresh: Boolean,
        },
        data() {
            return {
                isMounted: false,
                size: 10,
                total: null,
                current: 1,
                currentDataLength: 0,
            }
        },
        methods: {
            paginate: function () {
                let _this = this;
                let params = _this.params;
                if (params.page_proto !== undefined) {//has page_proto in params
                    params.page_proto.size = _this.size;
                    params.page_proto.page = _this.current;
                } else {//there is no page_proto in params
                    params.size = _this.size;
                    params.page = _this.current;
                }
                _this.$req.post(_this.api, params).then((result) => {
                    //console.log('data', result);
                    _this.total = result.total_elements;
                    _this.currentDataLength = result.content.length;
                    _this.$emit('val-change', result.content);
                }).finally(()=>{
                })
            },
            change: function (page) {
                this.current = page;
                this.paginate();
            }
        },
        watch: {
            'size': {
                handler: function () {
                    this.current = 1;
                    this.paginate();
                }
            },
            'refresh': {
                handler: function () {
                    //this.current = 1;
                    this.paginate();
                },
                // 深度观察
                deep: true
            }
        },
        mounted() {
            console.log('mounted');
            //this.isMounted = true;
                this.paginate();
        },
        activated() {
            console.log('activated');
            this.paginate()
        }
    }
</script>
<style lang="less" scoped>
    .pagination {
        padding: 7px;
        border: 1px solid #ebeef5;
        background: #fff;
        text-align: right;
    }

    .total {
        float: left;
        margin-top: 8px;
        margin-left: 10px;
        font-size: 13px;
        color: #606266;
    }

</style>
