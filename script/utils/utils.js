// utils/utils.js

/**
 * Returns a BBCode checkbox token depending on whether the selected option matches the rating.
 * Used by DOR and Weekly generators.
 * @param {string} selected - Selected value
 * @param {string} ratingOption - Value to match against
 * @returns {string} BBCode checkbox
 */
export function getRatingToken(selected, ratingOption) {
  return selected === ratingOption ? "[cbc][/cbc]" : "[cb][/cb]";
}

/**
 * Retrieves the selected value from a radio button group
 * @param {string} groupName - Name attribute of the radio inputs
 * @returns {string} Selected radio value, or empty string
 */
export function getSelectedValue(groupName) {
  const selected = document.querySelector(`input[name="${groupName}"]:checked`);
  return selected ? selected.value : "";
}

/**
 * For Orientation: Returns token object with [cbc] for yes, [cb] for no.
 * @param {string} radioName - Name of the orientation radio input group
 * @returns {{yes: string, no: string}}
 */
export function getOrientationToken(radioName) {
  const selected = document.querySelector(`input[name="${radioName}"]:checked`);
  const value = selected ? selected.value : "";

  if (value === "1") {
    return { yes: "[cbc][/cbc]", no: "[cb][/cb]" };
  } else if (value === "2") {
    return { yes: "[cb][/cb]", no: "[cbc][/cbc]" };
  } else {
    return { yes: "[cb][/cb]", no: "[cbc][/cbc]" };
  }
}