import{d as x,l as T,m as S,u as D,b as C,r as t,e as m,s as z,f as M,o as V,c as W,h as s,x as i,t as o,v as n,i as f,w as y,_ as $}from"./index-c643d5de.js";const j={class:"row"},B={class:"col-12"},E={class:"card box-margin"},F={class:"card-body"},N=s("b",null,"Asistente: ",-1),P=s("b",null,"assistant_id: ",-1),R={class:"row mt-3"},q={class:"col-sm-3"},A={class:"card"},L={class:"card-body"},O=s("h5",{class:"text-danger card-title"},"Tokens consumidos",-1),U={class:"text-center font-30 mb-0"},G={class:"d-flex justify-content-between mt-30"},H={class:""},I={class:""},J={class:"col-sm-3"},K={class:"card"},Q={class:"card-body"},X=s("h5",{class:"text-danger card-title"},"Total USD",-1),Y={class:"text-center font-30 mb-0"},Z=s("i",{class:"fa fa-money text-success mr-2 font-32"},null,-1),ss=x({__name:"Statistics",setup(ts){T("$formatDate");const c=S(),k=D();C();let e=t({});t({}),t(null),t([]);const r=t(!1),d=t(!1),b=t(0),_=t(0),u=t(0),l=m(()=>k.query.assistant_id),v=m(()=>_.value+u.value);z(()=>{h()});async function h(){e.value=await c.dispatch("assistantsModule/listOne",l.value);const a=await c.dispatch("llmTrackerModule/getTotalTokens",{by:"assistant",assistant_id:l.value});_.value=a.payload.prompt_tokens,u.value=a.payload.completion_tokens,b.value+=1}async function g(){try{r.value=!0,await c.dispatch("assistantsModule/train",l.value)}catch(a){console.error(a)}finally{r.value=!1}}async function w(){try{d.value=!0,await c.dispatch("assistantsModule/generateFromWatson",l.value),h()}catch(a){console.error(a)}finally{d.value=!1}}return(a,es)=>{const p=M("el-button");return V(),W("div",j,[s("div",B,[s("div",E,[s("div",F,[s("div",null,[N,i(o(n(e).name),1)]),s("div",null,[P,i(o(n(e).assistant_id),1)]),f(p,{disabled:!n(e).watson_skill_id||!n(e).watson_api_key,size:"large",type:"primary",color:"#5E00D9",onClick:w,loading:d.value},{default:y(()=>[i("Sincronizar con Watson "+o(!n(e).watson_skill_id||!n(e).watson_api_key?"(Faltan credenciales)":""),1)]),_:1},8,["disabled","loading"]),f(p,{size:"large",type:"primary",color:"#5E00D9",onClick:g,loading:r.value},{default:y(()=>[i("Train (Vectorizar)")]),_:1},8,["loading"]),s("div",R,[s("div",q,[s("div",A,[s("div",L,[O,s("h4",U,o(v.value),1),s("div",G,[s("p",H,"Prompt Tokens: "+o(_.value),1),s("p",I,"Completion Tokens: "+o(u.value),1)])])])]),s("div",J,[s("div",K,[s("div",Q,[X,s("h4",Y,[Z,i("$"+o((v.value/1e3*.002).toFixed(3)),1)])])])])])])])])])}}}),os=$(ss,[["__file","D:/Programacion/Trabajo/Databot/vue3_ts_skeleton/src/views/Statistics.vue"]]);export{os as default};