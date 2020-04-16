/* ========= initializing masonry ========= */
if ($(".grid").masonry) {
  // $(".grid").masonry({
  //   itemSelector: ".grid-item",
  //   columnWidth: 160,
  //   gutter: 20
  // });
  let $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    percentPosition: true,
    columnWidth: '.grid-sizer',
    gutter: 20
  });
}

/* ============ initializing wysiwyg editor ============ */
$(function() {
  if (document.querySelector('#editor1')) {
    tinymce.init({
    selector: '#editor1',
    plugins: 'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable',
    tinydrive_token_provider: 'URL_TO_YOUR_TOKEN_PROVIDER',
    tinydrive_dropbox_app_key: 'YOUR_DROPBOX_APP_KEY',
    tinydrive_google_drive_key: 'YOUR_GOOGLE_DRIVE_KEY',
    tinydrive_google_drive_client_id: 'YOUR_GOOGLE_DRIVE_CLIENT_ID',
    mobile: {
      plugins: 'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable'
    },
    menu: {
      tc: {
        title: 'TinyComments',
        items: 'addcomment showcomments deleteallconversations'
      }
    },
    menubar: 'file edit view insert format tools table tc help',
    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    image_advtab: true,
    content_css: '//www.tiny.cloud/css/codepen.min.css',
    link_list: [
      { title: 'My page 1', value: 'http://www.tinymce.com' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    mage_list: [
      { title: 'My page 1', value: 'http://www.tinymce.com' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_class_list: [
      { title: 'None', value: '' },
      { title: 'Some class', value: 'class-name' }
    ],
    importcss_append: true,
    height: 400,
    templates: [
          { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
      { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
      { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
    ],
    template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
    template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
    height: 600,
    image_caption: true,
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: 'sliding',
    spellchecker_dialog: true,
    spellchecker_whitelist: ['Ephox', 'Moxiecode'],
    tinycomments_mode: 'embedded',
    content_style: ".mymention{ color: gray; }",
    contextmenu: "link image imagetools table configurepermanentpen",
    a11y_advanced_options: true,
    });
  }
  // if ($('#editor1').froalaEditor) {
  //   $('#editor1').froalaEditor({
  //     // Set the file upload URL.
  //     imageUploadURL: 'image_upload',
  //     imageUploadParams: {
  //       id: 'my_editor'
  //     }
  //   })
  // }
});

/* ============ dismissing alert (time out) =============== */
if ($('[data-notify-position="top-right"]').length) {
  setTimeout(() => {
    $('[data-notify-position="top-right"]').alert('close')
  }, 5000)
}


/* ================ Deleting Single Post ================= */
const deletePost = (btn) => {
  const postId = btn.parentNode.querySelector('[name=postId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const postCard = btn.closest('.grid-item');

  swal({
    title: "Are you sure 🤔 ?",
    text: "Once deleted, you will not be able to recover this post!",
    icon: "warning",
    buttons: ["🤗 Cancel", "👍 Delete"],
    dangerMode: true,
  })
  .then((willDelete) => {
    console.log(postId)
    if (willDelete) {
      // making delete request to server
      let draftDelete = '';
      if (btn.getAttribute('draftDelete') == 'true') {
        draftDelete = '?draft=true';
      }
      fetch('/author/posts/' + postId + draftDelete, {
        method: 'DELETE',
        headers: {
          'csrf-token': csrf
        }
      })
        .then(result => {
          console.log(result)
          if (result.status == 200) {
            return result.json()
          } else {
            return Promise.reject(result)
          }
        })
        .then(data => {
          console.log(data)
          swal(data.message, {
            icon: "success",
          }).then(okay => {
            postCard.parentNode.removeChild(postCard)
          })
        })
        .catch(errResult => {
          console.log(errResult)
          if (errResult.status == 500) {
            return errResult.json()
          }
        })
        .then(failedData => {
          if (failedData) {
            swal({
              title: "Oops Deletion failed",
              text: failedData.message,
              icon: "error"
            })
          }
        })
    } else {
      swal("Your post is safe 😉!");
    }
  });
}