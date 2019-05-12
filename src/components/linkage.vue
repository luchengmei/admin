<template>
    <div class="linkage">
        <el-select
                v-model="SHENG"
                @change="choseProvince"
                placeholder="省级地区">
            <el-option
                    v-for="item in province"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id">
            </el-option>
        </el-select>
        <el-select
                v-model="SHI"
                @change="choseCity"
                placeholder="市级地区">
            <el-option
                    v-for="item in shi1"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id">
            </el-option>
        </el-select>
        <el-select
                v-model="QU"
                @change="choseBlock"
                placeholder="区级地区">
            <el-option
                    v-for="item in qu1"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        props: {
            sheng: {
                type: String,
                default: ''
            },
            shi: {
                type: String,
                default: ''
            },
            qu: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                mapJson: './static/json/map.json',
                province: '',
                shi1: [],
                qu1: [],
                city: '',
                block: '',
                SHENG:this.sheng,
                SHI:this.shi,
                QU:this.qu
            }
        },
        methods: {
            // 加载china地点数据，三级
            getCityData: function () {
                var that = this
                axios.get(this.mapJson).then(function (response) {
                    if (response.status == 200) {
                        var data = response.data
                        that.province = []
                        that.city = []
                        that.block = []
                        // 省市区数据分类
                        for (var item in data) {
                            if (item.match(/0000$/)) {//省
                                that.province.push({id: item, value: data[item], children: []})
                            } else if (item.match(/00$/)) {//市
                                that.city.push({id: item, value: data[item], children: []})
                            } else {//区
                                that.block.push({id: item, value: data[item]})
                            }
                        }
                        // 分类市级
                        for (var index in that.province) {
                            for (var index1 in that.city) {
                                if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
                                    that.province[index].children.push(that.city[index1])
                                }
                            }
                        }
                        // 分类区级
                        for (var item1 in that.city) {
                            for (var item2 in that.block) {
                                if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
                                    that.city[item1].children.push(that.block[item2])
                                }
                            }
                        }
                    }
                    else {
                        console.log(response.status)
                    }
                }).catch(function (error) {
                    console.log(error);
                    console.log(typeof+error)
                })
            },
            // 选省
            choseProvince: function (e) {
                for (var index2 in this.province) {
                    if (e === this.province[index2].id) {
                        this.shi1 = this.province[index2].children;
                        this.qu1 = this.province[index2].children[0].children;
                        this.SHI = this.province[index2].children[0].value;
                        this.QU = this.province[index2].children[0].children[0].value;
                        this.SHENG = this.province[index2].value;
                        this.$emit('changeCity', this.SHENG, this.SHI, this.QU);
                    }
                }
            },
            // 选市
            choseCity: function (e) {
                for (var index3 in this.city) {
                    if (e === this.city[index3].id) {
                        this.qu1 = this.city[index3].children;
                        this.SHI = this.city[index3].value;
                        this.QU = this.city[index3].children[0].value;
                        this.$emit('changeCity', this.SHENG, this.SHI, this.QU);
                    }
                }
            },
            // 选区
            choseBlock: function (e) {
                this.QU = this.qu1.filter((item) => {
                    return item.id === e;
                })[0].value;
                this.$emit('changeCity', this.SHENG, this.SHI, this.QU);
            },
        },
        created: function () {
            this.getCityData();
        }
    }
</script>

<style scoped>
.el-select{
    width: 150px;
}
</style>
