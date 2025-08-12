const configStyles:any= {
	extraButtons: [
		{
			name: 'insertDate',
			iconURL: 'https://xdsoft.net/jodit/logo.png',
			exec: function (editor) {
				editor.__plugins.search.findAndReplace();
			}
		}
	],
	disablePlugins: 'add-new-line',
	readonly: false,
	style: {
		background: '#fff',
		color: 'var(--dark-blue-500)',
		fontWeight: '400'
	},
	defaultMode: '1',
	showCharsCounter: false,
	showWordsCounter: false,
	showXPathInStatusbar: false,
	buttons:
		'bold,italic,underline,strikethrough,eraser,ul,ol,indent,outdent,left,font,fontsize,paragraph,classSpan,brush,superscript,subscript,file,copyformat'
};

export default configStyles;