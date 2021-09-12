<template>
    <div class="panel flex flex-col h-screen" @dragenter="dragIn" @dragleave="dragOut" @dragover="allowDrop" @drop="fileDrop">
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
      <div :class="[fileIn?'expand':'h-9', 'file_list', 'flex-grow-0', 'relative', 'transition-all', 'duration-300', 'ease-out', 'flex', 'flex-col']">
        <div class="feather_bg absolute top-0 w-1/3 h-40 transform -translate-x-1/2 left-1/2 z-0 flex-none"></div>
        <ul class="relative z-10 bg-white rounded-t-md min-h-3 shadow-md flex-shrink flex-grow overflow-auto px-6 py-3 divide-y divide-gray-200 scrollbar scrollbar-w-2 scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full" :v-show="currentIndex === 0">
          <li v-for="item in fileList" :key="item.id" class="file_list py-3">
            <div class="flex">
              <div class="flex-1 overflow-hidden flex-grow">
                <h6 class="text-base text-gray-800">{{item.name}}</h6>
                <p class="text-sm text-gray-400 overflow-ellipsis overflow-hidden w-full" :title="item.path">{{item.path}}</p>
              </div>
              <div class="status flex-none flex items-center">
                <div :class="['circle-loader', 'ml-1', item.status==='success'?'load-complete':'', item.status==='fail'?'load-fail':'']" :title="item.des">
                  <div class="checkmark draw"></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="flex-grow-0 bg-white relative z-10 p-4 flex items-center justify-center">
          <button class="px-4 py-2 w-40 rounded-md bg-green-600 text-white shadow-lg hover:bg-green-500 hover:shadow-none" @click="begin">压缩</button>
        </div>
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
      taglist: [
        "FontResource",
        "FileData",
        "DisabledFileData",
        "PressedFileData",
        "NormalFileData",
      ],
      finishList: [],
      compress_start: false,
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
        if(!this.fileList.find(Element => Element.path === f.path)){
          this.fileList.push({
            name: f.name,
            path: f.path,
            status: 'ready',
            des: 'ready to compress'
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
        Element.status = 'loading'
      })
      this.fileList.forEach(Element => {
        window.ipcRenderer.send('readFiles', Element.path);
      })
    }
  },
  mounted(){
    this.$nextTick(function(){
      window.ipcRenderer.receive("fromMain", (event, args) => {
        // this.finishList.push(args);
        // console.log(this.finishList);
        const fileIndex = this.fileList.findIndex(data => data.path === args.path);
        if(fileIndex>=0&&args.result){
          this.fileList[fileIndex].status = 'success'
          this.fileList[fileIndex].des = 'completed'
        }else{
          this.fileList[fileIndex].status = 'fail'
          this.fileList[fileIndex].des = args.error.message;
        }
        console.log(args);
      })
      // console.log(window.ipcRenderer);
    })
  }
}
</script>

<style>

</style>
