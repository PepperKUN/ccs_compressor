<template>
    <div :class="['panel', 'flex', 'flex-col', 'h-screen',  tab_lists[currentIndex].bgColor, 'overflow-hidden',]" @dragenter="dragIn" @dragleave="dragOut" @dragover="allowDrop" @drop="fileDrop">
      <ul class="top_bar flex flex-wrap w-full flex-grow-0 relative z-20">
        <li :class="['bar_btn', 'hover:'+tab_lists[currentIndex].hoverColor]" title="PepperKUN">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-options"></use>
          </svg>
        </li>
        <li class="drag flex-grow p-4 cursor-move" style="-webkit-app-region: drag;"></li>
        <li :class="['bar_btn', 'hover:'+tab_lists[currentIndex].hoverColor]" @click="minimize">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-minimize"></use>
          </svg>
        </li>
        <li class="bar_btn hover:bg-red-500"  @click="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close"></use>
          </svg>
        </li>
      </ul>
      <ul class="tab_list flex justify-center items-center flex-grow relative z-10">
        <li :class="currentIndex === index?'current':''" v-for="(item, index) in tab_lists" :key="item.id" @click="currentIndex=index">
          <h4 class="text">{{item.title}}</h4>
          <span>{{item.des}}</span>
        </li>
      </ul>
      <transition name="funcSwitch"  mode="out-in"  @after-leave="switchReset">
        <keep-alive>
          <component :is="currentTabComponent" :fileIn="fileIn[currentIndex]" v-on:dropCheck='getListLength'></component>
        </keep-alive>
      </transition>
    </div>

</template>

<script>
import compress from './components/compress.vue'
import pack from './components/packup.vue'
import search from './components/search.vue'
export default {
  name: 'App',
  components: {
    compress,
    pack,
    search
  },
  data() {
    return {
      tab_lists: [
        {
          title: "清理",
          des: "CCS Cleaning",
          component: 'compress',
          bgColor: 'bg-turquoise-dark',
          hoverColor: 'bg-turquoise-light',
          lightColor: 'light_one',
        },{
          title: "打包",
          des: "Project Package",
          component: 'pack',
          bgColor: 'bg-orange-dark',
          hoverColor: 'bg-orange-light',
          lightColor: 'light_two',
        },{
          title: "反查",
          des: "Search & Sort",
          component: 'search',
          bgColor: 'bg-rose-dark',
          hoverColor: 'bg-rose-light',
          lightColor: 'light_three',
        }
      ],
      currentIndex: 0,
      fileIn: [false,false,false],
      listLength: [0, 0, 0],
      dragCount: 0,
      taglist: [
        "FontResource",
        "FileData",
        "DisabledFileData",
        "PressedFileData",
        "NormalFileData",
      ],
      compress_start: false,
    }
  },
  watch: {
    listLength(newData){
      if(newData[this.currentIndex] === 0){
        this.fileIn[this.currentIndex] = false
        this.dragCount = 0;
      }else{
        this.fileIn[this.currentIndex] = true
      }

    }
  },
  methods: {
    close() {
      window.ipcRenderer.send('closeWin');
    },
    minimize() {
      window.ipcRenderer.send('minimize');
    },
    allowDrop(event) {
      event.preventDefault();
      event.stopPropagation();
    },
    dragIn() {
      this.dragCount++;
      this.fileIn[this.currentIndex] = true;
    },
    dragOut() {
      this.dragCount--;
      if(this.dragCount === 0){
        this.fileIn[this.currentIndex] = false;
      }
    },
    fileDrop(event){
        event.preventDefault();
        // event.stopPropagation();
        // console.log(event);
        let tempListLength = JSON.parse(JSON.stringify(this.listLength));
        // console.log(this.listLength);
        // tempListLength[this.currentIndex] = tempListLength[this.currentIndex] + 0;
        this.listLength = tempListLength;
    },
    switchReset() {
      this.dragCount = 0
    },
    fullReset() {
      this.fileIn[this.currentIndex] = false
      this.dragCount = 0
    },
    getListLength(currentLength) {
      let tempListLength = JSON.parse(JSON.stringify(this.listLength));
      tempListLength[this.currentIndex] = currentLength;
      this.listLength = tempListLength;
    }
  },
  computed: {
    currentTabComponent() {
      return this.tab_lists[this.currentIndex].component
    }
  }
}
</script>

<style>

</style>
