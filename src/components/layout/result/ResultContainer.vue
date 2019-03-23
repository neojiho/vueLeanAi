<template>
	<div class="resultArea">
		<h3 class="blind">Result area</h3>
		<div class="layoutNorthSouth">
			<ResultWrap v-bind:isExpandable="true" v-bind:isActivateResult="true"/>
			<ResultWrap v-bind:isExpandable="true" v-bind:isActivateResult="true"/>
		</div>
	</div><!--result area-->
</template>

<script>
import ResultWrap from '@/components/layout/result/ResultWrap.vue'
export default {
	name: "ResultContainer",
	components : {
		ResultWrap
	}
}
</script>

<style scoped>

</style>