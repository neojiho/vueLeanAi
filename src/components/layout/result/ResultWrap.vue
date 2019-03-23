<template>
	<div class="resultPanelWrap">
		<!--result area-->
		<luna-panel v-if="usePanel" v-bind:isExpandable="this.isExpandable" v-bind:isToggle="isToggle"
		            v-bind:class="isCollapsed?
		'collapsed' :
		''">
			<div slot="panel-header-content">
				status : {{this.status || ""}}
			</div>
			<div slot="panel-body-content" v-if="isResult">
				<luna-dataTable v-if="this.tableData"
				                v-bind:tableHeader="tableHeader" v-bind:tableData="tableData">
				</luna-dataTable>
				<div class='resultTextArea' v-if="this.textData">{{textData}}</div>
			</div>
		</luna-panel>
		<!--paragraph result-->
		<div v-else class="noPanelResultArea">
			<div class="resultSelectArea">
				<button class="btn btn-default btn-sm" type="button" v-on:click="resultViewType = 'text'"
				        v-show="resultViewType === 'text'">
					<span class="bold">
					TEXT</span>
				</button>
				<button class="btn btn-default btn-sm" type="button" v-on:click="resultViewType = 'table'"
				        v-show="resultViewType === 'table'">TABLE
				</button>
				<!--<button class="btn btn-default btn-sm" type="button" v-on:click="resultViewType = 'chart'"-->
				        <!--v-show="resultViewType === 'chart'">CHART-->
				<!--</button>-->
			</div>

			<div class='resultTextArea' v-if="resultViewType === 'text'">
				<pre>{{replacedText}}</pre>
			</div>
			<div class="resultTableArea" v-else-if="resultViewType === 'table'">
				<luna-dataTable slot="panel-body-content"
			                v-bind:tableHeader="tableHeader" v-bind:tableData="tableData">
				</luna-dataTable>
			</div>
			<!--<div class="resultChartArea" v-else-if="resultViewType === 'chart'">-->
				<!--chart-->
			<!--</div>-->
		</div>
	</div>
</template>

<script>
import {DATAINFO} from '@/common/const';
import {lunaPanel, lunaTable, lunaDataTable} from '@/components/luna/';

export default {
	name: "ResultWrap",
	data() {
		return {
			resultViewType : "text",
			tableViewType : ""
		}
	},
	computed: {
	    replacedText(){
	        if (this.textData) {return this.textData.replace("↵", "<br />")}
	    },
		resultData() {
			if (this.isActivateResult) {
				return this.$store.state.activateParagraphResult || {}
			}
			else {
				return this.responseData || {}
			}
		},
		isResult() {
			const result = this.resultData;
			if (result instanceof Array) return Boolean(result.length);
			else if (result instanceof Object) return Boolean(Object.keys(result).length);
		},
		status() {
			return this.isResult && this.resultData["code"];
		},
		dataType() {
			if (!this.isResult) {
				return "none";
			}
			else if (!this.tableHeader) {
				return "text";
			}
			else if (this.resultData["header"].length >= 1) {
				return "table";
			}
			else {
				return "chart";
			}
		},
		tableHeader() {
			return this.resultData["header"];
		},
		tableData() {
			if (!this.resultData || !this.tableHeader) return undefined;
			if (this.status === 'SUCCESS' && (this.dataType === 'table')) return this.resultData['data']
		},
		textData() {
			if (!this.isResult) return undefined;
			if (this.dataType === 'text') return this.resultData['data'];
		}
	},
	props: {
		isExpandable: {type: Boolean},
		responseData: {},
		isActivateResult: {type: Boolean},
		isCollapsed: {type: Boolean},
		isToggle: {type: Boolean},
		usePanel: {
			type: Boolean, default: true
		},
	},
	methods: {
		onStatusChange(s = this.status) {
			this.$emit("statusChange", this.status)
		}
	},
	components: {
		lunaPanel, lunaTable, lunaDataTable
	},
	mounted() {
		this.onStatusChange(this.status);
		if (this.textData) this.resultViewType = "text";
        else if (this.tableData) this.resultViewType = "table";
        else this.resultViewType = "text"
	},
	updated() {
		this.onStatusChange(this.status);
		if (this.textData) this.resultViewType = "text";
        else if (this.tableData) this.resultViewType = "table";
        else this.resultViewType = "text"
	}
}
</script>

<style scoped>

</style>