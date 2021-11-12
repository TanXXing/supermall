<template>
<!-- 第一个div里面加了v-if是为了，当没有获取到东西的时候，它就先不显示 -->
  <div v-if="Object.keys(detailInfo).length !== 0" class="goods-info">
    <div class="info-desc clear-fix">
      <div class="start">
      </div>
      <div class="desc">{{detailInfo.desc}}</div>
      <div class="end"></div>
    </div>
    <div class="info-key">{{detailInfo.detailImage[0].key}}</div>
    <div class="info-list">
      <img v-for="(item, index) in detailInfo.detailImage[0].list" 
      :src="item" alt="" v-on:load="imgLoad">
    </div>
  </div>
</template>

<script>
	export default {
		name: "DetailGoodsInfo",
    props: {
      detailInfo: {
        type: Object
      }
    }, 
    data() {
      return {
        counter: 0, 
        imgLength: 0
      }
    },
    methods: {
      imgLoad() {
        // 这个地方，肯定是先加再比较，如果是先比较再加的话，那么这个判断的if将不会达到效果(已经通过测试，验证了这个)
        if(++this.counter === this.imgLength) {
          // 上面中的判断条件中等号右边，会每一次都进行一次计算，这是很不好的，影响性能，我们只希望计算一次，
          // 只计算一次，这个类似于，当一个数据要多次用到，但是只需要提取一次，那就用个变量保存起来
          this.$emit('imgLoad')
        }
      }
    },
    watch: {
      detailInfo(){
          this.imgLength = this.detailInfo.detailImage[0].list.length
      }
    }
	}
</script>

<style scoped>
  .goods-info {
    padding: 20px 0;
    border-bottom: 5px solid #f2f5f8;
  }

  .info-desc {
    padding: 0 15px;
  }

  .info-desc .start, .info-desc .end {
    width: 90px;
    height: 1px;
    background-color: #a3a3a5;
    position: relative;
  }

  .info-desc .start {
    float: left;
  }

  .info-desc .end {
    float: right;
  }

  .info-desc .start::before, .info-desc .end::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: #333;
    bottom: 0;
  }

  .info-desc .end::after {
    right: 0;
  }

  .info-desc .desc {
    padding: 15px 0;
    font-size: 14px;
  }

  .info-key {
    margin: 10px 0 10px 15px;
    color: #333;
    font-size: 15px;
  }

  .info-list img {
    width: 100%;
  }
</style>
