import { generateOrientationBBCode } from './generators/orientation.js';
import { generateDORBBCode } from './generators/dor.js';
import { generateWeeklyBBCode } from './generators/weekly.js';

import {
  hideAllSections,
  populateStaticOfficerInfo,
  setupDropdowns,
  resetOrientationForm,
  resetDORForm,
  resetWeeklyForm
} from './utils/ui.js';

import { saveReport, loadSavedReports, loadReport } from './utils/localstorage.js';
import { getRatingToken } from './utils/utils.js';

window.addEventListener('DOMContentLoaded', () => {
  // Initial UI setup
  populateStaticOfficerInfo();
  setupDropdowns();
  loadSavedReports();

  // Navigation buttons
  document.getElementById('orientationButton')?.addEventListener('click', e => {
    e.preventDefault();
    hideAllSections();
    const name = localStorage.getItem("officerName") || "";
    const serial = localStorage.getItem("serialNumber") || "";
    document.getElementById("oriFTO").value = name;
    document.getElementById("oriFTOSerial").value = serial;
    document.getElementById('orientationGenerator').style.display = 'block';
    document.getElementById('orientationGenerator').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('dorButton')?.addEventListener('click', e => {
    e.preventDefault();
    hideAllSections();
    const name = localStorage.getItem("officerName") || "";
    const serial = localStorage.getItem("serialNumber") || "";
    document.getElementById("dorFTO").value = name;
    document.getElementById("dorFTOSerial").value = serial;
    document.getElementById('dorGenerator').style.display = 'block';
    document.getElementById('dorGenerator').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('weeklyReportButton')?.addEventListener('click', e => {
    e.preventDefault();
    hideAllSections();
    const name = localStorage.getItem("officerName") || "";
    const serial = localStorage.getItem("serialNumber") || "";
    document.getElementById("weeklyFTM").value = name;
    document.getElementById("weeklyFTMSerial").value = serial;
    document.getElementById('weeklyGenerator').style.display = 'block';
    document.getElementById('weeklyGenerator').scrollIntoView({ behavior: 'smooth' });
  });

  // Back buttons
  document.getElementById('backButton')?.addEventListener('click', () => {
    hideAllSections();
    document.getElementById('mainContent').style.display = 'block';
  });
  document.getElementById('dorBackButton')?.addEventListener('click', () => {
    hideAllSections();
    document.getElementById('mainContent').style.display = 'block';
  });
  document.getElementById('weeklyBackButton')?.addEventListener('click', () => {
    hideAllSections();
    document.getElementById('mainContent').style.display = 'block';
  });

  // Generate buttons
  document.getElementById('OrientationGenerateButton')?.addEventListener('click', e => {
    e.preventDefault();
    generateOrientationBBCode();
    document.getElementById('oriBBCodeOutput')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('DORGenerateButton')?.addEventListener('click', e => {
    e.preventDefault();
    generateDORBBCode();
    document.getElementById('dorBBCodeOutput')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('generateWeekly')?.addEventListener('click', e => {
    e.preventDefault();
    generateWeeklyBBCode();
    document.getElementById('weeklyBBCodeOutput')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Remedial visibility toggle
  document.getElementById('remedialRequired')?.addEventListener('change', function () {
    const container = document.getElementById('remedialDetailsContainer');
    container.style.display = this.value === 'Yes' ? 'block' : 'none';
  });

  // Save static officer info
  document.getElementById("formButton")?.addEventListener("click", function () {
    const nameInput = document.getElementById("officerName");
    const serialInput = document.getElementById("serialNumber");
    const timeInput = document.getElementById("ftpTime");
    const ftoUrlInput = document.getElementById("ftoUrl");

    if (this.textContent === "SAVE") {
      localStorage.setItem("officerName", nameInput.value);
      localStorage.setItem("serialNumber", serialInput.value);
      localStorage.setItem("ftpTime", timeInput.value);
      localStorage.setItem("ftoUrl", ftoUrlInput.value);
      location.reload();
    } else {
      this.textContent = "SAVE";
      nameInput.style.display = "inline-block";
      serialInput.style.display = "inline-block";
      timeInput.style.display = "inline-block";
      ftoUrlInput.style.display = "inline-block";
    }
  });

  // Optional: Reset buttons
  document.getElementById("orientationResetButton")?.addEventListener("click", resetOrientationForm);
  document.getElementById("dorResetButton")?.addEventListener("click", resetDORForm);
  document.getElementById("weeklyResetButton")?.addEventListener("click", resetWeeklyForm);
});