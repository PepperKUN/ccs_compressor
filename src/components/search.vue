<template>
    <div :class="[fileIn?'expand':'h-9', 'file_list', 'flex-grow-0', 'relative', 'transition-all', 'duration-300', 'ease-out', 'flex', 'flex-col']" @dragover="allowDrop" @drop="fileDrop">
        <div class="add absolute z-20 shadow-md -top-6 transform -translate-x-1/2 left-1/2 cursor-pointer p-3 rounded-full bg-white" @click="addPic" v-if="!fileIn">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-add"></use>
            </svg>
        </div>
        <div class="feather_bg absolute top-0 w-1/3 h-40 transform -translate-x-1/2 left-1/2 z-0 flex-none light_three"></div>
        <div class="tips w-full h-full absolute z-20" v-show="fileList.length === 0&&fileIn">
            <img class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 opacity-20" style="user-drag:none" src="../assets/placeholder.png" >
        </div>
        <ul class="relative z-10 bg-white rounded-t-md min-h-3 shadow-md flex-shrink flex-grow overflow-auto px-6 py-3 divide-y divide-gray-200 scrollbar scrollbar-w-2 scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full">
            <li v-for="(item, index) in fileList" :key="index" class="file_list_line">
                <div class="flex py-3">
                    <div class="flex-1 overflow-hidden flex-grow" :ref="setItemRef">
                        <h6 class="text-base text-gray-800 overflow-ellipsis overflow-hidden w-full" :title="item.name" @click="dbClick(item, index)" v-if="!item.editable">{{item.name}}</h6>
                        <input class="w-full outline-none" type="text" v-model="fileList[index].name" v-else @blur="inputComplete(item, index)" @keyup.enter="item.editable = false" @keypress.tab.prevent @keyup.tab="editLoop(item, index)" @keydown.tab.prevent>
                    </div>
                    <div class="stats hidden flex-none items-center" v-if="!item.editable">
                        <svg class="icon text-2xl cursor-pointer" aria-hidden="true" title="delete it" @click="deleteItem(item)">
                            <use xlink:href="#icon-delete"></use>
                        </svg>
                    </div>
                </div>
            </li>
            <li class=" text-center" v-if="fileList.length>0">
                <div class="listAdd p-3 my-2 cursor-pointer rounded-md hover:bg-gray-100" @click="addPic" title="Add">
                    <svg class="icon m-auto" aria-hidden="true">
                        <use xlink:href="#icon-add"></use>
                    </svg>
                </div>
            </li>
        </ul>
        <div class="flex-grow-0 bg-white relative z-10 p-4 flex items-center justify-center gap-2">
            <button class="px-2 py-2 w-40 rounded-md bg-red-600 text-white shadow-lg hover:bg-red-500 hover:shadow-none" @click="deleteAll" v-show="fileList.length>0">删除全部</button>
            <button class="px-4 py-2 w-40 rounded-md bg-purple-800  text-white shadow-lg hover:bg-purple-600 hover:shadow-none" @click="search">查询</button>
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
        timer: null,
        delay: 300,
        itemRefs: [],
    }
  },
  watch: {
    fileList(newList, oldList){
      console.log(newList.length, oldList.length);
      this.$emit('dropCheck', newList.length);
    }
  },
  methods: {
    dbClick(target,idx){
        if(target.clicks === 0){
            clearTimeout(this.timer)
        }
        target.clicks++ 
        if(target.clicks === 1) {
        this.timer = setTimeout(function() {
            target.clicks = 0
        }, this.delay);
        } else{
            clearTimeout(this.timer);  
            target.editable = true;
            target.clicks = 0;
            this.$nextTick(()=>{
                const targetInput = this.itemRefs[idx].childNodes[0]
                targetInput.focus();
                targetInput.select();
            })
            
        }
    },
    inputComplete(target, idx) {
        if(target.name.length<1){
            const tempList = JSON.parse(JSON.stringify(this.fileList));
            tempList.splice(idx, 1);
            this.fileList = tempList;
        }else{
            target.editable = false;
        }
    },
    editLoop(target, idx){
        console.log(1);
        if(idx < this.fileList.length-1){
            target.editable = false;
            this.fileList[idx+1].editable = true;
            this.$nextTick(() => {
                const targetInput = this.itemRefs[idx+1].childNodes[0]
                targetInput.focus();
                targetInput.select();
            })
        }else{
            target.editable = false;
        }
    },
    setItemRef(el) {
      this.itemRefs.push(el)
    },
    fileDrop(event){
        event.preventDefault();
        event.stopPropagation();
         Array.from(event.dataTransfer.files).forEach(f => {
            const rawList = f.name.split('.');
            if(!this.fileList.find(Element => Element.path === f.path)&&this.acceptType.includes(rawList[rawList.length - 1].toLowerCase())){
              this.fileList.push({
                  name: f.name,
                  clicks: 0,
                  editable: false,
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
                  clicks: 0,
                  editable: true,
              });
        this.fileList = tempList;
        this.$nextTick(()=>{
            const targetInput = this.itemRefs[this.itemRefs.length-1].childNodes[0]
            targetInput.focus();
            targetInput.select();
        })
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
  },
  beforeUpdate() {
    this.itemRefs = []
  },
}
</script>

<style scoped>
    .file_list_line:hover .stats{
        display: flex;
    }
    ::selection {
    color: #fff;
    background: #5924b2;
    }
</style>