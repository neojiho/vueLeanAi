<template>
	<modal v-bind:name="this.name"
	       v-bind:width="this.width"
	       v-bind:height="this.height"
	       v-bind:transition="this.transition"
	       v-bind:clickToClose="this.clickToClose"
	       v-bind:resizable="this.resizable"
	       v-bind:draggable="this.draggable === true? '.modal-header': false"
	       v-on:before-open="beforeOpen"
	       v-on:before-close="beforeClose"
	>
		<div class="modal-content">
			<div class="modal-header text-center" style="cursor:pointer">
				<slot name="modal-header-content" />
			</div>
			<div class="modal-body">
				<slot name="modal-body-content" />
			</div>
			<div class="modal-footer">
				<slot name="modal-footer-content"/>
				<slot name="modal-footer-buttons"/>
				<button type="button" class="btn btn-default" data-dismiss="modal"
				        v-on:click.stop.prevent="hide">
					Close
				</button>
			</div>
		</div>
	</modal>
</template>

<script>
import Vue from 'vue';
import VModal from 'vue-js-modal'

Vue.use(VModal);

export default {
	name: "luna-modal",
	props: {
		name: {type: String, default: 'modal'},
		width: {default: '600px'},
		height: {default: 'auto'},
		transition: {type: String, default: "pop-out"},
		clickToClose: {type: Boolean, default: false},
		resizable: {type: Boolean, default: false},
		draggable: {default: false},
		doBeforeOpen:{type: Function},
		doBeforeClose:{type: Function},
	},
	methods: {
		show() {
			this.$modal.show(this.name);
		},
		hide() {
			this.$modal.hide(this.name);
		},
		beforeOpen(event) {
			(this.doBeforeOpen && typeof this.doBeforeOpen === 'function') && this.doBeforeOpen();
		},
		beforeClose(event) {
			(this.doBeforeClose && typeof this.doBeforeClose === 'function') && this.doBeforeClose();
		}
	}
}
</script>

<style>
	.modal-content {height:100%;}
	.scale-enter-active, .scale-leave-active {
		transition:all 0.5s ease;
	}
	.scale-enter, .scale-leave-active {
		opacity:0;
		transform:scale(0.3) translateY(24px);
	}
	.pop-out-enter-active, .pop-out-leave-active {
		transition:all 0.5s ease;
	}
	.pop-out-enter, .pop-out-leave-active {
		opacity:0;
		transform:translateY(24px);
	}

	.pop-in-enter-active, .pop-in-leave-active {
		transition:all 0.5s;
	}
	.pop-in-enter, .pop-in-leave-active {
		opacity:0;
		transform:translateY(-30px);
	}
	.v--modal-overlay {background:rgba(0, 0, 0, 0.4)}
</style>