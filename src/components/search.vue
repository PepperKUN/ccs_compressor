<template>
    <div :class="[fileIn?'expand':'h-9', 'file_list', 'flex-grow-0', 'relative', 'transition-all', 'duration-300', 'ease-out', 'flex', 'flex-col']" @dragover="allowDrop" @drop="fileDrop">
        <div class="add absolute z-20 shadow-md -top-6 transform -translate-x-1/2 left-1/2 cursor-pointer p-3 rounded-full bg-white" @click="addPic" v-if="!fileIn">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-add"></use>
            </svg>
        </div>
        <div class="feather_bg absolute top-0 w-1/3 h-40 transform -translate-x-1/2 left-1/2 z-0 flex-none light_three"></div>
            <ul class="relative z-10 bg-white rounded-t-md min-h-3 shadow-md flex-shrink flex-grow overflow-auto px-6 py-3 divide-y divide-gray-200 scrollbar scrollbar-w-2 scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full">
                <li v-for="item in fileList" :key="item.id" class="file_list">
                    <div class="flex py-3 cursor-pointer" @click="subMenu(item)">
                        <h6 class="text-base text-gray-800">{{item.name}}</h6>
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
        excelData: [
            {
                "ccs": "c1.ccs",
                "csd": "b1.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a2,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a3,png"
            },
            {
                "ccs": "",
                "csd": "b2.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a2,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a3,png"
            },
            {
                "ccs": "",
                "csd": "b3.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "b12.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a2,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a3,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a4,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a5,png"
            },
            {
                "ccs": "c2.ccs",
                "csd": "b4.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a4,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a5,png"
            },
            {
                "ccs": "",
                "csd": "b6.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a2,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a4,png"
            },
            {
                "ccs": "",
                "csd": "b8.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a4,png"
            },
            {
                "ccs": "",
                "csd": "b13.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a3,png"
            },
            {
                "ccs": "",
                "csd": "b14.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a2,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a3,png"
            },
            {
                "ccs": "c3.ccs",
                "csd": "b5.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a2,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a3,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a4,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a5,png"
            },
            {
                "ccs": "",
                "csd": "b9.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a3,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a4,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a5,png"
            },
            {
                "ccs": "",
                "csd": "b15.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a2,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a3,png"
            },
            {
                "ccs": "c4.ccs",
                "csd": "b7.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a2,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a4,png"
            },
            {
                "ccs": "c6.ccs",
                "csd": "b11.csd",
                "pic": "a1.png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a3,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a4,png"
            },
            {
                "ccs": "",
                "csd": "",
                "pic": "a5,png"
            }
        ],
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
      const tempData = JSON.stringify(this.excelData)
      // console.log(tempData);
    //   window.ipcRenderer.send('excel', tempData);
      window.ipcRenderer.send('search', tempData);
      console.log('!!!');
    },
    deleteAll() {
      this.fileList = [];
    },
    addPic() {
        let tempList = JSON.parse(JSON.stringify(this.fileList));
        tempList.push({
                  name: 'default.png',
                  path: null,
                  stats: 'ready',
                  des: 'ready to compress',
                  operate: false,
              });
        this.fileList = tempList;
    },
    subMenu(el) {
        this.fileList.forEach(Element => {
            if(Element !== el)Element.operate = false;
        })
        el.operate = !el.operate;
    },
    deleteItem(el) {
      const idx = this.fileList.findIndex(data => data.path===el.path);
      let tempArray = JSON.parse(JSON.stringify(this.fileList));
      tempArray.splice(idx, 1);
      this.fileList = tempArray;
    },
  }
}
</script>

<style>

</style>