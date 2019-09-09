<template>
    <div class="main">
        <div id="map" class="map"></div>
        <div class="sidebar" :class="{'sidebar-open':sidebarOpen}">
            <div class="sidebar-inner">
                <p class="sidebar-item" v-for="i in lifts" :key="i.id" @click="onSidebarItem(i)">{{i.lift_name}}</p>
            </div>
            <span :class="sidebarOpen?'el-icon-d-arrow-left':'el-icon-d-arrow-right'" @click="onSidebar"></span>
        </div>
        <el-input placeholder="" clearable v-model="inputValue" @clear="showSearchResult= false"
                  @keyup.native.enter="search" class="input">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-card id="search-result" v-show="showSearchResult">
            <div slot="header">
                <span style="color: #666666">搜索结果</span>
                <el-button style="float: right; padding: 3px 0;font-size: 16px" type="text" icon="el-icon-close"
                           @click="showSearchResult = false"></el-button>
            </div>
            <div id="search-content">
                <div v-for="i in result" style="line-height: 20px;border-bottom: 1px solid #eeeeee;margin-bottom: 5px">
                    <p style="cursor: pointer" @click="onResult(i)">{{i.title}}</p>
                    <p style="font-size: 12px;color: #666666">地址：{{i.address}}</p>
                </div>
            </div>
        </el-card>
        <el-card class="card" size="small">
            <p>电梯名称：{{chosenLift.name}}</p>
            <p>经度：{{chosenLift.lng}}</p>
            <p>维度：{{chosenLift.lat}}</p>
            <el-button type="primary" style="margin-top: 10px" @click="saveLiftPoint(chosenLift)">确认</el-button>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Map",
        data() {
            return {
                map: null,
                lifts: [],
                sidebarOpen: false,
                inputValue: '',
                result: [],
                showSearchResult: false,
                chosenLift: {
                    id: '',
                    name: '',
                    lng: '',
                    lat: ''
                }
            }
        },
        methods: {
            getLifts() {
                this.$api_v3.post('/Lifts/listPage', {list_rows: 999}).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        res.data.data.forEach((item) => {
                            this.lifts.push(
                                {
                                    "lift_id": item.id,
                                    "lift_name": item.name,
                                    "lng": item.lng,
                                    "lat": item.lat
                                }
                            );
                        });
                        for (let i = 0; i < this.lifts.length; i++) {
                            this.createMarker(this.lifts[i])
                        }
                    }
                })
            },
            saveLiftPoint(params) {
                this.$api_v3.post('/Lifts/save', params).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        this.$message.success('设置经纬度成功');
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            onSidebarItem(i) {
                //console.log(i);
                let point = new BMap.Point(i.lng, i.lat);
                this.map.panTo(point);
                setTimeout(() => {
                    this.map.setZoom(18);
                }, 1000);
            },
            initMap() {
                this.map = new BMap.Map("map");// 创建地图实例
                let point = new BMap.Point(113.134025635, 23.0350948405);// 创建点坐标(佛山)
                this.map.centerAndZoom(point, 14);// 初始化地图，设置中心点坐标和地图级别
                this.map.enableScrollWheelZoom();//设置滚轮缩放
            },
            createMarker(item) { // 创建标注
                let point = new BMap.Point(item.lng, item.lat);
                let marker = new BMap.Marker(point);
                marker.lift_id = item.lift_id;
                marker.lift_name = item.lift_name;
                marker.setTitle(item.lift_name);
                marker.enableDragging();//可拖拽
                marker.addEventListener("dragging", (e) => {
                    //console.log("当前位置：" + e.point.lng + ", " + e.point.lat, e);
                    this.chosenLift.name = e.target.lift_name;
                    this.chosenLift.id = e.target.lift_id;
                    this.chosenLift.lng = e.point.lng;
                    this.chosenLift.lat = e.point.lat;
                });
                marker.addEventListener("click", (e) => {
                    //console.log(e);
                    this.map.panTo(e.target.point);
                    this.chosenLift.name = e.target.lift_name;
                    this.chosenLift.id = e.target.lift_id;
                    this.chosenLift.lng = e.target.point.lng;
                    this.chosenLift.lat = e.target.point.lat;
                });
                this.map.addOverlay(marker);
            },
            search() {
                this.showSearchResult = true;
                let options = {
                    onSearchComplete: (result) => {
                        //console.log(result);
                        if (result) {
                            this.result = result.Qq;
                        }
                    }
                };
                let local = new BMap.LocalSearch(this.map, options);
                local.search(this.inputValue);
            },
            onSidebar() {
                this.sidebarOpen = !this.sidebarOpen;
            },
            onResult(i) {
                //console.log(i);
                this.map.panTo(i.point);
            }
        },
        mounted() {
            this.initMap();
            this.getLifts();
        }
    }
</script>

<style lang="less" scoped>
    @import "Map";
</style>
