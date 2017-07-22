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
$('#button-login').on('click',function(){
    firebase.auth().signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value).catch(function(error) {
        toastr["warning", "Error:" + error.message];
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
    document.getElementById("button-edit-company-profile").style.display="none";
    document.getElementById("button-save-company-profile").style.display="inline";
    document.getElementById("button-cancel-company-profile").style.display="inline";
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
    document.getElementById("button-edit-company-profile").style.display="inline";
    document.getElementById("button-save-company-profile").style.display="none";
    document.getElementById("button-cancel-company-profile").style.display="none";
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
        document.getElementById("non-access").style.display="inline";
        if(localStorage["WYDuserAccess"] == 1) {
            if(document.getElementById("overall-input").value >= document.getElementById("used-input").value) document.getElementById("button-add-user-modal").style.display="inline";
            document.getElementById("button-delete-user-modal").style.display="inline";
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
                endSpan.style.display="none";
                endSpan.setAttribute("name", "user-delete");
                endSpan.value = numPeeps;
                endSpan.setAttribute("data-toggle","tooltip");
                endSpan.setAttribute("data-placement","left");
                endSpan.setAttribute("data-title","Click to Delete User");
                endSpan.setAttribute("data-trigger","hover focus");
                endSpan.id = "user-delete-" + numPeeps;
                endSpan.onclick = function() {
                    this.style.display="none";
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
                        this.style.display="none";
                        confirmSpan.style.display="none";
                        endSpan.style.display="inline";
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
                        firebase.database().ref('company/' + localStorage['WYDuserCompanyID'] + '/users/' + childSnapshot.key).remove()
                        firebase.database().ref('user/' + childSnapshot.key).remove().then(function() {
                            var minusSeat = Number(document.getElementById('used-input').value)-1;
                            firebase.database().ref('company/' + localStorage['WYDuserCompanyID'] + '/payment/').update({used:minusSeat}).then(function() {
                                seatDiv.style.display="none";
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
        document.getElementById('user-delete-'+i).style.display="inline";
    }
    document.getElementById('button-delete-user-modal').style.display="none";
    document.getElementById('button-hide-delete-user-modal').style.display="inline";
});

// Function run when "Delete Users" button is clicked again to hide delete prompts
// hideDeleteUserButton()
// Operations-seats
$('#button-hide-delete-user-modal').on('click',function(){
    var seatLengths = document.getElementsByName('user-delete').length;
    for(i=0; i<seatLengths; i++) {
        document.getElementById('user-delete-'+i).style.display="none";
    }
    document.getElementById('button-delete-user-modal').style.display="inline";
    document.getElementById('button-hide-delete-user-modal').style.display="none";
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
    //var viewJob = document.getElementById("myTable");
    //var jobTable = document.getElementById("job-table");
    var jobCountDiv = document.getElementById("job-count");
    if(access < 3) {
        document.getElementById("button-add-job-div").style.display="inline";
        document.getElementById("button-switch-job-div").style.display="inline";
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
    },function(error){
        document.getElementById("job-div").innerHTML = "An Error Occured! Please Try Again!";
    });
}

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
    document.getElementById("add-job-inputs").style.display="inline";
    document.getElementById("button-add-job").style.display="none";
});

// Function run when "Add Job" button is clicked to save everything in "add-job-inputs" div then hide if successful
// addJobButton()
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
        var showDiv = document.getElementById("display-jobs");
        var jobDiv = document.createElement("div");
        jobDiv.className = "input-group mb-1";
        var jobSpan = document.createElement("span");
        jobSpan.className = "input-group-addon";
        var jobI = document.createElement("i");
        jobI.className = "icon-user";
        jobSpan.append(jobI);
        jobDiv.append(jobSpan);
        var jobInput = document.createElement("input");
        jobInput.className = "form-control";
        jobInput.type = "text";
        jobInput.id = ("job-" + newJobKey);
        jobInput.value = document.getElementById("name-input");
        //jobInput.onClick("viewJob(jobInput.id)");
        jobDiv.append(jobInput);
        //showDiv.append(jobDiv);
        // Use Click of Cancel to clear everything
        $('#button-add-job-cancel').trigger('click');
    });
});

// Function run when "Cancel" button is clicked to unhide "button-add-job" and Hide+Clear "add-job-inputs"
// cancelAddJobButton()
// Operations-jobs
$('#button-add-job-cancel').on('click',function(){
    document.getElementById("add-job-inputs").style.display="none";
    document.getElementById("additional-contacts-header").style.display="none";
    document.getElementById("button-add-job").style.display="inline";
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
    document.getElementById("additional-contacts-header").style.display="inline";
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
// dismissViewJobModal
// Operations-jobs
$("#view-job-modal").on("hide.bs.modal", function(){
    document.getElementById("button-job-save").style.display = "none";
    document.getElementById("button-job-delete").style.display = "none";
    document.getElementById("button-job-edit").style.display = "inline";
    document.getElementById("button-job-cancel").innerHTML = "Close";
    var modal = document.getElementById("view-job-modal");
    var inputs = modal.getElementsByTagName('input');
    for(i = 0; i < inputs.length; i++) {
        inputs[i].disabled=true;
    }
});

// Function run when "Edit Job" Button is clicked to enable all job info inputs
// editJobButton
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
// deleteJobButton
// Operations-jobs
$('#button-job-delete').on('click',function() {
    if(confirm("Are You Sure You Want To Delete This Job?")) {
        var jobKey = document.getElementById("jobID").value;
        firebase.database().ref("company/" + localStorage["WYDuserCompanyID"] + "/job/active/" + jobKey).remove();
        firebase.database().ref("company/" + localStorage["WYDuserCompanyID"] + "/job/inactive/" + jobKey).remove();
        var row = document.getElementById("job-" + jobKey);
        row.parentNode.removeChild(row);
    }
    else {
    }
});

// Function run when "Save Job" Button is clicked
// saveJobButton
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
    var newEditJob = firebase.database().ref('company/' + companyKey + '/job/' + active + "/" + jobKey + "/editedBy").push();
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
        // Use Click of Cancel to clear everything
        $('#button-job-cancel').trigger('click');
    });
});

/* =============================================== */
/* USEFUL SCRIPTS USED ON ALL PAGES WHEN LOGGED IN */
// Function to save all user data into localStorage
function getUserData() {
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
        firebase.database().ref('company/' + data.companyID + "/info").once('value').then(function(snapshot) {
            localStorage["WYDuserCompanyName"] = snapshot.val().name;
            location.reload();
        });
    });
}

// When anything with the id "Logout" is clicked LOGOUT
// userLogout()
$('#logout').on('click', function() {
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

function getTodaysDate() {
    date =  new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    if(month < 10) {
        month = "0" + month;   
    }
    day = date.getDate();
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