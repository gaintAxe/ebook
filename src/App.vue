<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view />
  </div>
</template>
<script>
import store from './store/index'
import {mapGetters} from 'vuex'
function fn(args,store){
  console.log('fn',store)
  let obj = {};
  let getfun = (data)=>{
    return ()=>{
      return data
    }
  }
  for(let i in args){
    let index = args[i]
    if(store.getters[index]){
      obj[index] = getfun(store.getters[index])
    }
    
  }
  return obj;
}
export default {
  computed:{
    // ...mapGetters(['book'])
    ...fn(['book'])
  },
  mounted(){
    this.$store.dispatch('setTest',10).then(()=>{
      console.log(this.$store.state.book.test);
      console.log(this.$store.getters.book,this.book)
    })
    
  }
};
document.addEventListener("DOMContentLoaded", () => {
  const html = document.querySelector("html");
  let fontSize = window.innerWidth / 10;
  fontSize = fontSize > 50 ? 50 : fontSize;
  html.style.fontSize = fontSize + "px";
});
</script>
<style>
#app {
  height: 100%;
  width: 100%;
  font-size: 1rem;
}
</style>
