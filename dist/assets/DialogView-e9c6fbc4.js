import{d as x,b as s,c as d,f as t,i as u,t as n,e as _,q as k,_ as D,D as $,r as i,o as p,F as w,G as L,h as f,H as j,z as O,u as V,l as B,a as R,m as S,I as W}from"./index-98139807.js";const q={class:"card-body"},z={class:"card bg-light"},F={class:"card-header border-bottom-0"},H=t("b",null,"dialog_node",-1),M=t("b",null,"Tipo: ",-1),T=t("b",null,"Condiciones:",-1),A={class:"card-body"},E={class:"card-text"},G={key:0},I=t("b",null,"Respuestas:",-1),P=t("b",null,"Anterior: ",-1),J=t("b",null,"Siguiente: ",-1),K={key:1},Q=t("h6",{class:"mt-3"},"Listado hijos condicional",-1),U={key:2},X=t("h6",{class:"mt-3"},"Listado hijos",-1),Y={key:3},Z=t("h6",{class:"mt-3"},"Listado slots hijos",-1),ee=x({__name:"NodeComponent",props:{node:{type:Object,default:()=>({})},nodes:{type:Object,default:()=>({})}},setup(e){return(v,c)=>{var a,o;return s(),d("div",q,[t("div",z,[t("div",F,[t("div",null,[H,u(": "+n(e.node.dialog_node),1)]),t("div",null,[M,u(n(e.node.type),1)]),t("div",null,[T,u(" "+n(e.node.conditions),1)]),t("h5",null,[t("b",null,n(e.node.title),1)])]),t("div",A,[t("p",E,[t("div",null,n(e.node),1),e.node.output?(s(),d("div",G,[I,u(" "+n((o=(a=e.node)==null?void 0:a.output)==null?void 0:o.generic),1)])):_("v-if",!0),t("div",null,[P,u("dialog_node: "+n(e.node.previous_sibling),1)]),t("div",null,[J,u("dialog_node: "+n(e.node.next_sibling),1)]),e.node.first_response_condition_child?(s(),d("div",K,[Q,k(b,{firstNode:e.nodes[e.node.first_response_condition_child],nodes:e.nodes},null,8,["firstNode","nodes"])])):_("v-if",!0),e.node.first_child?(s(),d("div",U,[X,k(b,{firstNode:e.nodes[e.node.first_child],nodes:e.nodes},null,8,["firstNode","nodes"])])):_("v-if",!0),e.node.first_slot_child?(s(),d("div",Y,[Z,k(b,{firstNode:e.nodes[e.node.first_slot_child],nodes:e.nodes},null,8,["firstNode","nodes"])])):_("v-if",!0)])])])])}}}),te=D(ee,[["__file","D:/programming/Work/Databot/databot_ia_frontend/src/components/NodeComponent.vue"]]),oe={class:"card-body"},se={class:"card bg-light"},ne=x({__name:"ListNodesComponent",props:{nodes:{type:Object,default:()=>({})},firstNode:{type:Object,default:()=>({})}},setup(e){const v=e,{nodes:c,firstNode:a}=$(v);let o=i([]);p(()=>{o.value.push(a.value),r(a.value.next_sibling)});function r(l){l&&(o.value.push(c.value[l]),r(c.value[l].next_sibling))}return(l,g)=>(s(),d("div",oe,[t("div",se,[(s(!0),d(w,null,L(f(o),h=>(s(),j(te,{node:h,nodes:f(c),key:h.dialog_node},null,8,["node","nodes"]))),128))])]))}}),b=D(ne,[["__file","D:/programming/Work/Databot/databot_ia_frontend/src/components/ListNodesComponent.vue"]]),ie={class:"col-12"},de={class:"card box-margin"},ae=x({__name:"DialogView",setup(e){O("$formatDate");const v=V(),c=B();R();let a=i({}),o=i({}),r=i(null);i([]),i(!1),i(!1);const l=i(0),g=S(()=>c.query.assistant_id);p(()=>{h()});async function h(){a.value=await v.dispatch("assistantsModule/listOne",g.value),o.value=(await W.getNodesHandler(g.value)).data.payload,C(o),l.value+=1}function C(m){for(const N in m.value)if(Object.prototype.hasOwnProperty.call(m.value,N)){const y=m.value[N];!y.previous_sibling&&!y.parent&&(r.value=y)}}return(m,N)=>(s(),d("div",{class:"row",key:l.value},[t("div",ie,[t("div",de,[f(r)?(s(),j(b,{key:0,firstNode:f(r),nodes:f(o)},null,8,["firstNode","nodes"])):_("v-if",!0)])])]))}}),ce=D(ae,[["__file","D:/programming/Work/Databot/databot_ia_frontend/src/views/DialogView.vue"]]);export{ce as default};
