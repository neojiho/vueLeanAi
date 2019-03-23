<template>
	<div class="paragraphText"></div>
</template>

<script>
import codeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

//theme
import 'codemirror/theme/darcula.css'; //grey tone + dark
import 'codemirror/theme/elegant.css';
/*
import 'codemirror/theme/base16-dark.css';
import 'codemirror/theme/colorforth.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/theme/idea.css'; //white idea
import 'codemirror/theme/lesser-dark.css';
import 'codemirror/theme/xq-dark.css';
import 'codemirror/theme/cobalt.css';
*/

//mode meta info
import 'codemirror/mode/meta'

//mode
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/r/r';
import 'codemirror/mode/python/python';
import 'codemirror/mode/sparql/sparql';
import 'codemirror/mode/sql/sql';

//addon : hint
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/xml-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/hint/show-hint.css'

//addon : fold
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/xml-fold.js';

let themeWhite = 'elegant',
	themeBlack = 'darcula';

export default {
	name: "CodeMirror",
	data() {
		return {
			codeInstance: {},
		}
	},
	props: {
	    codeText : "",
		themeType : {},
		lang : {}
	},
	methods: {
		getCodeValue() {
			return this.codeInstance.getValue();
		},
		getSelection() {
			return this.codeInstance.getSelection();
		},
		setCodeValue(val) {
		    return this.codeInstance.setValue(val);
		},
		setOption(name, val){
			this.codeInstance.setOption(name, this.getMode(val));
		},
		getMode(lang){
			if (Boolean(lang) && (typeof lang === "string")) {
			    lang = lang.toUpperCase();
				return codeMirror.modeInfo.find(item => {return item.name.toUpperCase() === lang}).mime;
			}
			else {
				return "text/html"
			}
		}
	},
	created(){

	},
	mounted() {
		// let mode = (lang => {
		// 	if (Boolean(lang) && (typeof lang === "string")) {
		// 	    lang = lang.toUpperCase();
		// 		return codeMirror.modeInfo.find(item => {return item.name.toUpperCase() === lang}).mime;
		// 	}
		// 	else {
		// 		return "text/html"
		// 	}
        // })(this.lang);
		let mode = this.getMode(this.lang);
		console.log(`init codeMirror mode : ${mode}`);
		const opt = {
		    value : this.codeText || '',
			mode: mode,
			indentWithTabs: true,
            matchBrackets: true,
            autofocus: false, //initial focus
			lineNumbers: true,
			lineWrapping: true,
			theme: this.themeType === 'white' ? themeWhite : themeBlack,
			extraKeys: {
                "Ctrl-Space": "autocomplete",
				"Alt-Space": "autocomplete",
                "Ctrl-Enter": (e) => {
                    this.$emit("codeRun")
                },
                "Shift-Enter": (e) => {
                    this.$emit("codeRun")
                },

            },
			hintOptions : {},
			completeSingle: false,
			foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		};

		//make code mirror instance
		this.codeInstance = codeMirror(this.$el, opt);
	},
	beforeUpdate(){
	    console.warn("cm got a lang : ",this.lang)
	},
	updated(){
		console.warn("codeText", this.codeText)
	}

}
</script>

<style scoped>

</style>