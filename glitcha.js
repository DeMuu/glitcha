// TODO: add func to
// - 1. copy text into 2, 3 or 4 sub elements
// - 2. add correct classes based on passed params

// DONE: refactor query selector to document.querySelectorAll()
// TODO: refactor lines, colors and opacity setter functionality so it can work with multiple objects
// TODO: refactor replaceTags so it matches the inital variable setup style to make the if else obsolete
// DONE: set correct height + offset values. formula -> top + bottom = elem.height / 2.5; middle = top / 2; offset = sum of preceding heights
// TODO: make texts work again with calculating the correct line-height for each line

glitchText = function (elemSelector) {
  window.onload = function onload () {
    this._elem = document.querySelectorAll(elemSelector);
    this._selectorType;
    this._glitchLines;
    this._glitchOpacity;
    this._glitchColors;
    this._glitchPosition;
    this._glitchDelay;
    this._elemStyles;
    
    // takes care of initalizing, replacing the container tag and styling
    this.replaceTags = function () {
      let _copies = [];
      let _elemParent = [];
      const len = this._elem.length;
      
      for (let i = 0; i < len; i++) {
        const curr = this._elem[i];
        _copies[i] = this.getSetupCopies(curr, this._glitchLines);

        _elemParent[i] = curr;
      }

      for (let i = 0, len = _elemParent.length; i < len; i++) {
        const currElem = _elemParent[i];
        const newParent = document.createElement('div');
        const _compStyles = window.getComputedStyle(currElem);
        this._elemStyles = {
          margin: _compStyles.getPropertyValue('margin'),
          padding: _compStyles.getPropertyValue('padding'),
          border: _compStyles.getPropertyValue('border'),
          height: _compStyles.getPropertyValue('height'),
          width: _compStyles.getPropertyValue('width')
        };
        
        newParent.className = 'gl-fx';
        newParent.style.height = this._elemStyles.height;
        newParent.style.width = this._elemStyles.width;
        newParent.style.border = this._elemStyles.border;
        newParent.style.padding = this._elemStyles.padding;
        newParent.style.margin = this._elemStyles.margin;
        
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
        let sumTopOffset = 0;
        this._selectorType = this._elem[i].tagName.toLowerCase();

        for (let j = 0; j < copyMarkup[i].length; j++) {
          const currCopy = copyMarkup[i][j];
          const currTag = ['<' + currCopy.tagName + '><span>', '</span></' + currCopy.tagName + '>'];
          const divFactor = j % 2 ? 2 : 2.5;
          let doOffsetPos = false;

          if (this._selectorType !== 'img') {
            elem.innerHTML += currTag[0] + currCopy.innerHTML + currTag[1];
          }
          else {
            elem.innerHTML += '<span><img src="' + currCopy.getAttribute('src') + '" class="' + currCopy.getAttribute('class') + '" /></span>';
          }
       
          const elemChild = elem.childNodes[j];
          let childToUse;

          if (elemChild.tagName.toLowerCase() !== 'span' && elemChild.childNodes.length > 0) {
            childToUse = elemChild.childNodes[0];
          }
          else {
            childToUse = elemChild;
            childToUse.style.display = 'block';
            doOffsetPos = true;
          }

          if (doOffsetPos) {
            childToUse.childNodes[0].style.top = -sumTopOffset + 'px';
          }

          childToUse.style.top = sumTopOffset + 'px';
          childToUse.style.height = parseFloat(divFactor === 2.5 ? this._elemStyles.height : elem.childNodes[0].style.height) / divFactor + 'px';
          sumTopOffset += parseFloat(childToUse.style.height);

          if (this._glitchDelay[j] !== 0) {
            childToUse.style.animationDelay = this._glitchDelay[j] + 's';
          }
          
          this.setGlitchParams(elem.childNodes[j]);
        }
      }
    };
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
    };
    
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
      this._glitchDelay = curr.getAttribute('data-glitch-delay') !== null ? curr.getAttribute('data-glitch-delay').replace(' ', '').split(',') : [0];
    
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
}
