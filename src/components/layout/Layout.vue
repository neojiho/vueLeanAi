<template>
	<div class="wrapper">
		<!--<Header />-->
		<!--<Navigation />-->
		<Content />
		<luna-toast/>
	</div>
</template>

<script>
import Header from './Header.vue';
import Navigation from './Navigation.vue';
import Content from './Content.vue';
import {lunaToast} from '@/components/luna'

export default {
	name: "Layout",
	methods : {

	},
	components : {
		Header,
		Navigation,
		Content,
		lunaToast
	},
}
</script>

<style scoped>

</style>