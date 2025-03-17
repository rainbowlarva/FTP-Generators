// Officer Form Button Click Handler
document.getElementById('formButton').addEventListener('click', function(e) {
  e.preventDefault();
  var btn = this;
  
  if (btn.textContent.trim() === "SUBMIT") {
    // Retrieve input values
    var officerName = document.getElementById('officerName').value;
    var serialNumber = document.getElementById('serialNumber').value;
    var ftpTime = document.getElementById('ftpTime').value;
    var ftoUrl = document.getElementById('ftoUrl').value;
    
    // Save officer details, FTP Time and FTO URL to localStorage
    localStorage.setItem("officerName", officerName);
    localStorage.setItem("serialNumber", serialNumber);
    localStorage.setItem("ftpTime", ftpTime);
    localStorage.setItem("ftoUrl", ftoUrl);
    
    // Replace the officer name and serial number inputs with static text including FTP Time and a clickable FTO file link.
    var nameAndSerialDiv = document.getElementById('nameAndSerial');
    nameAndSerialDiv.innerHTML =
      '<span id="officerNameStatic" class="static-text">' + officerName + '</span><br>' +
      '<span id="serialNumberStatic" class="static-text">#' + serialNumber + '</span><br>' +
      '<span id="ftpTimeStatic" class="static-text">FTP Time: ' + ftpTime + '</span><br>' +
      '<span style="display:block; margin-top:5px;"><a id="ftoUrlLink" class="static-text" href="' + ftoUrl + '" target="_blank" style="color:#0094FF;">FTO FILE LINK</a></span>';
    
    // Hide the FTO File URL and FTP Time input fields
    document.getElementById('ftoUrl').style.display = 'none';
    document.getElementById('ftpTime').style.display = 'none';
    
    // Change the button text to EDIT
    btn.textContent = "EDIT";
  } else {
    var nameAndSerialDiv = document.getElementById('nameAndSerial');
    var officerNameStatic = document.getElementById('officerNameStatic').textContent;
    var serialNumberStatic = document.getElementById('serialNumberStatic').textContent.replace(/^#/, '');
    
    nameAndSerialDiv.innerHTML =
      '<input type="text" id="officerName" placeholder="Officer Name" required value="' + officerNameStatic + '">' +
      '<input type="text" id="serialNumber" placeholder="Serial Number" required value="' + serialNumberStatic + '">';
    
    // Show the FTO File URL and FTP Time input fields and restore their values
    document.getElementById('ftpTime').style.display = 'block';
    document.getElementById('ftoUrl').style.display = 'block';
    document.getElementById('ftpTime').value = localStorage.getItem("ftpTime") || "";
    document.getElementById('ftoUrl').value = localStorage.getItem("ftoUrl") || "";
    
    btn.textContent = "SUBMIT";
  }
});

// Orientation Generator Toggle
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

// Daily Observation Report (DOR) Generator Toggle
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

// Back Buttons
document.getElementById('backButton').addEventListener('click', function() {
  hideAllSections();
  document.getElementById('mainContent').style.display = 'block';
});
document.getElementById('dorBackButton').addEventListener('click', function() {
  hideAllSections();
  document.getElementById('mainContent').style.display = 'block';
});

// New Orientation Report Button: clear text fields and orientation checklist toggles
document.getElementById('newOrientationReport').addEventListener('click', function() {
  document.getElementById('oriOfficer').value = "";
  document.getElementById('oriOfficerSerial').value = "";
  document.getElementById('oriPatrolNumber').value = "";
  document.getElementById('oriDate').value = "";
  document.getElementById('oriTime').value = "";
  document.getElementById('oriDuration').value = "";
  document.getElementById('oriIncidentsTasks').value = "";
  // Clear orientation checklist checkboxes (assumed to be 8 toggles)
  for (let i = 1; i <= 8; i++) {
    let toggle = document.getElementById("oriToggle" + i);
    if (toggle) { toggle.checked = false; }
  }
  document.getElementById('oriBBCodeOutput').value = "";
});

// New DOR Report Button: clear text fields and DOR evaluation radio selections
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
  // Clear all DOR evaluation radio button selections (assumed 17 groups)
  for (let i = 1; i <= 17; i++) {
    let radios = document.getElementsByName("dorRating" + i);
    for (let j = 0; j < radios.length; j++) {
      radios[j].checked = false;
    }
  }
  document.getElementById('dorBBCodeOutput').value = "";
});

// Helper function to hide all sections
function hideAllSections() {
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('orientationGenerator').style.display = 'none';
  document.getElementById('dorGenerator').style.display = 'none';
}

// Dynamic token helper for evaluation ratings
function getRatingToken(selected, ratingOption) {
  return (selected == ratingOption) ? "[cbc=][/cbc]" : "[cb=][/cb]";
}

// Generate DOR BBCode Function using a grouped evaluation table
function generateDORBBCode() {
  // Retrieve DOR field values
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
  
  // Build header using table2 (as in your template)
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
  
  // Roleplay Remarks Section (full width, shorter box)
  let roleplayBBCode = "";
  roleplayBBCode += "[font=Arial][b][size=110](( ROLEPLAY REMARKS ))[/size][/b][/font]\n\n";
  roleplayBBCode += "[ooc]" + (dorRoleplayRemarks ? dorRoleplayRemarks : "Brief remarks") + "[/ooc]\n\n";
  
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
  
  // Dynamic Evaluation Categories with groups
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
      // For first group, output header row with rating column headings.
      evalTable += "[tr]\n";
      evalTable += "[td][font=Arial][b]" + group.title + "[/b][/font][/td]\n";
      evalTable += "[td][font=Arial][center][b]1[/b][/center][/font][/td]\n";
      evalTable += "[td][font=Arial][center][b]2[/b][/center][/font][/td]\n";
      evalTable += "[td][font=Arial][center][b]3[/b][/center][/font][/td]\n";
      evalTable += "[td][font=Arial][center][b]4[/b][/center][/font][/td]\n";
      evalTable += "[td][font=Arial][center][b]N/O[/b][/center][/font][/td]\n";
      evalTable += "[/tr]\n";
    } else {
      // For subsequent groups, output a separator row with the group title spanning all columns.
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
      // Fallback for older browsers
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
function getToggleToken(toggleId) {
  var cb = document.getElementById(toggleId);
  if (cb && cb.checked) {
    return { yes: "[cbc][/cbc]", no: "[cb][/cb]" };
  } else {
    return { yes: "[cb][/cb]", no: "[cbc][/cbc]" };
  }
}

function generateOrientationBBCode() {
  var oriOfficer = document.getElementById('oriOfficer').value;
  var oriOfficerSerial = document.getElementById('oriOfficerSerial').value;
  var oriFTO = document.getElementById('oriFTO').value;
  var oriFTOSerial = document.getElementById('oriFTOSerial').value;
  var oriPatrolNumber = document.getElementById('oriPatrolNumber').value;
  var oriDate = document.getElementById('oriDate').value;
  var oriTime = document.getElementById('oriTime').value;
  var oriDuration = document.getElementById('oriDuration').value;
  var oriIncidentsTasks = document.getElementById('oriIncidentsTasks').value;
  
  // Build header
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
  bbcode += "[/tdwidth][/tr]\n";
  
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
  
  // Incidents/Tasks section
  bbcode += "[font=Arial][b][size=110]INCIDENTS/TASKS[/size][/b][/font]\n\n";
  bbcode += oriIncidentsTasks + "\n\n";
  
  // Orientation Checklist section using the checkboxes
  bbcode += "[font=Arial][b][size=110]ORIENTATION CHECKLIST[/size][/b][/font]\n\n";
  bbcode += "[table]\n";
  // Header row for checklist
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial][b]ADMINISTRATIVE[/b][/font][/td]\n";
  bbcode += "[td][font=Arial][center][b]✓[/b][/center][/font][/td]\n";
  bbcode += "[td][font=Arial][center][b]✗[/b][/center][/font][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 1: Probationer's Divisional Notebook Created (oriToggle1)
  var t1 = getToggleToken("oriToggle1");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]1. Probationer's Divisional Notebook Created[/font][/td]\n";
  bbcode += "[td][center]" + t1.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t1.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Separator for FIELD items
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial][b]FIELD[/b][/font][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 2: Uniform and Equipment Checks (oriToggle2)
  var t2 = getToggleToken("oriToggle2");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]3. Uniform and Equipment Checks[/font][/td]\n";
  bbcode += "[td][center]" + t2.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t2.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 3: Mission Row Familiarization (oriToggle3)
  var t3 = getToggleToken("oriToggle3");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]4. Mission Row Familiarization[/font][/td]\n";
  bbcode += "[td][center]" + t3.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t3.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 4: Radio Setup (oriToggle4)
  var t4 = getToggleToken("oriToggle4");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]5. Radio Setup[/font][/td]\n";
  bbcode += "[td][center]" + t4.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t4.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 5: Vehicle Checks (oriToggle5)
  var t5 = getToggleToken("oriToggle5");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]6. Vehicle Checks (ELS, Maintenance Forms etc.)[/font][/td]\n";
  bbcode += "[td][center]" + t5.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t5.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Out-of-Character header (if needed)
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial][ooc][b]OUT OF CHARACTER[/b][/ooc][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 6: Teamspeak Binds (oriToggle6)
  var t6 = getToggleToken("oriToggle6");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]7. Teamspeak Binds (Central / TACs)[/font][/td]\n";
  bbcode += "[td][center]" + t6.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t6.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 7: Vehicle Spawning (oriToggle7)
  var t7 = getToggleToken("oriToggle7");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]8. Vehicle Spawning[/font][/td]\n";
  bbcode += "[td][center]" + t7.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t7.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  // Checklist item 8: General Faction Commands (oriToggle8)
  var t8 = getToggleToken("oriToggle8");
  bbcode += "[tr]\n";
  bbcode += "[td][font=Arial]9. General Faction Commands[/font][/td]\n";
  bbcode += "[td][center]" + t8.yes + "[/center][/td]\n";
  bbcode += "[td][center]" + t8.no + "[/center][/td]\n";
  bbcode += "[/tr]\n";
  
  bbcode += "[/table]\n\n";
  
  // Set the generated BBCode into the orientation output textbox
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

  if(type === "orientation") {
    // Save text fields for orientation
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
    // Save orientation checklist toggle states
    let oriToggles = {};
    for (let i = 1; i <= 8; i++) {
      let toggle = document.getElementById("oriToggle" + i);
      oriToggles["oriToggle" + i] = toggle ? toggle.checked : false;
    }
    report.data.toggles = oriToggles;
  } else if(type === "dor") {
    // Save text fields for DOR
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
    // Save DOR evaluation radio selections
    let dorRatings = {};
    for (let i = 1; i <= 17; i++) {
      let sel = document.querySelector('input[name="dorRating' + i + '"]:checked');
      dorRatings["dorRating" + i] = sel ? sel.value : "";
    }
    report.data.ratings = dorRatings;
  }
  
  report.title = report.data.officer + " - " + report.data.time + " - " + report.data.date;
  report.duration = report.data.duration;
  
  var savedReports = JSON.parse(localStorage.getItem("savedReports") || "[]");
  var existingIndex = savedReports.findIndex(r => r.title === report.title);
  
  var currentFTPTimeStr = localStorage.getItem("ftpTime") || "00:00";
  var currentFTPTimeMinutes = parseTimeToMinutes(currentFTPTimeStr);
  var newReportMinutes = parseTimeToMinutes(report.duration);
  
  if(existingIndex >= 0) {
    var oldReport = savedReports[existingIndex];
    var oldReportMinutes = parseTimeToMinutes(oldReport.duration);
    if(newReportMinutes !== oldReportMinutes) {
      currentFTPTimeMinutes = currentFTPTimeMinutes - oldReportMinutes + newReportMinutes;
    }
    savedReports[existingIndex] = report;
  } else {
    currentFTPTimeMinutes = currentFTPTimeMinutes + newReportMinutes;
    savedReports.push(report);
  }
  
  var newFTPTimeStr = minutesToTimeStr(currentFTPTimeMinutes);
  localStorage.setItem("ftpTime", newFTPTimeStr);
  localStorage.setItem("savedReports", JSON.stringify(savedReports));
  
  var ftpTimeElem = document.getElementById("ftpTimeStatic");
  if(ftpTimeElem) {
    ftpTimeElem.textContent = "FTP Time: " + newFTPTimeStr;
  }
  
  loadSavedReports();
}

function loadSavedReports() {
  var savedReports = JSON.parse(localStorage.getItem("savedReports") || "[]");
  var dropdown = document.querySelectorAll(".dropdown")[0];
  var guidedPatrolsDiv = dropdown.querySelector(".dropdown-content");
  guidedPatrolsDiv.innerHTML = "";
  savedReports.forEach(function(report) {
    var a = document.createElement("a");
    a.href = "#";
    a.textContent = report.title;
    a.addEventListener("click", function(e) {
      e.preventDefault();
      loadReport(report);
    });
    guidedPatrolsDiv.appendChild(a);
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
    // Restore orientation checklist toggles
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
      '<span style="display:block; margin-top:5px;"><a id="ftoUrlLink" class="static-text" href="' + ftoUrl + '" target="_blank" style="color:#0094FF;">FTO FILE LINK</a></span>';
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
});
