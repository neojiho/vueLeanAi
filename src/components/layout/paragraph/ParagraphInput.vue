<template>
	<div class="paragraphInput">
		<Paragraph v-bind:paragraph="{}"
		           v-bind:isFooterExpand="false"
		           v-bind:isToggle="false"
		           v-bind:class="ParagraphInputClass"
		           v-bind:paragraphType="'input'"
		           v-on:afterNewParaInput="listScroll">
		</Paragraph>
	</div>
</template>

<script>
import Paragraph from './Paragraph.vue'

export default {
	name: "paragraphInput",
	data(){
		return {
			ParagraphInputClass : 'panel-c-white paragraphInputPanel'
		}
	},
	methods : {
	     listScroll(){
	        //scroll to base
			const pList = document.getElementsByClassName("paragraphList")[0];
			pList.scrollTop = pList.scrollHeight;
	    }
	},
	components : {
		Paragraph
	},
	mounted() {

	}
}

</script>

<style scoped>

</style>