<template>
	<div class="paragraphListWrap" v-drag-and-drop:options="dragDropOptions">
		<div class="loader-bar" v-show="isParagraphListLoading"></div>
		<transition-group name="slideLeft" class="paragraphList" tag="ul">
			<li v-for="(paragraph, idx) in paragraphList" v-bind:key="paragraph.id" v-bind:data-id="paragraph.id">
				<Paragraph v-bind:class="ParagraphListClass"
				           v-bind:paragraphIndex="idx"
				           v-bind:paragraphId='paragraph.id'
				           v-bind:paragraphType="'list'"
				           v-bind:paragraph="paragraph"
				           v-bind:isFooterExpand="true"
				           v-bind:isRemoveable="true"
				           v-bind:isCollapsed="true"
				           v-bind:isToggle="true"
				           v-bind:useResultPanel="false"
				           v-on:paragraphCheck="updateCheckList"
				           ref="paragraph" />
			</li>
		</transition-group>
	</div>
</template>

<script>
import Paragraph from './Paragraph.vue'
import {lunaToast} from '@/components/luna'
import {mapGetters} from 'vuex';

export default {
    name : "ParagraphList",
    data() {
        const that = this;
        return {
            ParagraphListClass : "paragraphPanel",
            checkedList : new Set(),
            dragDropOptions : {
                dropzoneSelector : 'ul',
                draggableSelector : 'li',
                // showDropzoneAreas: false,
                // multipleDropzonesItemsDraggingEnabled: true,
                onDrop(event) {
                    const draggedId = parseInt(event.items[0].dataset["id"]),
                        currentParagraphList = that.$store.state.currentParagraphList,
                        targetDomUl = Array.from(event.droptarget.children).filter(el => el.tagName === 'LI'),
                        draggedCurrentParagraphIdx = currentParagraphList.findIndex(v => parseInt(v.id) === draggedId),
                        draggedDomIdx = targetDomUl.findIndex(v => parseInt(v.dataset.id) === draggedId),
                        draggedValue = currentParagraphList.splice(draggedCurrentParagraphIdx, 1);
                    currentParagraphList.splice(draggedDomIdx, 0, draggedValue[0]);
                    // console.log(draggedCurrentParagraphIdx, draggedDomIdx);
                    // console.warn(currentParagraphList)
                },
                onDragstart(event) {
                },
                onDragend(event) {
                    // if you need to stop d&d
                    // event.stop();
                }
            }
        }
    },
    computed : {
        paragraphList() {
            return this.$store.state.currentParagraphList
        },
        paragraphVueInstance() {
            //apply index of paragraphList, so that paragraphs run progressively
            return this.paragraphList.reduce((acc, cur, idx) => {
                this.$refs.paragraph.forEach((value) => {
                    if (value.paragraphId === cur.id) {
                        acc[idx] = value
                    }
                });
                return acc;
            }, []);
        },
        isParagraphListLoading() {
            return this.$store.state.isCurrentParagraphLoading
        },
        ...mapGetters([
            'isCurrentParagraphsListExist'
        ]),
    },
    methods : {
        getAllParagraphId() {
            return this.paragraphVueInstance.map(acc => acc.paragraphId)
        },
        check(type) {
            if (!this.isCurrentParagraphsListExist) return;
            let func, activeIdx;
            switch (type) {
                case "TRUE" :
                    func = component => {
                        component.isChecked = true;
                    };
                    break;
                case "FALSE" :
                    func = component => {
                        component.isChecked = false;
                    };
                    break;
                case "ABOVE" :
                    activeIdx = this.paragraphVueInstance.findIndex(component => component.isActive);
                    if (activeIdx === -1) {
                        lunaToast.warning("please, select paragraph");
                        return
                    }
                    else {
                        func = (component, idx) => {
                            if (idx < activeIdx) component.isChecked = true;
                            else component.isChecked = false;
                        };
                    }
                    break;
                case "BELOW" :
                    activeIdx = this.paragraphVueInstance.findIndex(component => component.isActive);
                    if (activeIdx === -1) {
                        lunaToast.warning("please, select paragraph");
                        return
                    }
                    else {
                        func = (component, idx) => {
                            if (idx > activeIdx) component.isChecked = true;
                            else component.isChecked = false;
                        };
                    }
                    break;
                case "REVERSE" :
                    func = component => {
                        component.isChecked = !component.isChecked;
                    };
                    break;
                case "SUCCESS" :
                    func = component => {
                        if (component.codeResultStatus === 'SUCCESS') component.isChecked = true;
                        else component.isChecked = false;
                    };
                    break;
                case "ERROR" :
                    func = component => {
                        if (component.codeResultStatus === 'ERROR') component.isChecked = true;
                        else component.isChecked = false;
                    };
                    break;
                default  :
                    func = component => {
                        component.isChecked = true;
                    };
                    break;
            }
            this.paragraphVueInstance.forEach(func);
        },
        updateCheckList({id, checked}) {
            if (checked) {
                this.checkedList.add(id);
            }
            else {
                this.checkedList.delete(id);
            }
        },
        run(list = [...this.checkedList], isParallel) {
            if (isParallel) {
                Boolean(list.length) && this.runParagraphsParallel(list, {})
            }
            else {
                Boolean(list.length) && this.runParagraphs(list, {})
            }
        },
        delete(list = [...this.checkedList]) {
            Boolean(list.length) && this.deleteParagraphs(list);
        },
        expand(list = [...this.checkedList]) {
            Boolean(list.length) && this.collapseParagraphs(list, false);
        },
        collapse(list = [...this.checkedList]) {
            Boolean(list.length) && this.collapseParagraphs(list, true);
        },
        resultOpen(list = [...this.checkedList]) {
            Boolean(list.length) && this.resultOpenParagraphs(list, true);
        },
        resultClose(list = [...this.checkedList]) {
            Boolean(list.length) && this.resultOpenParagraphs(list, false);
        },
        search(keyword) {
            this.paragraphVueInstance.forEach((paragraph, idx) => {
                const codeText = paragraph.$refs.codeMirror.getCodeValue();
                //import search related addon file to codeMirror.vue file then connect
            })
        },
        runParagraphs([...paragraphId], {successFunc, failFunc}) {
            //list up target components
            const targetComponent = this.paragraphVueInstance.filter(paragraph =>
                (paragraphId.includes(paragraph.paragraphId)));
            if (successFunc && typeof successFunc === 'function') {
                targetComponent.forEach(component => {
                    component.runCode({successFunc, failFunc});
                });
            }
            else {

                let size = targetComponent.length;
                this.$store.commit("setParagraphsRun", true);
                this.$store.commit("setParagraphsRunProgressCnt", 0);
                this.$store.commit("setParagraphsRunStatus", "RUNNING");

                const runCode = (component, idx) => {
                    //validate code before next run
                    let isExist = this.paragraphList.map(v => v.id).includes(component[idx].paragraphId);
                    const successFunc = (idx === targetComponent.length - 1) ?
                        () => {
                            //final
                            this.$store.commit("setParagraphsRunProgressCnt", 100);
                            this.$store.commit("setParagraphsRun", false);
                            this.$store.commit("setParagraphsRunStatus", "FINISHED");
                            lunaToast.success("paragraphs run finish")
                        } :
                        () => {
                            //not yet
                            this.$store.commit("setParagraphsRunProgressCnt", this.$store.state.paragraphsRun.cnt + (parseInt(component[idx].progressCnt) / size));
                            this.$store.commit("setParagraphsRunStatus", "RUNNING");
                            runCode(component, idx + 1)
                        },
                        failFunc = () => {
                            this.$store.commit("setParagraphsRun", false);
                            this.$store.commit("setParagraphsRunStatus", "ERROR");
                            lunaToast.error(`${component[idx].paragraphId} paragraph run fail`)
                        };
                    if (isExist) {
                        component[idx].runCode({successFunc, failFunc});
                    }
                    else {
                        runCode(component, idx + 1);
                    }
                };
                runCode(targetComponent, 0);
            }
        },
        runParagraphsParallel([...paragraphId], {successFunc, failFunc}) {
            const runPromiseList = [];
            const targetComponent = this.paragraphVueInstance.filter(paragraph =>
                (paragraphId.includes(paragraph.paragraphId)));
            let size = targetComponent.length;

            this.$store.commit("setParagraphsRun", true);
            this.$store.commit("setParagraphsRunProgressCnt", 0);
            this.$store.commit("setParagraphsRunStatus", "RUNNING");

            targetComponent.forEach(component => {
                let resolveFunc, rejectFunc;
                const defer = new Promise((resolve, reject) => {
                    resolveFunc = resolve;
                    rejectFunc = reject;
                });
                const successFunc = () => {
                        resolveFunc(component.paragraphId);
                        this.$store.commit("setParagraphsRunProgressCnt", this.$store.state.paragraphsRun.cnt + (parseInt(component.progressCnt) / size));
                        this.$store.commit("setParagraphsRunStatus", "RUNNING");
                    },
                    failFunc = () => {
                        rejectFunc(component.paragraphId);
                        this.$store.commit("setParagraphsRunStatus", "ERROR");
                        lunaToast.error(`${component.paragraphId} paragraph run fail`);
                    };
                runPromiseList.push(defer);
                component.runCode({successFunc, failFunc});
            });

            Promise.all(runPromiseList)
            .then((resolved) => {
                this.$store.commit("setParagraphsRunProgressCnt", 100);
                this.$store.commit("setParagraphsRun", false);
                this.$store.commit("setParagraphsRunStatus", "FINISHED");
                lunaToast.success("paragraphs run finish");
            })
            .catch(error => {
                this.$store.commit("setParagraphsRun", false);
                this.$store.commit("setParagraphsRunStatus", "ERROR");
                lunaToast.error(`paragraphs run fail`);
            });
        },
        deleteParagraphs([...paragraphId]) {
            const deletedPromiseList = [];
            //list up target components
            const targetComponent = this.paragraphVueInstance.filter(paragraph =>
                (paragraphId.includes(paragraph.paragraphId)));
            //run code each of target component
            targetComponent.forEach(component => {
                const defer = new Promise((resolve, reject) => {
                    component.deleteParagraph(resolve.bind(this, component.paragraphId));
                });
                deletedPromiseList.push(defer);
            });

            Promise.all(deletedPromiseList)
            .then((resolved) => {
                lunaToast.success("paragraphs delete success");
                this.$store.dispatch("getNotebookInfo");
            })
            .catch(error => {
                lunaToast.error(error);
                this.$store.dispatch("getNotebookInfo");
            })
        },
        collapseParagraphs([...paragraphId], val, callbackFunc) {
            const targetComponent = this.paragraphVueInstance.filter(paragraph =>
                (paragraphId.includes(paragraph.paragraphId)));
            //run code each of target component
            targetComponent.forEach(component => {
                component.$refs.lunaPanel.isCollapsed = val;
            })
        },
        resultOpenParagraphs([...paragraphId], val, callbackFunc) {
            const targetComponent = this.paragraphVueInstance.filter(paragraph =>
                (paragraphId.includes(paragraph.paragraphId)));
            //run code each of target component
            targetComponent.forEach(component => {
                component.isResultVisible = val;
            })
        },
    },
    mounted() {
        this.$store.commit("clearCurrentParagraphList");
    },
    updated() {
        //scroll to base
        const paragraphList = document.getElementsByClassName("paragraphListWrap")[0];
        paragraphList.scrollTop = paragraphList.scrollHeight;
    },
    components : {
        Paragraph
    }
}
</script>

<style scoped>
	.slideLeft-enter-active {transition:all .3s ease;}
	.slideLeft-leave-active {transition:all .2s ease;}
	.slideLeft-enter {transform:translateX(-100px);opacity:0;}
	.slideLeft-leave-to {transform:translateX(0);opacity:1;}
</style>
