import{d as p,f as m,g as f,r as d,h as v,o as h,a as g,b as s,w as i,v as u,i as _}from"./index-DHr_EMP0.js";const b={class:"login-area"},w={class:"main-content- h-100vh"},y={class:"container h-100"},k={class:"row h-100 align-items-center justify-content-center"},x={class:"col-md-8 col-lg-5"},E={class:"middle-box"},M={class:"card"},B={class:"card-body p-4"},L={class:"form-group"},V={class:"form-group"},K=p({__name:"AppLogin",setup(q){const a=m(),l=f(),c=d(!1),e=d({email:"",password:""});v(()=>{a.state.authModule.isTokenSet&&l.push({name:"dashboard"})});function n(){a.dispatch("authModule/login",e.value).then(()=>{l.push({name:"dashboard"})}).catch(r=>{console.log("error en login: ",r)}).finally(()=>c.value=!1)}return(r,o)=>(h(),g("div",b,[s("div",w,[s("div",y,[s("div",k,[s("div",x,[s("div",E,[s("div",M,[s("div",B,[o[5]||(o[5]=s("h4",{class:"font-24 mb-1"},"Login.",-1)),s("div",null,[s("div",L,[o[2]||(o[2]=s("label",{class:"float-left",for:"emailaddress"},"Email",-1)),i(s("input",{class:"form-control",type:"email",id:"emailaddress","onUpdate:modelValue":o[0]||(o[0]=t=>e.value.email=t),requiredplaceholder:"Enter your email"},null,512),[[u,e.value.email]])]),s("div",V,[o[3]||(o[3]=s("a",{href:"forget-password.html",class:"text-dark float-right"},null,-1)),o[4]||(o[4]=s("label",{class:"float-left",for:"password"},"Password",-1)),i(s("input",{onKeyup:_(n,["enter"]),"onUpdate:modelValue":o[1]||(o[1]=t=>e.value.password=t),class:"form-control",type:"password",requiredid:"password",placeholder:"Enter your password"},null,544),[[u,e.value.password]])]),s("div",{class:"form-group mb-0"},[s("button",{class:"btn btn-primary btn-block",type:"submit",onClick:n}," Log In ")])])])])])])])])])]))}});export{K as default};
