import Vue from 'vue'
import Vuex from 'vuex'
import {DATAINFO, APP} from '@/common/const';
import {lunaToast} from '@/components/luna'
import EventBus from '@/eventBus/';

Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        notebookList : [],
        currentNote : {},
        currentLanguage : "",
        currentParagraphList : [],
        isCurrentParagraphLoading : false,
        activateParagraph : [],
        activateParagraphText : "",
        activateParagraphResult : [],
        paragraphInputCodeMirrorInstance : {},
        paragraphInputCodeMirrorDom : {},
        paragraphsRun : {
            cnt : 0,
            status : '',
            isRun : false,
            available : true
        }
    },
    getters : {
        isNoteSelected(state) {
            //initial paragraphs list control
            state.paragraphsRun.cnt = 0;
            state.paragraphsRun.status = 'PENDING';
            state.paragraphsRun.isRun = false;
            EventBus.$emit("initCheck", false);
            return Object.keys(state.currentNote).length > 0;
        },
        isCurrentParagraphsListExist(state) {
            return state.currentParagraphList.length > 0
        }
    },
    mutations : {
        setNotebookList(state, list) {
            console.log("set all Notebook List\n", list);
            state.notebookList = list;
        },
        setCurrentNote(state, note = {}) {
            console.log("set current Note\n", note);
            state.currentNote = note;
            
            //after set current note process
            const paragraphInputDom = document.getElementsByClassName("paragraphInput")[0];
            
            if ((Object.keys(note).length > 0) && state.paragraphInputCodeMirrorInstance) {
                state.paragraphInputCodeMirrorInstance.setValue("", true);
                state.paragraphInputCodeMirrorInstance.setOption("readOnly", false);
                paragraphInputDom.classList.remove("readOnly");
            }
            else if ((Object.keys(note).length === 0) && state.paragraphInputCodeMirrorInstance) {
                state.paragraphInputCodeMirrorInstance.setValue("", true);
                state.paragraphInputCodeMirrorInstance.setOption("readOnly", true);
                paragraphInputDom.classList.add("readOnly");
                //clear current paragraph list
                this.commit("setCurrentParagraphList", [])
            }
        },
        setCurrentLanguage(state, language) {
            console.log("set current Language : ", language);
            state.currentLanguage = language;
        },
        setCurrentParagraphList(state, list = []) {
            console.log("set current paragraph List\n", list);
            state.currentParagraphList = list;
        },
        clearCurrentParagraphList(state) {
            state.currentParagraphList = [];
        },
        setActivateParagraphText(state, data) {
            console.log("set activated paragraph Text\n", data);
            state.activateParagraphText = data;
        },
        setActivateParagraphResult(state, data) {
            console.log("set activated paragraph Result\n", data);
            state.activateParagraphResult = data;
        },
        setParagraphListScrollTop(state, data) {
            const paragraphList = document.getElementsByClassName("paragraphListWrap")[0];
            paragraphList.scrollTop = paragraphList.scrollHeight;
        },
        setParagraphInputInstance(state, data) {
            console.log("set paragraph input codeMirror instance");
            state.paragraphInputCodeMirrorInstance = data;
        },
        setParagraphsRunProgressCnt(state, value) {
            state.paragraphsRun.cnt = value;
        },
        setParagraphsRun(state, value) {
            state.paragraphsRun.isRun = value;
        },
        setParagraphsRunStatus(state, value) {
            state.paragraphsRun.status = value;
        }
    },
    actions : {
        getNotebookInfo(context, callbackFunc) {
            //get note specific data from
            console.log("get paragraph list");
            const {id, notebookName} = this.state.currentNote;
            if (!id) {
                context.state.isCurrentParagraphLoading = false;
                lunaToast.error('current notebook id is not defined');
                throw 'current notebook id is not defined'
            }
            else {
                //get paragraph list data
                fetch(`${APP.BASE_URL}ai/notebook/${id}.lean`, {
                    method : 'GET',
                    headers : new Headers({
                        "Content-Type" : 'application/json;charset=UTF-8',
                    }),
                    // mode: 'cors'
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else {
                        context.state.isCurrentParagraphLoading = false;
                        throw "get paragraph list fail"
                    }
                })
                .then(data => {
                    context.state.isCurrentParagraphLoading = false;
                    context.commit('setCurrentParagraphList', data.body.paragraphs);
                    context.commit('setCurrentLanguage', data.body.language);
                })
                .then(() => {
                    if (callbackFunc && typeof callbackFunc === 'function') {
                        // console.log("do after set paragraph List");
                        callbackFunc();
                    }
                })
                .catch((e) => {
                    context.state.isCurrentParagraphLoading = false;
                    console.error(e);
                    lunaToast.error(e);
                });
            }
            
        },
        getNotebookList(context) {
            console.log("get notebook list");
            return fetch(`${APP.BASE_URL}ai/notebook.lean`, {
                method : "GET",
                headers : new Headers({
                    // 'Access-Control-Allow-Origin': '*',
                    "Content-Type" : 'application/json;charset=UTF-8',
                }),
                // mode: "cors"
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw "get notebook list fail"
                }
            })
            .then((data) => {
                context.commit('setNotebookList', data.body);
                return data;
            })
            .catch((e) => {
                console.error(e);
                lunaToast.error(e);
            })
        }
    }
})
