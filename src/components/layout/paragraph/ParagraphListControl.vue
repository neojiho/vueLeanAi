<template>
	<div v-show="isNoteSelected" class="paragraphListControl">
		<div class="paragraphListControlBtns">
			<span v-bind:class="['btn-group', {open : isCheckBoxMenuVisible}]"
			      v-on:mouseleave="isCheckBoxMenuVisible = false">
				<label class="btn btn-sm btn-default btn_allCheck">
					<input id='paragraphListControll_allCheck' type="checkbox" v-model="isAllCheckChecked"
					       v-on:click="($event)=>{check(String($event.target.checked))}" />
				</label>
				<button class="btn btn-sm btn-default btn_checkCaret"
				        v-on:click="isCheckBoxMenuVisible = !isCheckBoxMenuVisible">
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
                    <li><a href="#" v-on:click="check('ABOVE')">Check above of selected</a></li>
                    <li><a href="#" v-on:click="check('BELOW')">Check below of selected</a></li>
                    <li><a href="#" v-on:click="check('REVERSE')">Check reverse</a></li>
                    <li class="divider"></li>
                    <li><a href="#" v-on:click="check('SUCCESS')">Check SUCCESS</a></li>
                    <li><a href="#" v-on:click="check('ERROR')">Check ERROR</a></li>
                </ul>
			</span>

			<span v-bind:class="['btn-group', {open : isRunMenuVisible}]" v-on:mouseleave="isRunMenuVisible = false">
				<button type="button" class="btn btn-sm btn-accent" v-on:click.stop.prevent="run(undefined)">
					<i class="fa fa-play"></i><span class="bold"> Run</span>
				</button>
				<button class="btn btn-sm btn-accent btn_checkCaret" v-on:click="isRunMenuVisible = !isRunMenuVisible">
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
					<li><a href="#" v-on:click="run(undefined)">Run checked progressively</a></li>
                    <li><a href="#" v-on:click="runParallel(undefined)">Run checked at once</a></li>
                    <li class="divider"></li>
					<li><a href="#" v-on:click="run(getAllPragraphId)">Run All progressively</a></li>
                    <li><a href="#" v-on:click="runParallel(getAllPragraphId)">Run All at once</a></li>
				</ul>
			</span>

			<span v-bind:class="['btn-group', {open : isDeleteMenuVisible}]"
			      v-on:mouseleave="isDeleteMenuVisible = false">
				<button type="button" class="btn btn-sm btn-default"
				        v-on:click.stop.prevent="deleteParagraphs(undefined)">
					<i class="fa fa-trash-o"></i><span class="bold"> Delete</span>
				</button>
				<button class="btn btn-sm btn-default btn_checkCaret"
				        v-on:click="isDeleteMenuVisible = !isDeleteMenuVisible">
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
					<li><a href="#" v-on:click="deleteParagraphs(undefined)">Delete checked</a></li>
                    <li><a href="#" v-on:click="deleteParagraphs(getAllPragraphId)">Delete All</a></li>
				</ul>
			</span>

			<span v-bind:class="['btn-group', {open : isExpandMenuVisible}]"
			      v-on:mouseleave="isExpandMenuVisible = false">
				<button type="button" class="btn btn-sm btn-default" v-on:click.stop.prevent="expand(undefined)">
					<i class="fa fa-chevron-down"></i><span class="bold"> Expand</span>
				</button>
				<button class="btn btn-sm btn-default btn_checkCaret"
				        v-on:click="isExpandMenuVisible = !isExpandMenuVisible">
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
                    <li><a href="#" v-on:click="expand(undefined)">Expand checked</a></li>
                    <li><a href="#" v-on:click="expand(getAllPragraphId)">Expand All</a></li>
				</ul>
			</span>

			<span v-bind:class="['btn-group', {open : isCollapseMenuVisible}]"
			      v-on:mouseleave="isCollapseMenuVisible = false">
				<button type="button" class="btn btn-sm btn-default" v-on:click.stop.prevent="collapse(undefined)">
					<i class="fa fa-chevron-up" v-on:click="isCollapseMenuVisible = !isCollapseMenuVisible">
					</i><span class="bold"> Collapse</span>
				</button>
				<button class="btn btn-sm btn-default btn_checkCaret"
				        v-on:click="isCollapseMenuVisible = !isCollapseMenuVisible">
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
                    <li><a href="#" v-on:click="collapse(undefined)">collapse checked</a></li>
                    <li><a href="#" v-on:click="collapse(getAllPragraphId)">collapse All</a></li>
				</ul>
			</span>

			<span v-bind:class="['btn-group', {open : isResultOpenMenuVisible}]"
			      v-on:mouseleave="isResultOpenMenuVisible = false">
				<button type="button" class="btn btn-sm btn-primary" v-on:click.stop.prevent="resultOpen(undefined)">
					<i class="fa fa-chevron-down"></i><span class="bold"> Result Open</span>
				</button>
				<button class="btn btn-sm btn-primary btn_checkCaret"
				        v-on:click="isResultOpenMenuVisible = !isResultOpenMenuVisible">
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
                    <li><a href="#" v-on:click="resultOpen(undefined)">Result Open checked</a></li>
                    <li><a href="#" v-on:click="resultOpen(getAllPragraphId)">Result Open All</a></li>
				</ul>
			</span>

			<span v-bind:class="['btn-group', {open : isResultCloseMenuVisible}]"
			      v-on:mouseleave="isResultCloseMenuVisible = false">
				<button type="button" class="btn btn-sm btn-primary" v-on:click.stop.prevent="resultClose(undefined)">
					<i class="fa fa-chevron-up"></i><span class="bold"> Result Close</span>
				</button>
				<button class="btn btn-sm btn-primary btn_checkCaret"
				        v-on:click="isResultCloseMenuVisible = !isResultCloseMenuVisible">
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
                    <li><a href="#" v-on:click="resultClose(undefined)">Result Close checked</a></li>
                    <li><a href="#" v-on:click="resultClose(getAllPragraphId)">Result Close All</a></li>
				</ul>
			</span>

			<!--<span v-bind:class="['btn-group', {open : isSearchMenuVisible}]" >-->
			<!--<button type="button" class="btn btn-sm btn-default btn-single" v-on:click="isSearchMenuVisible = !isSearchMenuVisible">-->
			<!--<i class="fa fa-search"></i><span class="bold"></span>-->
			<!--</button>-->
			<!--<span class="dropdown-menu">-->
			<!--<input type="search" class="form-control" v-on:input="searchInput(searchKey)" v-model="searchKey"/>-->
			<!--</span>-->
			<!--</span>-->

		</div>
		<ProgressBar size="3"
		             v-bind:val="paragraphsRunProgressCnt"
		             v-bind:bar-transition="'all 0.3s ease'"
		             v-bind:bar-color="progressBarColor"
		             v-bind:bg-color="'#2F323B'"
		             v-bind:text-fg-color="'#949ba2'"
		             v-bind:font-size="10"
		             v-bind:spacing="10"
		             v-bind:text-position="'top'"
		             v-bind:max="100"
		             v-bind:class="['vue-progress-wrap', isRun? 'active': '']" />
	</div>
</template>

<script>
import ProgressBar from 'vue-simple-progress'
import EventBus from '@/eventBus/';

export default {
    data() {
        return {
            isAllCheckChecked : false,
            isCheckBoxMenuVisible : false,
            isRunMenuVisible : false,
            isDeleteMenuVisible : false,
            isCollapseMenuVisible : false,
            isExpandMenuVisible : false,
            isResultOpenMenuVisible : false,
            isResultCloseMenuVisible : false,
            isSearchMenuVisible : false,
            searchKey : ""
        }
    },
    computed : {
        isNoteSelected() {
            return this.$store.getters.isNoteSelected
        },
        getAllPragraphId() {
            return this.$parent.$refs.paragraphList.getAllParagraphId()
        },
        paragraphsRunProgressCnt() {
            return this.$store.state.paragraphsRun.cnt
        },
        isRun() {
            return this.$store.state.paragraphsRun.isRun
        },
        progressBarColor() {
            switch (this.$store.state.paragraphsRun.status) {
                case 'READY' :
                    return "#393C45"; //same to bg color
                case 'PENDING' :
                    return "#949ba2";
                case 'RUNNING' :
                    return "#eee";
                case 'FINISHED' :
                    return "#1bbf89";
                case 'ABORT' :
                    return "#db524b";
                case 'ERROR' :
                    return "#db524b";
                default :
                    return "#949ba2";
            }
        }
    },
    methods : {
        initCheck(value) {
            this.$nextTick(() => {
                this.$el.querySelector("#paragraphListControll_allCheck").checked = value;
            })
        },
        check(type) {
            this.$parent.$refs.paragraphList.check(type.toUpperCase());
        },
        run(list) {
            this.$parent.$refs.paragraphList.run(list, false);
        },
        runParallel(list) {
            this.$parent.$refs.paragraphList.run(list, true);
        },
        deleteParagraphs(list) {
            this.$parent.$refs.paragraphList.delete(list);
        },
        expand(list) {
            this.$parent.$refs.paragraphList.expand(list);
        },
        collapse(list) {
            this.$parent.$refs.paragraphList.collapse(list);
        },
        resultOpen(list) {
            this.$parent.$refs.paragraphList.resultOpen(list);
        },
        resultClose(list) {
            this.$parent.$refs.paragraphList.resultClose(list);
        },
        searchInput(keyword) {
            this.$parent.$refs.paragraphList.search(keyword)
        }
    },
    mounted() {
        EventBus.$on("initCheck", this.initCheck);
    },
    name : "ParagraphListControl",
    components : {ProgressBar}
}
</script>

<style scoped>

</style>
