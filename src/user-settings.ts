/**
 * Control of user settings
 *
 * @module UserSettings
 */

/**
 * Initialises and reacts to user settings
 *
 */
export class UserSettings {
  advancedMaterialClass = 'advancedMaterial';
  /**
   * Initialises elements and starts event listeners.
   */
  constructor() {
    this.getSavedAdvancedMaterial();
    this.setSavedAdvancedMaterial();
  }

  /**
   * Get the saved state of the advanced material switch.
   *
   * Get the saved state and set the switch accordingly. If no
   * saved state is found, the advanced material is shown by
   * default.
   */
  protected getSavedAdvancedMaterial(): void {
    document.addEventListener('DOMContentLoaded', () => {
      const savedState: string | null = localStorage.getItem(
        this.advancedMaterialClass
      );

      if (savedState === 'true' || savedState === null) {
        this.setAdvancedMaterialSwitch(true);
        this.showAdvancedMaterial(true);
      } else {
        this.setAdvancedMaterialSwitch(false);
        this.showAdvancedMaterial(false);
      }
    });
  }

  /**
   * Set the saved state of the advanced material switch.
   */
  protected setSavedAdvancedMaterial(): void {
    const advancedMaterialSwitch = document.getElementById(
      'advancedMaterialSwitch'
    ) as HTMLInputElement | null;

    if (advancedMaterialSwitch) {
      advancedMaterialSwitch.addEventListener('change', () => {
        if (advancedMaterialSwitch.checked) {
          this.showAdvancedMaterial(true);
          localStorage.setItem(this.advancedMaterialClass, 'true');
        } else {
          this.showAdvancedMaterial(false);
          localStorage.setItem(this.advancedMaterialClass, 'false');
        }
      });
    }
  }

  /**
   * Set the advanced material switch to checked or unchecked.
   *
   * @param {boolean} checked - The checked state of the advanced material switch.
   */
  protected setAdvancedMaterialSwitch(checked: boolean): void {
    const advancedMaterialSwitch = document.getElementById(
      'advancedMaterialSwitch'
    ) as HTMLInputElement | null;

    if (advancedMaterialSwitch) {
      advancedMaterialSwitch.checked = checked;
    }
  }

  /**
   * Show or hide advanced material.
   *
   * @param {boolean} show - Show or hide the advanced material.
   */
  protected showAdvancedMaterial(show: boolean): void {
    const advancedWrappers = document.getElementsByClassName(
      'advancedWrapper'
    ) as HTMLCollectionOf<Element> | null;

    // TODO: #1 this should really be a class change, not a style change
    const displayValue = show ? 'block' : 'none';

    if (advancedWrappers) {
      Array.from(advancedWrappers).forEach((wrapper) => {
        (wrapper as HTMLElement).style.display = displayValue;
      });
    }
  }
}

// Instantiate the UserSetting class if running in a real browser.
// Process is only defined in Node.js environments.
if (typeof process === 'undefined') {
  new UserSettings();
}
