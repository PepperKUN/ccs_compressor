<template>
    <div class="panel shadow-lg rounded-md" style="-webkit-app-region: drag;">
      <ul class="top_bar flex p-1 w-full">
        <li class="option flex-none w-4 h-4 cursor-pointer"></li>
        <li class="drag flex-grow h-4 cursor-move"></li>
        <li class="minus flex-none w-4 h-4 cursor-pointer"></li>
        <li class="close flex-none w-4 h-4 cursor-pointer"></li>
      </ul>
      <ul class="tab_list">
        <li>
          <h4>壓縮</h4>
          <span>CCS Compressor</span>
        </li>
        <li class="">
          <h4>拎走</h4>
          <span>CCS Package</span>
        </li>
      </ul>
      <div class="file_panel">

      </div>
    </div>

</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  }
}
</script>

<style>
@import './assets/style.css';

</style>
