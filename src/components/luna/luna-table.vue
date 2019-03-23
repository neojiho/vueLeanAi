<template>
	<table id="" class="table">
		<thead>
			<tr>
				<th v-for="head in this.tHeadList">{{head}}</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="row in this.tableData">
				<td v-for="td in row">{{td}}</td>
			</tr>
		</tbody>
	</table>
</template>


<script>
export default {
	name: "luna-table",
	data(){
		return {}
	},
	computed : {
		tHeadList(){
			if (this.tableData) return Object.keys(this.tableData[0]);
		}

	},
	props : ["tableData"],
	methods : {},
	mounted(){
	},
	beforeUpdate(){
	},
	updated(){
	}
}
</script>

<style scoped>

</style>