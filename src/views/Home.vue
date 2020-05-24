<template>
  <div class="ebook">
    <title-bar :isShowTitleAndMenu="isShowTitleAndMenu"></title-bar>
    <div class="read-wrapper">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="changePage(0)"></div>
        <div class="center" @click="toogleShowTitleAndMenu"></div>
        <div class="right" @click="changePage(1)"></div>
      </div>
    </div>
    <menu-bar
      :isShowTitleAndMenu="isShowTitleAndMenu"
      :defaultFontSize="defaultFontSize"
      :fontSizeList="fontSizeList"
      @changeFontSize="changeFontSize($event)"
      :themeList="themeList"
      :defaultTheme="defaultTheme"
      @selectTheme="selectTheme($event)"
      :progress="progress"
      :bookAvailable="bookAvailable"
      @setProgress="setProgress($event)"
      :locations="locations"
      :navigation="navigation"
      @jumpTo="jumpTo($event)"
      ref="menuBar"
    ></menu-bar>
  </div>
</template>

<script>
// @ is an alias to /src
import Epub from "epubjs";
//引入组件
import MenuBar from "@/components/MenuBar.vue";
import TitleBar from "@/components/TitleBar.vue";

const DOWNLOAD_URL = "/2018_Book_AgileProcessesInSoftwareEngine.epub";
global.ePub = Epub;

export default {
  name: "Home",
  components: { MenuBar, TitleBar },
  data() {
    return {
      isShowTitleAndMenu: false,
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 }
      ],
      defaultFontSize: 16,
      themeList: [
        {
          name: "default",
          style: {
            body: {
              color: "#000",
              background: "#fff"
            }
          }
        },
        {
          name: "eye",
          style: {
            body: {
              color: "#000",
              background: "#ceeaba"
            }
          }
        },
        {
          name: "night",
          style: {
            body: {
              color: "#fff",
              background: "#000"
            }
          }
        },
        {
          name: "glod",
          style: {
            body: {
              color: "#000",
              background: "rgb(241,236,226)"
            }
          }
        }
      ],
      defaultTheme: 0,
      progress: 0,
      bookAvailable: false,
      locations:{},
      navigation:{}
    };
  },
  methods: {
    initEpub() {
      this.book = new Epub(DOWNLOAD_URL, {
        width: "100%",
        height: "100%"
      });
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight
      });
      //渲染电子书
      this.rendition.display();
      //获取theme对象
      this.themes = this.rendition.themes;
      //设置默认字体
      this.themes.fontSize(this.defaultFontSize + "px");
      //注册主题
      this.registerTheme();
      //选择主题
      this.setTheme(this.defaultTheme);
      this.book.ready
        .then(() => {
          this.navigation = this.book.navigation;
          return this.book.locations.generate();
        })
        .then(result => {
          this.locations = this.book.locations;
          this.bookAvailable = true;
        });
    },
    registerTheme() {
      console.log(this.themeList);
      for (let i in this.themeList) {
        let theme = this.themeList[i];
        this.themes.register(theme.name, theme.style);
      }
    },
    setTheme(index) {
      this.themes.select(this.themeList[index].name);
    },
    //点击center  title menu  显示隐藏
    toogleShowTitleAndMenu() {
      this.isShowTitleAndMenu = !this.isShowTitleAndMenu;
    },
    //翻页
    changePage(flag) {
      if (!this.rendition) {
        return;
      }
      if (!flag) {
        this.rendition.prev();
      } else {
        this.rendition.next();
      }
      this.getCurProgress();
    },
    //接收子组件更改的字号
    changeFontSize(fontSize) {
      this.defaultFontSize = fontSize;
      this.themes.fontSize(this.defaultFontSize + "px");
    },
    //接收子组件的theme
    selectTheme(themeIndex) {
      this.defaultTheme = themeIndex;
      this.setTheme(this.defaultTheme);
    },
    //接收子progress
    setProgress(val) {
      const _progress = val / 100;
      const locations =
        _progress > 0 ? this.locations.cfiFromPercentage(_progress) : 0;
      this.rendition.display(locations);
      this.progress = val;
    },
    // 翻页时获取当前进度
    getCurProgress() {
      if (this.locations.length) {
        const currentLocation = this.rendition.currentLocation();
        if (currentLocation.start.cfi) {
          const proRange = this.locations.percentageFromCfi(
            currentLocation.start.cfi
          );
          this.progress = Math.round(proRange * 100);
          console.log(this.progress);
        }
      }
    },
    jumpTo(href){
      this.rendition.display(href);
      setTimeout(()=>{
        this.getCurProgress();
      },300)
      this.$refs.menuBar.menuShow = false;
    }
  },
  mounted() {
    this.initEpub();
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/global.scss";
.ebook {
  height: 100%;
  .read-wrapper {
    height: 100%;
    #read {
      height: 100%;
      width: 100%;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 100%;
      display: flex;
      .left {
        flex: 0 0 px2rem(100);
      }
      .center {
        flex: 1;
      }
      .right {
        flex: 0 0 px2rem(100);
      }
    }
  }
}
</style>
