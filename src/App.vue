<template>
    <div class="panel flex flex-col h-screen" @dragenter="dragIn" @dragleave="dragOut" @dragover="allowDrop" v-on:drop="fileDrop">
      <ul class="top_bar flex flex-wrap w-full flex-grow-0">
        <li class="option bar_btn"></li>
        <li class="drag flex-grow p-4 cursor-move" style="-webkit-app-region: drag;"></li>
        <li class="minus bar_btn" @click="minimize"></li>
        <li class="close bar_btn hover:bg-red-500"  @click="close"></li>
      </ul>
      <ul class="tab_list flex justify-center items-center flex-grow relative z-10">
        <li :class="currentIndex === index?'current':''" v-for="(item, index) in tab_lists" :key="item.id" @click="currentIndex=index">
          <h4 class="text">{{item.title}}</h4>
          <span>{{item.des}}</span>
        </li>
      </ul>
      <div :class="[fileIn?'h-4/5':'h-9', 'file_list', 'flex-grow-0', 'relative', 'transition-all', 'duration-300', 'ease-out']">
        <div class="feather_bg absolute top-0 w-1/3 h-40 transform -translate-x-1/2 left-1/2 z-0"></div>
        <ul class=" relative z-10 bg-white rounded-t-md h-full shadow-md" :v-show="currentIndex === 0">
          <li></li>
        </ul>
      </div>
    </div>

</template>

<script>
export default {
  name: 'App',
  components: {},
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
      fileIn: false,
      fileList: [],
      dragCount: 0,
    }
  },
  methods: {
    close() {
      window.ipcRenderer.send('closeWin');
    },
    minimize() {
      window.ipcRenderer.send('minimize');
    },
    dragIn() {
      this.dragCount++;
      this.fileIn = true;
    },
    dragOut() {
      this.dragCount--;
      if(this.dragCount === 0){
        this.fileIn = false;
      }
    },
    fileDrop(event){
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.files.forEach(f => {
        this.fileList.push(f.path);
        console.log(f)
        });
      // window.ipcRenderer.send('readFiles', filePath);
    },
    allowDrop(event) {
      event.preventDefault();
      event.stopPropagation();
    },
  }
}
</script>

<style>

</style>
