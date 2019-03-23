<template>
	<div class="">
		<h3 class="blind">Note area</h3>
		<h4>
			Language : {{currentSelectedNoteLanguage}}
		</h4>
		<div class="folderSelectArea">
			folder
			<lunaSelect2 ref="folderSelect"
			             v-bind:optionValue="folderValue"
			             v-bind:options="folderList"
			             v-bind:placeholder="'select folder'"
			             v-on:select="folderSelect" />
		</div>
		<div class="noteSelectArea">
			note
			<lunaSelect2 ref="noteSelect"
			             v-bind:optionValue="noteValue"
			             v-bind:options="noteList"
			             v-bind:optionText="'notebookName'"
			             v-bind:placeholder="'select notebook '"
			             v-on:select="noteSelect"
			             v-on:clearFunction="clearNoteSelect"/>
			<div class="noteIconArea">
				<button class="btn btn-default" type="button" v-if="isCurrentNote" v-on:click="noteDelete"><i
					class="fa fa-trash-o"></i>
					<span class="bold">
					Delete</span></button>
				<button class="btn btn-default " type="button" v-if="isCurrentNote" v-on:click="noteEdit"><i
						class="fa fa-paste"></i> Edit</button>
				<button class="btn btn-default " type="button" v-on:click="newNoteInput"><i class="fa fa-plus"></i> New</button>
			</div>
			<div class="loader-dots" v-if="isLoaderView"></div>
			<textarea class="form-control" name="" id="noteDescrition" cols="" rows=""
			          placeholder="notebook description">{{currentNoteDesc}}</textarea>
			<NoteInputModal ref='modalWrap'
			                v-bind:updateType="updateType"
			                v-bind:folderList="folderList"
			                v-on:folderSelect="folderValueSelect"
			                v-on:noteSelect="noteValueSelect"/>
		</div>
	</div>
</template>

<script>
import {lunaSelect, lunaSelect2, lunaModal, lunaToast} from '@/components/luna/';
import NoteInputModal from '@/components/layout/note/NoteInputModal.vue';
import {DATAINFO, APP} from '@/common/const';

export default {
	name: "NoteArea",
	data() {
		return {
		    folderValue : null,
			noteValue : null,
			currentSelectedFolder: null,
			currentSelectedNote: "",
			currentSelectedNoteDesc: "",
			currentSelectedNoteLanguage : "",
			isLoaderView : false,
			updateType : "New"
		}
	},
	computed: {
	    isCurrentNote(){
	        return (Object.keys(this.$store.state.currentNote).length > 0);
	    },
		allNotebookList() {
		    // console.log("all notebook Update");
			return this.$store.state.notebookList
		},
		folderList() {
		    // console.log("folder list Update");
		    return this.allNotebookList && this.allNotebookList.reduce((acc, cur)=>{
		        const folderName = cur.parentFolder;
		        if (folderName && acc.indexOf(folderName) === -1) {
		            acc.push(folderName);
		            return acc;
		        }
		        else return acc;
		    }, []);
		},
		noteList(){
		    // console.log("note list Update");
		    return this.allNotebookList.filter((v) => {
		    	//empty folder
		    	if (!Boolean(this.currentSelectedFolder)) return !Boolean(v.parentFolder);
		    	//exist folder
		    	else return v.parentFolder === this.currentSelectedFolder
			});
		},
		currentNoteDesc(){
	    	return this.$store.state.currentNote.description
		}
	},
	methods: {
	    folderValueSelect(val){
	        console.log("select folder : ", val);
	        this.folderValue = val
	    },
	    noteValueSelect(val){
	        console.log("select note : ", val);
	        this.noteValue = val
	    },
		folderSelect(val) {
		    //set current selected folder
			this.currentSelectedFolder = val;

			//clear note selection
			this.$refs.noteSelect.clearSelection();
			this.clearNoteSelect();

		},
		noteSelect(valObj) {
	        if (typeof valObj === 'string') {
	            //select from noteValueSelect method
	            console.log("noteContainer", valObj);
	        }
	        else {
	            //set current selected notebook name
				this.currentSelectedNote = valObj.notebookName;

				//set current selected notebook language
				this.currentSelectedNoteLanguage = valObj.language;

				//set current selected note desc
				this.currentSelectedNoteDesc = valObj.description;

				//set currentNote
				this.$store.commit('setCurrentNote', {...valObj});
	        }
            //loading bar show
            this.$store.state.isCurrentParagraphLoading = true;
	        //clear currentParagraphList
	        this.$store.commit("clearCurrentParagraphList");
			//set currentParagraphList
			this.$store.dispatch("getNotebookInfo");
		},
		newNoteInput(e) {
	        this.updateType = "New";
			this.$refs.modalWrap.initNewNoteData();
			this.$refs.modalWrap.modalShow();
		},
		noteEdit(){
	        this.updateType = "Edit";
			if (!this.currentSelectedNote) return;
			this.$refs.modalWrap.setNoteInfo();
			this.$refs.modalWrap.modalShow();
		},
		noteDelete(){
	    	let {id, notebookName, description} = this.$store.state.currentNote;
            if (!id) {
                lunaToast.error('current notebook id is not defined');
                throw 'notebook id is not defined'
            }
            (async()=> {
                this.isLoaderView = true;
                console.group("[note delete]");
	            console.log(`noteId : ${id} notebookName : ${notebookName}`);
                await fetch(`${APP.BASE_URL}ai/notebook/${id}`, {
                    method: "DELETE",
                    headers: new Headers({
                        // 'Access-Control-Allow-Origin': '*',
                        "Content-Type": 'application/json;charset=UTF-8',
                    }),
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        }
                        else {
                            console.error("notebook delete fail");
                        }
                    })
                    .then((data) => {
                        console.log(data);
                        console.groupEnd("[note delete]");
                        this.isLoaderView = false;

                        //clear note select
                        this.$refs.noteSelect.clearSelection();
                        this.clearNoteSelect();

	                    //get notebook list again
                        return this.$store.dispatch("getNotebookList")
                    })
	                .catch((e) => {
                        this.isLoaderView = false;
                        console.error("notebook delete fail", e);
                        console.groupEnd("[note delete]");
                        lunaToast.error(e);
                    })
            })()
		},
		clearNoteSelect(){
	        this.$store.commit("setCurrentNote", {});
			this.currentSelectedNoteLanguage = "";

		}
	},
	created() {
		this.$store.dispatch("getNotebookList");

	},
	components: {
		lunaSelect, lunaSelect2, lunaModal, NoteInputModal
	}
}

</script>

<style scoped>
	.fade-enter-active, .fade-leave-active {transition:opacity .5s;}
	.fade-enter, .fade-leave-to {opacity:0;}
	/* .fade-leave-active, .slide-fade-leave-active below version 2.1.8 */
	.slide-fade-enter-active {transition:all .3s ease;}
	.slide-fade-leave-active {transition:all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
	.slide-fade-enter, .slide-fade-leave-to {transform:translateX(10px);opacity:0;}
	.noteList {list-style:none;}

</style>