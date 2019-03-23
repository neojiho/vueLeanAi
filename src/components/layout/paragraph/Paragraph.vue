<template>
	<luna-panel ref="lunaPanel"
	            v-bind:class="[{ 'paragraphActive' : isActive }, statusChange(codeResultStatus)]"
	            v-bind:isRemoveable="isRemoveable"
	            v-bind:isExpandable="true"
	            v-bind:isToggle="isToggle"
	            v-bind:isPanelCloseDomRemove="false"
	            v-on:click="paragraphActive"
	            v-on:panelClose="deleteParagraph">
		<div slot="panel-header-content">
			<!--{{this.codeJobName || 'new paragraph'}}-->
			<!--| run : {{codeRunInfo.runTime}}-->
			<div class="paragraphInfo">
				<span v-show="paragraphType === 'list'" class="paragraphSelect"
				      v-bind:title="'paragraph ID : ' + paragraphId">
					<input type="checkbox" v-bind:value='paragraphId' v-on:click.stop="paragraphCheck"
					       v-model="isChecked" />
				</span>
				<span v-show="paragraphType === 'list'" class="paragraphIndex">
					<!--<i class="fa fa-info-circle"></i>-->
					<span> {{paragraphIndex + 1}}.</span>
				</span>
				<span v-show="paragraphType === 'list'"> status : {{codeResultStatus}}</span>
			</div>
			<!--| {{progress}}-->
		</div>
		<div slot="panel-body-content" class="panel-body-slotArea"
		     v-on:mouseover="(isButtonVisible = true)"
		     v-on:mouseleave="(isButtonVisible = false)">
			<div v-if="paragraphType === 'list' && isRun" class="loader-spin"></div>
			<div v-if="paragraphType === 'input' && isCreateParagraph" class="loader-dots"></div>
			<ProgressBar v-if="paragraphType === 'list'"
			             size="3"
			             v-bind:val="progressCnt"
			             v-bind:text="progressStatus"
			             v-bind:bar-transition="'all 0.3s ease'"
			             v-bind:bar-color="progressBarColor"
			             v-bind:bg-color="'#393C45'"
			             v-bind:text-fg-color="'#949ba2'"
			             v-bind:font-size="10"
			             v-bind:spacing="10"
			             v-bind:text-position="'top'"
			             v-bind:max="100"
			             v-bind:class="['vue-progress-wrap', isRun? 'active': '']"
			/>
			<CodeMirror ref="codeMirror"
			            v-on:codeRun="runCodeProcess"
			            v-bind:id="paragraphId"
			            v-bind:codeText="codeText"
			            v-bind:lang="codeLanguage"
			            v-bind:themeType="this.paragraphType === 'input'? 'white':'black'"
			/>

			<transition name="scalePop">
				<div v-if="isButtonVisible" class="btnArea">
					<a href="#" class="btn btn-sm btn-accent" v-if="!isRun"
					   v-on:click.stop="runCodeProcess">run</a>
					<a href="#" class="btn btn-sm btn-default" v-if="isRun" v-on:click.sopt="codeExcuteAbort($event,
					currentExcuteNotebookId, currentExcutePragraphId)">
						cancel</a>
				</div>
			</transition>

			<transition name="scalePop">
				<div v-if="isButtonVisible && isFooterExpand" class="btn_resultArea">
					<a href="#" class="btn btn-sm btn-primary"
					   v-on:click.stop="isResultVisible = !isResultVisible">
						{{isResultVisible? "Result Close" : "Result Open"}}
					</a>
				</div>
			</transition>
		</div>
		<div slot="panel-footer-content">
			<div class="paragraphFooterResultArea" v-if="isFooterExpand">
				<transition name="resultArea">
					<ResultWrap v-if="isResultVisible"
					            v-bind:isExpandable="false"
					            v-bind:isToggle="true"
					            v-bind:isCollapsed="this.isCollapsed"
					            v-bind:responseData="codeResult"
					            v-bind:usePanel="this.useResultPanel"
					            v-on:statusChange="statusChange" />
				</transition>
			</div>
		</div>
	</luna-panel>
</template>

<script>
import {lunaPanel, lunaToast} from '@/components/luna/';
import CodeMirror from '@/components/function/CodeMirror.vue';
import ResultWrap from '@/components/layout/result/ResultWrap.vue';
import {DATAINFO, APP} from '@/common/const';
import ProgressBar from 'vue-simple-progress'
import eventBus from '@/eventBus/';

export default {
    name : "Paragraph",
    data() {
        return {
            // paragraphId: this.paragraph.id,
            codeRunInfo : {
                runTime : 0
            },
            codeResultType : "",
            isChecked : false,
            isActive : false,
            isButtonVisible : false,
            isResultVisible : false,
            isRun : false,
            isCreateParagraph : false,
            currentExcuteNotebookId : "",
            currentExcutePragraphId : "",
            currentExcuteInterval : "",
            progressCnt : 0,
            progressStatus : "",
            progressCheckInterval : 1000,
        }
    },
    computed : {
        codeLanguage() {
            return this.$store.state.currentLanguage
        },
        codeText() {
            if (!this.paragraph.text) {
            }
            return this.paragraph.text
        },
        codeResult() {
            return this.paragraph.results
        },
        codeResultStatus() {
            if (this.codeResult) return this.codeResult.code;
        },
        progressBarColor() {
            switch (this.progressStatus) {
                case 'READY' :
                    return "#393C45"; //same to bg color
                case 'PENDING' :
                    return "#949ba2";
                case 'RUNNING' :
                    return "#eee";
                case 'FINISHED' :
                    return "#1bbf89";
                case 'ABORT' :
                    return "#db524b";
                case 'ERROR' :
                    return "#db524b";
                default :
                    return "#949ba2";
            }
        }
    },
    watch : {
        codeText() {
            //set value to codeMirror when new note changed
            if (!this.paragraph) {
            }
            this.$refs.codeMirror.setCodeValue(this.paragraph.text);
        },
        codeLanguage() {
            //set language to codeMirror when new language set
            // console.log("codeLang changed", this.codeLanguage)
            this.$refs.codeMirror.setOption("mode", this.$store.state.currentLanguage)
        },
        isChecked() {
            this.$emit('paragraphCheck', {id : this.paragraphId, checked : this.isChecked});
        }
    },
    props : {
        paragraphIndex : {},
        paragraph : {},
        paragraphId : "",
        paragraphType : {},
        isFooterExpand : {},
        isRemoveable : {},
        isCollapsed : {},
        isToggle : {},
        useResultPanel : {}
    },
    methods : {
        paragraphCheck() {
            //for prevent event propagation
        },
        paragraphActive(e) {
            if (this.paragraphType === 'list') {
                this.deactiveAllParagraph();
                this.isActive = true;
            }
        },
        deactiveAllParagraph() {
            //this < transitionGroup < paragraphList
            this.$parent.$parent.$refs.paragraph.forEach(paragraph => {
                paragraph.isActive = false;
            })
        },
        statusChange(status) {
            if (!status) return "panel-c-white";
            if (typeof status === 'string')
                switch (status) {
                    case "SUCCESS" :
                        return "panel-c-success";
                    case "ERROR" :
                        return "panel-c-danger";
                    case "PENDING" :
                        return "panel-c-warinng";
                    default :
                        return "panel-c-white";
                }
        },
        async createParagraph(codeText, notebookId) {
            //new paragraph
            let codeData = {text : codeText},
                serializedData = JSON.stringify(codeData);
            if (!notebookId) {
                lunaToast.error('notebook id is not defined');
                throw 'notebook id is not defined';
            }
            console.group(`[paragraph create]`);
            console.log(` notebookId : ${notebookId}\n text : ${codeText}`);
            //createParagraph
            return await fetch(`${APP.BASE_URL}ai/notebook/${notebookId}/paragraph.lean`, {
                method : "POST",
                headers : new Headers({
                    "Content-Type" : 'application/json;charset=UTF-8'
                }),
                body : serializedData
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw "paragraph create fail";
                }
            })
            .then((data) => {
                console.log("created paragraph success", data);
                console.groupEnd(`[paragraph create]`);
                return data;
            })
            .catch((e) => {
                this.isRun = false;
                console.error(e);
                console.groupEnd(`[paragraph create]`);
                lunaToast.error(e)
            });
        },
        async updateParagraph(codeText, notebookId, paragraphId) {
            //update paragraph
            let codeData = {text : codeText},
                serializedData = JSON.stringify(codeData);
            if (!notebookId) {
                lunaToast.error('notebook id is not defined');
                throw 'notebook id is not defined';
            }
            if (!paragraphId) {
                lunaToast.error('paragraph id is not defined');
                throw 'paragraph id is not defined'
            }

            console.group(`[paragraph update]`);
            console.log(` notebookId : ${notebookId}\n paragrphId : ${paragraphId}\n text : ${codeText}`);
            //createParagraph
            return await fetch(`${APP.BASE_URL}ai/notebook/${notebookId}/paragraph/${paragraphId}.lean`, {
                method : "PUT",
                headers : new Headers({
                    "Content-Type" : 'application/json;charset=UTF-8'
                }),
                body : serializedData
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw "paragraph update fail";
                }
            })
            .then((data) => {
                console.log("update paragraph success", data);
                console.groupEnd(`[paragraph update]`);
                return data;
            })
            .catch((e) => {
                this.isRun = false;
                console.error(e);
                console.groupEnd(`[paragraph update]`);
                lunaToast.error(e)
            });
        },
        async deleteParagraph(callbackFunc) {
            let notebookId = this.$store.state.currentNote.id,
                paragraphId = this.paragraph.id;
            if (!notebookId) {
                lunaToast.error('notebook id is not defined');
                throw 'notebook id is not defined'
            }
            if (!paragraphId) {
                lunaToast.error('paragraph id is not defined');
                throw 'paragraph id is not defined'
            }
            console.group("[paragraph delete]");
            console.log(`noteId : ${notebookId} paragraphId : ${paragraphId}`);
            this.isRun = true;
            await fetch(`${APP.BASE_URL}ai/notebook/${notebookId}/paragraph/${paragraphId}.lean`, {
                method : "DELETE",
                headers : new Headers({
                    "Content-Type" : 'application/json;charset=UTF-8'
                })
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    this.isRun = false;
                    throw "paragraph delete fail";
                }
            })
            .then((data) => {
                this.isRun = false;
                lunaToast.success(`paragraph ${paragraphId} delete success`);
                console.log(data);
                console.groupEnd("[paragraph delete]");
                if (callbackFunc && typeof callbackFunc === 'function') {
                    return callbackFunc();
                }
                else {
                    return this.$store.dispatch("getNotebookInfo");
                }
            })
            .catch((e) => {
                this.isRun = false;
                console.error("notebook delete fail", e);
                console.groupEnd("[paragraph delete]");
                lunaToast.error(e);
            })
        },
        async getParagraph(notebookId, paragraphId) {
            if (!notebookId) {
                lunaToast.error('notebook id is not defined');
                throw 'notebook id is not defined'
            }
            if (!paragraphId) {
                lunaToast.error('paragraph id is not defined');
                throw 'paragraph id is not defined'
            }
            return fetch(`${APP.BASE_URL}ai/notebook/${notebookId}/paragraph/${paragraphId}.lean`, {
                method : "GET",
                headers : new Headers({
                    "Content-Type" : 'application/json;charset=UTF-8'
                })
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw "get notebook list fail"
                }
            })
            .catch((e) => {
                lunaToast.error(e)
            })
        },
        async getProgress(notebookId, paragraphId) {
            if (!notebookId) {
                lunaToast.error('notebook id is not defined');
                throw 'notebook id is not defined'
            }
            if (!paragraphId) {
                lunaToast.error('paragraph id is not defined');
                throw 'paragraph id is not defined'
            }
            return fetch(`${APP.BASE_URL}ai/notebook/${notebookId}/paragraph/${paragraphId}/status.lean`, {
                method : "GET",
                headers : new Headers({
                    "Content-Type" : 'application/json;charset=UTF-8'
                })
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw "get progress fail"
                }
            })
            .then(data => {
                console.log(`progress count : ${data.body.progress} status : ${data.body.status}`);
                return data;
            })
            .catch((e) => {
                console.error(e);
                lunaToast.error(e);
            });
        },
        async codeExcute(notebookId, paragraphId) {
            if (!notebookId) {
                lunaToast.error('notebook id is not defined');
                throw 'notebook id is not defined'
            }
            if (!paragraphId) {
                lunaToast.error('paragraph id is not defined');
                throw 'paragraph id is not defined'
            }
            await fetch(`${APP.BASE_URL}ai/notebook/${notebookId}/paragraph/${paragraphId}/run.lean`, {
                method : "POST",
                headers : new Headers({
                    "Content-Type" : 'application/json;charset=UTF-8'
                })
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw "code excute fail"
                }
            })
            .then(data => (data))
            .catch((e) => {
                console.error("code excute fail", e);
                console.groupEnd("[code excute]");
                console.groupEnd("Run Code");
                lunaToast.error(e);
            });
        },
        async codeExcuteAbort(e, notebookId, paragraphId) {
            if (!notebookId) {
                lunaToast.error('notebook id is not defined');
                throw 'notebook id is not defined'
            }
            if (!paragraphId) {
                lunaToast.error('paragraph id is not defined');
                throw 'paragraph id is not defined'
            }
            await fetch(`${APP.BASE_URL}ai/notebook/${notebookId}/paragraph/${paragraphId}/stop.lean`, {
                method : "POST",
                headers : new Headers({
                    "Content-Type" : 'application/json;charset=UTF-8'
                })
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw "code excute abort fail"
                }
            })
            .then(data => {
                this.isRun = false;
                clearInterval(this.currentExcuteInterval);
                console.log("excute abort", data);
                console.groupEnd("[code excute]");
                console.groupEnd("Run Code");
            })
            .catch((e) => {
                console.error("code excute fail");
                console.groupEnd("[code excute]");
                console.groupEnd("Run Code");
                lunaToast.error(e);
            });
        },
        async runCode({successFunc, failFunc}) {
            try {
                if (this.isRun) {
                    console.log("code is running now");
                    lunaToast.warning("code is running now");
                    return
                }
                this.isRun = true;
                console.group("%c Run Code ", 'color:white;font-weight:bold;');

                let notebookId = this.currentExcuteNotebookId = this.$store.state.currentNote.id,
                    paragraphId = this.currentExcutePragraphId = this.paragraph.id,
                    codeText = this.$refs.codeMirror.getCodeValue();

                if (codeText === "") {
                    //exclude empty code
                    this.isRun = false;
                    throw 'code is empty'
                }
                else if (this.paragraph.text === codeText) {
                    //compare old code text to new code text
                    console.log("code has not changed")
                }
                else {
                    this.paragraph.text = codeText;
                    //code update
                    const updatedParagraph = await this.updateParagraph(codeText, notebookId, paragraphId);
                }

                //code excute
                console.group("[code excute]");
                if (this.codeResult) this.codeResult.code = "";
                this.codeExcute(notebookId, paragraphId);

                //get code result data
                const jobAfterProgressCheck = async (type) => {
                    this.isRun = false;
                    console.log(`progress ${type}`);
                    const paraData = await this.getParagraph(notebookId, paragraphId);
                    console.log("paragraph result", paraData.body.results);

                    //clear results
                    this.paragraph.results = null;

                    //set result
                    this.paragraph.results = paraData.body.results;

                    console.groupEnd("[code excute]");
                    console.log("run code finshed");
                    console.groupEnd("Run Code");
                    this.isResultVisible = true;

                    switch (type) {
                        case 'success' :
                            if (successFunc && typeof successFunc === 'function') successFunc.call(this);
                            break;
                        case 'error' :
                            if (failFunc && typeof failFunc === 'function') failFunc.call(this);
                            break;
                        default :
                            break;
                    }


                    //set activate paragraph result to vuex
                    /*if (this.isActive) {
						this.$store.commit("setActivateParagraphText", codeText);
						this.$store.commit("setActivateParagraphResult", this.codeResult);
					}*/
                };

                //get progress
                const progressPromise = new Promise((resolve, reject) => {
                    let progressCnt = 0;
                    this.progressCnt = 0;
                    this.progressStatus = "";
                    const progressCheck = async () => {
                        try {
                            const {body : {id, progress, status}} = await this.getProgress(notebookId, paragraphId);
                            this.progressCnt = progressCnt = parseInt(progress);
                            this.progressStatus = status;
                            switch (status.toUpperCase()) {
                                case "UNKNOWN" :
                                    break;
                                case "READY" :
                                    break;
                                case "PENDING" :
                                    break;
                                case "RUNNING" :
                                    break;
                                case "FINISHED" :
                                    if (progressCnt === 100) {
                                        clearInterval(this.currentExcuteInterval);
                                        resolve("success");
                                    }
                                    break;
                                case "ABORT" :
                                    clearInterval(this.currentExcuteInterval);
                                    reject("abort");
                                    break;
                                case "ERROR" :
                                    clearInterval(this.currentExcuteInterval);
                                    reject("error");
                                    break;
                                default :
                                    break;
                            }
                        }
                        catch (e) {
                            console.error("progress fail", e);
                            clearInterval(this.currentExcuteInterval);
                            reject();
                        }
                    };
                    //first check
                    window.setTimeout(progressCheck.bind(this), 500);
                    //do interval check
                    this.currentExcuteInterval = window.setInterval(progressCheck, this.progressCheckInterval);
                })
                .then((type) => {
                    jobAfterProgressCheck(type);
                })
                .catch((type) => {
                    jobAfterProgressCheck(type);
                })
                .finally(() => {
                });

            }
            catch (e) {
                this.isRun = false;
                console.error(e);
                console.groupEnd("[code excute]");
                lunaToast.error(e);
            }

        },
        async runNewCode() {
            //create new paragraph process
            let notebookId = this.$store.state.currentNote.id,
                paragraphId = "",
                codeText = this.$refs.codeMirror.getCodeValue(),
                isReadOnly = this.$store.state.paragraphInputCodeMirrorInstance.options.readOnly;
            //shield : cancel if note area is not available or code is empty
            if (isReadOnly) return;
            if (codeText === "") {lunaToast.error("code is empty"); return}
            this.isCreateParagraph = true;
            try {
                //clear inputed code text
                this.$refs.codeMirror.setCodeValue("");
                //create new paragraph
                const createdParagraph = await this.createParagraph(codeText, notebookId);
                if (createdParagraph && (createdParagraph.body) && (createdParagraph.body.id)) {
                    paragraphId = createdParagraph.body.id;
                    this.isCreateParagraph = false;
                }
                else throw "paragraph created fail";
            }
            catch (e) {
                this.isCreateParagraph = false;
                console.error(e);
                lunaToast.error(e);
                return;
            }
            //run new paragraph code after refresh paragraph list
            //get paragraph list
            this.$store.dispatch("getNotebookInfo", () => {
                const successFunc = function () {//bind have to use normal function, not a arrow function
                    //jQuery thread issue
                    window.requestAnimationFrame(() => {
                        this.paragraphActive();
                        this.$store.commit("setParagraphListScrollTop");
                    })
                };
                //run code via created paragraph
                this.$parent.$parent.$refs.paragraphList.runParagraphs([paragraphId], {successFunc});
            });

        },
        runCodeProcess(e) {
            if (this.paragraphType === 'list') this.runCode({});
            else this.runNewCode()
        },
    },
    created() {
    },
    mounted() {
        const codeMirrorInstance = this.$refs.codeMirror.codeInstance;
        if (this.paragraphType === "input" && this.$refs.codeMirror.codeInstance) {
            this.$store.commit("setParagraphInputInstance", codeMirrorInstance);
            //read only when note is not selected
            const paragraphInputDom = document.getElementsByClassName("paragraphInput")[0];
            paragraphInputDom.classList.add("readOnly");
            this.$refs.codeMirror.codeInstance.setOption("readOnly", true);
        }
    },
    beforeUpdate() {
    },
    updated() {
    },
    components : {CodeMirror, lunaPanel, ResultWrap, ProgressBar}
}
</script>

<style scoped lang="scss">
	/*.panel-body-slotArea {height:100%}*/
	.paragraphFooterResultArea {clear:both;}
	/*transition*/
	.scalePop-enter-active {transition:all .2s ease;}
	.scalePop-leave-active {transition:all .2s ease;}
	.scalePop-enter {transform:scale(0.2);opacity:0;}
	.scalePop-leave-to {transform:scale(0);opacity:0;}
	.slideLeft-enter-active {transition:all .5s ease;}
	.slideLeft-leave-active {transition:all .5s ease;}
	.slideLeft-enter {transform:translateX(50px);opacity:1;}
	.slideLeft-leave-to {transform:translateX(0);opacity:1;}
	.resultArea-enter-active {transition:all .3s ease;}
	.resultArea-leave-active {transition:all .2s ease;}
	.resultArea-enter, .resultArea-leave-to {transform:translateY(-20px);opacity:0;}
</style>
