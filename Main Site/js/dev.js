/* ========= initializing masonry ========= */
if ($(".grid").masonry) {
  $(".grid").masonry({
    itemSelector: ".grid-item",
    columnWidth: 160,
    gutter: 20
  });
}

/* ============ initializing ckeditor ============ */
$(function() {
  if ($('#editor1').froalaEditor) {
    $('#editor1').froalaEditor({
      // Set the file upload URL.
      imageUploadURL: 'image_upload',
      imageUploadParams: {
        id: 'my_editor'
      }
    })
  }
});