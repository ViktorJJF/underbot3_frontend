import{_ as i}from"./MatchGraph.vue_vue_type_script_setup_true_lang-c9W6FR1E.js";import{d as c,j as u,f as d,r,c as m,h as p,o as n,a as h,A as _,B as f,e as v,t as g,u as O}from"./index-1x2_oIEt.js";import"./installCanvasRenderer-FqoLGLL-.js";const w=c({__name:"MatchDetail",setup(b){const e=u(),o=d(),t=r([]),s=r({});m(()=>t.value.map(a=>({value:"",quarter:"",millis:"",date:"",underQuota:"",overQuota:"",scores:""}))),p(()=>{console.log("Ruta actual: ",e.params.id),l()});async function l(){const a=await Promise.all([o.dispatch("matchesModule/listOne",e.params.id),o.dispatch("bettingOddsModule/list",{matchId:e.params.id,type:"Principal",name:"Totales (incl. prórroga)"})]);s.value=await a[0],t.value=await a[1]}return(a,k)=>(n(),h("div",null,[Object.keys(s.value).length?(n(),_(i,{key:0,match:s.value,bettingOdds:t.value},null,8,["match","bettingOdds"])):f("",!0),v("h1",null,"detalles... "+g(O(e).params.id),1)]))}});export{w as default};