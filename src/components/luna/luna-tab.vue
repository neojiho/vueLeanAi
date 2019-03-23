<template>
	<div class="tabs-container">
		<ul class="nav nav-tabs">
			<li v-for="list in tabs" v-bind:id="`tabList_${list}`" class="tab-caption">
				<a data-toggle="tab" v-bind:data-targetContent="list" v-on:click="activateTab">{{list}}</a>
			</li>
		</ul>
		<div class="tab-content">
			<div v-for="list in tabs" v-bind:id="`tabContent_${list}`" class="tab-pane">
				<div class="panel-body">
					<slot v-bind:name="list" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "luna-tab",
	data() {
		return {
			allTabsEl: {},
			firstTabEl: {},
			allTabsContentEl: {},
			firstTabContentEl: {}
		}
	},
	props: ['tabs', 'initialTab'],
	methods: {
		activateTab(e = this.firstTabEl) {
			if (!e) return;
			const target = ((type) => {
				switch (type) {
					case "String" :
						return this.$el.querySelector(`#tabList_${e}`);
					case "MouseEvent" :
						return e.target.closest("li");
					case "HTMLLIElement" :
						return e;
					default :
						break;
				}
			})(e.constructor.name);

			const targetContentEl = target.querySelector("[data-toggle='tab']").getAttribute("data-targetContent");

			//remove active class every tab list and content
			for (const tab of this.allTabsEl) {
				tab.classList.remove("active");
			}
			for (const tabCon of this.allTabsContentEl) {
				tabCon.classList.remove("active");
			}

			//add active class selected tab list and content
			target.classList.add("active");
			this.$el.querySelector(`#tabContent_${targetContentEl}`).classList.add("active");
		}
	},
	mounted() {
		this.allTabsEl = this.$el.querySelector(".nav-tabs").childNodes;
		this.firstTabEl = this.$el.querySelector(".nav-tabs").firstChild;
		this.allTabsContentEl = this.$el.querySelectorAll(".tab-pane");
		this.firstTabContentEl = this.$el.querySelector(".tab-content").firstChild;

		//initial tab activate. if initial tab is not defined, activate first tab.
		this.activateTab(this.initialTab);
	}

}
</script>

<style scoped>
	.tab-caption {cursor:pointer}
</style>