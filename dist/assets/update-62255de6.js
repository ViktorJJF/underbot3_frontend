import{d as x,m as y,u as w,b as h,r as s,e as g,s as C,f as u,o as D,c as k,h as d,i as t,w as n,v as o,x as B,_ as T}from"./index-7e64b160.js";import{D as M}from"./Documents-06d8f6ce.js";const N={class:"row"},U={class:"col-12"},z={class:"card box-margin"},E={class:"card-body"},I=d("h3",null,"Editar documento",-1),R=x({__name:"update",setup($){const m=y(),p=w();h();let e=s(M()),i=s(!1);s(-1),s(!1);const _=g(()=>p.params.document_id);C(()=>{f()});async function f(){e.value=await m.dispatch("documentsModule/listOne",_.value)}async function v(){i.value=!0;try{await m.dispatch("documentsModule/update",{id:_.value,data:e.value}),close()}finally{i.value=!1}}return(j,a)=>{const c=u("el-input"),r=u("el-form-item"),b=u("el-button"),V=u("el-form");return D(),k("div",N,[d("div",U,[d("div",z,[d("div",E,[I,t(V,{"label-position":"top","label-width":"100px"},{default:n(()=>[t(r,{label:"Título"},{default:n(()=>[t(c,{modelValue:o(e).title,"onUpdate:modelValue":a[0]||(a[0]=l=>o(e).title=l)},null,8,["modelValue"])]),_:1}),t(r,{label:"Tipo"},{default:n(()=>[t(c,{modelValue:o(e).type,"onUpdate:modelValue":a[1]||(a[1]=l=>o(e).type=l)},null,8,["modelValue"])]),_:1}),t(r,{label:"Contenido"},{default:n(()=>[t(c,{type:"textarea",autosize:"",modelValue:o(e).content,"onUpdate:modelValue":a[2]||(a[2]=l=>o(e).content=l)},null,8,["modelValue"])]),_:1}),t(b,{type:"success",onClick:v,loading:o(i)},{default:n(()=>[B(" Guardar ")]),_:1},8,["loading"])]),_:1})])])])])}}}),P=T(R,[["__file","D:/Programacion/Trabajo/Databot/vue3_ts_skeleton/src/views/Documents/update.vue"]]);export{P as default};