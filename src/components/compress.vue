<template>
  <div :class="[fileIn?'expand':'h-9', 'file_list', 'flex-grow-0', 'relative', 'transition-all', 'duration-300', 'ease-out', 'flex', 'flex-col']" @dragover="allowDrop" @drop="fileDrop">
    <div class="feather_bg absolute top-0 w-1/3 h-40 transform -translate-x-1/2 left-1/2 z-0 flex-none light_one"></div>
    <ul class="relative z-10 bg-white rounded-t-md min-h-3 shadow-md flex-shrink flex-grow overflow-auto px-6 py-3 divide-y divide-gray-200 scrollbar scrollbar-w-2 scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full" >
      <div class="tips">
        
      </div>
      <li v-for="item in fileList" :key="item.id" class="file_list">
        <div class="flex py-3 cursor-pointer" @click="subMenu(item)">
          <div class="flex-1 overflow-hidden flex-grow">
            <h6 class="text-base text-gray-800">{{item.name}}</h6>
            <p class="text-sm text-gray-400 overflow-ellipsis overflow-hidden w-full" :title="item.path">{{item.path}}</p>
          </div>
          <div class="stats flex-none flex items-center" v-show="item.stats !== 'ready'">
            <div :class="['circle-loader', 'ml-1', item.stats==='success'?'load-complete':'', item.stats==='fail'?'load-fail':'']" :title="item.des">
              <div class="checkmark draw"></div>
            </div>
          </div>
        </div>
        <transition name="slide">
          <div class="row_operate flex overflow-hidden h-10 justify-center items-start divide-x" v-show="item.operate">
            <div class="flex-auto flex justify-center items-center cursor-pointer">
              <svg class="icon text-2xl" aria-hidden="true">
                <use xlink:href="#icon-folder"></use>
              </svg>
              <span class="text-sm text-gray-500 pl-1">打开文件夹</span>
            </div>
            <div class="flex-auto flex justify-center items-center cursor-pointer">
              <svg class="icon text-2xl" aria-hidden="true">
                <use xlink:href="#icon-backup"></use>
              </svg>
              <span class="text-sm text-gray-500 pl-1">备份</span>
            </div>
            <div class="flex-auto flex justify-center items-center cursor-pointer" @click="deleteItem(item)">
              <svg class="icon text-2xl" aria-hidden="true">
                <use xlink:href="#icon-delete"></use>
              </svg>
              <span class="text-sm text-red-600 pl-1">删除</span>
            </div>
          </div>
        </transition>
      </li>
    </ul>
    <div class="flex-grow-0 bg-white relative z-10 p-4 flex items-center justify-center gap-2">
      <button class="px-2 py-2 w-40 rounded-md bg-red-600 text-white shadow-lg hover:bg-red-500 hover:shadow-none" @click="deleteAll" v-show="fileList.length>0&&!compressing">删除全部</button>
      <button class="px-4 py-2 w-40 rounded-md bg-gray-400 text-white shadow-lg hover:bg-gray-200 hover:shadow-none" v-if="compressing" @click="stop">放弃</button>
      <button class="px-4 py-2 w-40 rounded-md bg-green-600 text-white shadow-lg hover:bg-green-500 hover:shadow-none" v-else @click="begin">压缩</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'compress',
  props: {
    fileIn: Boolean,

  },
  data() {
    return {
      fileList: [],
      acceptType: ['ccs'],
      startIndex: -1,
      compressing: false,
    }
  },
  watch: {
    fileList(newList, oldList){
      console.log(newList.length, oldList.length);
      this.$emit('dropCheck', newList.length);
    },
    startIndex(newData) {
      if(newData < this.fileList.length&&this.compressing){
        window.ipcRenderer.send('readFiles', this.fileList[newData].path);
      }else {
        this.compressing = false;
      }
    }
  },
  emits: ['dropCheck'],
  methods: {
    fileDrop(event){
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.files.forEach(f => {
            const rawList = f.name.split('.');
            if(!this.fileList.find(Element => Element.path === f.path)&&this.acceptType.includes(rawList[rawList.length - 1].toLowerCase())){
              this.fileList.push({
                  name: f.name,
                  path: f.path,
                  stats: 'ready',
                  des: 'ready to compress',
                  operate: false,
              });
            }else if(this.fileList.length === 0){
              this.fileList = [];
            }
        });
    },
    allowDrop(event) {
      event.preventDefault();
      event.stopPropagation();
    },
    begin() {
      this.fileList.forEach(Element => Element.operate = false)
      this.fileList.forEach(Element => {
        Element.stats = 'loading'
      })
      this.compressing = true;
      this.startIndex = 0;
    },
    stop() {
      this.compressing = false;
    },
    subMenu(el) {
      if(!this.compressing){
        this.fileList.forEach(Element => {
          if(Element !== el)Element.operate = false;
        })
        el.operate = !el.operate;
      }
    },
    deleteItem(el) {
      const idx = this.fileList.findIndex(data => data.path===el.path);
      let tempArray = JSON.parse(JSON.stringify(this.fileList));
      tempArray.splice(idx, 1);
      this.fileList = tempArray;
    },
    deleteAll() {
      this.fileList = [];
    }
  },
  mounted(){
    this.$nextTick(function(){
      window.ipcRenderer.receive("fromMain", (event, args) => {
        const fileIndex = this.fileList.findIndex(data => {
          if(data.path === args.path)return true
        });
        // console.log(fileIndex, args.path);
        if(fileIndex>=0&&args.result){
          this.fileList[fileIndex].stats = 'success'
          this.fileList[fileIndex].des = 'completed'
        }else{
          this.fileList[fileIndex].stats = 'fail'
          this.fileList[fileIndex].des = args.error.message;
        }
        console.log(args);
        this.startIndex++;
      })
      // console.log(window.ipcRenderer);
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
