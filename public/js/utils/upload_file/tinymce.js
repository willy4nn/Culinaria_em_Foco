try {
    tinymce.init({
        selector: '#mytextarea',
        language: 'pt_BR',
        plugins: 'preview importcss tinydrive searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars linkchecker emoticons',
        tinydrive_token_provider: '/api/uploads/tinymce-jwt',
        toolbar: "undo redo | revisionhistory | aidialog aishortcuts | blocks fontsizeinput | bold italic | align numlist bullist | link image | table media | lineheight  outdent indent | strikethrough forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog",
        mobile: {
            plugins: 'preview importcss tinydrive searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars linkchecker emoticons',
        },
        block_unsupported_drop: true,
        automatic_uploads: false,
    });
  } catch (error) {
    console.error("O editor não carregour corretamente, reiniciando...");
    location.reload();
  }