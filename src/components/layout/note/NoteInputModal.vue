<template>
	<lunaModal ref="noteInputModal"
	           v-bind:name="'noteInputModal'"
	           v-bind:width="'350'"
	           v-bind:clickToClose="true"
	           v-bind:draggable="true">
		<div slot="modal-header-content">{{updateType}} Notebook</div>

		<NoteInputContent slot="modal-body-content"
		                  v-bind:noteInfo="noteInfo"
		                  v-bind:folderList="folderList"
		                  v-bind:updateType="updateType"/>

		<button type="button" slot="modal-footer-buttons" class="btn btn-accent"
		        v-on:click="updateNote">
			Save
		</button>
	</lunaModal>
</template>

<script>
import {lunaSelect, lunaSelect2, lunaModal, lunaToast} from '@/components/luna/';
import NoteInputContent from '@/components/layout/note/NoteInputContent.vue';
import {DATAINFO, APP} from '@/common/const';

export default {
	name: "NoteInputModal",
	data() {
		return {
			noteInfo: {
				id: null,
				language: null,
				parentFolder: null,
				notebookName: null,
				description: null
			},
			createdNotebook : {}
		}
	},
	props: {
		folderList: {},
		updateType: {type:String}
	},
	methods: {
		updateNote() {
            let {id, language, parentFolder, notebookName, description} = {...this.noteInfo},
                serializedData = JSON.stringify({id,parentFolder,language,notebookName,description});
			let updateType = this.updateType,
				url, method;

			if (!notebookName) {
                lunaToast.warning('notebook name is necessary');
                return 'notebook name is necessary';
            }

			//new or edit
			switch(this.updateType.toUpperCase()){
				case "NEW" :
				    url = `${APP.BASE_URL}ai/notebook.lean`;
				    method = "POST";
				    break;
				case "EDIT" :
				    url = `${APP.BASE_URL}ai/notebook/${id}.lean`;
				    method = "PUT";
				    break;
			    default :
				    url = `${APP.BASE_URL}ai/notebook.lean`;
				    method = "POST";
				    break;
			}
			console.group(`[note ${updateType}]`);
			console.log(`${id? 'noteId : '+id+', ' : ""}parentFolder : ${parentFolder}, notebookName : ${notebookName}`);
            fetch(url, {
	                method: method,
	                headers: new Headers({
	                    // 'Access-Control-Allow-Origin': '*',
	                    "Content-Type": 'application/json;charset=UTF-8',
	                }),
	                body: serializedData
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else {
                        throw "notebook update fail";
                    }
                })
                .then((data) => {
                    console.log(data);
                    console.groupEnd(`[note ${updateType}]`);
                    this.createdNotebook = data.body;
                    return this.$store.dispatch("getNotebookList")
                })
                .then(() => {
                    // this.$store.commit("setCurrentNote", this.createdNotebook);
                    this.selectNoteValue(this.createdNotebook);
                    this.modalHide();
                })
                .catch((e) => {
                    console.error("notebook update fail", e);
                    console.groupEnd(`[note ${updateType}]`);
	                lunaToast.error(e);
                })

		},
		selectNoteValue({parentFolder} = this.createdNotebook){
		    this.$emit("folderSelect", parentFolder);
		    this.$emit("noteSelect", this.createdNotebook);
		},
		initNewNoteData() {
			if (Object.keys(this.$store.state.currentNote).length >= 1) {
				//new note with current selected note
				this.setNoteInfo();
				for (let prop in this.noteInfo) {
					if (prop === 'parentFolder') continue;
					else this.noteInfo[prop] = undefined;
				}
			}
			else {
				//new note without notebook
				this.noteInfo = {}
			}

			//language default SCALA
			this.noteInfo['language'] = 'SCALA'
		},
		setNoteInfo() {
			this.noteInfo = Object.assign(this.noteInfo, this.$store.state.currentNote);
		},
		modalShow() {
			this.$refs.noteInputModal.show();
		},
		modalHide() {
		    this.$refs.noteInputModal.hide();
		}
	},
	components: {lunaSelect, lunaModal, NoteInputContent}
}
</script>

<style scoped>

</style>