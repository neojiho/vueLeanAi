<template>
	<div class="paragraphArea">
		<h3 class="blind">Paragraph area</h3>
		<ParagraphListControl ref="paragraphListControl" />
		<ParagraphList ref="paragraphList" />
		<ParagraphInput ref="paragraphInput" />
	</div><!--paragraphArea-->
</template>

<script>
import ParagraphListControl from './ParagraphListControl.vue';
import ParagraphList from './ParagraphList.vue';
import ParagraphInput from './ParagraphInput.vue';

export default {
    name : "ParagraphContainer",
    components : {
        ParagraphListControl,
        ParagraphList,
        ParagraphInput
    }
}
</script>

<style scoped>

</style>
