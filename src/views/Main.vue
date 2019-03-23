<template>
	<div class="contentInner op1">
		<LunaTab v-bind:tabs="['note']" v-bind:class="'noteArea'"><!--toggleCollapse-->
			<NoteContainer slot="note"/>
			<!--<JsTree slot="table"/>-->
		</LunaTab>

		<paragraphContainer />

		<!--<ResultContainer />-->
	</div><!--contentInner-->
</template>

<script>
import NoteContainer from '@/components/layout/note/NoteContainer.vue';
import ParagraphContainer from '@/components/layout/paragraph/ParagraphContainer.vue';
import ParagraphList from '@/components/layout/paragraph/ParagraphList.vue';
import ParagraphInput from '@/components/layout/paragraph/ParagraphInput.vue';
import ResultContainer from '@/components/layout/result/ResultContainer.vue';
import LunaTab from '@/components/luna/luna-tab.vue';
import JsTree from '@/components/function/JsTree.vue';

export default {
	name: 'Main',
	components: {
		NoteContainer,
		ParagraphContainer,
		ParagraphList,
		ParagraphInput,
		ResultContainer,
		LunaTab,
		JsTree
	}
}
</script>

<style scoped>

</style>
