<template>
  <div :class="[fileIn?'expand':'h-9', 'file_list', 'flex-grow-0', 'relative', 'transition-all', 'duration-300', 'ease-out', 'flex', 'flex-col']" @dragover="allowDrop" @drop="fileDrop">
    <div class="feather_bg absolute top-0 w-1/3 h-40 transform -translate-x-1/2 left-1/2 z-0 flex-none light_one"></div>
    <ul class="relative z-10 bg-white rounded-t-md min-h-3 shadow-md flex-shrink flex-grow overflow-auto px-6 py-3 divide-y divide-gray-200 scrollbar scrollbar-w-2 scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full" >
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
      <button class="px-2 py-2 w-40 rounded-md bg-red-600 text-white shadow-lg hover:bg-red-500 hover:shadow-none" @click="deleteAll" v-show="fileList.length>0">删除全部</button>
      <button class="px-4 py-2 w-40 rounded-md bg-green-600 text-white shadow-lg hover:bg-green-500 hover:shadow-none" @click="begin">压缩</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'compress',
  props: {
    fileIn: Boolean,

  },
  methods: {
    fileDrop(event){
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.files.forEach(f => {
            const rawList = f.name.split('.');
            if(!this.fileList.find(Element => Element.path === f.path)&&rawList[rawList.length - 1]==='ccs'){
            this.fileList.push({
                name: f.name,
                path: f.path,
                stats: 'ready',
                des: 'ready to compress',
                operate: false,
            });
            }
            
            // console.log(f);
            });
    },
    allowDrop(event) {
      event.preventDefault();
      event.stopPropagation();
    },
    begin() {
      this.fileList.forEach(Element => {
        Element.stats = 'loading'
      })
      this.fileList.forEach(Element => {
        window.ipcRenderer.send('readFiles', Element.path);
      })
      // for(let i in this.fileList){
      //   window.ipcRenderer.send('readFiles', this.fileList[i].path);

      // }
    },
    subMenu(el) {
      this.fileList.forEach(Element => {
        if(Element !== el)Element.operate = false;
      })
      el.operate = !el.operate;
    },
    deleteItem(el) {
      const idx = this.fileList.findIndex(data => data.path===el.path);
      this.fileList.splice(idx, 1);
    },
    deleteAll() {
      this.fileList = [];
    }
  },
  data() {
    return {
      fileList: [],
    }
  },
  mounted(){
    this.$nextTick(function(){
      window.ipcRenderer.receive("fromMain", (event, args) => {
        console.log(args);
        const fileIndex = this.fileList.findIndex(data => {
          data.path == args.path
        });
        console.log(fileIndex, args.path);
        if(fileIndex>=0&&args.result){
          this.fileList[fileIndex].stats = 'success'
          this.fileList[fileIndex].des = 'completed'
        }else{
          this.fileList[fileIndex].stats = 'fail'
          this.fileList[fileIndex].des = args.error.message;
        }
        console.log(args);
      })
      // console.log(window.ipcRenderer);
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
