/* tinymce.init({
    selector: '#mytextarea',
    language: 'pt_BR',
    plugins:[
        'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
        'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 
        'table', 'emoticons', 'template', 'codesample'
    ],
    toolbar: 'undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify |' + 
    'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
    'forecolor backcolor emoticons',
    menu: {
        favs: {title: 'menu', items: 'code visualaid | searchreplace | emoticons'}
    },
    menubar: 'favs file edit view insert format tools table',
    content_style: 'body{font-family:Helvetica,Arial,sans-serif; font-size:16px}'
}); */
try {
    tinymce.init({
        selector: '#mytextarea',
        language: 'pt_BR',
        plugins: 'preview importcss tinydrive searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars linkchecker emoticons',
        tinydrive_token_provider: '/tinymce-jwt',
        toolbar: "undo redo | revisionhistory | aidialog aishortcuts | blocks fontsizeinput | bold italic | align numlist bullist | link image | table media | lineheight  outdent indent | strikethrough forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog",
        mobile: {
            plugins: 'preview importcss tinydrive searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars linkchecker emoticons',
        },
    });
  } catch (error) {
    console.error("O editor não carregour corretamente, reiniciando...");
    location.reload();
  }


//https://www.tiny.cloud/docs/tinymce/latest/full-featured-premium-demo/


// Alterar pra carregar com rota se não da errp
/* const button = document.getElementById('button');
button.addEventListener("click", () => {
    console.log(tinymce.activeEditor.getContent()); 
}) */

