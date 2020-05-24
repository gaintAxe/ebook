const book ={
    state: {
        test:1
      },
      mutations: {
        'SET_TEST':(state,newTest)=>{
          state.test=newTest
        }
      },
      actions: {
        setTest:({commit,state},newT)=>{
          // console.log(state.test,newT)
          //返回promise
          return commit('SET_TEST',newT)
        }
      }
}
export default book;