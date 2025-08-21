import { hideAllSections, populateStaticOfficerInfo } from './ui.js';
import { monthlyLogs, renderMonthlyLogs } from "../generators/ftofile.js";

export function parseTimeToMinutes(timeStr) {
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return hours * 60 + minutes;
}

export function minutesToTimeStr(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`;
}

export async function refreshFtpTime() {
  const user_uuid = localStorage.getItem("user_uuid");

  const res = await fetch(`/FTP/api/getFtpTime.php?user_uuid=${encodeURIComponent(user_uuid)}`);
  const data = await res.json();

  const time = data.ftp_time || "00:00";

  const staticTime = document.getElementById("ftpTimeStatic");
  const input = document.getElementById("ftpTime");
  const fileTime = document.getElementById("ftoFileTime");

  if (staticTime) staticTime.textContent = `FTP Time: ${time}`;
  if (input) input.value = time;
  if (fileTime) fileTime.value = time;
}

export async function saveReport(type) {
  const user_uuid = localStorage.getItem("user_uuid");

  const report = {
    user_uuid,
    type,
    title: "",
    duration: "",
    data: {}
  };

  const getValue = id => document.getElementById(id)?.value || "";

  if (type === "weekly") {
    report.data = {
      officer: getValue("weeklyOfficer"),
      officerSerial: getValue("weeklyOfficerSerial"),
      date: getValue("weeklyDate"),
      ftm: getValue("weeklyFTM"),
      ftmSerial: getValue("weeklyFTMSerial"),
      discussion: getValue("weeklyDiscussion"),
      strengthsDiscussion: getValue("strengthsDiscussionStatus"),
      weaknessesDiscussion: getValue("weaknessesDiscussionStatus"),
      remedialRequired: getValue("remedialRequired"),
      remedialDetails: getValue("remedialDetails"),
      performance: getValue("weeklyPerformanceSelect"),
      ratings: {}
    };
    for (let i = 1; i <= 17; i++) {
      const selected = document.querySelector(`input[name="weeklyRating${i}"]:checked`);
      report.data.ratings[`weeklyRating${i}`] = selected ? selected.value : "";
    }
    report.title = `${report.data.officer} - ${report.data.date} - ${report.data.performance}`;

  } else if (type === "orientation") {
    report.data = {
      officer: getValue("oriOfficer"),
      officerSerial: getValue("oriOfficerSerial"),
      fto: getValue("oriFTO"),
      ftoSerial: getValue("oriFTOSerial"),
      patrol: getValue("oriPatrolNumber"),
      date: getValue("oriDate"),
      time: getValue("oriTime"),
      duration: getValue("oriDuration"),
      incidents: getValue("oriIncidentsTasks"),
      ratings: {}
    };
    report.duration = report.data.duration;
    report.title = `${report.data.officer} - ${report.data.time} - ${report.data.date}`;
    for (let i = 1; i <= 8; i++) {
      const selected = document.querySelector(`input[name="oriRating${i}"]:checked`);
      report.data.ratings[`oriRating${i}`] = selected ? selected.value : "";
    }

  } else if (type === "dor") {
    report.data = {
      officer: getValue("dorOfficer"),
      officerSerial: getValue("dorOfficerSerial"),
      fto: getValue("dorFTO"),
      ftoSerial: getValue("dorFTOSerial"),
      patrol: getValue("dorPatrolNumber"),
      date: getValue("dorDate"),
      time: getValue("dorTime"),
      duration: getValue("dorDuration"),
      incidents: getValue("dorIncidentsTasks"),
      belowStandard: getValue("dorBelowStandard"),
      aboveStandard: getValue("dorAboveStandard"),
      learningGoals: getValue("dorLearningGoalsExplain"),
      roleplay: getValue("dorRoleplayRemarks"),
      ratings: {}
    };
    report.duration = report.data.duration;
    report.title = `${report.data.officer} - ${report.data.time} - ${report.data.date}`;
    for (let i = 1; i <= 17; i++) {
      const selected = document.querySelector(`input[name="dorRating${i}"]:checked`);
      report.data.ratings[`dorRating${i}`] = selected ? selected.value : "";
    }

  } else if (type === "ftofile") {
    const monthlyLogs = JSON.parse(localStorage.getItem("monthlyFTOLogs") || "[]");
    report.data = {
      name: getValue("ftoFileName"),
      serial: getValue("ftoFileSerial"),
      division: getValue("ftoFileDivision"),
      time: getValue("ftoFileTime"),
      logs: monthlyLogs
    };
    report.title = `FTO File - ${report.data.name}`;
  }

  await fetch("/FTP/api/saveReport.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report)
  });

  await loadSavedReports();
  await refreshFtpTime();
}

export async function loadSavedReports() {
  const user_uuid = localStorage.getItem("user_uuid");

  const res = await fetch(`/FTP/api/loadReports.php?user_uuid=${encodeURIComponent(user_uuid)}`);
  const reports = await res.json();

  const dropdowns = document.querySelectorAll(".dropdown");
  const ftoDiv = document.getElementById("ftoFileDropdown");
  const guidedDiv = dropdowns[1].querySelector(".dropdown-content");
  const ftmDiv = dropdowns[2].querySelector(".dropdown-content");

  ftoDiv.innerHTML = "";
  guidedDiv.innerHTML = "";
  ftmDiv.innerHTML = "";

  reports.forEach(report => {
    const wrapper = document.createElement("div");
    wrapper.className = "report-entry";

    const a = document.createElement("a");
    a.href = "#";
    a.textContent = report.title;
    a.style.flex = "1";
    a.addEventListener("click", e => {
      e.preventDefault();
      loadReport(report);
    });

    const del = document.createElement("button");
    del.textContent = "❌";
    del.title = "Delete Report";
    del.className = "delete-report-btn";
    del.addEventListener("click", async e => {
      e.stopPropagation();
      if (confirm(`Delete "${report.title}"?`)) {
        await deleteReport(report.title);
      }
    });

    wrapper.appendChild(a);
    wrapper.appendChild(del);

    if (report.type === "weekly") {
      ftmDiv.appendChild(wrapper);
    } else if (report.type === "ftofile") {
      ftoDiv.appendChild(wrapper);
    } else {
      guidedDiv.appendChild(wrapper);
    }
  });
}

export async function loadReport(reportMeta) {
  const user_uuid = localStorage.getItem("user_uuid");
  const res = await fetch(`/FTP/api/loadReport.php?user_uuid=${user_uuid}&title=${encodeURIComponent(reportMeta.title)}`);
  const report = await res.json();
  hideAllSections();

  const applyRating = (prefix, count, ratings) => {
    for (let i = 1; i <= count; i++) {
      const value = ratings[`${prefix}${i}`];
      const radios = document.getElementsByName(`${prefix}${i}`);
      radios.forEach(r => { r.checked = r.value === value; });
    }
  };

  if (report.type === "orientation") {
    Object.assign(document.getElementById("oriOfficer"), { value: report.data.officer });
    Object.assign(document.getElementById("oriOfficerSerial"), { value: report.data.officerSerial });
    Object.assign(document.getElementById("oriFTO"), { value: report.data.fto });
    Object.assign(document.getElementById("oriFTOSerial"), { value: report.data.ftoSerial });
    Object.assign(document.getElementById("oriPatrolNumber"), { value: report.data.patrol });
    Object.assign(document.getElementById("oriDate"), { value: report.data.date });
    Object.assign(document.getElementById("oriTime"), { value: report.data.time });
    Object.assign(document.getElementById("oriDuration"), { value: report.data.duration });
    Object.assign(document.getElementById("oriIncidentsTasks"), { value: report.data.incidents });
    applyRating("oriRating", 8, report.data.ratings);
    document.getElementById("orientationGenerator").style.display = "block";

  } else if (report.type === "dor") {
    Object.assign(document.getElementById("dorOfficer"), { value: report.data.officer });
    Object.assign(document.getElementById("dorOfficerSerial"), { value: report.data.officerSerial });
    Object.assign(document.getElementById("dorFTO"), { value: report.data.fto });
    Object.assign(document.getElementById("dorFTOSerial"), { value: report.data.ftoSerial });
    Object.assign(document.getElementById("dorPatrolNumber"), { value: report.data.patrol });
    Object.assign(document.getElementById("dorDate"), { value: report.data.date });
    Object.assign(document.getElementById("dorTime"), { value: report.data.time });
    Object.assign(document.getElementById("dorDuration"), { value: report.data.duration });
    Object.assign(document.getElementById("dorIncidentsTasks"), { value: report.data.incidents });
    Object.assign(document.getElementById("dorBelowStandard"), { value: report.data.belowStandard });
    Object.assign(document.getElementById("dorAboveStandard"), { value: report.data.aboveStandard });
    Object.assign(document.getElementById("dorLearningGoalsExplain"), { value: report.data.learningGoals });
    Object.assign(document.getElementById("dorRoleplayRemarks"), { value: report.data.roleplay });
    applyRating("dorRating", 17, report.data.ratings);
    document.getElementById("dorGenerator").style.display = "block";

  } else if (report.type === "weekly") {
    Object.assign(document.getElementById("weeklyOfficer"), { value: report.data.officer });
    Object.assign(document.getElementById("weeklyOfficerSerial"), { value: report.data.officerSerial });
    Object.assign(document.getElementById("weeklyDate"), { value: report.data.date || "" });
    Object.assign(document.getElementById("weeklyFTM"), { value: report.data.ftm });
    Object.assign(document.getElementById("weeklyFTMSerial"), { value: report.data.ftmSerial });
    Object.assign(document.getElementById("weeklyDiscussion"), { value: report.data.discussion });
    Object.assign(document.getElementById("strengthsDiscussionStatus"), { value: report.data.strengthsDiscussion });
    Object.assign(document.getElementById("weaknessesDiscussionStatus"), { value: report.data.weaknessesDiscussion });
    Object.assign(document.getElementById("remedialRequired"), { value: report.data.remedialRequired });
    Object.assign(document.getElementById("remedialDetails"), { value: report.data.remedialDetails });
    Object.assign(document.getElementById("weeklyPerformanceSelect"), { value: report.data.performance });
    applyRating("weeklyRating", 17, report.data.ratings);
    document.getElementById("remedialDetailsContainer").style.display = (report.data.remedialRequired === "Yes") ? "block" : "none";
    document.getElementById("weeklyGenerator").style.display = "block";
  
  } else if (report.type === "ftofile") {
    const currentTime = localStorage.getItem("ftpTime") || "00:00";

    Object.assign(document.getElementById("ftoFileName"), { value: report.data.name });
    Object.assign(document.getElementById("ftoFileSerial"), { value: report.data.serial });
    Object.assign(document.getElementById("ftoFileDivision"), { value: report.data.division });
    Object.assign(document.getElementById("ftoFileTime"), { value: currentTime });

    monthlyLogs.splice(0, monthlyLogs.length, ...(report.data.logs || []));

    document.getElementById("ftoFileGenerator").style.display = "block";
  }
}

export async function deleteReport(title) {
  const user_uuid = localStorage.getItem("user_uuid");

  await fetch(`/FTP/api/deleteReport.php`, {
    method: "DELETE",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ user_uuid, title })
  });

  await loadSavedReports();
}

function subtractFromFtpTime(removedTime) {
  const parse = t => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const format = mins => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const current = localStorage.getItem("ftpTime") || "00:00";
  const currentMins = parse(current);
  const removedMins = parse(removedTime);

  const newTotalMins = Math.max(currentMins - removedMins, 0);
  const newTime = format(newTotalMins);

  localStorage.setItem("ftpTime", newTime);

  const timeField = document.getElementById("ftpTime");
  if (timeField) timeField.value = newTime;

  const timeFieldStatic = document.getElementById("ftpTimeStatic");
  if (timeFieldStatic) timeFieldStatic.textContent = `FTP Time: ${newTime}`;
}
