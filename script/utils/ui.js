export function hideAllSections() {
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('orientationGenerator').style.display = 'none';
  document.getElementById('dorGenerator').style.display = 'none';
  document.getElementById('weeklyGenerator').style.display = 'none';
}

export function populateStaticOfficerInfo() {
  const officerName = localStorage.getItem("officerName");
  const serialNumber = localStorage.getItem("serialNumber");
  const ftpTime = localStorage.getItem("ftpTime");
  const ftoUrl = localStorage.getItem("ftoUrl") || "";

  if (!officerName || !serialNumber) return;

  const nameAndSerialDiv = document.getElementById('nameAndSerial');
  nameAndSerialDiv.innerHTML = `
    <span id="officerNameStatic" class="static-text">${officerName}</span><br>
    <span id="serialNumberStatic" class="static-text">#${serialNumber}</span><br>
    <span id="ftpTimeStatic" class="static-text">FTP Time: ${ftpTime}</span><br>
    <span style="display:block; margin-top:5px;">
      <a id="ftoUrlLink" class="static-text" href="${ftoUrl}" target="_blank" style="color:#0094FF;">FTO FILE</a>
    </span>
  `;

  const ftpTimeElem = document.getElementById('ftpTime');
  const ftoUrlElem = document.getElementById('ftoUrl');
  if (ftpTimeElem) ftpTimeElem.style.display = 'none';
  if (ftoUrlElem) ftoUrlElem.style.display = 'none';

  document.getElementById('formButton').textContent = "EDIT";
}

export function setupDropdowns() {
  document.querySelectorAll(".dropdown-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      this.parentElement.classList.toggle("active");
    });
  });

  document.querySelectorAll(".dropdown").forEach(dropdown => {
    dropdown.classList.add("active");
  });
}

export function resetOrientationForm() {
  document.getElementById("orientationForm")?.reset();
}

export function resetDORForm() {
  document.getElementById("dorForm")?.reset();
}

export function resetWeeklyForm() {
  document.getElementById("weeklyForm")?.reset();
}