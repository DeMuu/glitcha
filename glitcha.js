// TODO: add func to
// - 1. copy text into 2, 3 or 4 sub elements
// - 2. add correct classes based on passed params

// TODO: refactor query selector to document.querySelectorAll()
// TODO: refactor lines, colors and opacity setter functionality so it can work with multiple objects
// TODO: refactor replaceTags so it matches the inital variable setup style to make the if else obsolete

function glitchText (elemSelector) {
	this._selectorType = elemSelector.length > 1 ? elemSelector.substring(0, 1) : '';
  this._selectorName = this._selectorType !== '' ? elemSelector.substring(1) : elemSelector;
	this._elem = (this._selectorType === '.' ?
		      	      document.getElementsByClassName(this._selectorName) : (
				            this._selectorType === '#' ?
                  	  document.getElementById(this._selectorName) :
                      document.getElementsByTagName(this._selectorName)
                  )
                );
  this._glitchLines;
  this._glitchOpacity;
  this._glitchColors;
  this._glitchPosition;
  this._glitchDelay;
  
  // takes care of initalizing, replacing the container tag and styling
  this.replaceTags = function () {
    let _copies = [];
    let _elemParent = [];

    if (this._selectorType !== '#') {
      const len = this._elem.length;
      for (let i = 0; i < len; i++) {
        const curr = this._elem[i];
        _copies[i] = this.getSetupCopies(curr, this._glitchLines);

        _elemParent[i] = curr;
      }
    }
    else {
    	_elemParent[0] = this._elem;
      _copies[0] = this.getSetupCopies(_elemParent[0], this._glitchLines);
    }

    for (let i = 0, len = _elemParent.length; i < len; i++) {
      const currElem = _elemParent[i];
      const newParent = document.createElement('div');
      const _compStyles = window.getComputedStyle(currElem);
      const styles = {
      	margin: _compStyles.getPropertyValue('margin'),
        padding: _compStyles.getPropertyValue('padding'),
        border: _compStyles.getPropertyValue('border'),
        height: _compStyles.getPropertyValue('height'),
        width: _compStyles.getPropertyValue('width')
      };
      
      newParent.className = 'gl-txt';
      newParent.style.height = styles.height;
      newParent.style.width = styles.width;
      newParent.style.border = styles.border;
      newParent.style.padding = styles.padding;
      newParent.style.margin = styles.margin;
      
      currElem.parentNode.insertBefore(newParent, currElem);
      currElem.parentNode.removeChild(currElem);
      
      this.insertCopies(newParent, _copies);
    }
  };
  // get and return the markup copies
  this.getSetupCopies = function (elem, copies) {
    let _copyResult = [];
    copies = parseInt(copies);

    for (let i = 0; i < copies; i++) {
      _copyResult[i] = elem;
    }

    return _copyResult;
  };
  // replace the container tag and insert the copied markup
  this.insertCopies = function (elem, copyMarkup) {
  	const len = copyMarkup.length;
  	for (let i = 0; i < len; i++) {
    	for (let j = 0; j < copyMarkup[i].length; j++) {
      	const currCopy = copyMarkup[i][j];
        const currTag = ['<' + currCopy.tagName + '><span>', '</span></' + currCopy.tagName + '>'];
        elem.innerHTML += currTag[0] + currCopy.innerHTML + currTag[1];
      	
        if (this._glitchDelay[j] !== undefined) {
        	elem.childNodes[j].childNodes[0].style.animationDelay = this._glitchDelay[j] + 's';
        }
        
        this.setGlitchParams(elem.childNodes[j]);
      }
    }
  }
  // set classes based on the set properties
  this.setGlitchParams = function (elem) {
  	if (this._glitchOpacity) {
    	elem.classList.add('gl-opacity');
    }
    if (this._glitchPosition) {
    	elem.classList.add('gl-pos');
    }
    if (this._glitchColors) {
    	elem.classList.add('gl-clrs');
    }
  }
  
  const len = (this._elem.length === undefined ? 1 : this._elem.length);
  
  if (len === 1) {
  	this._elem[0] = this._elem;
  }
  
  for (let i = 0, curr = this._elem[i]; i < len; i++) {
  	// set the properties
    this._glitchLines = JSON.parse(curr.getAttribute('data-glitch-lines'));
    this._glitchOpacity = JSON.parse(curr.getAttribute('data-glitch-opacity'));
    this._glitchColors = JSON.parse(curr.getAttribute('data-glitch-colors'));
    this._glitchPosition = JSON.parse(curr.getAttribute('data-glitch-position'));
  	this._glitchDelay = curr.getAttribute('data-glitch-delay').replace(' ', '').split(',');
  
  	// default the number of lines to glitch to 3 if there's no or an invalid number set
    if (this._glitchLines !== 3 || this._glitchLines !== 4) {
      this._glitchLines = 3;
    }

    // if all of the glitches are disabled stop further execution
    if (!this._glitchOpacity && !this._glitchPosition && !this._glitchColors) {
      return;
    }

    // kick off the glitch
    this.replaceTags();
  }
};
