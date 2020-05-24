<template>
  <div class="menu-bar">
    <!-- 菜单栏 -->
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        v-show="isShowTitleAndMenu"
        :class="{'no-box-shadow':isNoBoxShaDow}"
      >
        <div class="icon-wrapper" @click="openSetting(1)">
          <span class="icon-menu icon"></span>
        </div>
        <div class="icon-wrapper" @click="openSetting(2)">
          <span class="icon-progress icon"></span>
        </div>
        <div class="icon-wrapper" @click="openSetting(3)">
          <span class="icon-bright icon"></span>
        </div>
        <div class="icon-wrapper" @click="openSetting(4)">
          <span class="icon-a icon">A</span>
        </div>
      </div>
    </transition>
    <!-- 菜单栏 -->
    <!-- 设置栏 -->
    <transition name="slide-up">
      <div class="setting-wrapper" v-show="isSettingShow">
        <!-- 4号字体设置 -->
        <div class="setting-font-size" v-show="settingType==4">
          <!-- A -->
          <div class="preview" :style="{fontSize:fontSizeFirst+'px'}">A</div>
          <div class="select">
            <div
              class="select-wrapper"
              v-for="(item,index) in fontSizeList"
              :key="index"
              @click="changeFontSize(item.fontSize)"
            >
              <!-- - -->
              <div class="line"></div>
              <!-- | -->
              <div class="point-wrapper">
                <div class="point" v-show="item.fontSize==defaultFontSize">
                  <div class="small-point"></div>
                </div>
              </div>
              <!-- - -->
              <div class="line"></div>
            </div>
          </div>
          <!-- A -->
          <div class="preview":style="{fontSize:fontSizeLast+'px'}">A</div>
        </div>
        <!-- 4号字体设置 -->
        <!-- 3号主题设置 -->
        <div class="setting-theme" v-show="settingType==3">
          <div
            class="setting-theme-item"
            v-for="(item,index) in themeList"
            :key="index"
            @click="selectTheme(index)"
          >
            <div class="preview">
              <div class="previewColor" :style="{'background':item.style.body.background}"></div>
            </div>
            <div class="text">{{item.name}}</div>
          </div>
        </div>
        <!-- 3号主题设置 -->
        <!-- 2号进度设置 -->
        <div class="setting-progress" v-show="settingType==2">
          <div class="progress-wrapper">
            <input
              type="range"
              class="progress"
              max="100"
              min="0"
              step="1"
              @change="onProgressChange($event.target.value)"
              @input="onProgressInput($event.target.value)"
              :value="progress"
              :disabled="!bookAvailable"
              ref="progress"
            />
          </div>
          <div class="text-wrapper">
            <span>{{bookAvailable? progress+'%':'加载中...'}}</span>
          </div>
        </div>
        <!--2号进度设置 -->
      </div>
    </transition>
    <!-- 设置栏 -->
    <!-- 目录 -->
    <transition name="fade">
      <div class="content-mask" v-show="menuShow" @click="menuShow = false">
        <div class="list-wrapper" v-show="locations.length" ref="wrapper">
          <div>
            <div class="toc-wrapper" v-for="(item,index) in navigation.toc" :key="index">
              <div class="item" @click="emitJumpTiTitle(item.href)">{{item.label||item}}</div>
            </div>
          </div>
        </div>
        <div class="loadings" v-show="!locations.length">loadings</div>
      </div>
    </transition>
    <!-- 目录 -->
  </div>
</template>

<script>
import BScroll from 'better-scroll';
export default {
  props: {
    isShowTitleAndMenu: Boolean,
    defaultFontSize: Number,
    fontSizeList: Array,
    themeList: Array,
    progress: [Number, String],
    bookAvailable: Boolean,
    locations:Object,
    navigation:Object
  },
  data() {
    return {
      isSettingShow: false,
      settingType: -1,
      isNoBoxShaDow: false,
      menuShow: false
    };
  },
  methods: {
    openSetting(type) {
      if (type == 1) {
        this.settingType = type;
        this.isSettingShow = false;
        this.menuShow = true;
      } else if (type == this.settingType && this.isSettingShow) {
        //关闭时且不是切换
        this.isSettingShow = false;
        //关闭时延迟300是menu上方box-shadow
      } else {
        if (type > 0) {
          this.settingType = type;
        }
        this.isSettingShow = true;
      }
    },
    changeFontSize(fontSize) {
      this.$emit("changeFontSize", fontSize);
    },
    selectTheme(themeIndex) {
      this.$emit("selectTheme", themeIndex);
    },
    onProgressChange(val) {
      //停下时触发
      this.$emit("setProgress", val);
    },
    onProgressInput(val) {
      //一直在变
      this.$refs.progress.style.backgroundSize = `${val}% 100%`;
    },
    emitJumpTiTitle(href){
      this.$emit('jumpTo',href)
    },

  },
  mounted(){
    this.$nextTick(()=>{
      this.scroll = new BScroll(this.$refs.wrapper,{
        click:true,tap:true
      })
    })
  },
  watch: {
    isSettingShow(val) {
      if (!val) {
        setTimeout(() => {
          this.isNoBoxShaDow = false;
        }, 300);
      } else {
        this.isNoBoxShaDow = true;
      }
    },
    isShowTitleAndMenu(val) {
      if (!val) {
        this.isSettingShow = false;
      }
    }
  },
  computed:{
    fontSizeFirst(){
      return this.fontSizeList[0].fontSize;
    },
    fontSizeLast(){
      return this.fontSizeList[this.fontSizeList.length-1].fontSize
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/global.scss";
.menu-bar {
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 110;
    width: 100%;
    height: px2rem(48);
    background: #fff;
    display: flex;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    &.no-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress,
      .icon-bright {
        font-size: px2rem(24);
      }
    }
  }
  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 101;
    width: 100%;
    height: px2rem(60);
    background: #fff;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    .setting-font-size {
      display: flex;
      height: 100%;
      .preview {
        flex: 0 0 px2rem(40);
        @include center;
      }
      .select {
        display: flex;
        flex: 1;
        .select-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          &:first-child {
            .line {
              &:first-child {
                border: none;
              }
            }
          }
          &:last-child {
            .line {
              &:last-child {
                border: none;
              }
            }
          }
          .line {
            flex: 1;
            height: 0;
            border-top: px2rem(1) solid #ccc;
          }
          .point-wrapper {
            flex: 0 0 0;
            position: relative;
            width: 0;
            height: px2rem(7);
            border-left: px2rem(1) solid #ccc;
            .point {
              position: absolute;
              top: px2rem(-6);
              left: px2rem(-10);
              width: px2rem(20);
              height: px2rem(20);
              border-radius: 50%;
              background: #fff;
              border: px2rem(1) solid #ccc;
              box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
              @include center .small-point {
                width: px2rem(5);
                height: px2rem(5);
                background: black;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
    .setting-theme {
      width: 100%;
      height: 100%;
      display: flex;
      .selected {
        color: #dcdcdc;
      }
      .setting-theme-item {
        flex: 1;
        display: flex;
        flex-direction: column;

        .preview {
          flex: 1;
          display: flex;
          padding: px2rem(4);
          .previewColor {
            flex: 1;
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
          }
        }
        .text {
          height: px2rem(25);
          font-size: px2rem(20);
          @include center;
        }
      }
    }
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .progress-wrapper {
        width: 100%;
        height: 70%;
        @include center;
        padding: 0 px2rem(30);
        box-sizing: border-box;
        .progress {
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
          background-size: 0 100%;
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            // 这个是中间的按钮
            //-webkit-appearance 阻止默认样式
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.15);
            border: px2rem(1) solid #ddd;
          }
        }
      }
      .text-wrapper {
        font-size: 14px;
        @include center;
      }
    }
  }
  .content-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.8);
    .list-wrapper {
      width: 70%;
      height: 100%;
      z-index: 130;
      background: #fff;
      overflow: hidden;
      .toc-wrapper {
        padding: px2rem(10);
        font-size: px2rem(18);
      }
    }
    .loadings {
      width: 70%;
      height: 100%;
      z-index: 130;
      background: #fff;
      overflow: hidden;
    }
  }
}
</style>
