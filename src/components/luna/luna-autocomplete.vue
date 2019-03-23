<template>
	<div>
		<vue-bootstrap-typeahead
		  v-bind:data="items"
		  v-bind:value="value"
		  v-bind:placeholder="placeholder"
		  v-on:input="v =>
		  this.$emit('input', v)"
		/>
	</div>
</template>

<script>
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'

export default {
	name: "luna-autocomplete",
	props : {
		items : {},
		placeholder: "",
		value : ""
	},
	data(){
		return {
		}
	},
	components: {VueBootstrapTypeahead}
}
</script>

<style>
	.input-group > input.form-control:first-child, .input-group > input.form-control:last-child {border-radius:4px;
		background-color:#494B54}
</style>