// Officer Form Button Click Handler
document.getElementById('formButton').addEventListener('click', function(e) {
  e.preventDefault();
  var btn = this;
  
  if (btn.textContent.trim() === "SUBMIT") {
    // retrieve input values
    var officerName = document.getElementById('officerName').value;
    var serialNumber = document.getElementById('serialNumber').value;
    var ftpTime = document.getElementById('ftpTime').value;
    var ftoUrl = document.getElementById('ftoUrl').value;
    
    // save officer details to local storage
    localStorage.setItem("officerName", officerName);
    localStorage.setItem("serialNumber", serialNumber);
    localStorage.setItem("ftpTime", ftpTime);
    localStorage.setItem("ftoUrl", ftoUrl);
    
    // replace the officer name and URL
    var nameAndSerialDiv = document.getElementById('nameAndSerial');
    nameAndSerialDiv.innerHTML =
      '<span id="officerNameStatic" class="static-text">' + officerName + '</span><br>' +
      '<span id="serialNumberStatic" class="static-text">#' + serialNumber + '</span><br>' +
      '<span id="ftpTimeStatic" class="static-text">FTP Time: ' + ftpTime + '</span><br>' +
      '<span style="display:block; margin-top:5px;"><a id="ftoUrlLink" class="static-text" href="' + ftoUrl + '" target="_blank" style="color:#0094FF;">FTO FILE LINK</a></span>';
    
    // hide the input fields after submission
    document.getElementById('ftoUrl').style.display = 'none';
    document.getElementById('ftpTime').style.display = 'none';
    
    // change the button from SUBMIT to EDIT
    btn.textContent = "EDIT";
  } else {
    var nameAndSerialDiv = document.getElementById('nameAndSerial');
    var officerNameStatic = document.getElementById('officerNameStatic').textContent;
    var serialNumberStatic = document.getElementById('serialNumberStatic').textContent.replace(/^#/, '');
    
    nameAndSerialDiv.innerHTML =
      '<input type="text" id="officerName" placeholder="Officer Name" required value="' + officerNameStatic + '">' +
      '<input type="text" id="serialNumber" placeholder="Serial Number" required value="' + serialNumberStatic + '">';
    
    // show the FTO details input when EDIT is pressed
    document.getElementById('ftpTime').style.display = 'block';
    document.getElementById('ftoUrl').style.display = 'block';
    document.getElementById('ftpTime').value = localStorage.getItem("ftpTime") || "";
    document.getElementById('ftoUrl').value = localStorage.getItem("ftoUrl") || "";
    
    btn.textContent = "SUBMIT";
  }
});

// orientation generator toggle
document.getElementById('orientationButton').addEventListener('click', function(e) {
  e.preventDefault();
  hideAllSections();
  var storedOfficerName = localStorage.getItem("officerName") || "";
  var storedSerialNumber = localStorage.getItem("serialNumber") || "";
  document.getElementById("oriFTO").value = storedOfficerName;
  document.getElementById("oriFTOSerial").value = storedSerialNumber;
  document.getElementById('orientationGenerator').style.display = 'block';
  document.getElementById('orientationGenerator').scrollIntoView({ behavior: 'smooth' });
});

// DOR generator toggle
document.getElementById('dorButton').addEventListener('click', function(e) {
  e.preventDefault();
  hideAllSections();
  var storedOfficerName = localStorage.getItem("officerName") || "";
  var storedSerialNumber = localStorage.getItem("serialNumber") || "";
  document.getElementById("dorFTO").value = storedOfficerName;
  document.getElementById("dorFTOSerial").value = storedSerialNumber;
  document.getElementById('dorGenerator').style.display = 'block';
  document.getElementById('dorGenerator').scrollIntoView({ behavior: 'smooth' });
});

// back buttons
document.getElementById('backButton').addEventListener('click', function() {
  hideAllSections();
  document.getElementById('mainContent').style.display = 'block';
});
document.getElementById('dorBackButton').addEventListener('click', function() {
  hideAllSections();
  document.getElementById('mainContent').style.display = 'block';
});

// orientation clear button
document.getElementById('newOrientationReport').addEventListener('click', function() {
  document.getElementById('oriOfficer').value = "";
  document.getElementById('oriOfficerSerial').value = "";
  document.getElementById('oriPatrolNumber').value = "";
  document.getElementById('oriDate').value = "";
  document.getElementById('oriTime').value = "";
  document.getElementById('oriDuration').value = "";
  document.getElementById('oriIncidentsTasks').value = "";
  // clear orientation checklist
  for (let i = 1; i <= 8; i++) {
    let radios = document.getElementsByName("oriRating" + i);
    for (let j = 0; j < radios.length; j++) {
      radios[j].checked = false;
    }
  }
  document.getElementById('oriBBCodeOutput').value = "";
});

// DOR clear button
document.getElementById('newDORReport').addEventListener('click', function() {
  document.getElementById('dorOfficer').value = "";
  document.getElementById('dorOfficerSerial').value = "";
  document.getElementById('dorPatrolNumber').value = "";
  document.getElementById('dorDate').value = "";
  document.getElementById('dorTime').value = "";
  document.getElementById('dorDuration').value = "";
  document.getElementById('dorIncidentsTasks').value = "";
  document.getElementById('dorBelowStandard').value = "";
  document.getElementById('dorAboveStandard').value = "";
  document.getElementById('dorRoleplayRemarks').value = "";
  // clear DOR checklist
  for (let i = 1; i <= 17; i++) {
    let radios = document.getElementsByName("dorRating" + i);
    for (let j = 0; j < radios.length; j++) {
      radios[j].checked = false;
    }
  }
  document.getElementById('dorBBCodeOutput').value = "";
});

// helper function to hide all sections
function hideAllSections() {
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('orientationGenerator').style.display = 'none';
  document.getElementById('dorGenerator').style.display = 'none';
  document.getElementById('weeklyGenerator').style.display = 'none';
}

// token helper for evaluation ratings
function getRatingToken(selected, ratingOption) {
  return (selected == ratingOption) ? "[cbc=][/cbc]" : "[cb=][/cb]";
}

// generate DOR BBCode function
function generateDORBBCode() {
  // retrieve DOR field values
  const dorOfficer = document.getElementById('dorOfficer').value;
  const dorOfficerSerial = document.getElementById('dorOfficerSerial').value;
  const dorFTO = document.getElementById('dorFTO').value;
  const dorFTOSerial = document.getElementById('dorFTOSerial').value;
  const dorPatrolNumber = document.getElementById('dorPatrolNumber').value;
  const dorDate = document.getElementById('dorDate').value;
  const dorTime = document.getElementById('dorTime').value;
  const dorDuration = document.getElementById('dorDuration').value;
  const dorIncidentsTasks = document.getElementById('dorIncidentsTasks').value;
  const dorBelowStandard = document.getElementById('dorBelowStandard').value;
  const dorAboveStandard = document.getElementById('dorAboveStandard').value;
  const dorRoleplayRemarks = document.getElementById('dorRoleplayRemarks').value;
  
  // build header using table2
  let headerBBCode = "";
  headerBBCode += "[font=Arial][color=black]Page [u]1[/u] of [u]1[/u][/color][/font]\n";
  headerBBCode += "[hr][/hr]\n";
  headerBBCode += "[font=Arial][center]LOS SANTOS POLICE DEPARTMENT\n";
  headerBBCode += "[size=120][color=black][b]PROBATIONARY POLICE OFFICER \n";
  headerBBCode += "DAILY OBSERVATION REPORT[/b][/font][/color][/size][/center]\n\n";
  
  headerBBCode += "[table2=1,black,transparent,Arial]\n";
  headerBBCode += "[tr]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,30,5]\n";
  headerBBCode += "[size=87]PROBATIONARY POLICE OFFICER[/size]\n" + dorOfficer + "\n";
  headerBBCode += "[/tdwidth]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,8,5]\n";
  headerBBCode += "[size=87]SERIAL NO.[/size]\n" + dorOfficerSerial + "\n";
  headerBBCode += "[/tdwidth]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,25,5]\n";
  headerBBCode += "[size=87]FIELD TRAINING OFFICER[/size]\n" + dorFTO + "\n";
  headerBBCode += "[/tdwidth]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,8,5]\n";
  headerBBCode += "[size=87]SERIAL NO.[/size]\n" + dorFTOSerial + "\n";
  headerBBCode += "[/tdwidth][/tr]\n\n";
  
  headerBBCode += "[tr]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,8,5]\n";
  headerBBCode += "[size=87]PATROL NUMBER[/size]\n" + dorPatrolNumber + "\n";
  headerBBCode += "[/tdwidth]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,25,5]\n";
  headerBBCode += "[size=87]DATE[/size]\n" + dorDate + "\n";
  headerBBCode += "[/tdwidth]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,15,5]\n";
  headerBBCode += "[size=87]TIME[/size]\n" + dorTime + "\n";
  headerBBCode += "[/tdwidth]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,15,5]\n";
  headerBBCode += "[size=87]DURATION[/size]\n" + dorDuration + "\n";
  headerBBCode += "[/tdwidth][/tr]\n";
  headerBBCode += "[/table2]\n\n";
  
  // Incidents/Tasks section
  let incidentsBBCode = "[font=Arial][b][size=110]INCIDENTS/TASKS[/size][/b][/font]\n\n";
  incidentsBBCode += dorIncidentsTasks + "\n\n";
  
  // Performance Sections
  let performanceBBCode = "";
  performanceBBCode += "[font=Arial][b][size=110]BELOW STANDARD PERFORMANCE[/size][/b][/font]\n\n";
  performanceBBCode += (dorBelowStandard ? dorBelowStandard : "Below standard performance details here") + "\n\n";
  
  performanceBBCode += "[font=Arial][b][size=110]ABOVE STANDARD PERFORMANCE[/size][/b][/font]\n\n";
  performanceBBCode += (dorAboveStandard ? dorAboveStandard : "Above standard performance details here") + "\n\n";
  
  // Roleplay Remarks Section
  let roleplayBBCode = "";
  roleplayBBCode += "[font=Arial][b][size=110](( ROLEPLAY REMARKS ))[/size][/b][/font]\n\n";
  roleplayBBCode += "[ooc]" + (dorRoleplayRemarks ? dorRoleplayRemarks : "Remarks here") + "[/ooc]\n\n";
  
  // Evaluation instructions block
  let evaluationInstructions = "";
  evaluationInstructions += "[font=Arial][b][size=110]EVALUATION CATEGORIES[/size][/b][/font]\n\n";
  evaluationInstructions += "[b]RATING INSTRUCTIONS: Use the following scale to rate the Probationary Officer's performance. A SPECIFIC comment MUST be made on the Daily Observation Report if a rating of (1) BELOW STANDARD, (2) IMPROVEMENT REQUIRED, or (4) ABOVE STANDARD is given. Check NOT OBSERVED (N/O) if behaviour is not observed.[/b]\n";
  evaluationInstructions += "[list=none]\n";
  evaluationInstructions += "(1) [b][u]BELOW STANDARD:[/u][/b] - The behavior demonstrates an inability to accomplish required tasks.\n";
  evaluationInstructions += "(2) [b][u]IMPROVEMENT REQUIRED:[/u][/b] - Performance is progressing towards acceptable, but does not yet meet the agency's standard.\n";
  evaluationInstructions += "(3) [b][u]STANDARD:[/u][/b] - The behavior demonstrates an adequate ability to accomplish required tasks.\n";
  evaluationInstructions += "(4) [b][u]ABOVE STANDARD:[/u][/b] - The behavior demonstrates a more than adequate ability to accomplish required tasks.\n";
  evaluationInstructions += "(N/O) [b][u]NOT OBSERVED:[/u][/b] - The behavior was not observed.\n";
  evaluationInstructions += "[/list]\n\n";
  
  // Dynamic Evaluation Categories
  let evalTable = "";
  evalTable += "[table]\n";
  
  // Define groups and their items
  const groups = [
    { title: "APPEARANCE", items: [ "1. General Appearance" ] },
    { title: "ATTITUDE", items: [ "2. Attitude towards the Job and Feedback" ] },
    { title: "KNOWLEDGE", items: [ "3. Department Policies/Procedures", "4. Law, Penal Code, Search and Seizure" ] },
    { title: "PERFORMANCE", items: [ "5. Driving Skill: General", "6. Driving Skill: Orientation and Response Time to Calls", "7. Report Writing: Accuracy/Grammar/Organisation", "8. Field Performance", "9. Self-Initiated Field Activities", "10. Field Activities: Traffic Stop", "11. Field Activities: Arrest Procedure", "12. Officer Safety Principles", "13. Control of Conflict: Voice Command/Physical Skill", "14. Use of Common Sense and Good Judgement", "15. Radio/MDC: Use of Mobile Data Computer", "16. Radio: Articulation of Transmissions" ] },
    { title: "RELATIONSHIPS", items: [ "17. With Citizens/Employees in General" ] }
  ];
  
  let ratingIndex = 0;
  groups.forEach((group, groupIndex) => {
    if (groupIndex === 0) {
      evalTable += "[tr]\n";
      evalTable += "[td][font=Arial][b]" + group.title + "[/b][/font][/td]\n";
      evalTable += "[td][font=Arial][center][b]1[/b][/center][/font][/td]\n";
      evalTable += "[td][font=Arial][center][b]2[/b][/center][/font][/td]\n";
      evalTable += "[td][font=Arial][center][b]3[/b][/center][/font][/td]\n";
      evalTable += "[td][font=Arial][center][b]4[/b][/center][/font][/td]\n";
      evalTable += "[td][font=Arial][center][b]N/O[/b][/center][/font][/td]\n";
      evalTable += "[/tr]\n";
    } else {
      evalTable += "[tr]\n";
      evalTable += "[td colspan='6'][font=Arial][b]" + group.title + "[/b][/font][/td]\n";
      evalTable += "[/tr]\n";
    }
    // Output each evaluation item for the group.
    group.items.forEach(item => {
      let ratingName = "dorRating" + (ratingIndex + 1);
      let selectedElem = document.querySelector('input[name="' + ratingName + '"]:checked');
      let selectedValue = selectedElem ? selectedElem.value : "0";
      evalTable += "[tr]\n";
      evalTable += "[td][font=Arial]" + item + "[/font][/td]\n";
      evalTable += "[td][center]" + getRatingToken(selectedValue, "1") + "[/center][/td]\n";
      evalTable += "[td][center]" + getRatingToken(selectedValue, "2") + "[/center][/td]\n";
      evalTable += "[td][center]" + getRatingToken(selectedValue, "3") + "[/center][/td]\n";
      evalTable += "[td][center]" + getRatingToken(selectedValue, "4") + "[/center][/td]\n";
      evalTable += "[td][center]" + getRatingToken(selectedValue, "N/O") + "[/center][/td]\n";
      evalTable += "[/tr]\n";
      ratingIndex++;
    });
  });
  evalTable += "[/table]";
  
  let fullBBCode = headerBBCode + incidentsBBCode + performanceBBCode + roleplayBBCode + evaluationInstructions + evalTable;
  
  // Set the generated BBCode into the DOR output textbox
  var outputElem = document.getElementById('dorBBCodeOutput');
  outputElem.value = fullBBCode;
  outputElem.select();
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(outputElem.value).then(() => {
        console.log("DOR BBCode copied to clipboard.");
      }).catch(err => {
        console.error("Clipboard copy failed: ", err);
      });
    } else {
      document.execCommand("copy");
      console.log("DOR BBCode copied to clipboard (fallback).");
    }
  } catch (err) {
    console.error("Error copying text: ", err);
  }
  
  // Save the DOR report
  saveReport("dorForm", "dor");
}

// Helper function for orientation checklist toggles
function getOrientationToken(radioName) {
  var selectedElem = document.querySelector('input[name="' + radioName + '"]:checked');
  var selectedValue = selectedElem ? selectedElem.value : "";
  // value "1" means completed and "2" means not completed.
  if (selectedValue === "1") {
    return { yes: "[cbc][/cbc]", no: "[cb][/cb]" };
  } else if (selectedValue === "2") {
    return { yes: "[cb][/cb]", no: "[cbc][/cbc]" };
  } else {
    return { yes: "[cb][/cb]", no: "[cbc][/cbc]" };
  }
}

function generateOrientationBBCode() {
  // Retrieve orientation form values
  var oriOfficer = document.getElementById('oriOfficer').value;
  var oriOfficerSerial = document.getElementById('oriOfficerSerial').value;
  var oriFTO = document.getElementById('oriFTO').value;
  var oriFTOSerial = document.getElementById('oriFTOSerial').value;
  var oriPatrolNumber = document.getElementById('oriPatrolNumber').value;
  var oriDate = document.getElementById('oriDate').value;
  var oriTime = document.getElementById('oriTime').value;
  var oriDuration = document.getElementById('oriDuration').value;
  var oriIncidentsTasks = document.getElementById('oriIncidentsTasks').value;
  
  // Build header BBCode
  let bbcode = "";
  bbcode += "[font=Arial][color=black]Page [u]1[/u] of [u]1[/u][/color][/font]\n";
  bbcode += "[hr][/hr]\n";
  bbcode += "[font=Arial][center]LOS SANTOS POLICE DEPARTMENT\n";
  bbcode += "[size=120][color=black][b]PROBATIONARY POLICE OFFICER \n";
  bbcode += "INTRODUCTORY AND ORIENTATION REPORT[/b][/font][/color][/size][/center]\n\n";
  
  bbcode += "[table2=1,black,transparent,Arial]\n";
  bbcode += "[tr]\n";
  bbcode += "[tdwidth=1,black,transparent,top,left,30,5]\n";
  bbcode += "[size=87]PROBATIONARY POLICE OFFICER[/size]\n" + oriOfficer + "\n";
  bbcode += "[/tdwidth]\n";
  bbcode += "[tdwidth=1,black,transparent,top,left,8,5]\n";
  bbcode += "[size=87]SERIAL NO.[/size]\n" + oriOfficerSerial + "\n";
  bbcode += "[/tdwidth]\n";
  bbcode += "[tdwidth=1,black,transparent,top,left,25,5]\n";
  bbcode += "[size=87]FIELD TRAINING OFFICER[/size]\n" + oriFTO + "\n";
  bbcode += "[/tdwidth]\n";
  bbcode += "[tdwidth=1,black,transparent,top,left,8,5]\n";
  bbcode += "[size=87]SERIAL NO.[/size]\n" + oriFTOSerial + "\n";
  bbcode += "[/tdwidth][/tr]\n\n";
  
  bbcode += "[tr]\n";
  bbcode += "[tdwidth=1,black,transparent,top,left,8,5]\n";
  bbcode += "[size=87]PATROL NUMBER[/size]\n" + oriPatrolNumber + "\n";
  bbcode += "[/tdwidth]\n";
  bbcode += "[tdwidth=1,black,transparent,top,left,25,5]\n";
  bbcode += "[size=87]DATE[/size]\n" + oriDate + "\n";
  bbcode += "[/tdwidth]\n";
  bbcode += "[tdwidth=1,black,transparent,top,left,15,5]\n";
  bbcode += "[size=87]TIME[/size]\n" + oriTime + "\n";
  bbcode += "[/tdwidth]\n";
  bbcode += "[tdwidth=1,black,transparent,top,left,15,5]\n";
  bbcode += "[size=87]DURATION[/size]\n" + oriDuration + "\n";
  bbcode += "[/tdwidth][/tr]\n";
  bbcode += "[/table2]\n\n";
  
  // Orientation Checklist section
  bbcode += "[font=Arial][b][size=110]ORIENTATION CHECKLIST[/size][/b][/font]\n";
  bbcode += "[br][/br]";
  bbcode += "[table]\n";
  // Header row for checklist
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial][b]ADMINISTRATIVE[/b][/font][/td]\n";
  bbcode += "[td][font=Arial][center][b]✓[/b][/center][/font][/td]\n";
  bbcode += "[td][font=Arial][center][b]✘[/b][/center][/font][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 1: Probationer's Divisional Notebook Created (radio group: oriRating1)
  var t1 = getOrientationToken("oriRating1");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]1. Probationer's Divisional Notebook Created[/font][/td]\n";
  bbcode += "[td][center]" + t1.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t1.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Separator for FIELD items
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial][b]FIELD[/b][/font][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 2: Uniform and Equipment Checks (radio group: oriRating2)
  var t2 = getOrientationToken("oriRating2");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]2. Uniform and Equipment Checks[/font][/td]\n";
  bbcode += "[td][center]" + t2.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t2.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 3: Mission Row Familiarization (radio group: oriRating3)
  var t3 = getOrientationToken("oriRating3");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]3. Mission Row Familiarization[/font][/td]\n";
  bbcode += "[td][center]" + t3.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t3.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 4: Radio Setup (radio group: oriRating4)
  var t4 = getOrientationToken("oriRating4");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]4. Radio Setup[/font][/td]\n";
  bbcode += "[td][center]" + t4.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t4.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 5: Vehicle Checks (radio group: oriRating5)
  var t5 = getOrientationToken("oriRating5");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]5. Vehicle Checks (ELS, Maintenance Forms etc.)[/font][/td]\n";
  bbcode += "[td][center]" + t5.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t5.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Out-of-Character header
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial][ooc][b]OUT OF CHARACTER[/b][/ooc][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 6: Teamspeak Binds (radio group: oriRating6)
  var t6 = getOrientationToken("oriRating6");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]6. Teamspeak Binds (Central / TACs)[/font][/td]\n";
  bbcode += "[td][center]" + t6.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t6.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 7: Vehicle Spawning (radio group: oriRating7)
  var t7 = getOrientationToken("oriRating7");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]7. Vehicle Spawning[/font][/td]\n";
  bbcode += "[td][center]" + t7.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t7.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 8: General Faction Commands (radio group: oriRating8)
  var t8 = getOrientationToken("oriRating8");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]8. General Faction Commands[/font][/td]\n";
  bbcode += "[td][center]" + t8.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t8.no + "[/center][/td]\n";
  bbcode += "[/tr]\n\n";

  bbcode += "[/table]\n\n";
  bbcode +="[br][/br]\n";

  bbcode += "[font=Arial][b][size=110]INCIDENTS/TASKS[/size][/b][/font]\n\n";
  bbcode += oriIncidentsTasks + "\n\n";
  
  // Place the generated BBCode into the output textarea and copy to clipboard
  var outputElemOri = document.getElementById('oriBBCodeOutput');
  outputElemOri.value = bbcode;
  outputElemOri.select();
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(outputElemOri.value).then(() => {
        console.log("Orientation BBCode copied to clipboard.");
      }).catch(err => {
        console.error("Clipboard copy failed: ", err);
      });
    } else {
      document.execCommand("copy");
      console.log("Orientation BBCode copied to clipboard (fallback).");
    }
  } catch (err) {
    console.error("Error copying text: ", err);
  }
  
  saveReport("orientationForm", "orientation");
}

function parseTimeToMinutes(timeStr) {
  var parts = timeStr.split(':');
  if(parts.length !== 2) return 0;
  var hours = parseInt(parts[0], 10);
  var minutes = parseInt(parts[1], 10);
  return hours * 60 + minutes;
}

function minutesToTimeStr(minutes) {
  var hours = Math.floor(minutes / 60);
  var mins = minutes % 60;
  return (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins;
}

function saveReport(formId, type) {
  var report = { type: type, title: "", duration: "", data: {} };

  if (type === "weekly") {
    // Save text fields and dropdown selections from the weekly form
    report.data = {
      officer: document.getElementById("weeklyOfficer").value,
      officerSerial: document.getElementById("weeklyOfficerSerial").value,
      ftm: document.getElementById("weeklyFTM").value,
      ftmSerial: document.getElementById("weeklyFTMSerial").value,
      discussion: document.getElementById("weeklyDiscussion").value,
      strengthsDiscussion: document.getElementById("strengthsDiscussionStatus").value,
      weaknessesDiscussion: document.getElementById("weaknessesDiscussionStatus").value,
      remedialRequired: document.getElementById("remedialRequired").value,
      remedialDetails: document.getElementById("remedialDetails").value
    };
    // Save the weekly evaluation checklist options
    let weeklyRatings = {};
    for (let i = 1; i <= 17; i++) {
      let selectedRadio = document.querySelector('input[name="weeklyRating' + i + '"]:checked');
      weeklyRatings["weeklyRating" + i] = selectedRadio ? selectedRadio.value : "";
    }
    report.data.ratings = weeklyRatings;
  } else if (type === "orientation") {
    // Orientation report data
    report.data = {
      officer: document.getElementById("oriOfficer").value,
      officerSerial: document.getElementById("oriOfficerSerial").value,
      fto: document.getElementById("oriFTO").value,
      ftoSerial: document.getElementById("oriFTOSerial").value,
      patrol: document.getElementById("oriPatrolNumber").value,
      date: document.getElementById("oriDate").value,
      time: document.getElementById("oriTime").value,
      duration: document.getElementById("oriDuration").value,
      incidents: document.getElementById("oriIncidentsTasks").value
    };
    // Save the orientation checklist options
    let oriRatings = {};
    for (let i = 1; i <= 8; i++) {
      let selectedRadio = document.querySelector('input[name="oriRating' + i + '"]:checked');
      oriRatings["oriRating" + i] = selectedRadio ? selectedRadio.value : "";
    }
    report.data.ratings = oriRatings;
  } else if (type === "dor") {
    // DOR report data
    report.data = {
      officer: document.getElementById("dorOfficer").value,
      officerSerial: document.getElementById("dorOfficerSerial").value,
      fto: document.getElementById("dorFTO").value,
      ftoSerial: document.getElementById("dorFTOSerial").value,
      patrol: document.getElementById("dorPatrolNumber").value,
      date: document.getElementById("dorDate").value,
      time: document.getElementById("dorTime").value,
      duration: document.getElementById("dorDuration").value,
      incidents: document.getElementById("dorIncidentsTasks").value,
      belowStandard: document.getElementById("dorBelowStandard").value,
      aboveStandard: document.getElementById("dorAboveStandard").value,
      roleplay: document.getElementById("dorRoleplayRemarks").value
    };
    // Save the DOR evaluation radio selections
    let dorRatings = {};
    for (let i = 1; i <= 17; i++) {
      let sel = document.querySelector('input[name="dorRating' + i + '"]:checked');
      dorRatings["dorRating" + i] = sel ? sel.value : "";
    }
    report.data.ratings = dorRatings;
  }
  
  // Create the report title from officer name, time and date
  report.title = report.data.officer + " - " + report.data.time + " - " + report.data.date;
  report.duration = report.data.duration;
  
  // Retrieve existing saved reports and update or add the current report
  var savedReports = JSON.parse(localStorage.getItem("savedReports") || "[]");
  var existingIndex = savedReports.findIndex(r => r.title === report.title);
  
  if (existingIndex >= 0) {
    savedReports[existingIndex] = report;
  } else {
    savedReports.push(report);
  }
  
  // Only update FTP time for non-weekly reports.
  if (type !== "weekly") {
    var currentFTPTimeStr = localStorage.getItem("ftpTime") || "00:00";
    var currentFTPTimeMinutes = parseTimeToMinutes(currentFTPTimeStr);
    var newReportMinutes = parseTimeToMinutes(report.duration);
    
    if (existingIndex >= 0) {
      var oldReport = savedReports[existingIndex];
      var oldReportMinutes = parseTimeToMinutes(oldReport.duration);
      if (newReportMinutes !== oldReportMinutes) {
        currentFTPTimeMinutes = currentFTPTimeMinutes - oldReportMinutes + newReportMinutes;
      }
    } else {
      currentFTPTimeMinutes = currentFTPTimeMinutes + newReportMinutes;
    }
    var newFTPTimeStr = minutesToTimeStr(currentFTPTimeMinutes);
    localStorage.setItem("ftpTime", newFTPTimeStr);
    var ftpTimeElem = document.getElementById("ftpTimeStatic");
    if (ftpTimeElem) {
      ftpTimeElem.textContent = "FTP Time: " + newFTPTimeStr;
    }
  }
  
  localStorage.setItem("savedReports", JSON.stringify(savedReports));
  loadSavedReports();
}

function loadSavedReports() {
  var savedReports = JSON.parse(localStorage.getItem("savedReports") || "[]");
  
  // Get the first dropdown (Guided Patrols) and second dropdown (Field Training Management)
  var dropdowns = document.querySelectorAll(".dropdown");
  var guidedPatrolsDiv = dropdowns[0].querySelector(".dropdown-content");
  var ftmDiv = dropdowns[1].querySelector(".dropdown-content");
  
  // Clear both dropdowns
  guidedPatrolsDiv.innerHTML = "";
  ftmDiv.innerHTML = "";
  
  // Add each report to the appropriate dropdown based on type
  savedReports.forEach(function(report) {
    var a = document.createElement("a");
    a.href = "#";
    a.textContent = report.title;
    a.addEventListener("click", function(e) {
      e.preventDefault();
      loadReport(report);
    });
    
    if (report.type === "weekly") {
      ftmDiv.appendChild(a);
    } else {
      guidedPatrolsDiv.appendChild(a);
    }
  });
}

function loadReport(report) {
  hideAllSections();
  
  if(report.type === "orientation") {
    document.getElementById("oriOfficer").value = report.data.officer;
    document.getElementById("oriOfficerSerial").value = report.data.officerSerial;
    document.getElementById("oriFTO").value = report.data.fto;
    document.getElementById("oriFTOSerial").value = report.data.ftoSerial;
    document.getElementById("oriPatrolNumber").value = report.data.patrol;
    document.getElementById("oriDate").value = report.data.date;
    document.getElementById("oriTime").value = report.data.time;
    document.getElementById("oriDuration").value = report.data.duration;
    document.getElementById("oriIncidentsTasks").value = report.data.incidents;
    // Checklist toggles
    if(report.data.toggles) {
      for (let i = 1; i <= 8; i++) {
        let checkbox = document.getElementById("oriToggle" + i);
        if (checkbox) {
          checkbox.checked = report.data.toggles["oriToggle" + i];
        }
      }
    }
    document.getElementById('orientationGenerator').style.display = 'block';
    document.getElementById('orientationGenerator').scrollIntoView({ behavior: 'smooth' });
  } else if(report.type === "dor") {
    document.getElementById("dorOfficer").value = report.data.officer;
    document.getElementById("dorOfficerSerial").value = report.data.officerSerial;
    document.getElementById("dorFTO").value = report.data.fto;
    document.getElementById("dorFTOSerial").value = report.data.ftoSerial;
    document.getElementById("dorPatrolNumber").value = report.data.patrol;
    document.getElementById("dorDate").value = report.data.date;
    document.getElementById("dorTime").value = report.data.time;
    document.getElementById("dorDuration").value = report.data.duration;
    document.getElementById("dorIncidentsTasks").value = report.data.incidents;
    document.getElementById("dorBelowStandard").value = report.data.belowStandard || "";
    document.getElementById("dorAboveStandard").value = report.data.aboveStandard || "";
    document.getElementById("dorRoleplayRemarks").value = report.data.roleplay || "";
    // Restore DOR evaluation radio selections
    if(report.data.ratings) {
      for (let i = 1; i <= 17; i++) {
        let ratingValue = report.data.ratings["dorRating" + i];
        let radios = document.getElementsByName("dorRating" + i);
        // Iterate over NodeList to set checked property
        for (let j = 0; j < radios.length; j++) {
          radios[j].checked = (radios[j].value === ratingValue);
        }
      }
    }
    document.getElementById('dorGenerator').style.display = 'block';
    document.getElementById('dorGenerator').scrollIntoView({ behavior: 'smooth' });
  }
}

// --- WEEKLY REPORT GENERATOR TOGGLE ---
document.getElementById('weeklyReportButton').addEventListener('click', function(e) {
  hideAllSections();
  var storedOfficerName = localStorage.getItem("officerName") || "";
  var storedSerialNumber = localStorage.getItem("serialNumber") || "";
  document.getElementById("weeklyOfficer").value = "";
  document.getElementById("weeklyOfficerSerial").value = "";
  document.getElementById("weeklyFTM").value = storedOfficerName;
  document.getElementById("weeklyFTMSerial").value = storedSerialNumber;
  
  document.getElementById('weeklyGenerator').style.display = 'block';
  document.getElementById('weeklyGenerator').scrollIntoView({ behavior: 'smooth' });
});

// Back button for Weekly Report
document.getElementById('weeklyBackButton').addEventListener('click', function() {
  hideAllSections();
  document.getElementById('mainContent').style.display = 'block';
});

// Clear button for Weekly Report
document.getElementById('newWeeklyReport').addEventListener('click', function() {
  document.getElementById('weeklyOfficer').value = "";
  document.getElementById('weeklyOfficerSerial').value = "";
  document.getElementById('weeklyFTM').value = "";
  document.getElementById('weeklyFTMSerial').value = "";
  // Clear checklist toggles (if any)
  document.getElementById('weeklyToggle1').checked = false;
  document.getElementById('weeklyToggle2').checked = false;
  document.getElementById('weeklyBBCodeOutput').value = "";
});

document.getElementById('remedialRequired').addEventListener('change', function() {
  var container = document.getElementById('remedialDetailsContainer');
  container.style.display = (this.value === 'Yes') ? 'block' : 'none';
});

function getSelectedValue(radioGroupName) {
  var selected = document.querySelector('input[name="' + radioGroupName + '"]:checked');
  return selected ? selected.value : "";
}

function getRatingToken(selected, ratingOption) {
  return (selected == ratingOption) ? "[cbc][/cbc]" : "[cb][/cb]";
}

function generateWeeklyBBCode(e) {
  if (e) e.preventDefault();
  
  // Retrieve the weekly form values
  var weeklyOfficer = document.getElementById("weeklyOfficer").value;
  var weeklyOfficerSerial = document.getElementById("weeklyOfficerSerial").value;
  var weeklyFTM = document.getElementById("weeklyFTM").value;
  var weeklyFTMSerial = document.getElementById("weeklyFTMSerial").value;
  
  // --- Build the Header Section ---
  let headerBBCode = "";
  headerBBCode += "[font=Arial][color=black]Page [u]1[/u] of [u]1[/u][/color][/font]\n";
  headerBBCode += "[hr][/hr]\n";
  headerBBCode += "[font=Arial][center]LOS SANTOS POLICE DEPARTMENT\n";
  headerBBCode += "[size=120][color=black][b]PROBATIONARY POLICE OFFICER WEEKLY EVALUATION REPORT[/b][/font][/color][/size][/center]\n\n";
  
  headerBBCode += "[table2=1,black,transparent,Arial]\n";
  headerBBCode += "[tr]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,30,5]\n";
  headerBBCode += "[size=87]PROBATIONARY POLICE OFFICER[/size]\n" + weeklyOfficer + "\n";
  headerBBCode += "[/tdwidth]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,8,5]\n";
  headerBBCode += "[size=87]SERIAL NO.[/size]\n" + weeklyOfficerSerial + "\n";
  headerBBCode += "[/tdwidth]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,25,5]\n";
  headerBBCode += "[size=87]FIELD TRAINING MANAGER[/size]\n" + weeklyFTM + "\n";
  headerBBCode += "[/tdwidth]\n";
  headerBBCode += "[tdwidth=1,black,transparent,top,left,8,5]\n";
  headerBBCode += "[size=87]SERIAL NO.[/size]\n" + weeklyFTMSerial + "\n";
  headerBBCode += "[/tdwidth][/tr]\n";
  headerBBCode += "[/table2]\n\n";
  
  // --- Build the Evaluation Section ---
  let evaluationBBCode = "";
  evaluationBBCode += "[font=Arial]\n";
  evaluationBBCode += "[b]RATING INSTRUCTIONS: Use the following scale to summarize the probationary police officer's performance throughout the week. A SPECIFIC comment MUST have been made on a Daily Observation Report during the week being reviewed if a rating of (1) BELOW STANDARD, (2) IMPROVEMENT REQUIRED, or (4) ABOVE STANDARD is given. Check NOT OBSERVED (N/O) if behavior is not observed throughout the week.[/b]\n";
  evaluationBBCode += " [b][u]BELOW STANDARD:[/u][/b] - The behavior demonstrates an inability to accomplish required tasks.\n";
  evaluationBBCode += "(2) [b][u]IMPROVEMENT REQUIRED:[/u][/b] - Performance is progressing towards acceptable, but does not yet meet the agency's standard.\n";
  evaluationBBCode += "(3) [b][u]STANDARD:[/u][/b] - The behavior demonstrates an adequate ability to accomplish required tasks.\n";
  evaluationBBCode += "(4) [b][u]ABOVE STANDARD:[/u][/b] - The behavior demonstrates a more than adequate ability to accomplish required tasks.\n";
  evaluationBBCode += "(N/O) [b][u]NOT OBSERVED:[/u][/b] - The behavior was not observed.[/list]\n";
  
  // Evaluation Grid
  evaluationBBCode += "[table]\n";
  evaluationBBCode += "[tr]\n";
  evaluationBBCode += "[td][font=Arial][b]APPEARANCE[/b][/td]\n";
  evaluationBBCode += "[td][font=Arial][center][b]1[/b][/center][/font][/td]\n";
  evaluationBBCode += "[td][font=Arial][center][b]2[/b][/center][/font][/td]\n";
  evaluationBBCode += "[td][font=Arial][center][b]3[/b][/center][/font][/td]\n";
  evaluationBBCode += "[td][font=Arial][center][b]4[/b][/center][/font][/td]\n";
  evaluationBBCode += "[td][font=Arial][center][b]N/O[/b][/center][/font][/td]\n";
  evaluationBBCode += "[/tr]\n";
  
  evaluationBBCode += "[tr]\n";
  evaluationBBCode += "[td][font=Arial]1. General Appearance[/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating1"), "1") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating1"), "2") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating1"), "3") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating1"), "4") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating1"), "N/O") + "[/center][/td]\n";
  evaluationBBCode += "[/tr]\n";
  
  evaluationBBCode += "[tr]\n";
  evaluationBBCode += "[td][b][font=Arial]ATTITUDE[/b][/td]\n";
  evaluationBBCode += "[/tr]\n";
  
  evaluationBBCode += "[tr]\n";
  evaluationBBCode += "[td][font=Arial]2. Attitude towards the Job and Feedback[/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating2"), "1") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating2"), "2") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating2"), "3") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating2"), "4") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating2"), "N/O") + "[/center][/td]\n";
  evaluationBBCode += "[/tr]\n";
  
  evaluationBBCode += "[tr]\n";
  evaluationBBCode += "[td][b][font=Arial]KNOWLEDGE[/b][/td]\n";
  evaluationBBCode += "[/tr]\n";
  
  evaluationBBCode += "[tr]\n";
  evaluationBBCode += "[td][font=Arial]3. Department Policies/Procedures[color=transparent]------------------------------------------------------[/color][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating3"), "1") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating3"), "2") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating3"), "3") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating3"), "4") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating3"), "N/O") + "[/center][/td]\n";
  evaluationBBCode += "[/tr]\n";
  
  evaluationBBCode += "[tr]\n";
  evaluationBBCode += "[td][font=Arial]4. Law, Penal Code, Search and Seizure[color=transparent]---------------------------------------------[/color][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating4"), "1") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating4"), "2") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating4"), "3") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating4"), "4") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating4"), "N/O") + "[/center][/td]\n";
  evaluationBBCode += "[/tr]\n";
  
  evaluationBBCode += "[tr]\n";
  evaluationBBCode += "[td][b][font=Arial]PERFORMANCE[/b][/td]\n";
  evaluationBBCode += "[/tr]\n";
  
  const performanceItems = [
      "5. Driving Skill: General[color=transparent]--[/color]",
      "6. Driving Skill: Orientation and Response Time to Calls",
      "7. Report Writing: Accuracy/Grammar/Organisation",
      "8. Field Performance",
      "9. Self-Initiated Field Activites",
      "10. Field Activities: Traffic Stop",
      "11. Field Activities: Arrest Procedure",
      "12. Officer Safety Principles",
      "13. Control of Conflict: Voice Command/Physical Skill",
      "14. Use of Common Sense and Good Judgement",
      "15. Radio/MDC: Use of Mobile Data Computer",
      "16. Radio: Articulation of Transmissions"
  ];
  
  for (let i = 5; i <= 16; i++) {
    let index = i - 5;
    evaluationBBCode += "[tr]\n";
    evaluationBBCode += "[td][font=Arial]" + performanceItems[index] + "[/font][/td]\n";
    evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating" + i), "1") + "[/center][/td]\n";
    evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating" + i), "2") + "[/center][/td]\n";
    evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating" + i), "3") + "[/center][/td]\n";
    evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating" + i), "4") + "[/center][/td]\n";
    evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating" + i), "N/O") + "[/center][/td]\n";
    evaluationBBCode += "[/tr]\n";
  }
  
  evaluationBBCode += "[tr]\n";
  evaluationBBCode += "[td][b][font=Arial]RELATIONSHIPS[/b][/td]\n";
  evaluationBBCode += "[/tr]\n";
  
  evaluationBBCode += "[tr]\n";
  evaluationBBCode += "[td][font=Arial]17. With Citizens/Employees in General[color=transparent]-----------------------[/color][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating17"), "1") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating17"), "2") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating17"), "3") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating17"), "4") + "[/center][/td]\n";
  evaluationBBCode += "[td][center]" + getRatingToken(getSelectedValue("weeklyRating17"), "N/O") + "[/center][/td]\n";
  evaluationBBCode += "[/tr]\n";
  evaluationBBCode += "[/table]\n";

  let strengthsChoice = document.getElementById('strengthsDiscussionSelect').value; // "have" or "have not"
  let weaknessesChoice = document.getElementById('weaknessesDiscussionSelect').value; // "have" or "have not"
  let remedialChoice = document.getElementById('remedialTrainingSelect').value;        // "has" or "has not"
  let remedialTrainingText = document.getElementById('remedialTrainingDetails').value.trim();
  let remedialOutput = (remedialChoice === "has") ? (remedialTrainingText ? remedialTrainingText : "N/A") : "N/A";
  let swsComments = document.getElementById('strengthsWeaknessesDiscussion').value.trim();
  
  let performanceDiscussionBBCode = "";
  performanceDiscussionBBCode += "[table2=1,black,transparent,Arial]\n";
  performanceDiscussionBBCode += "[tr][tdwidth=1,black,transparent,top,left,100,5][b]Regarding the Probationer's performance:[/b]\n";
  performanceDiscussionBBCode += "[list]\n";
  performanceDiscussionBBCode += "[*]I " + strengthsChoice + " discussed the Probationer's most significant strengths with him/her.\n";
  performanceDiscussionBBCode += "[*]I " + weaknessesChoice + " discussed the Probationer's most significant weaknesses with him/her.\n";
  performanceDiscussionBBCode += "[*]The Probationer's significant weaknesses " + remedialChoice + " required remedial training.\n";
  performanceDiscussionBBCode += "[/list]\n\n";
  performanceDiscussionBBCode += "[b]Remedial training, if provided, consisted of:[/b]\n";
  performanceDiscussionBBCode += "[list][*]" + remedialOutput + "[/list]\n";
  performanceDiscussionBBCode += "[b]Comments regarding significant strengths, weaknesses, and progress to date:[/b]\n";
  performanceDiscussionBBCode += "[list][*]" + swsComments + "[/list]\n";
  performanceDiscussionBBCode += "[/td][/tr]\n";
  performanceDiscussionBBCode += "[/table2]\n";
  
  // --- Weekly Performance Option Section ---
  let weeklyPerfElem = document.querySelector('input[name="weeklyPerformance"]:checked');
  let weeklyPerf = weeklyPerfElem ? weeklyPerfElem.value : "";
  let weeklyPerformanceBBCode = "";
  weeklyPerformanceBBCode += "[aligntable=right,0,0,0,0,0,0]\n";
  weeklyPerformanceBBCode += "[center][font=Arial][size=110][b]Weekly Performance[/b][/center]\n";
  weeklyPerformanceBBCode += "A continuation of an unsatisfactory weekly duty performance \nevaluation may lead to termination of employment with the\nLos Santos Police Department.\n\n";
  if (weeklyPerf === "Satisfactory") {
    weeklyPerformanceBBCode += "[cbc] Satisfactory [/cbc][space=200][cb]Unsatisfactory[/cb]";
  } else if (weeklyPerf === "Unsatisfactory") {
    weeklyPerformanceBBCode += "[cb] Satisfactory [space=200][cbc]Unsatisfactory[/cbc]";
  } else {
    weeklyPerformanceBBCode += "[cb] Satisfactory [space=200][cb]Unsatisfactory";
  }
  weeklyPerformanceBBCode += "[/aligntable]";
  
  // --- Field Trainer Signature Section ---
  let fieldTrainer = document.getElementById('weeklyFTM').value.trim();
  let signatureBBCode = "";
  signatureBBCode += "[aligntable=left,30,0,0,0,0,0]\n";
  signatureBBCode += "[table2=1,black,transparent,Arial]\n";
  signatureBBCode += "[tr][tdwidth=1,black,transparent,top,left,100,5][b]SIGNATURE OF FIELD TRAINING MANAGER[/b]\n";
  signatureBBCode += fieldTrainer + "\n";
  signatureBBCode += "[/td][/tr]\n";
  signatureBBCode += "[/table2]\n";
  signatureBBCode += "[/aligntable]\n";
  
  let fullBBCode = headerBBCode + evaluationBBCode + performanceDiscussionBBCode + weeklyPerformanceBBCode + signatureBBCode;
  
  // Output the final BBCode
  var outputElem = document.getElementById('weeklyBBCodeOutput');
  outputElem.value = fullBBCode;
  outputElem.select();
  
  // Auto-copy the BBCode to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullBBCode).then(() => {
      console.log("Weekly BBCode copied to clipboard.");
    }).catch(err => {
      console.error("Clipboard copy failed: ", err);
    });
  } else {
    document.execCommand("copy");
    console.log("Weekly BBCode copied to clipboard (fallback).");
  }
  
  // Save the weekly report
  saveReport("weeklyForm", "weekly");
}


window.addEventListener('DOMContentLoaded', function() {
  var officerName = localStorage.getItem("officerName");
  if(officerName) {
    var serialNumber = localStorage.getItem("serialNumber");
    var ftpTime = localStorage.getItem("ftpTime");
    var ftoUrl = localStorage.getItem("ftoUrl") || "";
    var nameAndSerialDiv = document.getElementById('nameAndSerial');
    nameAndSerialDiv.innerHTML =
      '<span id="officerNameStatic" class="static-text">' + officerName + '</span><br>' +
      '<span id="serialNumberStatic" class="static-text">#' + serialNumber + '</span><br>' +
      '<span id="ftpTimeStatic" class="static-text">FTP Time: ' + ftpTime + '</span><br>' +
      '<span style="display:block; margin-top:5px;"><a id="ftoUrlLink" class="static-text" href="' + ftoUrl + '" target="_blank" style="color:#0094FF;">FTO FILE</a></span>';
    if(document.getElementById('ftoUrl')) {
      document.getElementById('ftoUrl').style.display = 'none';
    }
    if(document.getElementById('ftpTime')) {
      document.getElementById('ftpTime').style.display = 'none';
    }
    document.getElementById('formButton').textContent = "EDIT";
  }
  loadSavedReports();
  
  document.querySelectorAll(".dropdown-btn").forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      this.parentElement.classList.toggle("active");
    });
  });
    // Open all dropdowns by default
    document.querySelectorAll(".dropdown").forEach(function(dropdown) {
      dropdown.classList.add("active");
    });
  
    // Attach click event listeners for toggling dropdowns
    document.querySelectorAll(".dropdown-btn").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        this.parentElement.classList.toggle("active");
      });
    });
  });