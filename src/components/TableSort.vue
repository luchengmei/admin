<template>
  <span class="caret-wrapper" :class="activeClass">
      <i class="sort-caret ascending" @click="clickAsc"></i>
      <i class="sort-caret descending" @click="clickDesc"></i>
  </span>
</template>
<script>
    export default {
        name: 'TableSort',
        props: {},
        data() {
            return {
                activeClass: ''
            }
        },
        methods:{
            clickAsc(){
                this.activeClass = 'ascending';
                this.$emit('ascending')
            },
            clickDesc(){
                this.activeClass = 'descending';
                this.$emit('descending')
            }
        }
    }
</script>

