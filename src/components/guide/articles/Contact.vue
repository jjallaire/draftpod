<script>
export default { 
    name: 'Contact'
}

</script>

<template>
  <div>
    <h2>Contact Us</h2>

    <p>
      If you have questions, encounter problems, or have ideas about how to improve mtglimited.io,  
      please contact us using the form below.
    </p>

    <form 
      id="contact-form" 
      method="post" 
      action="https://formspree.io/jj.allaire@gmail.com"
      role="form"
    >
      <div class="messages" />

      <div class="controls">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="form_name">
                First name:
              </label>
              <input 
                id="form_name" 
                type="text" 
                name="name" 
                class="form-control" 
                required="required" 
                data-error="Firstname is required."
              >
              <div class="help-block with-errors" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="form_lastname">
                Last name:
              </label>
              <input 
                id="form_lastname" 
                type="text" 
                name="surname" 
                class="form-control" 
                required="required" 
                data-error="Lastname is required."
              >
              <div class="help-block with-errors" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="form_email">
                Email address:
              </label>
              <input 
                id="form_email" 
                type="email" 
                name="email" 
                class="form-control" 
                required="required" 
                data-error="Valid email is required."
              >
              <div class="help-block with-errors" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="form_message">
                Message:
              </label>
              <textarea 
                id="form_message" 
                name="message" 
                class="form-control" 
                rows="7" 
                required="required" 
                data-error="Please, leave us a message."
              />
              <div class="help-block with-errors" />
            </div>
          </div>
          <div class="col-md-12">
            <input 
              type="submit" 
              class="btn btn-success btn-send" 
              value="Send Message"
            >
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style>

#contact-form .btn-send {
    margin-top: 15px;
    padding-left: 25px;
    padding-right: 25px;
}

</style>