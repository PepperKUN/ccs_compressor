<template>
    <div class="panel flex flex-col" >
      <ul class="top_bar flex flex-wrap w-full flex-grow-0">
        <li class="option bar_btn hover:bg-green-700"></li>
        <li class="drag flex-grow p-4 cursor-move hover:bg-blue-600" style="-webkit-app-region: drag;"></li>
        <li class="minus bar_btn hover:bg-green-700" @click="minimize"></li>
        <li class="close bar_btn hover:bg-red-500"  @click="close"></li>
      </ul>
      <ul class="tab_list flex justify-center items-center flex-grow">
        <li :class="currentIndex === index?'current':''" v-for="(item, index) in tab_lists" :key="item.id" @click="currentIndex=index">
          <h4 class="text">{{item.title}}</h4>
          <span>{{item.des}}</span>
        </li>
      </ul>
      <ul class="file_list flex-grow-0 bg-white h-9 rounded-t-md" :v-show="currentIndex === 0">
        <li></li>
      </ul>
    </div>

</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  data() {
    return {
      tab_lists: [
        {
          title: "壓縮",
          des: "CCS Compressor"
        },{
          title: "拎走",
          des: "CCS Package"
        }
      ],
      currentIndex: 0,
    }
  },
  methods: {
    close() {
      // console.log(window.ipcRenderer);
      window.ipcRenderer.send('closeWin');
    },
    minimize() {
      // console.log(window.ipcRenderer);
      window.ipcRenderer.send('minimize');
    }
  }
}
</script>

<style>

</style>
