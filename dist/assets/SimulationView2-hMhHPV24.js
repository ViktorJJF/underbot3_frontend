import{d as b,r as o,f as ee,c as q,z as ae,h as le,S as D,k as v,o as u,a as p,e,b as c,n as H,F as x,u as E,A as F,l as k,w as se,C as te,t as s,p as V,B as Q,q as oe,G as ne,E as ue}from"./index-1x2_oIEt.js";import{s as G}from"./index-gacbde3m.js";const ce={class:"container"},de={class:"row my-3"},ie={class:"col-sm-3"},re={class:"col-sm-3"},me=e("span",{class:""},"Desde",-1),he={class:"col-sm-3"},ve=e("span",{class:""},"Hasta",-1),pe={class:"col-sm-3"},_e=e("span",{class:""},"Ambos",-1),fe={class:"row"},ye=e("div",null,[e("h6")],-1),we={class:"row"},De={class:"col-sm-6"},Ve=e("h4",null,"Resultados simulación",-1),ge={class:"match-ended"},Be={class:"d-inline"},Ue=e("h6",{class:"d-inline"},"Winrate:",-1),xe=e("h6",{class:"d-inline"},"Dinero Apostado:",-1),Fe=e("h6",{class:"d-inline"},"Dinero Obtenido:",-1),ke=e("h6",{class:"d-inline"},"Ganancia neta:",-1),Ce=e("h6",{class:"d-inline"},"Beneficio:",-1),Se={class:"table"},$e=e("thead",null,[e("tr",null,[e("th",{scope:"col"},"#"),e("th",{scope:"col"},"Fecha"),e("th",{scope:"col"},"Match"),e("th",{scope:"col"},"Total"),e("th",{scope:"col"},"Bet"),e("th",{scope:"col"},"Cuarto"),e("th",{scope:"col"},"Apostado"),e("th",{scope:"col"},"Under Quota"),e("th",{scope:"col"},"Beneficio"),e("th",{scope:"col"},"Over Quota"),e("th",{scope:"col"},"Score"),e("th",{scope:"col"},"Cantidad de montañas"),e("th",{scope:"col"},"Diferencia ups/downs %"),e("th",{scope:"col"},"¿Primera apuesta?")])],-1),Me={scope:"row"},Ne=["href"],Qe=b({__name:"SimulationView2",setup(Te){const z=o([]),C=o(new Date(G(new Date,1))),S=o(new Date(G(new Date,1))),$=o(new Date("2023-10-26")),g=o(null),M=o(!1),f=o(0),B=o(0),O=o(0),I=o(0),d=o([]);o({});const i=o({wins:0,losses:0,winrate:0}),h=o({wins:0,losses:0,winrate:0}),P=o(0),r=o({fromQuarter:[!0,"c4","Evaluar desde","text"],untilQuarter:[!0,"c4","Evaluar hasta","text"],fromTime:[!0,12*60*1e3,"Desde (milisegundos) (Faltando 2 min para acabar c3) ","number"],untilTime:[!0,5*60*1e3,"Hasta (milisegundos) (Antes de llegar al minuto 5 de c4)","number"],minUnderPercent:[!1,80,"Mínimo porcentaje de Under","number"],hasUnderBeatOver:[!1,!1,"Under supera o iguala over","boolean"],minimalScoreDifference:[!1,8,"Mínima diferencia de score (pendiente) (NEW)","number"],minimalUpsDownsDifference:[!0,.1,"Mínima diferencia de Ups/Downs %","number"],hasInvertedCones:[!0,!0,"Evaluar gráfica en forma de montañas","boolean"],minimalDifferenceToNextBet:[!0,2,"Mínima diferencia para apostar de nuevo en mismo match","number"],moneyBet:[!0,333,"Dinero a apostar (Primera apuesta cebo)","number"],moneyNextBet:[!0,533,"Dinero a apostar (Siguientes apuestas)","number"],ignoreFirstBet:[!1,!0,"Ignorar primera apuesta","boolean"]}),N=ee(),L=q(()=>d.value),y=q(()=>r.value.ignoreFirstBet[0]&&r.value.ignoreFirstBet[1]?d.value.filter(t=>!t.isFirstBet):L.value);ae(r,()=>{clearTimeout(I.value),I.value=setTimeout(()=>{},500)},{deep:!0}),le(async()=>{await w()});async function w(){M.value=!0;const t={sort:"createdAt",order:"desc",dateFrom:C.value,dateTo:S.value,dateBoth:$.value};g.value&&(t.teamId=g.value);const l=await Promise.all([N.dispatch("matchesModule/simulator",t),N.dispatch("teamsModule/list",{sort:"name",order:"asc",league:"NBA"})]);z.value=l[0],d.value=[];for(const m of z.value)d.value.push(...m.bets.map(U=>({...U,match:m})));j(),M.value=!1}async function j(){R(),K(y.value),J()}function R(){i.value.wins=0,i.value.losses=0,h.value.wins=0,h.value.losses=0}function J(){r.value.moneyBet[1]=parseFloat(r.value.moneyBet[1]),r.value.moneyNextBet[1]=parseFloat(r.value.moneyNextBet[1]),f.value=y.value.reduce((t,l)=>t+parseFloat(l.money),0),B.value=D(d.value.reduce((t,l)=>((l.type==="U"&&l.value>l.match.scoresDetailed.home+l.match.scoresDetailed.away||l.type==="O"&&l.value<l.match.scoresDetailed.home+l.match.scoresDetailed.away)&&(t+=(l.underQuota||1.63)*parseFloat(l.money)),t),0)),O.value=D((B.value-f.value)/f.value)}function W(t){return t.type==="U"&&t.value>t.match.scoresDetailed.home+t.match.scoresDetailed.away||t.type==="O"&&t.value<t.match.scoresDetailed.home+t.match.scoresDetailed.away}function K(t){t.forEach((l,m)=>{l.type==="U"?l.value>l.match.scoresDetailed.home+l.match.scoresDetailed.away?(i.value.wins++,t[m].win=!0):(i.value.losses++,t[m].win=!1):l.value<l.match.scoresDetailed.home+l.match.scoresDetailed.away?h.value.wins++:h.value.losses++}),i.value.winrate=D(i.value.wins/y.value.length),h.value.winrate=D(h.value.wins/y.value.length),P.value=D((i.value.wins+h.value.wins)/y.value.length)}return(t,l)=>{const m=v("el-option"),U=v("el-select"),T=v("el-date-picker"),A=v("el-divider"),X=v("el-checkbox"),Y=v("el-switch"),Z=v("el-input");return u(),p("div",null,[e("div",ce,[e("div",de,[e("div",ie,[c(U,{modelValue:g.value,"onUpdate:modelValue":l[0]||(l[0]=a=>g.value=a),placeholder:"Filtrar equipo",onChange:w,clearable:""},{default:H(()=>[(u(!0),p(x,null,k(E(N).state.teamsModule.teams,(a,_)=>(u(),F(m,{key:_,label:a.name,value:a._id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),e("div",re,[me,c(T,{onChange:w,class:"mx-2",modelValue:C.value,"onUpdate:modelValue":l[1]||(l[1]=a=>C.value=a),type:"date",placeholder:"Desde",size:"large"},null,8,["modelValue"])]),e("div",he,[ve,c(T,{onChange:w,class:"mx-2",modelValue:S.value,"onUpdate:modelValue":l[2]||(l[2]=a=>S.value=a),type:"date",placeholder:"Hasta",size:"large"},null,8,["modelValue"])]),e("div",pe,[_e,c(T,{onChange:w,class:"mx-2",modelValue:$.value,"onUpdate:modelValue":l[3]||(l[3]=a=>$.value=a),type:"date",placeholder:"Ambos",size:"large"},null,8,["modelValue"])])]),c(A),e("div",fe,[(u(!0),p(x,null,k(r.value,(a,_)=>(u(),p("div",{key:_,class:"col-sm-6"},[c(X,{label:a[2],modelValue:a[0],"onUpdate:modelValue":n=>a[0]=n,size:"large"},null,8,["label","modelValue","onUpdate:modelValue"]),e("div",null,[typeof a[1]=="boolean"?(u(),F(Y,{key:0,class:"d-block mb-2",modelValue:a[1],"onUpdate:modelValue":n=>a[1]=n,"active-text":"Sí",disabled:!a[0],"inactive-text":"No"},null,8,["modelValue","onUpdate:modelValue","disabled"])):Q("",!0)]),a[3]=="number"?(u(),F(Z,{key:0,type:a[3],disabled:!a[0],modelValue:a[1],"onUpdate:modelValue":n=>a[1]=n},null,8,["type","disabled","modelValue","onUpdate:modelValue"])):Q("",!0),a[3]=="text"?(u(),F(U,{key:1,modelValue:a[1],"onUpdate:modelValue":n=>a[1]=n},{default:H(()=>[(u(),p(x,null,k(["c1","c2","c3","c4"],n=>c(m,{key:n,label:n,value:n},null,8,["label","value"])),64))]),_:2},1032,["modelValue","onUpdate:modelValue"])):Q("",!0)]))),128))]),ye,c(A),e("div",we,[e("div",De,[Ve,se(e("h5",ge,"(Calculando)",512),[[te,M.value]]),e("h6",Be,"Cantidad de apuestas: "+s(d.value.length),1),e("div",null,[Ue,V(" "+s(((P.value||0)*100).toFixed(2))+"% ("+s(i.value.wins)+"/"+s(d.value.length)+") ",1)]),e("div",null,[xe,V(" $ "+s(f.value),1)]),e("div",null,[Fe,V(" $ "+s(B.value),1)]),e("div",null,[ke,V(" $ "+s((B.value-f.value).toFixed(2)),1)]),e("div",null,[Ce,V(" "+s((O.value*100).toFixed(2))+"% ",1)])])]),c(A),e("table",Se,[$e,e("tbody",null,[(u(!0),p(x,null,k(d.value,(a,_)=>{var n;return u(),p("tr",{class:oe((n=a.match)!=null&&n.hasOvertime?"table-danger":""),key:_},[e("th",Me,s(_+1),1),e("td",null,s(E(ne)(a.match.createdAt)),1),e("td",null,[e("a",{href:`/matches/${a.match._id}`,target:"_blank"},s(`${a.match.teams[0].name} (${a.match.scoresDetailed.home}) - (${a.match.scoresDetailed.away}) ${a.match.teams[1].name}`),9,Ne)]),e("td",null,s(a.match.scoresDetailed.home+a.match.scoresDetailed.away),1),e("td",null,s(a.type)+" "+s(a.value)+" "+s(W(a)?"✅":"❌"),1),e("td",null,s(a.quarter)+" "+s(E(ue)(a.millis)),1),e("td",null,"S/. "+s(a.money),1),e("td",null,s(a.underQuota),1),e("td",null,s(W(a)?`- S/. ${(a.money*(a.underQuota-1)).toFixed(2)}`:`- ${a.money}`),1),e("td",null,s(a.overQuota),1),e("td",null,s(a.scoresDetailed?`${a.scoresDetailed.home} - ${a.scoresDetailed.away}`:"Sin scores"),1),e("td",null,s(a.invertedConesLength),1),e("td",null,s(a.isFirstBet?"Sí":"No"),1),e("td",null,s(a.match.externalId),1)],2)}),128))])])])])}}});export{Qe as default};