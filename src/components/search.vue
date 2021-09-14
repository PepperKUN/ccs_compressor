<template>
  <div :class="[fileIn?'expand':'h-9', 'file_list', 'flex-grow-0', 'relative', 'transition-all', 'duration-300', 'ease-out', 'flex', 'flex-col']" @dragover="allowDrop" @drop="fileDrop">
        <div class="feather_bg absolute top-0 w-1/3 h-40 transform -translate-x-1/2 left-1/2 z-0 flex-none light_three"></div>
            <ul class="relative z-10 bg-white rounded-t-md min-h-3 shadow-md flex-shrink flex-grow overflow-auto px-6 py-3 divide-y divide-gray-200 scrollbar scrollbar-w-2 scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full">
            </ul>
        <div class="flex-grow-0 bg-white relative z-10 p-4 flex items-center justify-center gap-2">
            <button class="px-2 py-2 w-40 rounded-md bg-red-600 text-white shadow-lg hover:bg-red-500 hover:shadow-none" @click="deleteAll" v-show="fileList.length>0">删除全部</button>
            <button class="px-4 py-2 w-40 rounded-md bg-red-700  text-white shadow-lg hover:bg-green-500 hover:shadow-none" @click="search">查询</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'search',
  props: {
    fileIn: Boolean,
  },
  data() {
    return {
        fileList: [],
        acceptType: ['jpg', 'png'],
    }
  },
  watch: {
    fileList(newList, oldList){
      console.log(newList.length, oldList.length);
      this.$emit('dropCheck', newList.length);
    }
  },
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
    search() {
        console.log('!!!');
    },
    deleteAll() {
      this.fileList = [];
    },
  }
}
</script>

<style>

</style>