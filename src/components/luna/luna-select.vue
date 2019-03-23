<template>
	<select class="form-control"
	        v-bind:placeholder='placeholder'
	        v-on:change="optionSelect($event, selected)"
	        v-model="selected">
		<option></option>
		<option v-for="list in options"
		        v-bind:value="list">
			{{optionText? list[optionText] : list}}
		</option>
	</select>
</template>

<script>

export default {
	name: "lunaSelect",
	data(){
		return {
			selected : null,
		}
	},
	props: {
	    options : {default:[]},
		optionText : {default:null},
		optionValue : {},
		placeholder : {}
	},
	methods: {
		optionSelect(event, selected) {
			//delegate parameter selected value only, no event object
			this.$emit("select", selected);
		},
	}

}
</script>
<style lang="scss">
</style>