/*
 * Description:
 * The goal of this script is to test sign in and sign out.
 *
 * command to run on prod:
 * RL-Casper$ casperjs test pam/newTest.js --env=prod --ignore-ssl-errors=true --ssl-protocol=any --includes=resources/generalFunctions.js
 *
 */

casper.test.begin("Login Logout test", function (test) {
    var waitTime = 3000;
    var varscreenshotNow = new Date();
    var viewports = [
            {
              'name': 'smartphone-portrait',
              'viewport': {width: 320, height: 480}
            },
            {
              'name': 'smartphone-landscape',
              'viewport': {width: 480, height: 320}
            },
            {
              'name': 'tablet-portrait',
              'viewport': {width: 768, height: 1024}
            },
            {
              'name': 'tablet-landscape',
              'viewport': {width: 1024, height: 768}
            },
            {
              'name': 'desktop-standard',
              'viewport': {width: 1280, height: 1024}
            }
          ];

    var environment = casper.cli.get("env");
    if (!environment){
        // If the environement is not passed in, then use prod by default
        var urlPrefix = 'http://www';
        environment = "prod";
    }
    else {
      if(environment == 'test'){var urlPrefix = 'http://www.test';}
      else if(environment == 'stage'){var urlPrefix = 'http://www.stg';}
      else if (environment == 'prod'){var urlPrefix = 'http://www';}
      else { casper.echo("I do not recognize your environment argument. Acceptable options are 'test', 'stage', 'prod'."); return; }
    }

    //load the home page and verify it is correct
    casper.start( urlPrefix + ".rocketlawyer.com", function() {
      this.echo("======= Beginning Test Suite =======");
      this.echo("======= Environment is " + environment);
      test.assertHttpStatus(200, 'Connected to Home page');
      test.assertTitle('Affordable Legal Services, Free Legal Documents, Advice & Ask a Lawyer | Rocket Lawyer', 'Title is correct');
    });
    
    //go to sign up page
	  casper.thenClick(".rlHeaderTopRightLink[href='/login-register.rl#/register?hd=navreg']", function () {
  		this.echo("======= Going to sign up page =======");
  		test.assertHttpStatus(200, 'Connected to Registration page');
    });

    //register user
   casper.waitForUrl("/login-register.rl", function () {
      test.assertTitle("Login and registration", "Title is correct");
      this.echo("======= Registering a new user =======");
      this.fillSelectors("form#registerForm", {
        "form#registerForm #email"  : userName,
        "form#registerForm #pass"   : userName
      }, true);

      this.echo("User is:  " + userName + "\n");
    });

   // verify that user ends up on dashboard
   casper.waitForUrl("/dashboard.rl", function () {
      this.echo("======= Checking to make sure that user lands on dashboard =======");
      test.assertHttpStatus(200, 'Connected to Dashboard');
      test.assertTitle("Dashboard", "Title is correct");
    });

   // log out
    casper.thenClick(".rlMenuPopupGenericItemLink[href='/secure/registration/logout.aspx']", function () {
      this.echo("======= Signing Out =======");
      test.assertHttpStatus(200, 'Connected to Home page');
      test.assertTitle('Affordable Legal Services, Free Legal Documents, Advice & Ask a Lawyer | Rocket Lawyer', 'Title is correct');
    });   


   // log back in
    casper.thenClick(".rlHeaderTopRightLink[href='/login-register.rl#/login?hd=navreg']", function () {
      this.echo("======= Going to sign in page =======");
      test.assertHttpStatus(200, 'Connected to Login page');
    });

   casper.waitForUrl("/login-register.rl", function () {
      test.assertTitle("Login and registration", "Title is correct");
      this.echo("======= Logging in as user " + userName + "=======");
      this.fillSelectors("form#loginForm", {
        "form#loginForm #email"  : userName,
        "form#loginForm #pass"   : userName
      }, true);
    });

   // verify that user ends up on dashboard
   casper.waitForUrl("/dashboard.rl", function () {
      test.assertHttpStatus(200, 'Connected to Dashboard');
      test.assertTitle("Dashboard", "Title is correct");

      var loggedInUser = getCurrentUser();

      printUserInfo(loggedInUser);

      this.echo("Login succeeded.");

    });   

    casper.run(function() {
        test.done();
    });
});
