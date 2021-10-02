<template>
  <div id="app" >
    <router-view/>
    <main-tab-bar/>
  </div>
</template>

<script>
import MainTabBar from './components/context/mainTabbar/MainTabBar';

export default {
  name: 'app',
  components: {
    MainTabBar
  }
}
</script>


<style>
@import "assets/css/base.css";
</style>
