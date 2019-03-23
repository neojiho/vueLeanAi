import Vue from 'vue'
import App from './App.vue'
import router from './routes/'
import store from './store/'
import {DATAINFO, APP} from '@/common/const';

//global component
import VueDraggable from 'vue-draggable'

//vender style
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

//luna style
import './assets/styles/pe-icons/pe-icon-7-stroke.css';
import './assets/styles/pe-icons/helper.css';
import './assets/styles/stroke-icons/style.css';
import './assets/styles/style.css';

//luna font
// import 'roboto-npm-webfont';

//custom style
import './assets/styles/custom.css';

//jQuery related
import $ from 'jquery';

//global component use
Vue.use(VueDraggable);

Vue.config.productionTip = false;

const deferred = new Promise(async(resolve, reject)=>{
    //login

    // const formData = new FormData();
    // formData.append("id", "admin");
    // formData.append("password", "admin");

    const data = JSON.stringify({
        id: "admin",
        password: "admin"
    });
    // console.log(data);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");

    // await $.ajax({
    //     type: "POST",
    //     url: `${APP.BASE_URL}login`,
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Accept": "*/*"
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     data: data,
    //     success: function (json) {
    //         console.log(json);
    //         resolve();
    //     }
    // });

    // await $.ajax(`${APP.BASE_URL}login`, {
    //     method: "POST",
    //     headers: headers,
    //     body: data,
    //     // body: formData,
    //     // mode: "no-cors"
    // })
    //     .then((response) => {
    //         console.warn(response);
    //         console.warn(response.body);
    //         resolve();
    //     })
    //     .catch((e) => {
    //         reject();
    //         console.error(e);
    //     })
    resolve();
});

deferred.then(()=>{
    new Vue({
        router,
        store,
        render: h => h(App),
        beforeCreate(){
        },
        created() {
            $.prototype.toggleBox = function (customOption) {
                //extend option
                const option = Object.assign({}, {
                    //default option
                    direction: 'horizontal', //"vertical"
                    title: 'toggle'
                }, customOption);

                this.each((idx, el) => {

                    //Box wrap DOM
                    const boxWrapClassList = el.classList;
                    boxWrapClassList.add("toggleWrap");

                    //button DOM create
                    const btnArea = document.createElement("div"),
                        btn = document.createElement("span"),
                        icon = document.createElement("i");

                    btnArea.classList.add("toggleBtnArea");
                    btn.classList.add("toggleBtn");
                    btn.setAttribute("title", option.title);
                    icon.classList.add("fa");
                    boxWrapClassList.contains("toggleCollapse") ? icon.classList.add("fa-caret-right") : icon.classList.add("fa-caret-left");

                    //assemble
                    btn.appendChild(icon);
                    btnArea.appendChild(btn);
                    el.appendChild(btnArea);

                    //add event
                    btn.addEventListener("click", function () {
                        boxWrapClassList.toggle("toggleCollapse");
                        if (boxWrapClassList.contains("toggleCollapse")) {
                            icon.classList.remove("fa-caret-left");
                            icon.classList.add("fa-caret-right");
                        }
                        else {
                            icon.classList.remove("fa-caret-right");
                            icon.classList.add("fa-caret-left");
                        }
                    })
                });
                return this;
            };
        },
        mounted() {
            //toggle box
            $(".noteArea").toggleBox({title: "note area toggle"});
            // $(".paragraphArea").toggleBox({title:"paragraph area toggle"});
            $(".resultArea").toggleBox({title: "result area toggle"});

        }
    }).$mount('#app');
});
