<template>
	<div class="dataTableWrap">
		<div class="filterWrap">
			<input type="text" class="form-control" v-model="filter" placeholder="Filter">
		</div>
		<datatable v-bind:columns="columns" v-bind:data="rows" v-bind:filter-by="filter"></datatable>
		<div class="pagerWrap">
			<datatable-pager v-model="page" type="abbreviated"
			                            v-bind:per-page="per_page"></datatable-pager>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import DatatableFactory from 'vuejs-datatable/dist/vuejs-datatable.esm.js';
import DataParser from '@/common/parser';

Vue.use(DatatableFactory);


export default {
	name: "luna-dataTable",
	data() {
		return {
			/*example_columns: [
				{label: 'id', field: 'id'},
				{label: 'Username', field: 'user.username', headerClass: 'class-in-header second-class'},
				{label: 'First Name', field: 'user.first_name'},
				{label: 'Last Name', field: 'user.last_name'},
				{label: 'Email', field: 'user.email'},
				{
					label: 'address', representedAs: function (row) {
						return row.address + '<br />' + row.city + ', ' + row.state;
					}, interpolate: true
				}
			],
			example_rows: [
				{
					"id": 1,
					"user": {
						"username": "dprice0",
						"first_name": "Daniel",
						"last_name": "Price",
						"email": "dprice0@blogs.com"
					},
					"address": "3 Toban Park",
					"city": "Pocatello",
					"state": "Idaho"
				}
			]*/
            filter: '',
            page: 1,
            per_page: 10
        }
	},
	computed: {
		columns() {
			if (!this.tableData || !this.tableHeader) return [];
			return DataParser.parse("dataTableColumn", [...this.tableHeader])
		},
		rows() {
			if (!this.tableData || !this.tableHeader) return [];
			return DataParser.parse("dataTableRow", [...this.tableHeader], this.tableData)
		}

	},
	props: ["tableHeader", "tableData"],
	beforeCreate (){
	    DataParser.setParseFunc("dataTableColumn", tableHeader => {
	        return tableHeader.reduce((acc, cur) => {
	            acc.push({field:cur, label:cur});
				return acc;
	        }, [])
	    });
	    DataParser.setParseFunc("dataTableRow", (tableHeader, tableData)=>{
	        const tableRow = tableData.split("\n");
			return tableRow.reduce((rows, row)=>{
			    if (!row) return rows;
				const vals = row.split("\t");
				rows.push(tableHeader.reduce((acc, field, idx)=>{
					acc[field] = vals[idx];
					return acc;
				}, {}));
				return rows
			}, []);
	    });
	}
}
</script>

<style scoped lang="scss">
</style>