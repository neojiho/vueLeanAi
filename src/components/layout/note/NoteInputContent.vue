<template>
	<div>
		<dl>
			<dt>Language</dt>
			<dd>
				<div class='radio radio-warning radio-inline' v-for="type in languages">
					<input type="radio"
					       name="languageType"
					       v-bind:id="'selectedNoteLanguage_'+type"
					       v-bind:value="type"
					       v-bind:disabled="isDisable"
					       v-model="noteInfo.language">
					<label v-bind:for="'selectedNoteLanguage_'+type">{{type}}</label>
				</div>
			</dd>
		</dl>
		<dl>
			<dt>Folder
				<!--<span><label><input type="checkbox" v-model="isNewNoteChecked" class="styled">New</label></span>-->
			</dt>
			<dd class="noteFolderSelect">
				<!--<input type="text" class="form-control" v-show='isNewNoteChecked' v-model="noteInfo.parentFolder"-->
				       <!--placeholder="input new folder name"/>-->
				<lunaSelect2 ref="folderSelect"
				             v-show="!isNewNoteChecked"
				             v-bind:options="folderList"
				             v-bind:optionValue="noteInfo.parentFolder"
				             v-bind:placeholder="'select folder'"
				             v-bind:taggable="true"
				             v-bind:selectOnTab="true"
				             v-bind:clearSearchOnSelect="false"
				             v-on:select="setNoteInfoParentFolder"
				             v-on:searchBlurFunction="searchBlurFunction"/>
			</dd>
		</dl>
		<dl>
			<dt>Notebook Name</dt>
			<dd>
				<input type="text" class="form-control" v-model="noteInfo.notebookName" />
			</dd>
		</dl>
		<dl>
			<dt>Notebook Description</dt>
			<dd>
				<textarea class="form-control" id="noteUpdateDescription" v-model="noteInfo.description"></textarea>
			</dd>
		</dl>
	</div>
</template>

<script>
import {lunaAutocomplete, lunaSelect2} from '@/components/luna'

export default {
	name: "NoteInputContent",
	data(){
	    return {
	        languages : ['R', 'PYTHON', 'SCALA', 'SQL'],
		    isNewNoteChecked : false,
	    }
	},
	computed:{
	    isDisable(){
	        return (this.updateType.toUpperCase() === "EDIT");
	    }
	},
	props: {
		noteInfo: {},
		folderList: {},
		updateType: {type:String}

	},
	methods : {
		setNoteInfoParentFolder(val){
			this.noteInfo.parentFolder = val
		},
		searchBlurFunction(val){
		    const vueSelect = this.$refs.folderSelect.$refs.vueSelect;
		    //force update value to
			vueSelect.typeAheadSelect();

			//default search blur process again~
			if (vueSelect.mousedown && !vueSelect.searching) {
                vueSelect.mousedown = false
            }
            else {
                vueSelect.search = '';
				vueSelect.open = false
			}
		}
	},
	components: {lunaAutocomplete, lunaSelect2}
}
</script>

<style scoped>

</style>