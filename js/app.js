/*****
* CONFIGURATION
*/
//Main navigation
$.navigation = $('nav > ul.nav');

$.panelIconOpened = 'icon-arrow-up';
$.panelIconClosed = 'icon-arrow-down';

//Default colours
$.brandPrimary =  '#20a8d8';
$.brandSuccess =  '#4dbd74';
$.brandInfo =     '#63c2de';
$.brandWarning =  '#f8cb00';
$.brandDanger =   '#f86c6b';

$.grayDark =      '#2a2c36';
$.gray =          '#55595c';
$.grayLight =     '#818a91';
$.grayLighter =   '#d1d4d7';
$.grayLightest =  '#f8f9fa';

'use strict';
``

/****
* MAIN NAVIGATION
*/

$(document).ready(function($){
  // Add class .active to current link
  $.navigation.find('a').each(function(){

    var cUrl = String(window.location).split('?')[0];

    if (cUrl.substr(cUrl.length - 1) == '#') {
      cUrl = cUrl.slice(0,-1);
    }

    if ($($(this))[0].href==cUrl) {
      $(this).addClass('active');

      $(this).parents('ul').add(this).each(function(){
        $(this).parent().addClass('open');
      });
    }
  });

  // Dropdown Menu
  $.navigation.on('click', 'a', function(e){
    if ($.ajaxLoad) {
      e.preventDefault();
    }

    if ($(this).hasClass('nav-dropdown-toggle')) {
      $(this).parent().toggleClass('open');
      resizeBroadcast();
    }
  });

  function resizeBroadcast() {
    var timesRun = 0;
    var interval = setInterval(function(){
      timesRun += 1;
      if(timesRun === 5){
        clearInterval(interval);
      }
      window.dispatchEvent(new Event('resize'));
    }, 62.5);
  }
    
  /* ---------- Main Menu Open/Close, Min/Full ---------- */
  $('.navbar-toggler').click(function(){
    if ($(this).hasClass('sidebar-toggler')) {
      $('body').toggleClass('sidebar-hidden');
      resizeBroadcast();
    }
    if ($(this).hasClass('aside-menu-toggler')) {
      $('body').toggleClass('aside-menu-hidden');
      resizeBroadcast();
    }
    if ($(this).hasClass('mobile-sidebar-toggler')) {
      $('body').toggleClass('sidebar-mobile-show');
      resizeBroadcast();
    }
  });
    
  $('.sidebar-close').click(function(){
    $('body').toggleClass('sidebar-opened').parent().toggleClass('sidebar-opened');
  });

  /* ---------- Disable moving to top ---------- */
  $('a[href="#"][data-top!=true]').click(function(e){
    e.preventDefault();
  });
    
});

/****
* CARDS ACTIONS
*/

$(document).on('click', '.card-actions a', function(e){
  e.preventDefault();

  if ($(this).hasClass('btn-close')) {
    $(this).parent().parent().parent().fadeOut();
  } else if ($(this).hasClass('btn-minimize')) {
    var $target = $(this).parent().parent().next('.card-block');
    if (!$(this).hasClass('collapsed')) {
      $('i',$(this)).removeClass($.panelIconOpened).addClass($.panelIconClosed);
    } else {
      $('i',$(this)).removeClass($.panelIconClosed).addClass($.panelIconOpened);
    }

  } else if ($(this).hasClass('btn-setting')) {
    $('#myModal').modal('show');
  }

});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function init(url) {
  /* ---------- Tooltip ---------- */
  $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({"placement":"bottom",delay: { show: 400, hide: 200 }});

  /* ---------- Popover ---------- */
  $('[rel="popover"],[data-rel="popover"],[data-toggle="popover"]').popover();
}

/* ----- Useful Scripts: Can Be Used Anywhere ----- */

// Check for HTML5 Local Storage
// All pages
function localStorageCheck() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        alert("localStorage is not supported. For this site to function properly, please use a compatible browser.")
        return false;
    }
}

// Increments a progress-bar div by a given amount
// All pages
function progressBar(progressDiv, incrementVal) {
    var progress = document.getElementById(progressDiv);
    var temp = Number(progress.getAttribute('aria-valuenow'))+incrementVal;
    var wTemp = 'width: '+String(temp)+'%';
    progress.setAttribute('aria-valuenow', temp);
    progress.setAttribute('style',wTemp);
}

// Login a User
// Login
// userLogin
$('#button-login').on('click', function(){
    firebase.auth().signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value).catch(function(error) {
        console.log("Something wrong: " + error.message);
        toastr["warning"]("Error:" + error.message);
    });
});

// Register a Company
// Login
// userRegister
$('#button-register').on('click', function() {
    window.location="register.html";
});

// Send to Forgot Password
// Login
// forgotPassword
$('#button-forgot').on('click', function() {
    window.location="forgot.html";
});

// Return to Login Page
// Forgot
// returnLogin
$('#button-return').on('click', function() {
    window.location="login.html";
});

// Reset Password
// Forgot
// resetPassword
$('#button-reset').on('click', function() {
    var auth = firebase.auth();
    var emailAddress = document.getElementById("forgot-email").value;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
        window.location="login.html";
    }).catch(function(error) {
        toastr["warning"]("Something happened: " + error);
      // An error happened.
    });
});


// Check to make sure that passwords match
// Register
function passCheck(input) {
    // Store the password field objects into variables
    var pass1 = document.getElementById('password-input');
    var pass2 = document.getElementById('password-confirm');
    // Store the Confimation Message Object
    var message = document.getElementById('password-match');
    // Store the button that creates user
    var createButton = document.getElementById('button-create-company');
    // Set the colors we will be using
    var goodColor = $.brandSuccess;
    var badColor = $.brandDanger;
    // Compare the values in the password field 
    // and the confirmation field
    if(pass1.value == pass2.value){
        // The passwords match. 
        // Set the color to the good color and inform
        // the user that they have entered the correct password 
        pass2.style.backgroundColor = null;
        message.style.color = goodColor;
        message.innerHTML = "Passwords Match!"
        if(input==null)createButton.classList.remove("disabled");
    }else{
        // The passwords do not match.
        // Set the color to the bad color and
        // notify the user.
        pass2.style.backgroundColor = badColor;
        message.style.color = badColor;
        message.innerHTML = "Passwords Do Not Match!"
        if(input==null)if(!createButton.classList.contains("disabled")) createButton.classList.add("disabled");
    }
}

// Passwords must be of minimal length 8 for firebase
// Register
function passMinCheck() {
    // Store the Password Hint Message Object
    var hintMessage = document.getElementById('password-hint');
    var input = document.getElementById('password-input');
    var confirm = document.getElementById('password-confirm');
    // Set the color to be used
    var badColor = $.brandDanger;
    // Compare the length of the Password
    if(input.value.length < 8) {
        hintMessage.style.color = badColor;
        hintMessage.innerHTML = "Password Must be at least 8 characters long";
        if(!confirm.hasAttribute('disabled')) {
            confirm.setAttribute('disabled',true);
        }
    }else{
        hintMessage.innerHTML = null;
        document.getElementById('password-confirm').removeAttribute("disabled");
    }
}

/* ----- Page Specific Scripts ----- */
/*************************************/

// Function run when creating a new company account: createCompany()
// Register
$('#button-create-company').on('click',function(){
    if(!document.getElementById('button-create-company').classList.contains('disabled')) {
        var input = document.getElementById('password-input');
        var confirm = document.getElementById('password-confirm');
        if(input.value == confirm.value) {
                var email = document.getElementById('email-input');
                var loading = document.getElementById('loading');
                email.setAttribute('disabled',true);
                input.setAttribute('disabled',true);
                confirm.setAttribute('disabled',true);
                loading.setAttribute('style','display:true');
                localStorage["WYDuserEmail"] = email.value;
                // Actually sign up user
                firebase.auth().createUserWithEmailAndPassword(email.value, input.value).catch(function (err) {
                    // Handle errors
                    toastr["warning"]("Something Happened. Please try again.\n"+err);
                    email.removeAttribute('disabled');
                    input.removeAttribute('disabled');
                    confirm.removeAttribute('disabled');
                    loading.setAttribute('style','display:none');
                });
        } else{
            toastr["warning"]("Passwords Do Not Match!!\nPlease Try Again.");
        }
    }
});

// Checks to Make sure that Company Profile Information is filled in before enabling save button
// Create Company Profile
function companyProfileCheck() {
    var allFilled = 0;
    if(document.getElementById('name-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('address-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('contact-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('website-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('lunch-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('first-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('last-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('full-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('initials-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('cell-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('contact-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('class-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('title-input').value == "") {
        allFilled++;
    }
    if(allFilled == 0) {
        document.getElementById('button-create-company-profile').classList.remove("disabled");
    }
    else {
        document.getElementById('button-create-company-profile').classList.add("disabled");
    }
}

// Checks to Make sure that User Profile Information is filled in before enabling save button
// userProfileCheck()
// Operations-seats
function userProfileCheck() {
    var allFilled = 0;
    if(document.getElementById('first-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('last-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('full-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('initials-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('access-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('cell-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('contact-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('class-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('title-input').value == "") {
        allFilled++;
    }
    if(allFilled == 0) {
        document.getElementById('button-add-user-info').disabled = false;
    }
    else {
        document.getElementById('button-add-user-info').disabled = true;
    }
}

// Checks to Make sure that User Profile Information is filled in before enabling save button
// companyJobCheck()
// Operations-jobs
function companyJobCheck() {
    var allFilled = 0;
    if(document.getElementById('name-input').value == "") {
        allFilled++;
    }
    else if(document.getElementById('number-input').value == "") {
        allFilled++;
    }
    if(allFilled == 0) {
        document.getElementById('button-add-job-confirm').disabled = false;
    }
    else {
        document.getElementById('button-add-job-confirm').disabled = true;
    }
}

// Function run when creating a new company profile
// createCompanyProfile()
// Create Company Profile
$('#button-create-company-profile').on('click', function(){
    var newCompany = firebase.database().ref('company').push();
    var newCompanyKey = newCompany.key;
    var uID = localStorage["WYDuserID"];
    var updateEverything = {};
    var loading = document.getElementById('loading').setAttribute('style','display:true');
    // Add Company Information
    // Change the below if seat numbers are changed when making payments
    updateEverything['company/' + newCompanyKey + '/payment/seats'] = 25;
    updateEverything['company/' + newCompanyKey + '/payment/used'] = 0;
    updateEverything['company/' + newCompanyKey + '/payment/signup'] = getTodaysDate(0,0,0);
    updateEverything['company/' + newCompanyKey + '/payment/payStart'] = getTodaysDate(0,0,0);
    updateEverything['company/' + newCompanyKey + '/payment/payEnd'] = getTodaysDate(1,0,0);
    updateEverything['company/' + newCompanyKey + '/info/name'] = document.getElementById('name-input').value;
    updateEverything['company/' + newCompanyKey + '/info/numContact'] = document.getElementById('contact-input').value;
    updateEverything['company/' + newCompanyKey + '/info/address'] = document.getElementById('address-input').value;
    updateEverything['company/' + newCompanyKey + '/info/numFax'] = document.getElementById('fax-input').value;
    updateEverything['company/' + newCompanyKey + '/info/website'] = document.getElementById('website-input').value;
    updateEverything['company/' + newCompanyKey + '/info/lunch'] = document.getElementById('lunch-input').value;
    // Add User Information in Company
    updateEverything['company/' + newCompanyKey + '/users/' + uID + '/nameFirst'] = document.getElementById('first-input').value;
    updateEverything['company/' + newCompanyKey + '/users/' + uID + '/nameLast'] = document.getElementById('last-input').value;
    updateEverything['company/' + newCompanyKey + '/users/' + uID + '/nameFull'] = document.getElementById('full-input').value;
    updateEverything['company/' + newCompanyKey + '/users/' + uID + '/nameInitials'] = document.getElementById('initials-input').value;
    updateEverything['company/' + newCompanyKey + '/users/' + uID + '/class'] = document.getElementById('class-input').value;
    // Add User Information in Users Section
    updateEverything['user/' + uID + '/access'] = 1;
    updateEverything['user/' + uID + '/nameFirst'] = document.getElementById('first-input').value;
    updateEverything['user/' + uID + '/nameLast'] = document.getElementById('last-input').value;
    updateEverything['user/' + uID + '/nameFull'] = document.getElementById('full-input').value;
    updateEverything['user/' + uID + '/nameInitials'] = document.getElementById('initials-input').value;
    toastr["info", "userEmail: " + localStorage["WYDuserEmail"]];  
    updateEverything['user/' + uID + '/email'] = localStorage["WYDuserEmail"];
    updateEverything['user/' + uID + '/numCell'] = document.getElementById('cell-input').value;
    updateEverything['user/' + uID + '/numContact'] = document.getElementById('contact-input').value;
    updateEverything['user/' + uID + '/class'] = document.getElementById('class-input').value;
    updateEverything['user/' + uID + '/jobTitle'] = document.getElementById('title-input').value;
    updateEverything['user/' + uID + '/nameInitials'] = document.getElementById('initials-input').value;
    updateEverything['user/' + uID + '/companyName'] = document.getElementById('name-input').value;
    updateEverything['user/' + uID + '/companyID'] = newCompanyKey;
    updateEverything['user/' + uID + '/numID'] = document.getElementById('employee-input').value;
    updateEverything['user/' + uID + '/additional'] = document.getElementById('additional-input').value;
    updateEverything['user/' + uID + '/userID'] = uID;
    // Send All Data to Firebase
    firebase.database().ref().update(updateEverything)
    .then(function() {
        // If set correctly
        localStorage["WYDuserCompanyName"] = document.getElementById('name-input').value;
        toastr["info"](localStorage["WYDuserCompanyName"] + " Information Successfully Saved!");
        document.getElementById('loading').setAttribute('style','display:none');
        getUserData();
        window.location='/operations-dashboard.html';
    })
    .catch(function(error) {
        // If wrong
        toastr["warning"]("Something happened when saving company details: " + error.message);
        document.getElementById('loading').setAttribute('style','display:none');
        console.log(error);
    });
});

// Function run to edit the company profile
// editCompanyProfile()
// Edit Company Profile
$('#button-edit-company-profile').on('click', function(){
    document.getElementById("name-input").removeAttribute("disabled");
    document.getElementById("address-input").removeAttribute("disabled");
    document.getElementById("contact-input").removeAttribute("disabled");
    document.getElementById("fax-input").removeAttribute("disabled");
    document.getElementById("website-input").removeAttribute("disabled");
    document.getElementById("lunch-input").removeAttribute("disabled");
    var i = 0;
    while(document.getElementById("additional-" + i) != null) {
        document.getElementById("additional-" + i).readOnly = false;
        i++;
    }
    localStorage["WYDadditionalEdit"] = i-1;
    document.getElementById("button-edit-company-profile").setAttribute("style", "display:none");
    document.getElementById("button-save-company-profile").setAttribute("style", "display:inline");
    document.getElementById("button-cancel-company-profile").setAttribute("style", "display:inline");
    document.getElementById("button-edit-company-add-additional").setAttribute("style", "display:inline");
});

// Function run to cancel the editing of the company profile
// cancelEditCompanyProfile()
// Edit Company Profile
$('#button-cancel-company-profile').on('click', function(){
    document.getElementById("name-input").setAttribute("disabled", "true");
    document.getElementById("address-input").setAttribute("disabled", "true");
    document.getElementById("contact-input").setAttribute("disabled", "true");
    document.getElementById("fax-input").setAttribute("disabled", "true");
    document.getElementById("website-input").setAttribute("disabled", "true");
    document.getElementById("lunch-input").setAttribute("disabled", "true");
    document.getElementById("button-edit-company-profile").setAttribute("style", "display:inline");
    document.getElementById("button-save-company-profile").setAttribute("style", "display:none");
    document.getElementById("button-cancel-company-profile").setAttribute("style", "display:none");
    document.getElementById("button-edit-company-add-additional").setAttribute("style", "display:none");
    for(var i = 0; i < localStorage["WYDviewClicked"]; i++) {
        document.getElementById("additional-" + i).setAttribute("readOnly", "true");
    }
    var j = localStorage["WYDviewClicked"] - 1;
    var parent = document.getElementById("additional");
    while(document.getElementById("additional-div-" + j) != null) {
        parent.removeChild(document.getElementById("additional-div-" + j));
        j++;
    }
});

// Function run when editing the company profile
// saveCompanyProfile()
// Save Company Profile
$('#button-save-company-profile').on('click', function(){
    var uID = localStorage["WYDuserID"];
    var companyKey = localStorage["WYDuserCompanyID"];
    var updateEverything = {};
    var i = 0;
    var current = 0;
    var loading = document.getElementById('loading').setAttribute('style','display:true');
    // Add Company Information
    updateEverything['company/' + companyKey + '/info/name'] = document.getElementById('name-input').value;
    updateEverything['company/' + companyKey + '/info/numContact'] = document.getElementById('contact-input').value;
    updateEverything['company/' + companyKey + '/info/address'] = document.getElementById('address-input').value;
    updateEverything['company/' + companyKey + '/info/numFax'] = document.getElementById('fax-input').value;
    updateEverything['company/' + companyKey + '/info/website'] = document.getElementById('website-input').value;
    updateEverything['company/' + companyKey + '/info/lunch'] = document.getElementById('lunch-input').value;
    while(document.getElementById('additional-' + i) != null && document.getElementById('additional-' + i).value != null) {
        if(document.getElementById('additional-' + i).value == '' || document.getElementById('additional-' + i).value == null) {
            i ++;
        }
        else {
            updateEverything['company/' + companyKey + '/info/additional/' + current] = document.getElementById('additional-' + i).value;
            current++;
            i++;
        }
    }
    
    // Send All Data to Firebase
    firebase.database().ref().update(updateEverything)
    .then(function() {
        // If set correctly
        localStorage["WYDuserCompanyName"] = document.getElementById('name-input').value;
        toastr["info"](localStorage["WYDuserCompanyName"] + " Information Successfully Saved!");
        document.getElementById('loading').setAttribute('style','display:none');
    })
    .catch(function(error) {
        // If wrong
        toastr["warning"]("Something happened when saving company details: " + error.message);
        console.log(error);
    });
});

// Function run when adding additional info to Company Profile
// editAddAdditionalCompanyProfile()
// Add Additional Company Info
$("#button-edit-company-add-additional").on('click', function() {
    var addDiv = document.getElementById("additional");
    var newDiv = document.createElement("div");
    var newInput = document.createElement("textArea");
    var newSpan = document.createElement("span");
    var newIcon = document.createElement("i");
    newDiv.className = "input-group mb-1";
    newDiv.id = "additional-div-" +  localStorage["WYDadditionalEdit"];
    newInput.type = "textarea";
    newInput.className = "form-control";
    newInput.placeholder = "Additional Information";
    localStorage["WYDadditionalEdit"]++;
    newInput.id = "additional-" + localStorage["WYDadditionalEdit"];
    newSpan.className = "input-group-addon";
    newIcon.className = "icon-layers";
    newSpan.append(newIcon);
    newDiv.append(newSpan);
    newDiv.append(newInput);
    addDiv.append(newDiv);
});

// Function Run to show seated users (variation will be used in employees section)
// getSeatedUsers()
// Operations-seats
function getSeatedUsers() {
    firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + "/payment").once('value').then(function(snapshot) {
        document.getElementById("overall-input").value = snapshot.val().seats;
        document.getElementById("used-input").value = snapshot.val().used;
        document.getElementById("signup-input").value = snapshot.val().signup;
        document.getElementById("start-input").value = snapshot.val().payStart;
        document.getElementById("end-input").value = snapshot.val().payEnd;
    });

    if(localStorage["WYDuserAccess"] < 3) {
        document.getElementById("non-access").setAttribute("style", "display:inline");
        if(localStorage["WYDuserAccess"] == 1) {
            if(document.getElementById("overall-input").value >= document.getElementById("used-input").value) document.getElementById("button-add-user-modal").setAttribute("style", "display:inline");
            document.getElementById("button-info-edit").setAttribute("style", "display:inline");
            document.getElementById("view-access-div").setAttribute("style", "display:true");
        }
    }
    /*
    var seatedPeeps = document.getElementById("seated-users");
    var query = firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + "/users").orderByChild("nameFull");
    query.once('value').then(function(snapshot) {
        var numPeeps = 0;
        var access = localStorage["WYDuserAccess"];
        snapshot.forEach(function(childSnapshot){
            //console.log(childSnapshot.val().nameFull);
            var seatDiv = document.createElement("div");
            seatDiv.className = "input-group mb-1";
            var seatSpan = document.createElement("span");
            seatSpan.className = "input-group-addon";
            var seatI = document.createElement("i");
            seatI.className = "fa fa-user";
            seatSpan.append(seatI);
            seatDiv.append(seatSpan);
            var seatInput = document.createElement("input");
            seatInput.className = "form-control";
            seatInput.type = "text";
            seatInput.disabled = true;
            seatInput.value = childSnapshot.val().nameFull;
            seatDiv.append(seatInput);
            if(access == 1 && childSnapshot.key != localStorage["WYDuserID"]) {
                // Click to bring up delete options
                var endSpan = document.createElement("span");
                endSpan.className = "input-group-addon";
                endSpan.setAttribute("style", "display:none");
                endSpan.setAttribute("name", "user-delete");
                endSpan.value = numPeeps;
                endSpan.setAttribute("data-toggle","tooltip");
                endSpan.setAttribute("data-placement","left");
                endSpan.setAttribute("data-title","Click to Delete User");
                endSpan.setAttribute("data-trigger","hover focus");
                endSpan.id = "user-delete-" + numPeeps;
                endSpan.onclick = function() {
                    this.setAttribute("style", "display:none");
                    // Click to cancel
                    var cancelSpan = document.createElement("span");
                    var confirmSpan = document.createElement("span");
                    cancelSpan.className = "input-group-addon";
                    cancelSpan.setAttribute("name", "user-delete");
                    cancelSpan.value = numPeeps;
                    cancelSpan.setAttribute("data-toggle","tooltip");
                    cancelSpan.setAttribute("data-placement","left");
                    cancelSpan.setAttribute("data-title","Click to Cancel");
                    cancelSpan.setAttribute("data-trigger","hover focus");
                    cancelSpan.id = "user-cancel-" + numPeeps;
                    cancelSpan.onclick = function() {
                        this.setAttribute("style", "display:none");
                        confirmSpan.setAttribute("style", "display:none");
                        endSpan.setAttribute("style", "display:inline");
                    };
                    var cancelIt = document.createElement("i");
                    cancelIt.className = "icon-close";
                    cancelSpan.append(cancelIt);
                    seatDiv.append(cancelSpan);
                    // Click to delete
                    confirmSpan.className = "input-group-addon";
                    confirmSpan.setAttribute("name", "user-delete");
                    confirmSpan.value = numPeeps;
                    confirmSpan.setAttribute("data-toggle","tooltip");
                    confirmSpan.setAttribute("data-placement","left");
                    confirmSpan.setAttribute("data-title","Click to Confirm");
                    confirmSpan.setAttribute("data-trigger","hover focus");
                    confirmSpan.id = "user-delete-" + numPeeps;
                    confirmSpan.onclick = function() {
                        firebase.database().ref('company/' + localStorage['WYDuserCompanyID'] + '/users/' + childSnapshot.key).remove();
                        firebase.database().ref('user/' + childSnapshot.key).remove().then(function() {
                            var minusSeat = Number(document.getElementById('used-input').value)-1;
                            firebase.database().ref('company/' + localStorage['WYDuserCompanyID'] + '/payment/').update({used:minusSeat}).then(function() {
                                seatDiv.setAttribute("style", "display:none");
                                toastr["User has been deleted"];
                                document.getElementById('used-input').value = minusSeat;
                            });
                        });
                    };
                    var confirmIt = document.createElement("i");
                    confirmIt.className = "icon-user-unfollow";
                    confirmSpan.append(confirmIt);
                    seatDiv.append(confirmSpan);
                    $('[data-toggle="tooltip"]').tooltip();  
                };
                var deleteIt = document.createElement("i");
                deleteIt.className = "fa fa-close";
                endSpan.append(deleteIt);
                seatDiv.append(endSpan);
                numPeeps++;
            }
            seatedPeeps.append(seatDiv);
        });
        $('[data-toggle="tooltip"]').tooltip();  
    }); */
}

// Function run when creating a new seated user account
// addUser()
// Operations-seats
$('#button-add-user').on('click',function(){
    if(!document.getElementById('button-add-user').classList.contains('disabled')) {
        var input = document.getElementById('password-input');
        var confirm = document.getElementById('password-confirm');
        if(input.value == confirm.value) {
            var secondaryFB = createSecondFB();
            var email = document.getElementById('email-input');
            var loading = document.getElementById('loading');
            email.setAttribute('disabled',true);
            input.setAttribute('disabled',true);
            confirm.setAttribute('disabled',true);
            loading.setAttribute('style','display:true');

            // Actually sign up user
            secondaryFB.auth().createUserWithEmailAndPassword(email.value, input.value).then(function() {
                localStorage["WYDaddedUserEmail"] = email.value;
                localStorage["WYDaddedUserID"] = secondaryFB.auth().currentUser.uid;
                secondaryFB.auth().signOut();
                email.removeAttribute('disabled');
                email.value = "";
                input.removeAttribute('disabled');
                input.value = "";
                confirm.removeAttribute('disabled');
                confirm.value="";
                loading.setAttribute('style','display:none');
                $('#add-user-modal').modal('hide');
                $('#add-user-info-modal').modal('show');

            }).catch(function (err) {
                // Handle errors
                toastr["warning"]("Something Happened. Please try again.\n"+err);
                email.removeAttribute('disabled');
                input.removeAttribute('disabled');
                confirm.removeAttribute('disabled');
                loading.setAttribute('style','display:none');
            });
        } else{
            toastr["warning"]("Passwords Do Not Match!!\nPlease Try Again.");
        }
    }
});

// Function run after creating a new seated user for their info
// addUserInfo()
// Operations-seats
$('#button-add-user-info').on('click',function(){
    var loading = document.getElementById('loading');
    loading.setAttribute('style', 'display:true');
    var uID = localStorage["WYDaddedUserID"];
    var companyKey = localStorage["WYDuserCompanyID"];
    var updateEverything = {};
    // Add User Information in Company
    updateEverything['company/' + companyKey + '/payment/used'] = Number(document.getElementById('used-input').value) + 1;
    updateEverything['company/' + companyKey + '/users/' + uID + '/nameFirst'] = document.getElementById('first-input').value;
    updateEverything['company/' + companyKey + '/users/' + uID + '/nameLast'] = document.getElementById('last-input').value;
    updateEverything['company/' + companyKey + '/users/' + uID + '/nameFull'] = document.getElementById('full-input').value;
    updateEverything['company/' + companyKey + '/users/' + uID + '/nameInitials'] = document.getElementById('initials-input').value;
    updateEverything['company/' + companyKey + '/users/' + uID + '/class'] = document.getElementById('class-input').value;
    // Add User Information in Users Section
    updateEverything['user/' + uID + '/access'] = document.getElementById('access-input').value;
    updateEverything['user/' + uID + '/nameFirst'] = document.getElementById('first-input').value;
    updateEverything['user/' + uID + '/nameLast'] = document.getElementById('last-input').value;
    updateEverything['user/' + uID + '/nameFull'] = document.getElementById('full-input').value;
    updateEverything['user/' + uID + '/nameInitials'] = document.getElementById('initials-input').value;
    updateEverything['user/' + uID + '/email'] = localStorage["WYDaddedUserEmail"];
    updateEverything['user/' + uID + '/numCell'] = document.getElementById('cell-input').value;
    updateEverything['user/' + uID + '/numContact'] = document.getElementById('contact-input').value;
    updateEverything['user/' + uID + '/class'] = document.getElementById('class-input').value;
    updateEverything['user/' + uID + '/jobTitle'] = document.getElementById('title-input').value;
    updateEverything['user/' + uID + '/nameInitials'] = document.getElementById('initials-input').value;
    updateEverything['user/' + uID + '/companyName'] = localStorage["WYDuserCompanyName"];
    updateEverything['user/' + uID + '/companyID'] = companyKey;
    updateEverything['user/' + uID + '/numID'] = document.getElementById('employee-input').value;
    updateEverything['user/' + uID + '/additional'] = document.getElementById('additional-input').value;
    updateEverything['user/' + uID + '/userID'] = uID;
    // Send All Data to Firebase
    firebase.database().ref().update(updateEverything)
    .then(function() {
        // If set correctly
        toastr["info"](localStorage["WYDuserNameFull"] + " Information Successfully Saved!");
        loading.setAttribute('style','display:none');
        $('#add-user-modal-info').modal('hide');
        document.getElementById('used-input').value = Number(document.getElementById('used-input').value) + 1;
        location.reload(true);
    })
    .catch(function(error) {
        // If wrong
        toastr["warning"]("Something happened when saving company details: " + error.message);
        document.getElementById('loading').setAttribute('style','display:none');
        console.log(error);
    });
    toastr[document.getElementById("nameFull").value + " has been added as a user"];
});

// Function run when "Edit User" Button is clicked to enable all user info inputs
// editSeatButton()
// Operations-seats
$('#button-info-edit').on('click',function() {
    document.getElementById("button-info-save").style.display = "inline";
    document.getElementById("button-info-delete").style.display = "inline";
    document.getElementById("button-info-edit").style.display = "none";
    document.getElementById("button-info-close").innerHTML = "Cancel";
    var modal = document.getElementById("user-info-modal");
    var inputs = modal.getElementsByTagName('input');
    for(i = 0; i < inputs.length; i++) {
        inputs[i].readOnly = false;
    }
    document.getElementById("view-additional-input").readOnly = false;
});

// Function run when "Remove User" Button is remove user
// deleteUserButton()
// Operations-seats
$('#button-info-delete').on('click', function() {
    if(confirm("Are You Sure You Want To Delete This User?")) {
        var companyId = localStorage["WYDuserCompanyID"];
        var updateEverything = {};
        var path = 'user/' + document.getElementById("view-uid-input").value;
        var companyPath = 'company/' + companyId + '/users/' + document.getElementById("view-uid-input").value;
        var usedPath = 'company/' + companyId + '/payment/used';
        var usedQuantity = document.getElementById("used-input").value;
        usedQuantity--;
        updateEverything[path] = null;
        updateEverything[companyPath] = null;
        updateEverything[usedPath] = usedQuantity;
        // Send All Data to Firebase
        firebase.database().ref().update(updateEverything)
        .then(function() {
            document.getElementById("used-input").value = usedQuantity;
            toastr["info"](document.getElementById("view-uid-input").value + " Successfully Deleted! Refresh Page to see changes..");
            document.getElementById("button-info-close").click();
        })
        .catch(function(error) {
            // If wrong
            toastr["warning"]("Something happened when deleting user: " + error.message);
            console.log(error);
        });
    }
});

// Function run when "Save User" Button is clicked to save data to Firebase
// editSeatIno()
// Operations-seats
$('#button-info-save').on('click', function() {
    var companyId = localStorage["WYDuserCompanyID"];
    var updateEverything = {};
    var path = 'user/' + document.getElementById("view-uid-input").value + '/';
    var companyPath = 'company/' + companyId + '/users/' + document.getElementById("view-uid-input").value + '/';
    console.log("Update User Path: " + path);
    console.log("Update Company Path: " + companyPath);
    updateEverything[companyPath + 'class'] = document.getElementById("view-class-input").value;
    updateEverything[companyPath + 'nameFirst'] = document.getElementById("view-first-input").value;
    updateEverything[companyPath + 'nameLast'] = document.getElementById("view-last-input").value;
    updateEverything[companyPath + 'nameFull'] = document.getElementById("view-full-input").value;
    updateEverything[companyPath + 'nameInitials'] = document.getElementById("view-initials-input").value;
    updateEverything[path + 'nameFirst'] = document.getElementById("view-first-input").value;
    updateEverything[path + 'nameLast'] = document.getElementById("view-last-input").value;
    updateEverything[path + 'nameFull'] = document.getElementById("view-full-input").value;
    updateEverything[path + 'nameInitials'] = document.getElementById("view-initials-input").value;
    updateEverything[path + 'email'] = document.getElementById("view-email-input").value;
    updateEverything[path + 'numCell'] = document.getElementById("view-cell-input").value;
    updateEverything[path + 'numContact'] = document.getElementById("view-contact-input").value;
    updateEverything[path + 'class'] = document.getElementById("view-class-input").value;
    updateEverything[path + 'jobTitle'] = document.getElementById("view-title-input").value;
    updateEverything[path + 'numID'] = document.getElementById("view-employee-input").value;
    updateEverything[path + 'additional'] = document.getElementById("view-additional-input").value;
    updateEverything[path + 'access'] = document.getElementById("view-access-input").value;
    // Send All Data to Firebase
    firebase.database().ref().update(updateEverything)
        .then(function() {
            toastr["info"](document.getElementById("view-uid-input").value + " Information Successfully Updated!");
            document.getElementById("button-info-close").click();
        })
        .catch(function(error) {
            // If wrong
            toastr["warning"]("Something happened when updating user details: " + error.message);
            console.log(error);
        });
});

// Function run when the View User Modal loses focus then disables all job info inputs
// dismissViewSeatModal()
// Operations-seats
$("#user-info-modal").on("hide.bs.modal", function(){
    if(localStorage["WYDuserAccess"] < 2) {
        document.getElementById("button-info-save").style.display = "none";
        document.getElementById("button-info-delete").style.display = "none";
        document.getElementById("button-info-edit").style.display = "inline";
        document.getElementById("button-info-close").innerHTML = "Close";
    }
    var modal = document.getElementById("user-info-modal");
    var inputs = modal.getElementsByTagName('input');
    for(i = 0; i < inputs.length; i++) {
        inputs[i].readOnly = true;
    }
    document.getElementById("view-additional-input").readOnly = true;
});

// Function run when the View User Modal loses focus then disables all job info inputs
// dismissViewSeatModal()
// Operations-seats
$("#employee-info-modal").on("hide.bs.modal", function(){
    if(localStorage["WYDuserAccess"] < 2) {
        document.getElementById("button-info-close").innerHTML = "Close";
    }
});

// Function Run to show active jobs
// getActiveJobs()
// Operations-jobs
function getActiveJobs() {
    var access = localStorage["WYDuserAccess"];
    var jobCountDiv = document.getElementById("job-count");
    if(access < 3) {
        document.getElementById("button-add-job-div").setAttribute("style", "display:inline");
        document.getElementById("button-switch-job-div").setAttribute("style", "display:inline");
        document.getElementById("button-switch-completed-job-div").setAttribute("style", "display:inline");
    }
    var query = firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + "/job/active").orderByChild("jobName");
    query.once('value').then(function(snapshot) {
        var tableDiv = document.getElementById("job-div");
        var jobTable = document.createElement("table");
        jobTable.id = "job-table";
        jobTable.className = "table table-striped table-bordered";
        var jobHead = jobTable.createTHead()
        var jobHeadRow = jobHead.insertRow();
        var headerCell0 = document.createElement("th");
        var headerCell1 = document.createElement("th");
        var headerCell2 = document.createElement("th");
        var jobBody = jobTable.createTBody();
        tableDiv.append(jobTable);
        snapshot.forEach(function(childSnapshot){
            var row = jobBody.insertRow();
            row.id = ("job-" + childSnapshot.key);
            var cell1 = row.insertCell(0).innerHTML = childSnapshot.val().jobName;
            var cell2 = row.insertCell(1).innerHTML = childSnapshot.val().jobNum; ;
            var cell3 = row.insertCell(2);
            var infoLink = document.createElement("a");
            infoLink.className = "btn btn-success";
            infoLink.title = "More Info";
            infoLink.href = "#";
            infoLink.onclick = function(){viewJob(childSnapshot,"active")};
            infoLink.setAttribute("data-toggle","modal");
            infoLink.setAttribute("data-target","#view-job-modal");
            var infoImg = document.createElement("i");
            infoImg.className = "fa fa-search-plus";
            infoLink.append(infoImg);
            cell3.append(infoLink);
            jobCountDiv.value++;
        });
        headerCell0.innerHTML = "Job Name";
        headerCell0.id = "job-sort-0";
        headerCell0.onclick=function(){sortJobTable(0)};
        headerCell1.innerHTML = "Job Num";
        headerCell1.id = "job-sort-1";
        headerCell2.innerHTML = "Actions";
        headerCell1.onclick=function(){sortJobTable(1)};
        jobHeadRow.appendChild(headerCell0);
        jobHeadRow.appendChild(headerCell1);
        jobHeadRow.appendChild(headerCell2);
        tableDiv.append(jobTable);
        document.getElementById("loading-jobs").style.display = "none";
        if(jobCountDiv.value == 0) tableDiv.innerHTML = "No Active Jobs";
    },function(error){
        document.getElementById("job-div").innerHTML = "An Error Occured! Please Try Again!";
    });
}

// Function Run to show Active/Inactive Jobs when clicked
// switchJobView()
// Operations-jobs
$('#button-switch-job').on('click',function(){
    var switchButton = document.getElementById("button-switch-job");
    var tableDiv = document.getElementById("job-div");
    tableDiv.innerHTML = "";
    var jobCountDiv = document.getElementById("job-count");
    var query = firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + "/job/" + this.value).orderByChild("jobName");
    query.once('value').then(function(snapshot) {
        var jobTable = document.createElement("table");
        jobTable.id = "job-table";
        jobTable.className = "table table-striped table-bordered";
        var jobHead = jobTable.createTHead()
        var jobHeadRow = jobHead.insertRow();
        var headerCell0 = document.createElement("th");
        var headerCell1 = document.createElement("th");
        var headerCell2 = document.createElement("th");
        var jobBody = jobTable.createTBody();
        tableDiv.append(jobTable);
        snapshot.forEach(function(childSnapshot){
            var row = jobBody.insertRow();
            row.id = ("job-" + childSnapshot.key);
            var cell1 = row.insertCell(0).innerHTML = childSnapshot.val().jobName;
            var cell2 = row.insertCell(1).innerHTML = childSnapshot.val().jobNum; ;
            var cell3 = row.insertCell(2);
            var infoLink = document.createElement("a");
            var switchVal;
            if(switchButton.value == "inactive") {
                switchVal = "inactive";
            }
            else {
                switchVal = "active";
            }
            infoLink.className = "btn btn-success";
            infoLink.title = "More Info";
            infoLink.href = "#";
            infoLink.onclick = function(){viewJob(childSnapshot,switchVal)};
            infoLink.setAttribute("data-toggle","modal");
            infoLink.setAttribute("data-target","#view-job-modal");
            var infoImg = document.createElement("i");
            infoImg.className = "fa fa-search-plus";
            infoLink.append(infoImg);
            cell3.append(infoLink);
            jobCountDiv.value++;
        });
        headerCell0.innerHTML = "Job Name";
        headerCell0.id = "job-sort-0";
        headerCell0.onclick=function(){sortJobTable(0)};
        headerCell1.innerHTML = "Job Num";
        headerCell1.id = "job-sort-1";
        headerCell2.innerHTML = "Actions";
        headerCell1.onclick=function(){sortJobTable(1)};
        jobHeadRow.appendChild(headerCell0);
        jobHeadRow.appendChild(headerCell1);
        jobHeadRow.appendChild(headerCell2);
        tableDiv.append(jobTable);
        if(switchButton.value == "inactive") {
            switchButton.value = "active";
            switchButton.innerText = "View Active Jobs";
        }
        else {
            switchButton.value = "inactive";
            switchButton.innerText = "View Inactive Jobs";
        }
    },function(error){
        document.getElementById("job-div").innerHTML = "An Error Occured! Please Try Again!";
    });
});

// Function Run to show Complete/Incompleted Jobs when clicked
// completedJobView()
// Operations-jobs
$('#button-switch-completed-job').on('click',function(){
    var switchButton = document.getElementById("button-switch-job");
    var completedButton = document.getElementById("button-switch-completed-job");
    var tableDiv = document.getElementById("job-div");
    tableDiv.innerHTML = "";
    var jobCountDiv = document.getElementById("job-count");
    var query = firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + "/job/complete").orderByChild("jobName");
    query.once('value').then(function(snapshot) {
        var jobTable = document.createElement("table");
        jobTable.id = "job-table";
        jobTable.className = "table table-striped table-bordered";
        var jobHead = jobTable.createTHead()
        var jobHeadRow = jobHead.insertRow();
        var headerCell0 = document.createElement("th");
        var headerCell1 = document.createElement("th");
        var headerCell2 = document.createElement("th");
        var jobBody = jobTable.createTBody();
        tableDiv.append(jobTable);
        snapshot.forEach(function(childSnapshot){
            var row = jobBody.insertRow();
            row.id = ("job-" + childSnapshot.key);
            var cell1 = row.insertCell(0).innerHTML = childSnapshot.val().jobName;
            var cell2 = row.insertCell(1).innerHTML = childSnapshot.val().jobNum; ;
            var cell3 = row.insertCell(2);
            var infoLink = document.createElement("a");
            infoLink.className = "btn btn-success";
            infoLink.title = "More Info";
            infoLink.href = "#";
            infoLink.onclick = function(){viewJob(childSnapshot,"complete")};
            infoLink.setAttribute("data-toggle","modal");
            infoLink.setAttribute("data-target","#view-job-modal");
            var infoImg = document.createElement("i");
            infoImg.className = "fa fa-search-plus";
            infoLink.append(infoImg);
            cell3.append(infoLink);
            jobCountDiv.value++;
        });
        headerCell0.innerHTML = "Job Name";
        headerCell0.id = "job-sort-0";
        headerCell0.onclick=function(){sortJobTable(0)};
        headerCell1.innerHTML = "Job Num";
        headerCell1.id = "job-sort-1";
        headerCell2.innerHTML = "Actions";
        headerCell1.onclick=function(){sortJobTable(1)};
        jobHeadRow.appendChild(headerCell0);
        jobHeadRow.appendChild(headerCell1);
        jobHeadRow.appendChild(headerCell2);
        tableDiv.append(jobTable);
    },function(error){
        document.getElementById("job-div").innerHTML = "An Error Occured! Please Try Again!";
    });
});

// Function Run to sort jobs within the table
// n is the column number that is being sorted
// sortJobsTable()
// Operations-jobs
function sortJobTable(n){
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("job-table");
    var nameCol = document.getElementById("job-sort-0");
    var numCol = document.getElementById("job-sort-1");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc"; 
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        if(dir == "asc") {
            var upArrow = document.createElement("i");
            upArrow.className = "fa fa-arrow-up";
            if(n==0) {
                nameCol.innerHTML = "Job Name";
                nameCol.appendChild(upArrow);
                numCol.innerHTML = "Job Num";
            }
            else {
                nameCol.innerHTML = "Job Name";
                numCol.innerHTML = "Job Num";
                numCol.appendChild(upArrow);
            }
        }
        else {
            var downArrow = document.createElement("i");
            downArrow.className = "fa fa-arrow-down";
            if(n==0) {
                nameCol.innerHTML = "Job Name";
                nameCol.appendChild(downArrow);
                numCol.innerHTML = "Job Num";
            }
            else {
                nameCol.innerHTML = "Job Name";
                numCol.innerHTML = "Job Num";
                numCol.appendChild(downArrow);
            }
        }
        rows = table.getElementsByTagName("tr");
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                  //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } 
            else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;      
        } 
        else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// Function run when "Add Job" button is clicked to show "add-job-inputs" div
// addJobButton()
// Operations-jobs
$('#button-add-job').on('click',function(){
    document.getElementById("add-job-inputs").setAttribute("style", "display:inline");
    document.getElementById("button-add-job").setAttribute("style", "display:none");
});

// Function run when "Add Job" button is clicked to save everything in "add-job-inputs" div then hide if successful
// confirmAddJobButton()
// Operations-jobs
$('#button-add-job-confirm').on('click',function(){
    document.getElementById('loading').setAttribute('style','display:true');
    var active;
    var companyKey = localStorage["WYDuserCompanyID"];
    if(document.getElementById("active-input").checked==true) {
        active = "active";
    }
    else {
        active = "inactive";
    }
    var newJob = firebase.database().ref('company/' + companyKey + '/job/' + active).push();
    var newJobKey = newJob.key;
    var count = document.getElementById("contact-count").value;
    var jobRef = 'company/' + companyKey + '/job/' + active + '/' + newJobKey + '/';
    var updateEverything = {};
    updateEverything[jobRef + "jobName"] = document.getElementById("name-input").value;
    updateEverything[jobRef + "jobNum"] = document.getElementById("number-input").value;
    updateEverything[jobRef + "jobLocation"] = document.getElementById("location-input").value;
    updateEverything[jobRef + "pmName"] = document.getElementById("pm-name-input").value;
    updateEverything[jobRef + "pmNum"] = document.getElementById("pm-contact-input").value;
    updateEverything[jobRef + "jobContractor"] = document.getElementById("contractor-input").value;
    updateEverything[jobRef + "createdBy/createdName"] = localStorage["WYDuserNameFull"];
    updateEverything[jobRef + "createdBy/createdID"] = localStorage["WYDuserID"];
    updateEverything[jobRef + "contacts/0/contactName"] = document.getElementById("name-input-0").value;
    updateEverything[jobRef + "contacts/0/contactNum"] = document.getElementById("number-input-0").value;
    if(count>0) {
        for(i=1;i<=count;i++) {
            updateEverything[jobRef + "contacts/" + i + "/contactName"] = document.getElementById("name-input-" + i).value;
            updateEverything[jobRef + "contacts/" + i + "/contactNum"] = document.getElementById("number-input-" + i).value; 
        }
    }
    
    // Send All Data to Firebase
    firebase.database().ref().update(updateEverything)
    .then(function() {
        var showDiv = document.getElementById("job-table");
        var row = document.createElement('tr');
        var nameCol = document.createElement('td');
        var numCol = document.createElement('td');
        var wordsCol = document.createElement('td');
        nameCol.innerHTML = document.getElementById("name-input").value;
        numCol.innerHTML = document.getElementById("number-input").value;
        wordsCol.innerHTML = "Refresh to view more";
        row.id = ("job-" + newJobKey);
        row.appendChild(nameCol);
        row.appendChild(numCol);
        showDiv.appendChild(row);
        // Use Click of Cancel to clear everything
        $('#button-add-job-cancel').trigger('click');
    });
});

// Function run when "Cancel" button is clicked to unhide "button-add-job" and Hide+Clear "add-job-inputs"
// cancelAddJobButton()
// Operations-jobs
$('#button-add-job-cancel').on('click',function(){
    document.getElementById("add-job-inputs").setAttribute("style", "display:none");
    document.getElementById("additional-contacts-header").setAttribute("style", "display:none");
    document.getElementById("button-add-job").setAttribute("style", "display:inline");
    document.getElementById("add-contacts").innerHTML="";
    document.getElementById("name-input").value="";
    document.getElementById("number-input").value="";
    document.getElementById("location-input").value="";
    document.getElementById("active-input").checked="checked";
    document.getElementById("pm-name-input").value="";
    document.getElementById("pm-contact-input").value="";
    document.getElementById("contractor-input").value="";
    document.getElementById("contact-count").value=0;
    document.getElementById("name-input-0").value="";
    document.getElementById("number-input-0").value="";
    document.getElementById("button-add-job-confirm").disabled="true";
    document.getElementById("loading").setAttribute('style','display:none');
});

// Function run when "Add Contractor Contact" button is clicked to add more contacts
// addJobContactButton()
// Operations-jobs
$('#button-add-job-contact').on('click',function(){
    document.getElementById("additional-contacts-header").setAttribute("style", "display:inline");
    var count = Number(document.getElementById("contact-count").value)+1;
    console.log(document.getElementById("contact-count").value);
    var holdingDiv = document.getElementById("add-contacts");
    var contactDiv = document.createElement("div");
    contactDiv.className = "input-group mb-1";
    var contactSpan = document.createElement("span");
    contactSpan.className = "input-group-addon";
    var contactI = document.createElement("i");
    contactI.className = "icon-user";
    contactSpan.append(contactI);
    contactDiv.append(contactSpan);
    var contactInput = document.createElement("input");
    contactInput.className = "form-control";
    contactInput.type = "text";
    contactInput.placeholder = "Contractor Contact Name";
    contactInput.id = ("name-input-" + count);
    contactDiv.append(contactInput);
    holdingDiv.append(contactDiv);
    var contactNumDiv = document.createElement("div");
    contactNumDiv.className = "input-group mb-1";
    var contactNumSpan = document.createElement("span");
    contactNumSpan.className = "input-group-addon";
    var contactNumI = document.createElement("i");
    contactNumI.className = "icon-phone";
    contactNumSpan.append(contactNumI);
    contactNumDiv.append(contactNumSpan);
    var contactNumInput = document.createElement("input");
    contactNumInput.className = "form-control";
    contactNumInput.type = "telephone";
    contactNumInput.placeholder = "Contractor Contact Number";
    contactNumInput.id = ("number-input-" + count);
    contactNumDiv.append(contactNumInput);
    holdingDiv.append(contactNumDiv);
    document.getElementById("contact-count").value = count;
});

// Function run when a job is clicked to view all relevent information
// viewJob()
// Operations-jobs
function viewJob(thisJob, type) {
    snapShot = thisJob.val();
    document.getElementById("viewJobModalTitle").innerHTML = (snapShot.jobName + " - " + snapShot.jobNum);
    document.getElementById("view-name-input").value = snapShot.jobName;
    document.getElementById("jobID").value = thisJob.key;
    document.getElementById("view-number-input").value = snapShot.jobNum;
    if(snapShot.jobLocation != null)document.getElementById("view-location-input").value = snapShot.jobLocation;
    switch(type) {
        case "active":
            document.getElementById("view-active-input").checked = true;
            document.getElementById("view-complete-input").checked = false;
            break;
        case "inactive":
            document.getElementById("view-active-input").checked = false;
            document.getElementById("view-complete-input").checked = false;
            break;
        case "complete":
            document.getElementById("view-active-input").checked = false;
            document.getElementById("view-complete-input").checked = true;
    }
    if(snapShot.pmName != null)document.getElementById("view-pm-name-input").value = snapShot.pmName;
    if(snapShot.pmNum != null)document.getElementById("view-pm-contact-input").value = snapShot.pmNum;
    if(snapShot.jobContractor != null)document.getElementById("view-contractor-input").value = snapShot.jobContractor;
    let jobContacts = document.getElementById("view-modal-job-contacts");
    jobContacts.innerHTML = "";
    //for(i = 0; i < snapShot.contacts.length; i++) {
    var count = 0;
    snapShot.contacts.forEach(function(element){
        var contactDiv = document.createElement("div");
        contactDiv.className = "input-group mb-1";
        var contactSpan = document.createElement("span");
        contactSpan.className = "input-group-addon";
        var contactI = document.createElement("i");
        contactI.className = "icon-user";
        contactSpan.append(contactI);
        contactDiv.append(contactSpan);
        var contactInput = document.createElement("input");
        contactInput.id = "view-name-input-" + count;
        contactInput.className = "form-control";
        contactInput.type = "text";
        contactInput.placeholder = "Contractor Contact Name";
        contactInput.value = element.contactName;
        contactInput.setAttribute("disabled","true");
        contactDiv.append(contactInput);
        jobContacts.append(contactDiv);
        var contactNumDiv = document.createElement("div");
        contactNumDiv.className = "input-group mb-1";
        var contactNumSpan = document.createElement("span");
        contactNumSpan.className = "input-group-addon";
        var contactNumI = document.createElement("i");
        contactNumI.className = "icon-phone";
        contactNumSpan.append(contactNumI);
        contactNumDiv.append(contactNumSpan);
        var contactNumInput = document.createElement("input");
        contactNumInput.id = "view-number-input-" + count;
        contactNumInput.className = "form-control";
        contactNumInput.type = "telephone";
        contactNumInput.placeholder = "Contractor Contact Number";
        contactNumInput.value = element.contactNum;
        contactNumInput.setAttribute("disabled","true");
        contactNumDiv.append(contactNumInput);
        jobContacts.append(contactNumDiv);
        count++;
    });
    document.getElementById("view-contact-count").value = count;
}

// Function run when the View Job Modal loses focus then disables all job info inputs
// dismissViewJobModal()
// Operations-jobs
$("#view-job-modal").on("hide.bs.modal", function(){
    if(document.getElementById("button-job-delete") != null) {
        document.getElementById("button-job-save").style.display = "none";
        document.getElementById("button-job-delete").style.display = "none";
        document.getElementById("button-job-edit").style.display = "inline";
        document.getElementById("button-job-cancel").innerHTML = "Close";
    }
    var modal = document.getElementById("view-job-modal");
    var inputs = modal.getElementsByTagName('input');
    for(i = 0; i < inputs.length; i++) {
        inputs[i].disabled=true;
    }
});

// Function run when "Edit Job" Button is clicked to enable all job info inputs
// editJobButton()
// Operations-jobs
$('#button-job-edit').on('click',function() {
    document.getElementById("button-job-save").style.display = "inline";
    if(localStorage["WYDuserAccess"] > 3) {
        document.getElementById("button-job-delete").style.display = "inline";
    }
    document.getElementById("button-job-cancel").innerHTML = "Cancel";
    document.getElementById("button-job-edit").style.display = "none";
    var modal = document.getElementById("view-job-modal");
    var inputs = modal.getElementsByTagName('input');
    for(i = 0; i < inputs.length; i++) {
        inputs[i].disabled=false;
    }
});

// Function run when "Delete Job" Button is clicked
// deleteJobButton()
// Operations-jobs
$('#button-job-delete').on('click',function() {
    if(confirm("Are You Sure You Want To Delete This Job?")) {
        var jobKey = document.getElementById("jobID").value;
        firebase.database().ref("company/" + localStorage["WYDuserCompanyID"] + "/job/active/" + jobKey).remove();
        firebase.database().ref("company/" + localStorage["WYDuserCompanyID"] + "/job/inactive/" + jobKey).remove();
        var row = document.getElementById("job-" + jobKey);
        row.parentNode.removeChild(row);
        toastr["info"]("Job Successfully Deleted"); 
    }
    else {
    }
});

// Function run when "Save Job" Button is clicked
// saveJobButton()
// Operations-jobs
$('#button-job-save').on('click',function() {
    document.getElementById('loading').setAttribute('style','display:true');
    var active;
    var complete=false;
    var companyKey = localStorage["WYDuserCompanyID"];
    var jobKey = document.getElementById("jobID").value;
    var count = document.getElementById("view-contact-count").value;
    var updateEverything = {};
    var jobRef;
    if(document.getElementById("view-complete-input").checked==true) {
        complete=true;
        updateEverything['company/' + companyKey + '/job/inactive/' + jobKey] = null;
        updateEverything['company/' + companyKey + '/job/active/' + jobKey] = null;
    }
    else {
        if(document.getElementById("view-active-input").checked==true) {
            active = "active";
            if(document.getElementById("button-switch-job").value=="active") {
                console.log("Job was inactive");
                updateEverything['company/' + companyKey + '/job/inactive/' + jobKey] = null;
                updateEverything['company/' + companyKey + '/job/complete/' + jobKey] = null;
            }
        }
        else {
            active = "inactive";
                console.log("Job was active");
                updateEverything['company/' + companyKey + '/job/active/' + jobKey] = null;
                updateEverything['company/' + companyKey + '/job/complete/' + jobKey] = null;
        }
    }
    if(complete) jobRef = 'company/' + companyKey + '/job/complete/' + jobKey + '/';
    else jobRef = 'company/' + companyKey + '/job/' + active + '/' + jobKey + '/';
    var newEditJob = firebase.database().ref('company/' + companyKey + '/job/' + active + '/' + jobKey + '/editedBy').push();
    var newEditJobKey = newEditJob.key;
    var jobName = document.getElementById("view-name-input").value;
    updateEverything[jobRef + "jobName"] = document.getElementById("view-name-input").value;
    updateEverything[jobRef + "jobNum"] = document.getElementById("view-number-input").value;
    updateEverything[jobRef + "jobLocation"] = document.getElementById("view-location-input").value;
    updateEverything[jobRef + "pmName"] = document.getElementById("view-pm-name-input").value;
    updateEverything[jobRef + "pmNum"] = document.getElementById("view-pm-contact-input").value;
    updateEverything[jobRef + "jobContractor"] = document.getElementById("view-contractor-input").value;
    updateEverything[jobRef + "editedBy/" + newEditJobKey + "/editedName"] = localStorage["WYDuserNameFull"];
    updateEverything[jobRef + "editedBy/" + newEditJobKey + "/editedID"] = localStorage["WYDuserID"];
    updateEverything[jobRef + "contacts/0/contactName"] = document.getElementById("view-name-input-0").value;
    updateEverything[jobRef + "contacts/0/contactNum"] = document.getElementById("view-number-input-0").value;
    if(count>1) {
        for(i=2;i<=count;i++) {
            updateEverything[jobRef + "contacts/" + i + "/contactName"] = document.getElementById("view-name-input-" + i).value;
            updateEverything[jobRef + "contacts/" + i + "/contactNum"] = document.getElementById("view-number-input-" + i).value; 
        }
    }
    console.log("UpdateEverything: " + updateEverything);
    // Send All Data to Firebase
    firebase.database().ref().update(updateEverything)
    .then(function() {
        // Use Click of Cancel to clear everything
        $('#view-modal-close').trigger('click');
        toastr["info"](jobName + " has successfully been updated!");
    });
});

// Function run when Template page is loaded
// viewTemplates()
// Operations-report-templates
function viewTemplates() {
    var access = localStorage["WYDuserAccess"];
    if(access < 3) {
        document.getElementById("new-template-div").setAttribute("style", "display:inline");
    }
    var query = firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + "/list").orderByKey();
    query.once('value').then(function(snapshot) {
        document.getElementById("view-template-card").style.display="block";
        var templateList = document.getElementById("view-template-div");
        snapshot.forEach(function(childSnapshot) {
            var templateButton = document.createElement("button");
            templateButton.innerHTML = childSnapshot.key;
            templateButton.id = childSnapshot.key;
            templateButton.className = "btn btn-secondary btn-block btn-lg";
            templateButton.onclick = function() {
                toastr["info"]("Viewing: " + childSnapshot.key);
                if(access < 3) document.getElementById("button-template-modal-edit").setAttribute("style", "display:inline");
                var childFields;
                var lunchy = childSnapshot.val().lunch;
                var templateFields = document.getElementById("view-modal-template-fields");
                if(lunchy == null || lunchy == false) {
                    if(lunchy == null) childFields = childSnapshot.numChildren()-1;
                    else childFields = childSnapshot.numChildren()-2;
                    templateFields.innerHTML = "<h5 id='template-modal-title'>" + childSnapshot.key + "</h5><input id='template-modal-title-value' value='" + childSnapshot.key + "' style='display:none'><input id='template-modal-count' value='" + (childFields) + "' style='display:none'><div class='input-group mb-1'><span class='input-group-addon'><i class='fa fa-star'></i></span><input disabled id='template-modal-short-title' class='form-control' value='" + childSnapshot.val().short + "'></div><div>Include Lunch?<label class='switch switch-text switch-pill switch-primary'><input id='template-modal-toggle-lunch' type='checkbox' class='switch-input'><span class='switch-label'data-on='YES' data-off='NO'></span><span class='switch-handle'></span></label></div><hr>";
                }
                else {
                    childFields = childSnapshot.numChildren()-2;
                    templateFields.innerHTML = "<h5 id='template-modal-title'>" + childSnapshot.key + "</h5><input id='template-modal-title-value' value='" + childSnapshot.key + "' style='display:none'><input id='template-modal-count' value='" + (childFields) + "' style='display:none'><div class='input-group mb-1'><span class='input-group-addon'><i class='fa fa-star'></i></span><input disabled id='template-modal-short-title' class='form-control' value='" + childSnapshot.val().short + "'></div><div>Include Lunch?<label class='switch switch-text switch-pill switch-primary'><input id='template-modal-toggle-lunch' type='checkbox' class='switch-input' checked><span class='switch-label'data-on='YES' data-off='NO'></span><span class='switch-handle'></span></label></div><hr>";
                }
                for(var i = 0; i < childFields; i++) {
                    (function(i){
                        if(childSnapshot.val()[i].type != null) {
                            var tempDiv = document.createElement("div");
                            tempDiv.id = "line-modal-div-" + i;
                            var choiceDiv = document.createElement("div");
                            var switchDiv = document.createElement("div");
                            switchDiv.id = "select-modal-div-" + i;
                            var titleDiv = document.createElement("div");
                            titleDiv.id = "title-modal-div-" + i;
                            var workDiv = document.createElement("div");
                            workDiv.id = "work-modal-div-" + i;
                            var codeDiv = document.createElement("div");
                            codeDiv.id = "code-modal-div-" + i;
                            // Choice Line
                            var choiceLabel = document.createElement("label");
                            var choiceSpan = document.createElement("span");
                            var choiceI = document.createElement("i");
                            var choiceSelect = document.createElement("select");
                            var option = document.createElement("option");
                            choiceLabel.innerHTML = "Choose Type of Field";
                            choiceDiv.setAttribute("class", "input-group mb-1");
                            choiceSpan.setAttribute("class", "input-group-addon");
                            choiceI.setAttribute("class", "fa fa-tasks");
                            choiceSelect.setAttribute("class", "form-control");
                            choiceSelect.disabled = true;
                            choiceSelect.id = ("choice-modal-input-" + i);
                            for(var j = 0; j < 3; j++) {
                                switch(j) {
                                    case 0:
                                        choiceSelect.options[j] = new Option('Cost Code Fixed', 'costCode');
                                        break;
                                    case 1:
                                        choiceSelect.options[j] = new Option('Cost Code Fillable', 'costCodeFillable');
                                        break;
                                    case 2:
                                        choiceSelect.options[j] = new Option('Title', 'title');
                                        break;
                                }

                            }
                            choiceSelect.value = childSnapshot.val()[i].type;
                            choiceSelect.onchange = function () {
                                console.log("changing to: " + this.value);
                                switch(this.value) {
                                    case 'title':
                                        document.getElementById("title-modal-div-" + i).setAttribute("style", "display:inline");
                                        document.getElementById("work-modal-div-" + i).setAttribute("style", "display:none");
                                        document.getElementById("code-modal-div-" + i).setAttribute("style", "display:none");
                                        break;
                                    case 'costCode':
                                        document.getElementById("title-modal-div-" + i).setAttribute("style", "display:none");
                                        document.getElementById("work-modal-div-" + i).setAttribute("style", "display:inline");
                                        document.getElementById("code-modal-div-" + i).setAttribute("style", "display:inline");
                                        document.getElementById("code-modal-input-" + i).placeholder = "Cost Code";
                                        break;
                                    case 'costCodeFillable':
                                        document.getElementById("title-modal-div-" + i).setAttribute("style", "display:none");
                                        document.getElementById("work-modal-div-" + i).setAttribute("style", "display:inline");
                                        document.getElementById("code-modal-div-" + i).setAttribute("style", "display:inline");
                                        document.getElementById("code-modal-input-" + i).placeholder = "Cost Code Place Holder";
                                        break;
                                }
                            }
                            var deleteLine = document.createElement("div");
                            var deleteButton = document.createElement("button");
                            deleteButton.setAttribute("class", "btn btn-danger float-right");
                            deleteButton.setAttribute("type", "button");
                            deleteButton.setAttribute("title", "DELETE LINE");
                            deleteButton.innerHTML = "DELETE LINE";
                            deleteButton.onclick = function() {
                                var thisContainer = this.parentElement.parentElement.parentElement;
                                var divAbove = this.parentElement.parentElement.parentElement.parentElement;
                                divAbove.removeChild(thisContainer);
                            };
                            
                            deleteLine.setAttribute("name", "delete-modal-line");
                            deleteLine.setAttribute("style", "display:none");
                            deleteLine.appendChild(deleteButton);
                            //choiceDiv.appendChild(choiceLabel);
                            choiceSpan.appendChild(choiceI);
                            choiceDiv.appendChild(choiceSpan);
                            choiceDiv.appendChild(choiceSelect);
                            tempDiv.appendChild(choiceDiv);
                            switch(childSnapshot.val()[i].type) {
                                case 'title':
                                    titleDiv.innerHTML = "<div class = 'input-group mb-1' disabled><span class = 'input-group-addon'><i class = 'icon-book-open'></i></span><input disabled type = 'text' class = 'form-control' placeholder = 'Title Name' id = 'title-modal-input-" + i + "' value = '" + childSnapshot.val()[i].work + "'> </div>";
                                    workDiv.innerHTML = "<div class = 'input-group mb-1' disabled><span class = 'input-group-addon'><i class = 'icon-wrench'></i></span><input disabled type = 'text' class = 'form-control' placeholder = 'Work Performed' id = 'work-modal-input-" + i + "'> </div>";
                                    codeDiv.innerHTML = "<div class = 'input-group mb-1' disabled><span class = 'input-group-addon'><i class = 'icon-calculator'></i></span><input disabled type = 'text' class = 'form-control' placeholder = 'Cost Code' id = 'code-modal-input-" + i + "'> </div>";
                                    titleDiv.setAttribute("style", "display:inline");
                                    workDiv.setAttribute("style", "display:none");
                                    codeDiv.setAttribute("style", "display:none");
                                    break;
                                case 'costCode':
                                    titleDiv.innerHTML = "<div class = 'input-group mb-1' disabled><span class = 'input-group-addon'><i class = 'icon-book-open'></i></span><input disabled type = 'text' class = 'form-control' placeholder = 'Title Name' id = 'title-modal-input-" + i + "'> </div>";
                                    workDiv.innerHTML = "<div class = 'input-group mb-1' disabled><span class = 'input-group-addon'><i class = 'icon-wrench'></i></span><input disabled type = 'text' class = 'form-control' placeholder = 'Work Performed' id = 'work-modal-input-" + i + "' value = '" + childSnapshot.val()[i].work + "'> </div>";
                                    codeDiv.innerHTML = "<div class = 'input-group mb-1' disabled><span class = 'input-group-addon'><i class = 'icon-calculator'></i></span><input disabled type = 'text' class = 'form-control' placeholder = 'Cost Code' id = 'code-modal-input-" + i + "' value = '" + childSnapshot.val()[i].code + "'> </div>";
                                    titleDiv.setAttribute("style", "display:none");
                                    workDiv.setAttribute("style", "display:inline");
                                    codeDiv.setAttribute("style", "display:inline");
                                    break;
                                case 'costCodeFillable':
                                    titleDiv.innerHTML = "<div class='input-group mb-1' disabled><span class='input-group-addon'><i class='icon-book-open'></i></span><input disabled type='text' class='form-control' placeholder='Title Name' id='title-modal-input-" + i + "'> </div>";
                                    workDiv.innerHTML = "<div class='input-group mb-1' disabled><span class='input-group-addon'><i class='icon-wrench'></i></span><input disabled type='text' class='form-control' placeholder='Work Performed' id='work-modal-input-" + i + "' value='" + childSnapshot.val()[i].work + "'> </div>";
                                    codeDiv.innerHTML = "<div class='input-group mb-1' disabled><span class='input-group-addon'><i class='icon-calculator'></i></span><input disabled type='text' class='form-control' placeholder='Cost Code Fillable' id='code-modal-input-" + i + "' value='" + childSnapshot.val()[i].code + "'> </div>";
                                    titleDiv.setAttribute("style", "display:none");
                                    workDiv.setAttribute("style", "display:inline");
                                    codeDiv.setAttribute("style", "display:inline");
                                    break;
                            }
                            switchDiv.appendChild(deleteLine);
                            switchDiv.appendChild(choiceDiv);
                            tempDiv.appendChild(switchDiv); 
                            tempDiv.appendChild(titleDiv);
                            tempDiv.appendChild(workDiv);
                            tempDiv.appendChild(codeDiv);
                            tempDiv.appendChild(document.createElement("hr"));
                            templateFields.appendChild(tempDiv);
                        }
                        // Pre-Title Change
                        else {
                            if(childSnapshot.val()[i].title==true) {
                                var tempDiv = document.createElement("div");
                                tempDiv.id = "line-modal-div-" + i;
                                var switchDiv = document.createElement("label");
                                var titleDiv = document.createElement("div");
                                var workDiv = document.createElement("div");
                                var codeDiv = document.createElement("div");
                                titleDiv.innerHTML = "<div class='input-group mb-1' disabled><span class='input-group-addon'> <i class='icon-book-open'></i></span> <input disabled type='text' class='form-control' placeholder='Template Title' value='" + childSnapshot.val()[i].work + "' id='title-modal-input-" + i + "'> </div><hr>";
                                workDiv.innerHTML = "<div class='input-group mb-1' disabled><span class='input-group-addon'> <i class='icon-calculator'></i></span> <input disabled type='text' class='form-control' id='work-modal-input-" + i + "' placeholder='Work Performed'> </div>";
                                codeDiv.innerHTML = "<div class='input-group mb-1' disabled><span class='input-group-addon'> <i class='icon-wrench'></i></span> <input disabled type='text' class='form-control' placeholder='Cost Code' id='code-modal-input-" + i + "'> </div><hr>";
                                switchDiv.className = "switch switch-text switch-pill switch-primary";
                                var switchSpanA = document.createElement("span");
                                var switchSpanB = document.createElement("span");
                                switchSpanA.className = "switch-label";
                                switchSpanA.setAttribute("data-on", "Yes");
                                switchSpanA.setAttribute("data-off", "No");
                                switchSpanB.className = "switch-handle";
                                var switchInput = document.createElement("input");
                                switchInput.className = "switch-input";
                                switchInput.id = "view-template-checked-" + i;
                                switchInput.type = "checkbox";
                                switchInput.checked = true;
                                switchInput.disabled = true;
                                switchInput.onchange=function() {
                                    if(this.checked==false) {
                                        titleDiv.setAttribute("style", "display:none");
                                        workDiv.setAttribute("style", "display:inline");
                                        codeDiv.setAttribute("style", "display:inline");
                                    }
                                    else {
                                        titleDiv.setAttribute("style", "display:inline");
                                        workDiv.setAttribute("style", "display:none");
                                        codeDiv.setAttribute("style", "display:none");
                                    }
                                }
                                workDiv.setAttribute("style", "display:none");
                                codeDiv.setAttribute("style", "display:none");
                                var switchLabel = document.createElement("label");
                                switchLabel.innerHTML = "&nbsp;&nbsp;&nbsp;Section Title?";
                                var deleteLine = document.createElement("button");
                                deleteLine.setAttribute("class", "btn btn-danger float-right");
                                deleteLine.setAttribute("type", "button");
                                deleteLine.setAttribute("title", "DELETE LINE");
                                deleteLine.setAttribute("style", "display:none");
                                deleteLine.setAttribute("name", "delete-modal-line");
                                deleteLine.innerHTML = "DELETE LINE";
                                deleteLine.onclick = function() {
                                    var thisContainer = this.parentElement.parentElement;
                                    var divAbove = this.parentElement.parentElement.parentElement;
                                    divAbove.removeChild(thisContainer);
                                    count.value--;
                console.log("Count: " + document.getElementById("view-contact-count").value);
                                };
                                var lineDiv = document.createElement("div");
                                switchDiv.appendChild(switchInput);
                                switchDiv.appendChild(switchSpanA);
                                switchDiv.appendChild(switchSpanB);
                                lineDiv.appendChild(switchDiv);
                                lineDiv.appendChild(switchLabel);
                                lineDiv.appendChild(deleteLine);
                                tempDiv.appendChild(lineDiv);
                                tempDiv.appendChild(document.createElement("br"));
                                tempDiv.appendChild(titleDiv);
                                tempDiv.appendChild(workDiv);
                                tempDiv.appendChild(codeDiv);
                                templateFields.appendChild(tempDiv);
                            }
                            else {
                                var tempDiv = document.createElement("div");
                                tempDiv.id = "line-modal-div-" + i;
                                var switchDiv = document.createElement("label");
                                var titleDiv = document.createElement("div");
                                var workDiv = document.createElement("div");
                                var codeDiv = document.createElement("div");
                                titleDiv.innerHTML = "<div class='input-group mb-1' disabled><span class='input-group-addon'> <i class='icon-book-open'></i></span> <input disabled type='text' class='form-control' placeholder='Template Title' id='title-modal-input-" + i + "'> </div><hr>";
                                workDiv.innerHTML = "<div class='input-group mb-1' disabled><span class='input-group-addon'> <i class='icon-calculator'></i></span> <input disabled type='text' class='form-control' placeholder='Work Performed' value='" + childSnapshot.val()[i].work + "' id='work-modal-input-" + i + "'> </div>";
                                codeDiv.innerHTML = "<div class='input-group mb-1' disabled><span class='input-group-addon'> <i class='icon-wrench'></i></span> <input disabled type='text' class='form-control' placeholder='Cost Code' id='code-modal-input-" + i + "' value='" + childSnapshot.val()[i].code + "'> </div><hr>";
                                switchDiv.className = "switch switch-text switch-pill switch-primary";
                                var switchSpanA = document.createElement("span");
                                var switchSpanB = document.createElement("span");
                                switchSpanA.className = "switch-label";
                                switchSpanA.setAttribute("data-on", "Yes");
                                switchSpanA.setAttribute("data-off", "No");
                                switchSpanB.className = "switch-handle";
                                var switchInput = document.createElement("input");
                                switchInput.className = "switch-input";
                                switchInput.id = "view-template-checked-" + i;
                                switchInput.type = "checkbox";
                                switchInput.checked = false;
                                switchInput.disabled = true;
                                switchInput.onchange=function() {
                                    if(this.checked==false) {
                                        titleDiv.setAttribute("style", "display:none");
                                        workDiv.setAttribute("style", "display:inline");
                                        codeDiv.setAttribute("style", "display:inline");
                                    }
                                    else {
                                        titleDiv.setAttribute("style", "display:inline");
                                        workDiv.setAttribute("style", "display:none");
                                        codeDiv.setAttribute("style", "display:none");
                                    }
                                }
                                titleDiv.setAttribute("style", "display:none");
                                var switchLabel = document.createElement("label");
                                switchLabel.innerHTML = "&nbsp;&nbsp;&nbsp;Section Title?";
                                var deleteLine = document.createElement("button");
                                deleteLine.setAttribute("class", "btn btn-danger float-right");
                                deleteLine.setAttribute("type", "button");
                                deleteLine.setAttribute("title", "DELETE LINE");
                                deleteLine.setAttribute("style", "display:none");
                                deleteLine.setAttribute("name", "delete-modal-line");
                                deleteLine.innerHTML = "DELETE LINE";
                                deleteLine.onclick = function() {
                                    var thisContainer = this.parentElement.parentElement;
                                    var divAbove = this.parentElement.parentElement.parentElement;
                                    divAbove.removeChild(thisContainer);
                                    count.value--;
                console.log("Count: " + document.getElementById("view-contact-count").value);
                                };
                                var lineDiv = document.createElement("div");
                                switchDiv.appendChild(switchInput);
                                switchDiv.appendChild(switchSpanA);
                                switchDiv.appendChild(switchSpanB);
                                lineDiv.appendChild(switchDiv);
                                lineDiv.appendChild(switchLabel);
                                lineDiv.appendChild(deleteLine);
                                tempDiv.appendChild(lineDiv);
                                tempDiv.appendChild(document.createElement("br"));
                                tempDiv.appendChild(titleDiv);
                                tempDiv.appendChild(workDiv);
                                tempDiv.appendChild(codeDiv);
                                templateFields.append(tempDiv);
                            }
                        }
                    }).call(this,i);
                }
                $("#view-template-modal").modal('show');
            }
            templateList.appendChild(templateButton);
            
        });
    });
}

// Function run when the View Template Modal loses focus then disables all job info inputs
// dismissViewTemplateModal()
// Operations-report-templates
$("#view-template-modal").on("hide.bs.modal", function(){
    document.getElementById("button-template-modal-cancel").innerHTML = "Close";
    document.getElementById("button-template-modal-save").style.display = "none";
    document.getElementById("button-template-modal-delete").style.display = "none";
    document.getElementById("button-template-modal-edit").style.display = "none";
    document.getElementById("button-template-modal-line").style.display = "none";
    enableInputs(false, "view-template-modal");
    document.getElementById("template-modal-inputs").innerHTML="";
    document.getElementById("modal-loading").setAttribute("style", "display:none");
});

// Function run when the Edit View Templates Button is clicked
// editViewTemplate()
// Operations-report-templates
$('#button-template-modal-edit').on('click', function() {
    enableInputs(true, "view-template-modal");
    document.getElementById("button-template-modal-edit").setAttribute("style", "display:none");
    document.getElementById("button-template-modal-save").setAttribute("style", "display:inline");
    document.getElementById("button-template-modal-delete").setAttribute("style", "display:inline");
    document.getElementById("button-template-modal-cancel").innerText="Cancel";
    document.getElementById("button-template-modal-line").style.display = "block";
    document.getElementById("template-modal-title").innerHTML = "<div class='input-group mb-1' id='view-name-title'><span class='input-group-addon'> <i class='icon-book-open'></i></span> <input id='template-modal-title-input' type='text' class='form-control' placeholder='Template Title' value='" + document.getElementById("template-modal-title-value").value + "'> </div>";
    var deleteLines = document.getElementsByName("delete-modal-line");
    for(i = 0; i < deleteLines.length; i++) {
        deleteLines[i].setAttribute("style", "display:inline");
    }
});

// Function run when the Save View Templates Button is clicked
// saveViewTemplate()
// Operations-report-templates
$('#button-template-modal-save').on('click', function() {
    // Delete Old Template
    var oldTitle = document.getElementById("template-modal-title-value").value;
    firebase.database().ref('company/' + localStorage['WYDuserCompanyID'] + '/list/' + oldTitle).remove();
    
    var updateEverything = {};
    document.getElementById('modal-loading').setAttribute('style','display:true');
    var actualCount = 0;
    var companyKey = localStorage["WYDuserCompanyID"];
    var count = document.getElementById("template-modal-count").value;
    var title = document.getElementById("template-modal-title-input").value;
    if(title == "") {
        d = new Date();
        title = "template_" + getTodaysDate(0,0,0) + "_" + d.getHours() + "-" + d.getMinutes();
    }
    var templatePath = 'company/' + companyKey + '/list/' + title + '/';
    updateEverything[templatePath + 'short'] = document.getElementById("template-modal-short-title").value;
    updateEverything[templatePath + 'lunch'] = document.getElementById("template-modal-toggle-lunch").checked;
    for(var i = 0; actualCount < count; i++){
        if(document.getElementById("line-modal-div-" + i) != null) {
            console.log("Checking: " + i + " count: " + count);
            if(document.getElementById("view-template-checked-" + i) == null){
                console.log("Choice: " + document.getElementById("choice-modal-input-" + i).value);
                var thisType = document.getElementById("choice-modal-input-" + i).value;
                updateEverything[templatePath + actualCount + "/type"] = thisType;
                switch(thisType) {
                    case 'title':
                        updateEverything[templatePath + actualCount + "/work"] = document.getElementById("title-modal-input-" + i).value;
                        break;
                    case 'costCode':
                        updateEverything[templatePath + actualCount + "/work"] = document.getElementById("work-modal-input-" + i).value;
                        updateEverything[templatePath + actualCount + "/code"] = document.getElementById("code-modal-input-" + i).value;
                        break;
                    case 'costCodeFillable':
                        updateEverything[templatePath + actualCount + "/work"] = document.getElementById("work-modal-input-" + i).value;
                        if(document.getElementById("code-fillable-modal-input-" + i) == null) {
                            updateEverything[templatePath + actualCount + "/code"] = document.getElementById("code-modal-input-" + i).value;
                        }
                        else updateEverything[templatePath + actualCount + "/code"] = document.getElementById("code-fillable-modal-input-" + i).value;
                        break;
                }
            }
            else {
                if(document.getElementById("view-template-checked-" + i).checked==false) {
                    updateEverything[templatePath + actualCount + "/type"] = "costCode";
                    updateEverything[templatePath + actualCount + "/work"] = document.getElementById("work-modal-input-" + i).value;
                    updateEverything[templatePath + actualCount + "/code"] = document.getElementById("code-modal-input-" + i).value;
                }
                else {
                    updateEverything[templatePath + actualCount + "/type"] = "title";
                    updateEverything[templatePath + actualCount + "/work"] = document.getElementById("title-modal-input-" + i).value;
                }
            }
            actualCount++;
        }
    }
    // Send All Data to Firebase
    firebase.database().ref().update(updateEverything)
    .then(function() {
        // Use Click of Cancel to clear everything
        $('#button-template-modal-cancel').trigger('click');
        toastr["info"](title + " has successfully been updated!");
        var renameButton = document.getElementById(oldTitle);
        location.reload();
    });
});

// Function run when the New Template Delete Button is clicked
// deleteViewTemplate()
// Operations-report-templates
$('#button-template-modal-delete').on('click',function() {
    // Delete Old Template
    var title = document.getElementById("template-modal-title-value").value;
    var confirmDelete = confirm("Are You Sure You Would Like To Delete " + title + "?");
    if(confirmDelete) {
        firebase.database().ref('company/' + localStorage['WYDuserCompanyID'] + '/list/' + title).remove()
        .then(function() {
            // Use Click of Cancel to clear everything
            $('#button-template-modal-cancel').trigger('click');
            toastr["info"](title + " has successfully been deleted!");
        });
        document.getElementById(title).setAttribute("style", "display:none");
    }
});

// Function run when the New Template Button is clicked
// newReportTemplate()
// Operations-report-templates
$('#button-template-new').on('click',function() {
    document.getElementById("button-template-new").setAttribute("style", "display:none");
    document.getElementById("template-card").style.display="block";
    document.getElementById("template-title-div").setAttribute("style", "display:inline");
    document.getElementById("button-template-line").setAttribute("style", "display:inline");
    document.getElementById("template-new-divider").setAttribute("style", "display:block");
    document.getElementById("button-template-save").setAttribute("style", "display:inline");
    document.getElementById("button-template-cancel").setAttribute("style", "display:inline");
    var inputs = document.getElementById("template-inputs");
    $('#button-template-line').trigger('click');
});

// Function run when the New Template Add Line Button is clicked
// newLineReportTemplate()
// Operations-report-templates
$('#button-template-line').on('click', function() {
    var count = document.getElementById("field-count");
    var showDiv = document.getElementById("template-inputs");
    var container = document.createElement("div");
    container.id = ("line-div-" + count.value);
    var choiceLine = document.createElement("div");
    var firstLine = document.createElement("div");
    var secondLine = document.createElement("div");
    var thirdLine = document.createElement("div");
    var fourthLine = document.createElement("div");
    var fifthLine = document.createElement("div");
    var sixthLine = document.createElement("div");
    // Fourth Line - Title Field
    var titleDiv = document.createElement("div");
    var titleSpan = document.createElement("span");
    var titleI = document.createElement("i");
    var titleInput = document.createElement("input");
    titleDiv.setAttribute("class", "input-group mb-1");
    titleSpan.setAttribute("class", "input-group-addon");
    titleI.setAttribute("class", "icon-book-open");
    titleInput.id = ("title-input-" + count.value);
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("class", "form-control");
    titleInput.setAttribute("placeholder", "Title Name");
    titleSpan.appendChild(titleI);
    titleDiv.appendChild(titleSpan);
    titleDiv.appendChild(titleInput);
    fourthLine.style=("display:none");
    fourthLine.appendChild(titleDiv);
    // Third Line - Fillable Cost Code Placeholder
    var codeFillableDiv = document.createElement("div");
    var codeFillableSpan = document.createElement("span");
    var codeFillableI = document.createElement("i");
    var codeFillableInput = document.createElement("input");
    codeFillableDiv.setAttribute("class", "input-group mb-1");
    codeFillableSpan.setAttribute("class", "input-group-addon");
    codeFillableI.setAttribute("class", "icon-calculator");
    codeFillableInput.id = ("code-fillable-input-" + count.value);
    codeFillableInput.setAttribute("type", "text");
    codeFillableInput.setAttribute("class", "form-control");
    codeFillableInput.setAttribute("placeholder", "Cost Code Placeholder");
    codeFillableSpan.appendChild(codeFillableI);
    codeFillableDiv.appendChild(codeFillableSpan);
    codeFillableDiv.appendChild(codeFillableInput);
    thirdLine.setAttribute("style", "display:none");
    thirdLine.appendChild(codeFillableDiv);
    // Second Line - Cost Code Fixed Field
    var codeDiv = document.createElement("div");
    var codeSpan = document.createElement("span");
    var codeI = document.createElement("i");
    var codeInput = document.createElement("input");
    codeDiv.setAttribute("class", "input-group mb-1");
    codeSpan.setAttribute("class", "input-group-addon");
    codeI.setAttribute("class", "icon-calculator");
    codeInput.id = ("code-input-" + count.value);
    codeInput.setAttribute("type", "text");
    codeInput.setAttribute("class", "form-control");
    codeInput.setAttribute("placeholder", "Cost Code");
    codeSpan.appendChild(codeI);
    codeDiv.appendChild(codeSpan);
    codeDiv.appendChild(codeInput);
    secondLine.appendChild(codeDiv);
    // First Line - Work Performed Field
    var performedDiv = document.createElement("div");
    var performedSpan = document.createElement("span");
    var performedI = document.createElement("i");
    var performedInput = document.createElement("input");
    performedDiv.setAttribute("class", "input-group mb-1");
    performedSpan.setAttribute("class", "input-group-addon");
    performedI.setAttribute("class", "icon-wrench");
    performedInput.id = ("work-input-" + count.value);
    performedInput.setAttribute("type", "text");
    performedInput.setAttribute("class", "form-control");
    performedInput.setAttribute("placeholder", "Work Performed");
    performedSpan.appendChild(performedI);
    performedDiv.appendChild(performedSpan);
    performedDiv.appendChild(performedInput);
    firstLine.appendChild(performedDiv);
    // Choice Line
    var choiceLabel = document.createElement("label");
    var choiceDiv = document.createElement("div");
    var choiceSpan = document.createElement("span");
    var choiceI = document.createElement("i");
    var choiceSelect = document.createElement("select");
    var option = document.createElement("option");
    choiceLabel.innerHTML = "Choose Type of Field";
    choiceDiv.setAttribute("class", "input-group mb-1");
    choiceSpan.setAttribute("class", "input-group-addon");
    choiceI.setAttribute("class", "fa fa-tasks");
    choiceSelect.setAttribute("class", "form-control");
    choiceSelect.id = ("choice-input-" + count.value);
    for(var i = 0; i < 3; i++) {
        switch(i) {
            case 0:
                choiceSelect.options[i] = new Option('Cost Code Fixed', 'costCode');
                break;
            case 1:
                choiceSelect.options[i] = new Option('Cost Code Fillable', 'costCodeFillable');
                break;
            case 2:
                choiceSelect.options[i] = new Option('Title', 'title');
                break;
        }
            
    }
    choiceSelect.onchange = function () {
        switch(this.value) {
            case 'title':
                firstLine.setAttribute("style", "display:none");
                secondLine.setAttribute("style", "display:none");
                thirdLine.setAttribute("style", "display:none");
                fourthLine.setAttribute("style", "display:inline");
                break;
            case 'costCode':
                firstLine.setAttribute("style", "display:inline");
                secondLine.setAttribute("style", "display:inline");
                thirdLine.setAttribute("style", "display:none");
                fourthLine.setAttribute("style", "display:none");
                break;
            case 'costCodeFillable':
                firstLine.setAttribute("style", "display:inline");
                secondLine.setAttribute("style", "display:none");
                thirdLine.setAttribute("style", "display:inline");
                fourthLine.setAttribute("style", "display:none");
                break;
        }
    }
    var deleteLine = document.createElement("div");
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn-danger float-right");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("title", "DELETE LINE");
    deleteButton.innerHTML = "DELETE LINE";
    deleteButton.onclick = function() {
        var thisContainer = this.parentElement.parentElement;
        var divAbove = this.parentElement.parentElement.parentElement;
        divAbove.removeChild(thisContainer);
        count.value--;
    };
    deleteLine.appendChild(deleteButton);
    choiceSpan.appendChild(choiceI);
    choiceDiv.appendChild(choiceSpan);
    choiceDiv.appendChild(choiceSelect);
    choiceLine.appendChild(choiceLabel);
    choiceLine.appendChild(choiceDiv);
    // Add everything to the container  
    container.appendChild(deleteLine);
    container.appendChild(document.createElement("br"));
    container.appendChild(choiceLine);
    container.appendChild(firstLine);
    container.appendChild(secondLine);
    container.appendChild(thirdLine);
    container.appendChild(fourthLine);
    container.appendChild(document.createElement("hr"));
    showDiv.appendChild(container);
    count.value++;
});

// Function run when the New Modal Template Add Line Button is clicked
// newModalLineReportTemplate()
// Operations-report-templates
$('#button-template-modal-line').on('click', function() {
    var count = document.getElementById("template-modal-count");
    var showDiv = document.getElementById("template-modal-inputs");
    var container = document.createElement("div");
    container.id = ("line-modal-div-" + count.value);
    var choiceLine = document.createElement("div");
    var firstLine = document.createElement("div");
    var secondLine = document.createElement("div");
    var thirdLine = document.createElement("div");
    var fourthLine = document.createElement("div");
    var fifthLine = document.createElement("div");
    var sixthLine = document.createElement("div");
    // Fourth Line - Title Field
    var titleDiv = document.createElement("div");
    var titleSpan = document.createElement("span");
    var titleI = document.createElement("i");
    var titleInput = document.createElement("input");
    titleDiv.setAttribute("class", "input-group mb-1");
    titleSpan.setAttribute("class", "input-group-addon");
    titleI.setAttribute("class", "icon-book-open");
    titleInput.id = ("title-modal-input-" + count.value);
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("class", "form-control");
    titleInput.setAttribute("placeholder", "Title Name");
    titleSpan.appendChild(titleI);
    titleDiv.appendChild(titleSpan);
    titleDiv.appendChild(titleInput);
    fourthLine.style=("display:none");
    fourthLine.appendChild(titleDiv);
    // Third Line - Fillable Cost Code Placeholder
    var codeFillableDiv = document.createElement("div");
    var codeFillableSpan = document.createElement("span");
    var codeFillableI = document.createElement("i");
    var codeFillableInput = document.createElement("input");
    codeFillableDiv.setAttribute("class", "input-group mb-1");
    codeFillableSpan.setAttribute("class", "input-group-addon");
    codeFillableI.setAttribute("class", "icon-calculator");
    codeFillableInput.id = ("code-fillable-modal-input-" + count.value);
    codeFillableInput.setAttribute("type", "text");
    codeFillableInput.setAttribute("class", "form-control");
    codeFillableInput.setAttribute("placeholder", "Cost Code Placeholder");
    codeFillableSpan.appendChild(codeFillableI);
    codeFillableDiv.appendChild(codeFillableSpan);
    codeFillableDiv.appendChild(codeFillableInput);
    thirdLine.setAttribute("style", "display:none");
    thirdLine.appendChild(codeFillableDiv);
    // Second Line - Cost Code Fixed Field
    var codeDiv = document.createElement("div");
    var codeSpan = document.createElement("span");
    var codeI = document.createElement("i");
    var codeInput = document.createElement("input");
    codeDiv.setAttribute("class", "input-group mb-1");
    codeSpan.setAttribute("class", "input-group-addon");
    codeI.setAttribute("class", "icon-calculator");
    codeInput.id = ("code-modal-input-" + count.value);
    codeInput.setAttribute("type", "text");
    codeInput.setAttribute("class", "form-control");
    codeInput.setAttribute("placeholder", "Cost Code");
    codeSpan.appendChild(codeI);
    codeDiv.appendChild(codeSpan);
    codeDiv.appendChild(codeInput);
    secondLine.appendChild(codeDiv);
    // First Line - Work Performed Field
    var performedDiv = document.createElement("div");
    var performedSpan = document.createElement("span");
    var performedI = document.createElement("i");
    var performedInput = document.createElement("input");
    performedDiv.setAttribute("class", "input-group mb-1");
    performedSpan.setAttribute("class", "input-group-addon");
    performedI.setAttribute("class", "icon-wrench");
    performedInput.id = ("work-modal-input-" + count.value);
    performedInput.setAttribute("type", "text");
    performedInput.setAttribute("class", "form-control");
    performedInput.setAttribute("placeholder", "Work Performed");
    performedSpan.appendChild(performedI);
    performedDiv.appendChild(performedSpan);
    performedDiv.appendChild(performedInput);
    firstLine.appendChild(performedDiv);
    // Choice Line
    var choiceLabel = document.createElement("label");
    var choiceDiv = document.createElement("div");
    var choiceSpan = document.createElement("span");
    var choiceI = document.createElement("i");
    var choiceSelect = document.createElement("select");
    var option = document.createElement("option");
    choiceLabel.innerHTML = "Choose Type of Field";
    choiceDiv.setAttribute("class", "input-group mb-1");
    choiceSpan.setAttribute("class", "input-group-addon");
    choiceI.setAttribute("class", "fa fa-tasks");
    choiceSelect.setAttribute("class", "form-control");
    choiceSelect.id = ("choice-modal-input-" + count.value);
    for(var i = 0; i < 3; i++) {
        switch(i) {
            case 0:
                choiceSelect.options[i] = new Option('Cost Code Fixed', 'costCode');
                break;
            case 1:
                choiceSelect.options[i] = new Option('Cost Code Fillable', 'costCodeFillable');
                break;
            case 2:
                choiceSelect.options[i] = new Option('Title', 'title');
                break;
        }
            
    }
    choiceSelect.onchange = function () {
        switch(this.value) {
            case 'title':
                firstLine.setAttribute("style", "display:none");
                secondLine.setAttribute("style", "display:none");
                thirdLine.setAttribute("style", "display:none");
                fourthLine.setAttribute("style", "display:inline");
                break;
            case 'costCode':
                firstLine.setAttribute("style", "display:inline");
                secondLine.setAttribute("style", "display:inline");
                thirdLine.setAttribute("style", "display:none");
                fourthLine.setAttribute("style", "display:none");
                break;
            case 'costCodeFillable':
                firstLine.setAttribute("style", "display:inline");
                secondLine.setAttribute("style", "display:none");
                thirdLine.setAttribute("style", "display:inline");
                fourthLine.setAttribute("style", "display:none");
                break;
        }
    }
    var deleteLine = document.createElement("div");
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn-danger float-right");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("title", "DELETE LINE");
    deleteButton.innerHTML = "DELETE LINE";
    deleteButton.onclick = function() {
        var thisContainer = this.parentElement.parentElement;
        var divAbove = this.parentElement.parentElement.parentElement;
        divAbove.removeChild(thisContainer);
        count.value--;
    };
    deleteLine.appendChild(deleteButton);
    choiceSpan.appendChild(choiceI);
    choiceDiv.appendChild(choiceSpan);
    choiceDiv.appendChild(choiceSelect);
    choiceLine.appendChild(choiceLabel);
    choiceLine.appendChild(choiceDiv);
    // Add everything to the container
    container.appendChild(deleteLine);
    container.appendChild(document.createElement("br"));
    container.appendChild(choiceLine);
    container.appendChild(firstLine);
    container.appendChild(secondLine);
    container.appendChild(thirdLine);
    container.appendChild(fourthLine);
    container.appendChild(document.createElement("hr"));
    showDiv.appendChild(container);
    count.value++;
});

// Function run when the New Template Save Button is clicked
// saveNewReportTemplate()
// Operations-report-templates
$('#button-template-save').on('click',function() {
    document.getElementById('loading').setAttribute('style','display:true');
    var actualCount = 0;
    var companyKey = localStorage["WYDuserCompanyID"];
    var count = document.getElementById("field-count").value;
    console.log("count: " + count);
    var title = document.getElementById("template-title").value;
    if(title == "") {
        d = new Date();
        title = "template_" + getTodaysDate(0,0,0) + "_" + d.getHours() + "-" + d.getMinutes();
    }
    console.log("Template Title: " + title);
    var templatePath = 'company/' + companyKey + '/list/' + title + '/';
    var updateEverything = {};
    updateEverything[templatePath + 'short'] = document.getElementById("template-short-title").value;
    updateEverything[templatePath + 'lunch'] = document.getElementById("template-toggle-lunch").checked;
    for(var i = 0; actualCount < count; i++){
        if(document.getElementById("line-div-" + i) != null) {
            var thisType = document.getElementById("choice-input-" + i).value;
            updateEverything[templatePath + actualCount + "/type"] = thisType;
            switch(thisType) {
                case 'title':
                    updateEverything[templatePath + actualCount + "/work"] = document.getElementById("title-input-" + i).value;
                    break;
                case 'costCode':
                    updateEverything[templatePath + actualCount + "/work"] = document.getElementById("work-input-" + i).value;
                    updateEverything[templatePath + actualCount + "/code"] = document.getElementById("code-input-" + i).value;
                    break;
                case 'costCodeFillable':
                    updateEverything[templatePath + actualCount + "/work"] = document.getElementById("work-input-" + i).value;
                    updateEverything[templatePath + actualCount + "/code"] = document.getElementById("code-fillable-input-" + i).value;                          
                    break;
            }
            actualCount++;
        }
    }
    // Send All Data to Firebase
    firebase.database().ref().update(updateEverything)
    .then(function() {
        // Use Click of Cancel to clear everything
        $('#button-template-cancel').trigger('click');
        toastr["info"](title + " has successfully been created!");
        location.reload();
    });
});

// Function run when the New Template Cancel Button is clicked
// cancelNewReportTemplate()
// Operations-report-templates
$('#button-template-cancel').on('click',function() {
    document.getElementById("button-template-new").setAttribute("style", "display:inline");
    document.getElementById("template-card").setAttribute("style", "display:none");
    document.getElementById("template-title-div").setAttribute("style", "display:none");
    document.getElementById("button-template-line").setAttribute("style", "display:none");
    document.getElementById("template-new-divider").setAttribute("style", "display:none"); 
    document.getElementById("button-template-line").setAttribute("style", "display:none");
    document.getElementById("button-template-cancel").setAttribute("style", "display:none");
    document.getElementById("button-template-save").setAttribute("style", "display:none");
    document.getElementById("loading").setAttribute("style", "display:none");
    document.getElementById("template-inputs").innerHTML="";
    document.getElementById("field-count").value=0;
});

// Function run when the New Report Page is loaded
// viewNewTemplates()
// Operations-reports-new & Employees-reports-new
function viewNewTemplates() {
    var buttonDiv = document.getElementById("template-select");
    // Fill in buttons for templates
    firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + '/list').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var newButton = document.createElement("button");
            newButton.type="button";
            newButton.className="btn btn-secondary btn-block btn-lg";
            newButton.onclick = function () {newReportSelect(childSnapshot.key)};
            newButton.innerText=childSnapshot.key;
            buttonDiv.append(newButton);
       }) ;
    });
    // Fill in dropdown for job
    var selectJob = document.getElementById("report-select-job-name");
    var selectJobNum = document.getElementById("report-select-job-num");
    var selectJobId = document.getElementById("report-select-job-id");
    //document.getElementById("report-time-start").value = (getTodaysDate() + " 08:00");
    //document.getElementById("report-time-end").value = (getTodaysDate() + " 16:00");
    firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + '/job/active/').once('value').then(function(snapshot) {
        var i = 0;
        snapshot.forEach(function(childSnapshot) {
            var el = document.createElement("option");
            el.textContent = childSnapshot.val().jobName;
            el.value = childSnapshot.val().jobContractor;
            selectJob.appendChild(el);
            var elNum = document.createElement("option");
            elNum.textContent = childSnapshot.val().jobNum;
            elNum.value = childSnapshot.val().jobContractor;
            selectJobNum.appendChild(elNum);
            var elId = document.createElement("option");
            elId.textContent = childSnapshot.key;
            elId.value = childSnapshot.key;
            selectJobId.appendChild(elId);
            if(i==0) document.getElementById("report-contractor").value = childSnapshot.val().jobContractor;
            i++;
        });
        /* Uncomment this for other option for job name/number
        var el = document.createElement("option");
        el.textContent = "Other";
        el.value = "Other";
        selectJob.appendChild(el);
        var elNum = document.createElement("option");
        elNum.textContent = "Other";
        elNum.value = "Other";
        selectJobNum.appendChild(elNum); */
    });
}

// Functions run when a specic Job Name/Num is selected to set the values of the current job
// onChangeReportSelectJobName()
// onChangeReportSelectJobNum()
// Operations-reports-new & Employees-reports-new
$("#report-select-job-name").change(function(){
    $("#report-select-job-num option").eq($(this).prop("selectedIndex")).prop("selected", "selected");
    $("#report-select-job-id option").eq($(this).prop("selectedIndex")).prop("selected", "selected");
    $("#report-contractor").val($(this).val());
});

$("#report-select-job-num").change(function(){
    console.log("changing job num : contractor : " + $(this).val());
    $("#report-select-job-name option").eq($(this).prop("selectedIndex")).prop("selected", "selected");
    $("#report-select-job-id option").eq($(this).prop("selectedIndex")).prop("selected", "selected");
    $("#report-contractor").val($(this).val());
});

// Function run to calculate the difference between start and end times in "x days y hours z min"
// calculateTimeDiff(template)
// Operations-reports-new & Employees-reports-new
function calculateTimeDiff(template, event) {
    // If template is 0 then being used in New Report
    if(template==0) {
        var start = document.getElementById("report-time-start-input");
        var end = document.getElementById("report-time-end-input");
        var total = document.getElementById("report-time-total");
        var startDate = new Date(start.value);
        var endDate = new Date(end.value);
        var totalDate = endDate - startDate; // Number in ms
        totalDate = totalDate/1000; // 1000ms per s
        var totalSec = Math.floor(totalDate%60);
        totalDate = totalDate/60; // 60 s per min
        var totalMin = Math.floor(totalDate%60);
        totalDate = totalDate/60; // 60 min per hour
        var totalHour = Math.floor(totalDate%24);
        totalDate = totalDate/24;
        var totalDay = Math.floor(totalDate);
        if(startDate != "Invalid Date" && endDate != "Invalid Date" && !isNaN(totalMin)) {
            console.log("It's all G");
            document.getElementById("button-save-report").disabled = false;  
            total.value = (totalDay + " days " + totalHour + " hours " + totalMin + " minutes");
        }
        console.log("start: " + startDate + ", end: " + endDate + ", total: " + total.value);
        
        // Enables the Save Button   
    //    if(!isNaN(totalMin))document.getElementById("button-save-report").disabled = false;
    }
}

// Function run when the Cancel Button for New Report is clicked
// cancelNewReport()
// Operations-reports-new & Employees-reports-new
$('#button-cancel-report').on('click', function() {
    document.getElementById("report-time-start-input").value = "";
    document.getElementById("report-time-end-input").value = "";
    document.getElementById("report-time-total").value = "Not Yet Set";
    document.getElementById("template-holder").setAttribute('style', 'display:none');
    document.getElementById("template-reselect").setAttribute('style', 'display:none');
    document.getElementById("template-hide-select").setAttribute('style', 'display:none');
    document.getElementById("template-select").setAttribute('style', 'display:true');
    document.getElementById("loading").setAttribute('style', 'display:none');
});

// Function run when the Save Button for New Report is clicked
// saveNewReport()
// Operations-reports-new & Employees-reports-new
$('#button-save-report').on('click', function() {
    let debug = true;
    calculateTimeDiff(0);
    if(debug) console.log("submittedDate: " + document.getElementById('report-date').innerText);
    document.getElementById('loading').setAttribute('style', 'display:true');
    var counts = 0;
    var companyKey = localStorage["WYDuserCompanyID"];
    var updateEverything = {};
    var newReport = firebase.database().ref('company/' + companyKey + '/report').push();
    if(debug) console.log(newReport);
    var path = 'company/' + companyKey + '/report/' + newReport.key + '/';
    var userPath = 'user/' + localStorage["WYDuserID"] +    '/history/' + newReport.key + '/';
    updateEverything[userPath + 'reportId'] = newReport.key;
    updateEverything[path + 'submittedBy'] = localStorage["WYDuserNameFull"];
    updateEverything[path + 'submittedUID'] = localStorage["WYDuserID"];
    updateEverything[path + 'submittedDate'] = document.getElementById('report-date').innerText;
    updateEverything[userPath + 'date'] = document.getElementById('report-date').innerText;
    updateEverything[path + 'submittedInitials'] = localStorage["WYDuserInitials"];
    updateEverything[path + 'type'] = document.getElementById('template-type-title').innerText;
    updateEverything[path + 'short'] = document.getElementById('template-short').value;
    updateEverything[userPath + 'type'] = document.getElementById('template-short').value;
    var selectedName = document.getElementById('report-select-job-name');
    updateEverything[path + 'jobName'] = selectedName.options[selectedName.selectedIndex].text;
    var selectedNum = document.getElementById('report-select-job-num');
    updateEverything[path + 'jobNum'] = selectedNum.options[selectedNum.selectedIndex].text;
    updateEverything[userPath + 'jobNum'] = selectedNum.options[selectedNum.selectedIndex].text;
    //Search Terms
    // type_number (Short Template + Job Number)
    updateEverything[path + 'short-num']= document.getElementById('template-short').value + '_' + selectedNum.options[selectedNum.selectedIndex].text;
    // type_submitted (Short Template + Submitted By)
    updateEverything[path + 'short-submitted']= document.getElementById('template-short').value + '_' + localStorage["WYDuserInitials"];
    // type_number_submitted (Short Template + Job Number + Submitted By)
    updateEverything[path + 'short-num-submitted']= document.getElementById('template-short').value + '_' + selectedNum.options[selectedNum.selectedIndex].text + '_' + localStorage["WYDuserInitials"];
    // number_submitted (Job Number + Submitted By)
    updateEverything[path + 'num-submitted']= selectedNum.options[selectedNum.selectedIndex].text + '_' + localStorage["WYDuserInitials"];
    // End search terms
    updateEverything[path + 'jobId'] = document.getElementById('report-select-job-id').value;
    updateEverything[userPath + 'jobId'] = document.getElementById('report-select-job-id').value;
    if(document.getElementById('report-select-job-name').value != 'option') {
        updateEverything[path + 'linked'] = true;
    }
    else {
        
    }
    updateEverything[path + 'timeStart'] = document.getElementById('report-time-start-input').value;
    updateEverything[userPath + 'timeStart'] = document.getElementById('report-time-start-input').value;
    updateEverything[path + 'timeEnd'] = document.getElementById('report-time-end-input').value;
    updateEverything[path + 'timeTotal'] = document.getElementById('report-time-total').value;
    updateEverything[path + 'contractor'] = document.getElementById('report-contractor').value;
    updateEverything[path + 'foreman'] = document.getElementById('report-foreman').options[document.getElementById('report-foreman').selectedIndex].text;
    if(document.getElementById('report-iqr').value=="") {
        updateEverything[path + 'iqr'] = "Nothing to Report";
    }
    else updateEverything[path + 'iqr'] = document.getElementById('report-iqr').value;
    // If DPR Report
    if(document.getElementById('template-type-title').innerText == 'DPR') {
        updateEverything[path + 'short'] = "DPR";
        updateEverything[userPath + 'type'] = "DPR";
        var tempDiv = document.getElementById("report-tech-0");
        var tempCount = 0;
        while (tempDiv != null) {
            if(debug) console.log("Looking for " + tempCount);
            updateEverything[path + 'employees/' + tempCount + '/name'] = tempDiv.innerText;
            updateEverything[path + 'employees/' + tempCount + '/id'] = tempDiv.value;
            updateEverything[path + 'employees/' + tempCount + '/hours'] = document.getElementById('report-tech-hours-' + tempCount).value;
            tempCount++;
            tempDiv = document.getElementById("report-tech-" + tempCount);
        }
        tempDiv = document.getElementById("report-materials-0");
        tempCount = 0;
        while (tempDiv != null) {
            updateEverything[path + 'materials/' + tempCount + '/needed'] = tempDiv.value;
            updateEverything[path + 'materials/' + tempCount + '/by'] = document.getElementById('report-materials-date-' + tempCount).value;
            tempCount++;
            tempDiv = document.getElementById("report-materials-" + tempCount);
        }
        tempDiv = document.getElementById("report-performed-0");
        tempCount = 0;
        while (tempDiv != null) {
            updateEverything[path + 'work/' + tempCount + '/performed'] = tempDiv.value;
            updateEverything[path + 'work/' + tempCount + '/location'] = document.getElementById('report-performed-location-' + tempCount).value;
            tempCount++;
            tempDiv = document.getElementById("report-performed-" + tempCount);
        }
        updateEverything[path + 'tasks/lunch'] = document.getElementById('report-dpr-lunch').value;
        tempCount = 0;
        tempDiv = document.getElementById("report-location-" + tempCount);
        while (tempDiv != null) {
            updateEverything[path + 'tasks/' + tempCount + '/location'] = tempDiv.value;
            updateEverything[path + 'tasks/' + tempCount + '/tr'] = document.getElementById('report-tr-' + tempCount).value;
            updateEverything[path + 'tasks/' + tempCount + '/pathways'] = document.getElementById('report-pathways-' + tempCount).value;
            updateEverything[path + 'tasks/' + tempCount + '/roughin'] = document.getElementById('report-roughin-' + tempCount).value;
            updateEverything[path + 'tasks/' + tempCount + '/terminations'] = document.getElementById('report-terminations-' + tempCount).value;
            updateEverything[path + 'tasks/' + tempCount + '/testing'] = document.getElementById('report-testing-' + tempCount).value;
            tempCount++;
            tempDiv = document.getElementById("report-location-" + tempCount);
        }
    }
    // If non-DPR
    else {
        //updateEverything[path + 'tasks/' + tempCount + '/testing'] = document.getElementById('report-testing-' + tempCount).value;
        if(document.getElementById('report-lunch').value != null && document.getElementById('report-lunch').value != '')
        updateEverything[path + 'lunch'] = document.getElementById('report-lunch').value;
        else if(document.getElementById('report-lunch').value == '') {
            if(localStorage["WYDuserCompanyLunch"] != '' && localStorage["WYDuserCompanyLunch"] != null) {
                updateEverything[path + 'lunch'] = localStorage["WYDuserCompanyLunch"];
            }
            else {
                updateEverything[path + 'lunch'] = 30;
            }
        }
        var i = 0;
        var templateLines = document.getElementById('report-' + i);
        while(templateLines != null) {
            // Title
            if(templateLines.tagName == 'H5') {
                //updateEverything[path + 'list/' + i + '/title'] = true;
                updateEverything[path + 'list/' + i + '/type'] = "title";
                updateEverything[path + 'list/' + i + '/work'] = templateLines.innerText;
            }
            // Non-title fields
            else {
                //updateEverything[path + 'list/' + i + '/title'] = false;
                // Cost Code FIllable
                if(document.getElementById("report-code-fillable-" + i) != null) {
                    updateEverything[path + 'list/' + i + '/type'] = "costCodeFillable";
                    updateEverything[path + 'list/' + i + '/work'] = document.getElementById("report-" + i).innerHTML;
                    var temp = document.getElementById("report-code-fillable-" + i);
                    if(temp.value == null || temp.value == "") {
                        updateEverything[path + 'list/' + i + '/code'] = temp.placeholder;
                    }
                    else {
                        updateEverything[path + 'list/' + i + '/code'] = temp.value;
                    }
                }
                // Cost Code
                else {
                    updateEverything[path + 'list/' + i + '/type'] = "costCode";
                    updateEverything[path + 'list/' + i + '/code'] = document.getElementById("report-code-" + i).value;
                    updateEverything[path + 'list/' + i + '/work'] = document.getElementById("report-" + i).innerHTML;
                }
                updateEverything[path + 'list/' + i + '/hours'] = document.getElementById("report-hours-" + i).value;
                updateEverything[path + 'list/' + i + '/ot'] = document.getElementById("report-ot-" + i).value;
                updateEverything[path + 'list/' + i + '/issued'] = document.getElementById("report-issued-" + i).value;
                updateEverything[path + 'list/' + i + '/installed'] = document.getElementById("report-installed-" + i).value;
            }
            i++;
            templateLines = document.getElementById('report-' + i);
        }
    }
    //updateEverything[path + ''] = 
    //updateEverything[path + ''] = 
    //updateEverything[path + ''] = 
    //updateEverything[path + ''] = 
    //updateEverything[path + ''] = 
    
    // Send All Date to Firebase
    console.log(updateEverything);
    firebase.database().ref().update(updateEverything).then(function() {
       $('#button-cancel-report').trigger('click');
        toastr["info"](newReport.key + " has successfully been submitted!");
    })    
    .catch(function(err) {
        toastr["error"](newReport.key + " has encountered an ERROR:<br>" + err);
        console.log('error', err);
    });
});

// Function run when a specific template button is clicked
// newReportSelect()
// Operations-reports-new & Employees-reports-new
function newReportSelect(name) {
    console.log("Hello there: " + name);
    document.getElementById("template-holder").setAttribute('style', 'display:true');
    document.getElementById("template-reselect").setAttribute('style', 'display:true');
    document.getElementById("template-hide-select").setAttribute('style', 'display:none');
    document.getElementById("template-select").setAttribute('style', 'display:none');
    document.getElementById("report-date").innerHTML = Date();
    document.getElementById("template-type").value = name;
    document.getElementById("template-lunch").style = "display:none";
    document.getElementById("template-type-title").innerText = name;
    if(name == "DPR") {
        console.log("lol dumpit DPR");
        var templateFields = document.getElementById("template-fields");
        var reportTechs = document.getElementById("report-dpr-techs");
        var reportForeman = document.getElementById("report-foreman");
        removeOptions(reportTechs);
        removeOptions(reportForeman);
        document.getElementById("div-report-dpr").setAttribute('style', 'display:true');
        templateFields.innerHTML = "";
        firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + '/users').once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot){
                var optA = document.createElement("option");
                var optB = document.createElement("option");
                optA.innerText = childSnapshot.val().nameFull;
                optB.innerText = childSnapshot.val().nameFull;
                optA.value = childSnapshot.key;
                optB.value = childSnapshot.key;
                reportTechs.add(optA);
                reportForeman.add(optB);
            });
        });
    }
    else {
        var reportForeman = document.getElementById("report-foreman");
        removeOptions(reportForeman);
        firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + '/users').once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot){
                var opt = document.createElement("option");
                opt.innerText = childSnapshot.val().nameFull;
                opt.value = childSnapshot.key;
                reportForeman.appendChild(opt);
            });
        });
        var templateFields = document.getElementById("template-fields");
        templateFields.innerHTML = "";
        document.getElementById("div-report-dpr").setAttribute('style', 'display:none');
        firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + '/list/' + name).once('value').then(function(snapshot) {
            var fields = snapshot.val();
            var lunch = fields.lunch;
            var childLength;
            if(lunch) {
                console.log("showing: " + lunch + " " + snapshot.numChildren());
                childLength = snapshot.numChildren()-2;
                document.getElementById("template-lunch").style = "display:inline";
            }
            else if(lunch == false){
                console.log("hiding: " + lunch + " " + snapshot.numChildren());
                childLength = snapshot.numChildren()-2;
                document.getElementById("template-lunch").style = "display:none";
            }
            else{
                console.log("no lunch");
                childLength = snapshot.numChildren()-1;
                document.getElementById("template-lunch").style = "display:none";
            }
            document.getElementById("template-short").value = fields.short;
            for(var i=0; i < childLength; i++) {
                if(fields[i].title == null) {
                    console.log("i: " + i + " childlength: " + childLength);
                    console.log(fields[i]);
                    switch(fields[i].type) {
                        case "title":
                            var titleDiv = document.createElement("h5");
                            titleDiv.id = "report-" + i;
                            titleDiv.innerText = fields[i].work;
                            templateFields.append(titleDiv);
                            templateFields.append(document.createElement("hr"));
                            break;
                        case "costCode":
                            var reportRowA = document.createElement("div");
                            reportRowA.className = "row";
                            var reportRowB = document.createElement("div");
                            reportRowB.className = "row";
                            var reportColA = document.createElement("div");
                            reportColA.className = "col";
                            reportColA.innerText = fields[i].work;
                            reportColA.id = "report-" + i;
                            var reportColB = document.createElement("div");
                            reportColB.className = "col";
                            reportColB.innerText = "Cost Code: " + fields[i].code;
                            reportColB.value = fields[i].code;
                            reportColB.id = "report-code-" + i;
                            reportRowA.append(reportColA);
                            reportRowA.append(reportColB);
                            var reportColC = document.createElement("div");
                            reportColC.className = "col-6 col-md-3 mb-1";
                            var reportColD = document.createElement("div");
                            reportColD.className = "col-6 col-md-3 mb-1";
                            var reportColE = document.createElement("div");
                            reportColE.className = "col-6 col-md-3 mb-1";
                            var reportColF = document.createElement("div");
                            reportColF.className = "col-6 col-md-3 mb-1";
                            var reportInputA = document.createElement("input");
                            reportInputA.className = "input-group";
                            reportInputA.id = "report-hours-" + i;
                            reportInputA.type = "number";
                            reportInputA.placeholder = "Hours";
                            reportColC.append(reportInputA);
                            var reportInputB = document.createElement("input");
                            reportInputB.className = "input-group";
                            reportInputB.id = "report-ot-" + i;
                            reportInputB.type = "number";
                            reportInputB.placeholder = "Overtime Hours";
                            reportColD.append(reportInputB);
                            var reportInputC = document.createElement("input");
                            reportInputC.className = "input-group";
                            reportInputC.id = "report-issued-" + i;
                            reportInputC.type = "text";
                            reportInputC.placeholder = "Issued Materials";
                            reportColE.append(reportInputC);
                            var reportInputD = document.createElement("input");
                            reportInputD.className = "input-group";
                            reportInputD.id = "report-installed-" + i;
                            reportInputD.type = "text";
                            reportInputD.placeholder = "Installed Materials";
                            reportColF.append(reportInputD);
                            reportRowB.append(reportColC);
                            reportRowB.append(reportColD);
                            reportRowB.append(reportColE);
                            reportRowB.append(reportColF);
                            templateFields.append(reportRowA);
                            templateFields.append(reportRowB);
                            break;
                        case "costCodeFillable":
                            var reportRowA = document.createElement("div");
                            reportRowA.className = "row";
                            var reportRowB = document.createElement("div");
                            reportRowB.className = "row";
                            var reportColA = document.createElement("div");
                            reportColA.className = "col-6 col-md-3 mb-1";
                            reportColA.innerText = fields[i].work;
                            reportColA.id = "report-" + i;
                            var reportColA2 = document.createElement("div");
                            reportColA2.className = "col";
                            reportColA2.className = "col-6 col-md-3 mb-1";
                            var reportColB = document.createElement("div");
                            reportColB.className = "col-6 col-md-3 mb-1";
                            reportColB.innerText = "Cost Code: " + fields[i].code;
                            var reportColB2 = document.createElement("div");
                            reportColB2.className = "col";
                            reportColB2.id = "report-fillable" + i;
                            var reportInputFillable = document.createElement("input");
                            reportInputFillable.className = "input-group";
                            reportInputFillable.id = "report-code-fillable-" + i;
                            reportInputFillable.type = "text";
                            reportInputFillable.placeholder = fields[i].code; 
                            reportRowA.append(reportColA);
                            reportRowA.append(reportColA2);
                            reportColB2.append(reportInputFillable);
                            reportRowA.append(reportColB);
                            reportRowA.append(reportColB2);
                            var reportColC = document.createElement("div");
                            reportColC.className = "col-6 col-md-3 mb-1";
                            var reportColD = document.createElement("div");
                            reportColD.className = "col-6 col-md-3 mb-1";
                            var reportColE = document.createElement("div");
                            reportColE.className = "col-6 col-md-3 mb-1";
                            var reportColF = document.createElement("div");
                            reportColF.className = "col-6 col-md-3 mb-1";
                            var reportInputA = document.createElement("input");
                            reportInputA.className = "input-group";
                            reportInputA.id = "report-hours-" + i;
                            reportInputA.type = "number";
                            reportInputA.placeholder = "Hours";
                            reportColC.append(reportInputA);
                            var reportInputB = document.createElement("input");
                            reportInputB.className = "input-group";
                            reportInputB.id = "report-ot-" + i;
                            reportInputB.type = "number";
                            reportInputB.placeholder = "Overtime Hours";
                            reportColD.append(reportInputB);
                            var reportInputC = document.createElement("input");
                            reportInputC.className = "input-group";
                            reportInputC.id = "report-issued-" + i;
                            reportInputC.type = "text";
                            reportInputC.placeholder = "Issued Materials";
                            reportColE.append(reportInputC);
                            var reportInputD = document.createElement("input");
                            reportInputD.className = "input-group";
                            reportInputD.id = "report-installed-" + i;
                            reportInputD.type = "text";
                            reportInputD.placeholder = "Installed Materials";
                            reportColF.append(reportInputD);
                            reportRowB.append(reportColC);
                            reportRowB.append(reportColD);
                            reportRowB.append(reportColE);
                            reportRowB.append(reportColF);
                            templateFields.append(reportRowA);
                            templateFields.append(reportRowB);
                            break;
                    }
                }
                else {
                    if(fields[i].title) {
                        var titleDiv = document.createElement("h5");
                        titleDiv.id = "report-" + i;
                        titleDiv.innerText = fields[i].work;
                        templateFields.append(titleDiv);
                        templateFields.append(document.createElement("hr"));
                    }
                    else {
                        var reportRowA = document.createElement("div");
                        reportRowA.className = "row";
                        var reportRowB = document.createElement("div");
                        reportRowB.className = "row";
                        var reportColA = document.createElement("div");
                        reportColA.className = "col";
                        reportColA.innerText = fields[i].work;
                        reportColA.id = "report-" + i;
                        var reportColB = document.createElement("div");
                        reportColB.className = "col";
                        reportColB.innerText = "Cost Code: " + fields[i].code;
                        reportColB.value = fields[i].code;
                        reportColB.id = "report-code-" + i;
                        reportRowA.append(reportColA);
                        reportRowA.append(reportColB);
                        var reportColC = document.createElement("div");
                        reportColC.className = "col-6 col-md-3 mb-1";
                        var reportColD = document.createElement("div");
                        reportColD.className = "col-6 col-md-3 mb-1";
                        var reportColE = document.createElement("div");
                        reportColE.className = "col-6 col-md-3 mb-1";
                        var reportColF = document.createElement("div");
                        reportColF.className = "col-6 col-md-3 mb-1";
                        var reportInputA = document.createElement("input");
                        reportInputA.className = "input-group";
                        reportInputA.id = "report-hours-" + i;
                        reportInputA.type = "number";
                        reportInputA.placeholder = "Hours";
                        reportColC.append(reportInputA);
                        var reportInputB = document.createElement("input");
                        reportInputB.className = "input-group";
                        reportInputB.id = "report-ot-" + i;
                        reportInputB.type = "number";
                        reportInputB.placeholder = "Overtime Hours";
                        reportColD.append(reportInputB);
                        var reportInputC = document.createElement("input");
                        reportInputC.className = "input-group";
                        reportInputC.id = "report-issued-" + i;
                        reportInputC.type = "text";
                        reportInputC.placeholder = "Issued Materials";
                        reportColE.append(reportInputC);
                        var reportInputD = document.createElement("input");
                        reportInputD.className = "input-group";
                        reportInputD.id = "report-installed-" + i;
                        reportInputD.type = "text";
                        reportInputD.placeholder = "Installed Materials";
                        reportColF.append(reportInputD);
                        reportRowB.append(reportColC);
                        reportRowB.append(reportColD);
                        reportRowB.append(reportColE);
                        reportRowB.append(reportColF);
                        templateFields.append(reportRowA);
                        templateFields.append(reportRowB);
                    }
                }
            }
        });
    }
}

// Function run when the Report Reselect Button is clicked
// newReportReselect()
// Operations-reports-new & Employees-reports-new
function newReportReselect() {
    document.getElementById("template-select").setAttribute('style', 'display:true');
    document.getElementById("template-hide-select").setAttribute('style', 'display:true');
    document.getElementById("template-reselect").setAttribute('style', 'display:none');
}

// Function run when a the Report Hide Select Button is clicked
// newReportHideSelect()
// Operations-reports-new & Employees-reports-new
function newReportHideSelect() {
    document.getElementById("template-select").setAttribute('style', 'display:none');
    document.getElementById("template-hide-select").setAttribute('style', 'display:none');
    document.getElementById("template-reselect").setAttribute('style', 'display:true');
}

// Function run to show input fields for Tech Hours
// reportSetTechHours()
// Operations-report-new & Employees-reports-new
function reportSetTechHours() {
    var selectedTechs = document.getElementById('report-dpr-techs');
    //var selectedArray = selectedTechs.val();
    var techsHoursDiv = document.getElementById('report-dpr-techs-hours');
    techsHoursDiv.innerHTML = "";
    var num = 0;
    for(var i = 0; i < selectedTechs.length; i++) {
        if(selectedTechs.options[i].selected) {
            var hoursDiv = document.createElement('div');
            hoursDiv.className = "input-group mb-1";
            var hoursLabel = document.createElement('label');
            hoursLabel.id = 'report-tech-' + num;
            hoursLabel.value = 
            selectedTechs.options[i].value;
            hoursLabel.innerText = 
            selectedTechs.options[i].text;
            var hoursSpan = document.createElement('span');
            hoursSpan.className = 'input-group-addon';
            var hoursI = document.createElement('i');
            hoursI.className = "fa fa-user";
            var hoursInput = document.createElement('input');
            hoursInput.className = "form-control";
            hoursInput.id = 'report-tech-hours-' + num;
            hoursInput.type = 'number';
            hoursInput.placeHolder = "Hours Worked";
            hoursSpan.appendChild(hoursI);
            hoursDiv.append(hoursSpan);
            hoursDiv.append(hoursInput);
            techsHoursDiv.append(hoursLabel);
            techsHoursDiv.append(hoursDiv);
            console.log(hoursLabel.value + ": " + hoursLabel.innerText);
            num++;
        }
    }
}

// Function run when a button is clicked and will add a new line for that specific button (used in DPR reports unless specified otherwise)
// newDPRLine()
// Operations-report-new & Employees-reports-new
function newDPRLine(section) {
    switch (section) {
        case 'materials':
            var materialsLine = document.getElementById("report-dpr-materials");
            var count = document.getElementById("report-dpr-materials-count").value;
            count++;
            document.getElementById('report-dpr-materials-count').value = count;
            var holdingDiv = document.createElement("div");
            holdingDiv.innerHTML = '<label for="report-materials-' + count + '">Materials / Equipment Needed</label><div class="row"><div class="input-group mb-1 col-sm"><span class="input-group-addon"><i class="fa fa-shopping-basket"></i></span><input id="report-materials-' + count + '" placeholder="Materials Needed" class="form-control"></div><div class="input-group mb-1 col-sm"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input id="report-materials-date-' + count + '" type="date" placeholder="Date Needed" class="form-control"></div></div>';
            materialsLine.append(holdingDiv);
            break;
        case 'performed':
            var performedLine =  document.getElementById("report-dpr-performed");
            var count = document.getElementById("report-dpr-performed-count").value;
            count++;
            document.getElementById("report-dpr-performed-count").value = count;
            var holdingDiv = document.createElement("div");
            holdingDiv.innerHTML = '<div class="row"><div class="col-sm mb-1"><label for="report-performed-' + count + '">Work Performed</label><div class="input-group"><span class="input-group-addon"><i class="icon-like"></i></span><input id="report-performed-' + count + '" placeholder="Work Performed" class="form-control"></div></div><div class="col-sm mb-1"><label for="report-performed-location-' + count + '">Location</label><div class="input-group"><span class="input-group-addon"><i class="icon-map"></i></span><input id="report-performed-location-' + count + '" placeholder="Location" class="form-control"></div></div></div>';
            performedLine.append(holdingDiv);
            break;
        case 'tasks':
            var tasksLine =  document.getElementById("report-dpr-tasks");
            var count = document.getElementById("report-dpr-tasks-count").value;
            count++;
            document.getElementById("report-dpr-tasks-count").value = count;
            var holdingDiv = document.createElement("div");
            holdingDiv.innerHTML = '<div class="row"><div class="col-sm mb-1"><label for="report-location-' + count + '">Location</label><div class="input-group"><span class="input-group-addon"><i class="icon-globe-alt"></i></span><input id="report-location-' + count + '" placeholder="Task Location" class="form-control"></div></div><div class="col-sm mb-1"><label for="report-description-' + count + '">TR Build Out</label><div class="input-group"><span class="input-group-addon"><i class="fa fa-building"></i></span><input id="report-tr-' + count + '" type="number" placeholder="TR % " class="form-control"></div></div><div class="col-sm mb-1"><label for="report-pathways-' + count + '">Pathways</label><div class="input-group"><span class="input-group-addon"><i class="fa fa-exchange"></i></span><input id="report-pathways-' + count + '" type="number" placeholder="Pathways %" class="form-control"></div></div></div><div class="row"><div class="col-sm mb-1"><label for="report-roughin-' + count + '">Rough In</label><div class="input-group"><span class="input-group-addon"><i class="fa fa-industry"></i></span><input id="report-roughin-' + count + '" type="number" placeholder="Rough In %" class="form-control"></div></div><div class="col-sm mb-1"><label for="report-terminations-' + count + '">Terminations</label><div class="input-group"><span class="input-group-addon"><i class="fa fa-terminal"></i></span><input id="report-terminations-' + count + '" type="number" placeholder="Terminations %" class="form-control"></div></div><div class="col-sm mb-1"><label for="report-testing-' + count + '">Testing</label><div class="input-group"><span class="input-group-addon"><i class="fa fa-calculator"></i></span><input id="report-testing-' + count + '" type="number" placeholder="Testing %" class="form-control"></div></div></div>';
                /*holdingDiv.innerHTML = '<div class="row"><div class="col-sm mb-1"><label for="report-progress-' + count + '">Location</label><div class="input-group"><span class="input-group-addon"><i class="icon-globe-alt"></i></span><input id="report-progress-' + count + '" placeholder="Progress Location" class="form-control"></div></div><div class="col-sm mb-1"><label for="report-description-' + count + '">Description</label><div class="input-group"><span class="input-group-addon"><i class="icon-map"></i></span><input id="report-description-' + count + '" placeholder="Progress Description" class="form-control"></div></div><div class="col-sm mb-1"><label for="report-percent-' + count + '">Percentage</label><div class="input-group"><span class="input-group-addon"><i class="icon-equalizer"></i></span><input id="report-percent-' + count + '" placeholder="Progress Percentage" class="form-control"></div></div></div>';
            */
            tasksLine.append(holdingDiv);
            break;
        default:
            alert("How did you even get this??");
    }
}

// Function run when employees-profile page is loaded
// getEmployeeProfile()
// Employees-profile
function getEmployeeProfile() {
    firebase.database().ref('user/' + localStorage["WYDuserID"]).once('value').then(function(snapshot) {
        document.getElementById("first-input").value = snapshot.val().nameFirst;
        document.getElementById("last-input").value = snapshot.val().nameLast;
        document.getElementById("full-input").value = snapshot.val().nameFull;
        document.getElementById("initials-input").value = snapshot.val().nameInitials;
        document.getElementById("cell-input").value = snapshot.val().numCell;
        document.getElementById("contact-input").value = snapshot.val().numContact;
        document.getElementById("class-input").value = snapshot.val().class;
        document.getElementById("title-input").value = snapshot.val().jobTitle;
        document.getElementById("employee-input").value = snapshot.val().numID;
        document.getElementById("access-input").value = snapshot.val().access;
        document.getElementById("uid-input").value = snapshot.key;
        document.getElementById("additional-input").value = snapshot.val().additional;
    });
}

// Function run to update employees profile
// saveEmployeeProfile()
// Employees-profile
$('#button-profile-save').on('click', function() {
    var updateEverything = {};
    var path = 'user/' + localStorage["WYDuserID"];
    updateEverything[path + '/nameFirst'] = document.getElementById("first-input").value;
    updateEverything[path + '/nameLast'] = document.getElementById("last-input").value;
    updateEverything[path + '/nameFull'] = document.getElementById("full-input").value;
    updateEverything[path + '/nameInitials'] = document.getElementById("initials-input").value;
    updateEverything[path + '/numCell'] = document.getElementById("cell-input").value;
    updateEverything[path + '/numContact'] = document.getElementById("contact-input").value;
    updateEverything[path + '/class'] = document.getElementById("class-input").value;
    updateEverything[path + '/jobTitle'] = document.getElementById("title-input").value;
    updateEverything[path + '/numID'] = document.getElementById("employee-input").value;
    updateEverything[path + '/access'] = document.getElementById("access-input").value;
    updateEverything[path + '/additional'] = document.getElementById("additional-input").value;
    firebase.database().ref().update(updateEverything).then(function() {
        toastr["info"]("Updated your profile!");
    });
});

// Function run when the save button is clicked to save settings for the default landing page
// settingsLanding()
// Settings
$('#button-settings-landing-save').on('click', function() {
    var updateEverything = {};
    var path = 'user/' + localStorage["WYDuserID"] + '/settings/landing';
    if(document.getElementById('landing-employees').checked == true) updateEverything[path] = "employees";
    if(document.getElementById('landing-operations').checked == true) updateEverything[path] = "operations";
    firebase.database().ref().update(updateEverything).then(function() {
        toastr["info"]("Updated your default landing page!");
    });
});

// Function run when the save button is clicked to save settings for showing unused fields in reports
// settingsLanding()
// Settings
$('#button-settings-unused-save').on('click', function() {
    var updateEverything = {};
    var path = 'user/' + localStorage["WYDuserID"] + '/settings/unused';
    if(document.getElementById('unused-true').checked == true) {
        updateEverything[path] = "true";
        localStorage["WYDuserUnused"] = "true";
    }
    if(document.getElementById('unused-false').checked == true) {
        updateEverything[path] = "false";
        localStorage["WYDuserUnused"] = "false";
    }
    firebase.database().ref().update(updateEverything).then(function() {
        toastr["info"]("Updated your Viewing of Unused Fields!");
    });
});

/* ================================================== */
/* USEFUL SCRIPTS: USEFUL ON ALL PAGES WHEN LOGGED IN */
// Function to save all user data into localStorage
function checkVersion(user) {
    let currentVersion = "alpha05212018";
    if(localStorage["WYDversion"] != currentVersion) {
        if(user.uid!=localStorage["WYDuserID"] || localStorage["WYDuserAccess"]==null || localStorage["WYDversion"]==null) {
            getUserData();
            localStorage["WYDversion"] = currentVersion;
        }
    }
}

function getUserData(input) {
    localStorage["WYDuserID"] = firebase.auth().currentUser.uid;
    toastr["info"]("Updating Local Storage for:" + localStorage["WYDuserID"]);
    firebase.database().ref('user/' + localStorage["WYDuserID"]).once('value').then(function(snapshot) {
        data = snapshot.val();
        localStorage["WYDuserAccess"] = data.access;
        localStorage["WYDuserNameFirst"] = data.nameFirst;
        localStorage["WYDuserNameLast"] = data.nameLast;
        localStorage["WYDuserNameFull"] = data.nameFull;
        localStorage["WYDuserInitials"] = data.nameInitials;
        localStorage["WYDuserEmail"] = data.email;
        localStorage["WYDuserNumCell"] = data.numCell;
        localStorage["WYDuserContact"] = data.numContact;
        localStorage["WYDuserClass"] = data.class;
        localStorage["WYDuserJobTitle"] = data.jobTitle;
        localStorage["WYDuserCompanyID"] = data.companyID;
        localStorage["WYDuserCompanyName"] = data.companyName;
        localStorage["WYDuserNumID"] = data.numID;
        if(data.settings == null || data.settings.unused == null) {
            localStorage["WYDuserUnused"] = 'true';
        }
        else {
            localStorage["WYDuserUnused"] = data.settings.unused;
        }
        if(input == 1) {
            if(data.settings == null || data.settings.landing == null || data.settings.landing == "employees") window.location = "employees-dashboard.html";
            else window.location = "operations-dashboard.html";
        }
    });
    firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + "/info/lunch").once('value').then(function(snapshot) {
        localStorage["WYDuserCompanyLunch"] = snapshot.val();
    });
}

// Function to Enable/disable user inputs in a given div
function enableInputs(enable, divName) {
    var div = document.getElementById(divName);
    var inputs = div.getElementsByTagName('input');
    for(var i=0; i<inputs.length; i++){
        inputs[i].disabled = !enable;
    }
    var selects = div.getElementsByTagName('select');
    for(var i=0; i<selects.length; i++){
        selects[i].disabled = !enable;
    }
}

// When anything with the id "Logout" is clicked LOGOUT
// userLogout()
$('#logout').add('#logout-sidebar').on('click', function() {
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
        localStorage.removeItem('WYDuserAccess');
        localStorage.removeItem('WYDuserNameFirst');
        localStorage.removeItem('WYDuserNameLast');
        localStorage.removeItem('WYDuserNameFull');
        localStorage.removeItem('WYDuserInitials');
        localStorage.removeItem('WYDuserEmail');
        localStorage.removeItem('WYDuserNumCell');
        localStorage.removeItem('WYDuserContact');
        localStorage.removeItem('WYDuserClass');
        localStorage.removeItem('WYDuserJobTitle');
        localStorage.removeItem('WYDuserCompanyName');
        localStorage.removeItem('WYDuserCompanyID');
        localStorage.removeItem('WYDuserNumID');
        localStorage.removeItem('WYDuserID');
        localStorage.removeItem('WYDviewClicked');
        localStorage.removeItem('WYDuserUnused');
        localStorage.removeItem('WYDversion');
        localStorage.removeItem('WYDuserCompanyLunch');
        localStorage.removeItem('WYDadditionalEdit');
        console.log("Logging Out");
        //alert("You Have Successfully Signed Out!");
        window.location="index.html";
    }, function(error) {
      // An error happened.
        toastr["warning"]("User has not logged out");
    }); 
});

// Returns today's Date as year-month-day
function getTodaysDate(addYear, addMonth, addDay) {
    var date =  new Date();
    var year = date.getFullYear() + addYear;
    var month = date.getMonth() + 1 + addMonth;
    if(month < 10) {
        month = "0" + month;   
    }
    var day = date.getDate() + addDay;
    if(day < 10) {
        day = "0" + day;   
    }
    return year + "-" + month + "-" + day;
}

// Returns a date as year-month-day
function convertDate(given) {
    var date = new Date(given);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(month < 10) {
        month = "0" + month;   
    }
    var day = date.getDate();
    if(day < 10) {
        day = "0" + day;   
    }
    return year + "-" + month + "-" + day;
}

function getLocalStorage() {
  for(var i=0, len=localStorage.length; i<len; i++) {
    var key = localStorage.key(i);
    var value = localStorage[key];
    console.log(key + " => " + value);
  }
}

// Remove options from select HTML
function removeOptions(selectBox) {
    var i = 0;
    for(i = selectBox.options.length - 1 ; i >= 0 ; i--)
    {
        selectBox.remove(i);
    }
}


// Returns FB connection
function createSecondFB() {
    // Initialize secondary Firebase App
    var config = {
        apiKey: "AIzaSyBJZ82GGbMNtg3aACcT0PVdLlY4yz9-jjo",
        authDomain: "wydo-19f1a.firebaseapp.com",
        databaseURL: "https://wydo-19f1a.firebaseio.com",
        projectId: "wydo-19f1a",
        storageBucket: "wydo-19f1a.appspot.com",
        messagingSenderId: "603556880559"
    };
    var secondaryFB = firebase.initializeApp(config, "Secondary");
    return secondaryFB;
}