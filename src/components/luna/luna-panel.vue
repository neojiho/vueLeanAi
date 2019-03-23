<template>
	<div v-bind:class="[{'panel-collapse' : isCollapsed}, 'panel', 'panel-filled']"
	     v-on:click.stop.prevent="panelClick">
		<div class="panel-heading">
			<div class="panel-heading-slotArea">
				<slot name="panel-header-content" />
			</div>
			<div class="panel-tools">
				<a v-if="isToggle" class="panel-toggle" v-on:click.stop.prevent="panelToggle">
					<i v-bind:class="['fa', isCollapsed? 'fa-chevron-down' : 'fa-chevron-up']"></i>
				</a>
				<a v-if="isExpandable" class="panel-expand" v-on:click.stop.prevent="panelExpand">
					<i class="fa fa-expand"></i>
				</a>
				<a v-if="isRemoveable" class="panel-close" v-on:click.stop.prevent="panelClose">
					<i class="fa fa-times"></i>
				</a>
			</div>
		</div>
		<transition name="bodyArea">
			<div v-show='!isCollapsed' class="panel-body">
				<slot name="panel-body-content" />
			</div>
		</transition>
		<transition name="footerArea">
			<div v-show='!isCollapsed' class="panel-footer">
				<slot name="panel-footer-content" />
			</div>
		</transition>
	</div>
</template>

<script>
import $ from 'jquery';

export default {
    name: "luna-panel",
    data() {
        return {
            isCollapsed: false
        }
    },
    props: {
        isToggle: {},
        isExpandable: {},
        isRemoveable: {},
        isPanelCloseDomRemove: {
            default: true
        }
    },
    methods: {
        panelClick(e) {
            this.$emit("click")
        },
        panelToggle(event) {
            // Handle panel toggle
            this.isCollapsed = !this.isCollapsed;
            // var hpanel = $(event.target).closest('div.panel');
            // var icon = $(event.target).closest('i');
            // var body = hpanel.find('div.panel-body');
            // var footer = hpanel.find('div.panel-footer');
            // body.slideToggle(200);
            // footer.slideToggle(100);

            // Toggle icon from up to down
            // icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
            // hpanel.toggleClass('').toggleClass('panel-collapse');
            // setTimeout(function () {
            // 	hpanel.resize();
            // 	hpanel.find('[id^=map-]').resize();
            // }, 50);
        },
        panelExpand(e) {
            const panelBox = this.$el,
                iconEl = e.target;
            panelBox.classList.toggle("expanded");
            if (panelBox.classList.contains("expanded")) {
                iconEl.classList.remove('fa-expand');
                iconEl.classList.add('fa-compress');
                this.$emit("click", panelBox);
            }
            else {
                iconEl.classList.remove('fa-compress');
                iconEl.classList.add('fa-expand');
            }
        },
        panelClose(event) {
            if (this.isPanelCloseDomRemove) {
                $(event.target).closest('div.panel').remove();
            }
            this.$emit("panelClose");
        }
    }
}
</script>

<style scoped>
	.panel-heading-slotArea {float:left;}
	.panel-heading:after {content:'';display:block;clear:both;height:0;}
	.bodyArea-enter-active {transition:all .3s ease;}
	.bodyArea-leave-active {transition:all .2s ease;}
	.bodyArea-enter, .bodyArea-leave-to {transform:translateY(-20px);opacity:0;}
	.footerArea-enter-active {transition:all .3s ease .2s;}
	.footerArea-leave-active {transition:all .2s ease;}
	.footerArea-enter, .footerArea-leave-to {transform:translateY(-30px);opacity:0;}
</style>