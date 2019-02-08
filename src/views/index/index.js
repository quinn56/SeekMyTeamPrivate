function handleSignup() {
  console.log('in signup');
}    
    
    
    
    /*
    
    
    $(document).ready(function() {
      $("#signup").click(function() {
        $.post( "/signup", $("#signupForm").serialize(),
                function(data) {
                  $("#signupSuccess").show();
                }
              )
              .error(function(xhr) {
                switch(xhr.status) {
                  case 409:
                    $("#signupDuplicate").show();
                    break;
                  default:
                    $("#signupError").show();
                }
              })
              .always(function() {
                $("#signupModal").modal('hide');
              });
      })
    })
    </script>*/