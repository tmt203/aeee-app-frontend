export const EDITOR_CONFIG = {
	selector: "textarea",
	width: "100%",
	plugins: [
		"advlist",
		"autolink",
		"link",
		"image",
		"lists",
		"charmap",
		"preview",
		"anchor",
		"pagebreak",
		"searchreplace",
		"wordcount",
		"visualblocks",
		"code",
		"fullscreen",
		"insertdatetime",
		"media",
		"table",
		"emoticons",
		"help"
	],
	toolbar:
		"undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
		"bullist numlist outdent indent | link image | print preview media fullscreen | " +
		"forecolor backcolor emoticons | help",
	menubar: "favs file edit view insert format tools table help",
	autosave_interval: "30s",
	autosave_restore_when_empty: true,
	autosave_retention: "2m",
	quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote",
	quickbars_insert_toolbar: "image media table codesample",
	image_advtab: true,
	image_title: true,
	automatic_uploads: true,
	file_picker_types: "image media",
	content_css: "light",
	skin: "oxide"
	// content_css: "dark",
	// skin: "oxide-dark"
};
