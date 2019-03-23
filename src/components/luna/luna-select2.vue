<template>
	<vue-select ref='vueSelect'
	            v-bind:value="optionValue"
	            v-bind:label="optionText"
	            v-bind:options="options"
	            v-bind:placeholder="placeholder"
	            v-bind:taggable="taggable"
	            v-bind:selectOnTab="selectOnTab"
	            v-bind:clearSearchOnSelect="clearSearchOnSelect"
	            v-on:search:blur="searchBlurFunction"
	            v-on:input="optionSelect">
	</vue-select>
</template>

<script>
import vueSelect from "vue-select"

export default {
	name: "lunaSelect",
	props: {
	    options : {default:[]},
		optionText : {default:""},
		optionValue : {}, //set value directly
		placeholder : {},
		taggable : {}, // available input value directly
		selectOnTab : {},  //select with tab key
		clearSearchOnSelect : {}, //when search on select
		clearFunc : {type:Function}
	},
	computed :{
	    optionLabel(){
	        if (typeof this.options === 'object' && typeof this.options[0] === 'object') return this.optionText;
		    else if (typeof this.options === 'object' && typeof this.options[0] === 'string') return null
		}
	},
	methods: {
	    //$emit methods are sync functions luna-select2 to vue-select
		optionSelect(val) {
			this.$emit("select", val)
		},
		searchBlurFunction(){
		    this.$emit("searchBlurFunction");
		},
		clearFunction(){
		    this.$emit("clearFunction")
		},
		clearSelection(){
			//init selected value of vue select
			this.$refs.vueSelect.clearSelection();
		}
	},
	components : {vueSelect},
	mounted(){
		this.$el.querySelector("button.clear").addEventListener("click", this.clearFunction)
	},
	beforeDestroy(){
	    this.$el.querySelector("button.clear").removeEventListener("click", this.clearFunction);
	}
}
</script>

<style lang="scss">
	//luna theme custom css
	.v-select {
		.selected-tag {color:inherit !important;background-color:#494b54;}
		.dropdown-toggle {background-color:#494b54 !important;
			.clear {color:inherit !important;}
			.open-indicator:before {border-color:inherit;}
		}
		.no-options {display:none;/*no-option message error*/}
		.dropdown-menu {padding:0;border:0 none;/*no-option message error*/}
	}
</style>