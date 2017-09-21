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

'use strict';``

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
        toastr["warning", "Error:" + error.message];
    });
});

// Register a Company
// Login
// userRegister
$('#button-register').on('click', function() {
    window.location="register.html";
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
    updateEverything['company/' + newCompanyKey + '/payment/signup'] = getTodaysDate();
    updateEverything['company/' + newCompanyKey + '/payment/payStart'] = getTodaysDate();
    updateEverything['company/' + newCompanyKey + '/payment/payEnd'] = getTodaysDate();
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
    document.getElementById("button-edit-company-profile").setAttribute("style", "display:none");
    document.getElementById("button-save-company-profile").setAttribute("style", "display:inline");
    document.getElementById("button-cancel-company-profile").setAttribute("style", "display:inline");
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
});

// Function run when editing the company profile
// saveCompanyProfile()
// Save Company Profile
$('#button-save-company-profile').on('click', function(){
    var uID = localStorage["WYDuserID"];
    var companyKey = localStorage["WYDuserCompanyID"];
    var updateEverything = {};
    var loading = document.getElementById('loading').setAttribute('style','display:true');
    // Add Company Information
    updateEverything['company/' + companyKey + '/info/name'] = document.getElementById('name-input').value;
    updateEverything['company/' + companyKey + '/info/numContact'] = document.getElementById('contact-input').value;
    updateEverything['company/' + companyKey + '/info/address'] = document.getElementById('address-input').value;
    updateEverything['company/' + companyKey + '/info/numFax'] = document.getElementById('fax-input').value;
    updateEverything['company/' + companyKey + '/info/website'] = document.getElementById('website-input').value;
    updateEverything['company/' + companyKey + '/info/lunch'] = document.getElementById('lunch-input').value;
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
            document.getElementById("button-delete-user-modal").setAttribute("style", "display:inline");
        }
    }
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
    });
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

// Function run when "Delete Users" button is clicked
// deleteUserButton()
// Operations-seats
$('#button-delete-user-modal').on('click',function(){
    var seatLengths = document.getElementsByName('user-delete').length;
    for(i=0; i<seatLengths; i++) {
        document.getElementById('user-delete-'+i).setAttribute("style", "display:inline");
    }
    document.getElementById('button-delete-user-modal').setAttribute("style", "display:none");
    document.getElementById('button-hide-delete-user-modal').setAttribute("style", "display:inline");
});

// Function run when "Delete Users" button is clicked again to hide delete prompts
// hideDeleteUserButton()
// Operations-seats
$('#button-hide-delete-user-modal').on('click',function(){
    var seatLengths = document.getElementsByName('user-delete').length;
    for(i=0; i<seatLengths; i++) {
        document.getElementById('user-delete-'+i).setAttribute("style", "display:none");
    }
    document.getElementById('button-delete-user-modal').setAttribute("style", "display:inline");
    document.getElementById('button-hide-delete-user-modal').setAttribute("style", "display:none");
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

// Function Run to show active jobs
// getActiveJobs()
// Operations-jobs
function getActiveJobs() {
    var access = localStorage["WYDuserAccess"];
    var jobCountDiv = document.getElementById("job-count");
    if(access < 3) {
        document.getElementById("button-add-job-div").setAttribute("style", "display:inline");
        document.getElementById("button-switch-job-div").setAttribute("style", "display:inline");
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
            infoLink.className = "btn btn-success";
            infoLink.title = "More Info";
            infoLink.href = "#";
            infoLink.onclick = function(){viewJob(childSnapshot,"inactive")};
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
function viewJob(thisJob,active) {
    snapShot = thisJob.val();
    document.getElementById("viewJobModalTitle").innerHTML = (snapShot.jobName + " - " + snapShot.jobNum);
    document.getElementById("view-name-input").value = snapShot.jobName;
    document.getElementById("jobID").value = thisJob.key;
    document.getElementById("view-number-input").value = snapShot.jobNum;
    if(snapShot.jobLocation != null)document.getElementById("view-location-input").value = snapShot.jobLocation;
    if(active == "active") document.getElementById("view-active-input").checked = true;
    else document.getElementById("view-active-input").checked = false;
    if(snapShot.pmName != null)document.getElementById("view-pm-name-input").value = snapShot.pmName;
    if(snapShot.pmNum != null)document.getElementById("view-pm-contact-input").value = snapShot.pmNum;
    if(snapShot.jobContractor != null)document.getElementById("view-contractor-input").value = snapShot.jobContractor;
    jobContacts = document.getElementById("view-modal-job-contacts");
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
    document.getElementById("button-job-delete").style.display = "inline";
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
    var companyKey = localStorage["WYDuserCompanyID"];
    if(document.getElementById("view-active-input").checked==true) {
        active = "active";
    }
    else {
        active = "inactive";
    }
    var jobKey = document.getElementById("jobID").value;
    var count = document.getElementById("view-contact-count").value;
    var jobRef = 'company/' + companyKey + '/job/' + active + '/' + jobKey + '/';
    var newEditJob = firebase.database().ref('company/' + companyKey + '/job/' + active + '/' + jobKey + '/editedBy').push();
    var newEditJobKey = newEditJob.key;
    var jobName = document.getElementById("view-name-input").value;
    var updateEverything = {};
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
        $('#button-add-job-cancel').trigger('click');
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
                var templateFields = document.getElementById("view-modal-template-fields");
                templateFields.innerHTML = "<h5 id='template-modal-title'>" + childSnapshot.key + "</h5><input id='template-modal-title-value' value='" + childSnapshot.key + "' style='display:none'><input id='template-modal-count' value='" + (childSnapshot.numChildren()-1) + "' style='display:none'><div class='input-group mb-1'><span class='input-group-addon'><i class='fa fa-star'></i></span><input disabled id='template-modal-short-title' class='form-control' value='" + childSnapshot.val().short + "'></div><hr>";
                for(var i = 0; i < childSnapshot.numChildren()-1; i++) {
                    (function(i){
                        console.log("i: " + i + " is " + childSnapshot.val()[i].work);
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
        title = "template_" + getTodaysDate() + "_" + d.getHours() + "-" + d.getMinutes();
    }
    var templatePath = 'company/' + companyKey + '/list/' + title + '/';
    updateEverything[templatePath + 'short'] = document.getElementById("template-modal-short-title").value;
    for(var i = 0; i < count; i++){
        if(document.getElementById("line-modal-div-" + i) != null) {
            if(document.getElementById("view-template-checked-" + i).checked==false) {
                updateEverything[templatePath + actualCount + "/title"] = false;
                updateEverything[templatePath + actualCount + "/work"] = document.getElementById("work-modal-input-" + i).value;
                updateEverything[templatePath + actualCount + "/code"] = document.getElementById("code-modal-input-" + i).value;
            }
            else {
                updateEverything[templatePath + actualCount + "/title"] = true;
                updateEverything[templatePath + actualCount + "/work"] = document.getElementById("title-modal-input-" + i).value;
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
    var firstLine = document.createElement("div");
    var secondLine = document.createElement("div");
    var thirdLine = document.createElement("div");
    var fourthLine = document.createElement("div");
    // Fourth Line
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
    // Third Line
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
    thirdLine.appendChild(codeDiv);
    // Second Line
    var performedDiv = document.createElement("div");
    var performedSpan = document.createElement("span");
    var performedI = document.createElement("i");
    var performedInput = document.createElement("input");
    performedDiv.setAttribute("class", "input-group mb-1");
    performedSpan.setAttribute("class", "input-group-addon");
    performedI.setAttribute("class", "icon-wrench");
    performedInput.id = ("performed-input-" + count.value);
    performedInput.setAttribute("type", "text");
    performedInput.setAttribute("class", "form-control");
    performedInput.setAttribute("placeholder", "Work Performed");
    performedSpan.appendChild(performedI);
    performedDiv.appendChild(performedSpan);
    performedDiv.appendChild(performedInput);
    secondLine.appendChild(performedDiv);
    // First Line
    var toggleContainer = document.createElement("label");
    toggleContainer.setAttribute("class", "switch switch-text switch-pill switch-primary");
    var toggle = document.createElement("input");
    toggle.setAttribute("class", "switch-input");
    toggle.setAttribute("type", "checkbox");
    toggle.id = ("toggle-input-" + count.value);
    toggle.onchange = function(){
        if(this.checked==false) {
            secondLine.setAttribute("style", "display:inline");
            thirdLine.setAttribute("style", "display:inline");
            fourthLine.setAttribute("style", "display:none");
        }
        else {
            secondLine.setAttribute("style", "display:none");
            thirdLine.setAttribute("style", "display:none");
            fourthLine.setAttribute("style", "display:inline");
        }
    };
    var toggleLabels = document.createElement("span");
    toggleLabels.setAttribute("class", "switch-label");
    toggleLabels.setAttribute("data-on", "Yes");
    toggleLabels.setAttribute("data-off", "No");
    var toggleHandle = document.createElement("span");
    toggleHandle.setAttribute("class","switch-handle");
    toggleContainer.appendChild(toggle);
    toggleContainer.appendChild(toggleLabels);
    toggleContainer.appendChild(toggleHandle);
    firstLine.appendChild(toggleContainer);
    var titleQuestion = document.createElement("label");
    titleQuestion.innerHTML = "&nbsp;&nbsp;&nbsp;Section Title?";
    firstLine.appendChild(titleQuestion);
    var deleteLine = document.createElement("button");
    deleteLine.setAttribute("class", "btn btn-danger float-right");
    deleteLine.setAttribute("type", "button");
    deleteLine.setAttribute("title", "DELETE LINE");
    deleteLine.innerHTML = "DELETE LINE";
    deleteLine.onclick = function() {
        var thisContainer = this.parentElement.parentElement;
        var divAbove = this.parentElement.parentElement.parentElement;
        divAbove.removeChild(thisContainer);
    };
    firstLine.appendChild(deleteLine);
    // Add everything to the container  
    container.appendChild(firstLine);
    container.appendChild(document.createElement("br"));
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
    var firstLine = document.createElement("div");
    var secondLine = document.createElement("div");
    var thirdLine = document.createElement("div");
    var fourthLine = document.createElement("div");
    // Fourth Line
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
    // Third Line
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
    thirdLine.appendChild(codeDiv);
    // Second Line
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
    secondLine.appendChild(performedDiv);
    // First Line
    var toggleContainer = document.createElement("label");
    toggleContainer.setAttribute("class", "switch switch-text switch-pill switch-primary");
    var toggle = document.createElement("input");
    toggle.setAttribute("class", "switch-input");
    toggle.setAttribute("type", "checkbox");
    toggle.id = ("view-template-checked-" + count.value);
    toggle.onchange = function(){
        if(this.checked==false) {
            secondLine.setAttribute("style", "display:inline");
            thirdLine.setAttribute("style", "display:inline");
            fourthLine.setAttribute("style", "display:none");
        }
        else {
            secondLine.setAttribute("style", "display:none");
            thirdLine.setAttribute("style", "display:none");
            fourthLine.setAttribute("style", "display:inline");
        }
    };
    var toggleLabels = document.createElement("span");
    toggleLabels.setAttribute("class", "switch-label");
    toggleLabels.setAttribute("data-on", "Yes");
    toggleLabels.setAttribute("data-off", "No");
    var toggleHandle = document.createElement("span");
    toggleHandle.setAttribute("class","switch-handle");
    toggleContainer.appendChild(toggle);
    toggleContainer.appendChild(toggleLabels);
    toggleContainer.appendChild(toggleHandle);
    firstLine.appendChild(toggleContainer);
    var titleQuestion = document.createElement("label");
    titleQuestion.innerHTML = "&nbsp;&nbsp;&nbsp;Section Title?";
    firstLine.appendChild(titleQuestion);
    var deleteLine = document.createElement("button");
    deleteLine.setAttribute("class", "btn btn-danger float-right");
    deleteLine.setAttribute("type", "button");
    deleteLine.setAttribute("title", "DELETE LINE");
    deleteLine.innerHTML = "DELETE LINE";
    deleteLine.onclick = function() {
        var thisContainer = this.parentElement.parentElement;
        var divAbove = this.parentElement.parentElement.parentElement;
        divAbove.removeChild(thisContainer);
        count.value--;
    };
    firstLine.appendChild(deleteLine);
    // Add everything to the container  
    container.appendChild(firstLine);
    container.appendChild(document.createElement("br"));
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
    var title = document.getElementById("template-title").value;
    if(title == "") {
        d = new Date();
        title = "template_" + getTodaysDate() + "_" + d.getHours() + "-" + d.getMinutes();
    }
    console.log("Template Title: " + title);
    var templatePath = 'company/' + companyKey + '/list/' + title + '/';
    var updateEverything = {};
    updateEverything[templatePath + 'short'] = document.getElementById("template-short-title").value;
    for(var i = 0; i < count; i++){
        if(document.getElementById("line-div-" + i) != null) {
            if(document.getElementById("toggle-input-" + i).checked==false) {
                updateEverything[templatePath + actualCount + "/title"] = false;
                updateEverything[templatePath + actualCount + "/work"] = document.getElementById("performed-input-" + i).value;
                updateEverything[templatePath + actualCount + "/code"] = document.getElementById("code-input-" + i).value;
            }
            else {
                updateEverything[templatePath + actualCount + "/title"] = true;
                updateEverything[templatePath + actualCount + "/work"] = document.getElementById("title-input-" + i).value;
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
function calculateTimeDiff(template) {
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
        total.value = (totalDay + " days " + totalHour + " hours " + totalMin + " minutes");
        
        // Enables the Save Button   
        if(!isNaN(totalMin))document.getElementById("button-save-report").disabled = false;
    }
}

// Function run when the Cancel Button for New Report is clicked
// cancelNewReport()
// Operations-reports-new & Employees-reports-new
$('#button-cancel-report').on('click', function() {
    document.getElementById("report-time-start-input").value = "";
    document.getElementById("report-time-end-input").value = "";
    document.getElementById("report-time-total").value = "8";
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
    console.log("submittedDate: " + document.getElementById('report-date').innerText);
    document.getElementById('loading').setAttribute('style', 'display:true');
    var counts = 0;
    var companyKey = localStorage["WYDuserCompanyID"];
    var updateEverything = {};
    var newReport = firebase.database().ref('company/' + companyKey + '/report').push();
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
    updateEverything[path + 'foreman'] = document.getElementById('report-foreman').value;
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
            updateEverything[path + 'work/' + tempCount + '/location'] = document.getElementById('report-location-' + tempCount).value;
            tempCount++;
            tempDiv = document.getElementById("report-performed-" + tempCount);
        }
        tempDiv = document.getElementById("report-progress-0");
        tempCount = 0;
        while (tempDiv != null) {
            updateEverything[path + 'progress/' + tempCount + '/location'] = tempDiv.value;
            updateEverything[path + 'progress/' + tempCount + '/description'] = document.getElementById('report-description-' + tempCount).value;
            updateEverything[path + 'progress/' + tempCount + '/percent'] = document.getElementById('report-percent-' + tempCount).value;
            tempCount++;
            tempDiv = document.getElementById("report-progress-" + tempCount);
        }
    }
    else {
        var i = 0;
        var templateLines = document.getElementById('report-' + i);
        while(templateLines != null) {
            if(templateLines.tagName == 'H5') {
                updateEverything[path + 'list/' + i + '/title'] = true;
                updateEverything[path + 'list/' + i + '/work'] = templateLines.innerText;
            }
            else {
                updateEverything[path + 'list/' + i + '/title'] = false;
                updateEverything[path + 'list/' + i + '/work'] = templateLines.innerText;
                updateEverything[path + 'list/' + i + '/code'] = document.getElementById("report-code-" + i).value;
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
    firebase.database().ref().update(updateEverything).then(function() {
       $('#button-cancel-report').trigger('click');
        toastr["info"](newReport.key + " has successfully been submitted!");
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
    document.getElementById("template-type-title").innerText = name;
    if(name == "DPR") {
        console.log("lol dumpit");
        var templateFields = document.getElementById("template-fields");
        var reportTechs = document.getElementById("report-dpr-techs");
        document.getElementById("div-report-dpr").setAttribute('style', 'display:true');
        templateFields.innerHTML = "";
        firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + '/users').once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot){
                var opt = document.createElement("option");
                opt.innerText = childSnapshot.val().nameFull;
                opt.value = childSnapshot.key;
                reportTechs.appendChild(opt);
            });
        });
    }
    else {
        var templateFields = document.getElementById("template-fields");
        templateFields.innerHTML = "";
        document.getElementById("div-report-dpr").setAttribute('style', 'display:none');
        firebase.database().ref('company/' + localStorage["WYDuserCompanyID"] + '/list/' + name).once('value').then(function(snapshot) {
            var fields = snapshot.val();
            document.getElementById("template-short").value = fields.short;
            for(i=0; i < snapshot.numChildren()-1; i++) {
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
        });
    }
}

// Function run when a the Report Reselect Button is clicked
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
    for(var i = 0; i < selectedTechs.length; i++) {
        if(selectedTechs.options[i].selected) {
            var hoursDiv = document.createElement('div');
            hoursDiv.className = "input-group mb-1";
            var hoursLabel = document.createElement('label');
            hoursLabel.id = 'report-tech-' + i;
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
            hoursInput.id = 'report-tech-hours-' + i;
            hoursInput.type = 'number';
            hoursInput.placeHolder = "Hours Worked";
            hoursSpan.appendChild(hoursI);
            hoursDiv.append(hoursSpan);
            hoursDiv.append(hoursInput);
            techsHoursDiv.append(hoursLabel);
            techsHoursDiv.append(hoursDiv);
            console.log(hoursLabel.value + ": " + hoursLabel.innerText);
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
            holdingDiv.innerHTML = '<div class="row"><div class="col-sm mb-1"><label for="report-performed-' + count + '">Work Performed</label><div class="input-group"><span class="input-group-addon"><i class="icon-like"></i></span><input id="report-performed-' + count + '" placeholder="Work Performed" class="form-control"></div></div><div class="col-sm mb-1"><label for="report-location-' + count + '">Location</label><div class="input-group"><span class="input-group-addon"><i class="icon-map"></i></span><input id="report-location-' + count + '" placeholder="Location" class="form-control"></div></div></div>';
            performedLine.append(holdingDiv);
            break;
        case 'progress':
            var progressLine =  document.getElementById("report-dpr-progress");
            var count = document.getElementById("report-dpr-progress-count").value;
            count++;
            document.getElementById("report-dpr-progress-count").value = count;
            var holdingDiv = document.createElement("div");
            holdingDiv.innerHTML = '<div class="row"><div class="col-sm mb-1"><label for="report-progress-' + count + '">Location</label><div class="input-group"><span class="input-group-addon"><i class="icon-globe-alt"></i></span><input id="report-progress-' + count + '" placeholder="Progress Location" class="form-control"></div></div><div class="col-sm mb-1"><label for="report-description--' + count + '">Description</label><div class="input-group"><span class="input-group-addon"><i class="icon-map"></i></span><input id="report-description-' + count + '" placeholder="Progress Description" class="form-control"></div></div><div class="col-sm mb-1"><label for="report-percent--' + count + '">Percentage</label><div class="input-group"><span class="input-group-addon"><i class="icon-equalizer"></i></span><input id="report-percent-' + count + '" placeholder="Progress Percentage" class="form-control"></div></div></div>';
            progressLine.append(holdingDiv);
            break;
        default:
            alert("How did you even get this??");
    }
}

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

/* ================================================== */
/* USEFUL SCRIPTS: USEFUL ON ALL PAGES WHEN LOGGED IN */
// Function to save all user data into localStorage
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
        localStorage["WYDuserNumID"] = data.numID;
        if(input == 1) {
            if(data.settings == null || data.settings.landing == null || data.settings.landing == "employees") window.location = "employees-dashboard.html";
            else window.location = "operations-dashboard.html";
        }
        firebase.database().ref('company/' + data.companyID + "/info").once('value').then(function(snapshot) {
            localStorage["WYDuserCompanyName"] = snapshot.val().name;
            if(input == null) {
                location.reload();
            }
        });
    });
}


// Function to Enable/disable user inputs in a given div
function enableInputs(enable, divName) {
    var div = document.getElementById(divName);
    var inputs = div.getElementsByTagName('input');
    for(var i=0; i<inputs.length; i++){
        inputs[i].disabled = !enable;
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
        console.log("Logging Out");
        //alert("You Have Successfully Signed Out!");
        window.location="index.html";
    }, function(error) {
      // An error happened.
        toastr["warning"]("User has not logged out");
    }); 
});

// Returns today's Date as year-month-day
function getTodaysDate() {
    var date =  new Date();
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