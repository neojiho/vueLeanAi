<template>
	<v-jstree v-bind:data="data" show-checkbox multiple allow-batch whole-row
	          v-on:item-click="itemClick"></v-jstree>
</template>

<script>
import VJstree from 'vue-jstree'
export default {
	name: "JsTree",
	data(){
		return {
			data: [
				{
					"text": "Same but with checkboxes",
					"children": [
						{
							"text": "initially selected",
							"selected": true
						},
						{
							"text": "custom icon",
							"icon": "fa fa-warning icon-state-danger"
						},
						{
							"text": "initially open",
							"icon": "fa fa-folder icon-state-default",
							"opened": true,
							"children": [
								{
									"text": "Another node"
								}
							]
						},
						{
							"text": "custom icon",
							"icon": "fa fa-warning icon-state-warning"
						},
						{
							"text": "disabled node",
							"icon": "fa fa-check icon-state-success",
							"disabled": true
						}
					]
				},
				{
					"text": "Same but with checkboxes",
					"opened": true,
					"children": [
						{
							"text": "initially selected",
							"selected": true
						},
						{
							"text": "custom icon",
							"icon": "fa fa-warning icon-state-danger"
						},
						{
							"text": "initially open",
							"icon": "fa fa-folder icon-state-default",
							"opened": true,
							"children": [
								{
									"text": "Another node"
								}
							]
						},
						{
							"text": "custom icon",
							"icon": "fa fa-warning icon-state-warning"
						},
						{
							"text": "disabled node",
							"icon": "fa fa-check icon-state-success",
							"disabled": true
						}
					]
				},
				{
					"text": "And wholerow selection"
				}
			]
		}
	},
	methods : {
		itemClick (e) {
			console.log(e.model.selected);
          console.log(e.model.text + ' clicked !')
        }
	},
	components : {
		VJstree
	}
}
</script>

<style scoped>

</style>