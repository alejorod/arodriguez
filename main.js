var Glitcher = (function() {
  var glitchChars = '@#><}@{}()@-_*&%@!~abcdefghijkhlmnopqrstjk';

  function Glitcher(elem) {
    this.target = elem;
    this.originalText = elem.textContent;
    this.animationId = null;
    this.lastUpdate = 0;
    this.threshold = 140;
    this.glitchSteps = 6;
  }

  Glitcher.prototype.stop = function () {
    cancelAnimationFrame(this.animationId);
    this.target.textContent = this.originalText;
  };

  Glitcher.prototype.start = function (time) {
    this.animationId = requestAnimationFrame(this.start.bind(this));
    this.lastTime = this.lastTime ? this.lastTime : time;
    var delta = time - this.lastTime;

    if (delta > this.threshold) {
      this.threshold = 120 + Math.random() * 20;
      this.lastTime = time;
      if (this.glitchSteps) {
        this.glitchSteps--;
        wordCount = Math.floor(Math.random() * 2) + Math.floor(this.originalText.length / 4);
        glitchText = this.originalText;

        i = 0;
        while(i < wordCount) {
          index = Math.floor(Math.random() * this.originalText.length);
          if (glitchText[index] && !/\s/.test(glitchText[index])) {
            i++;
            glitchCharIndex = Math.floor(Math.random() * glitchChars.length);
            glitchChar = glitchChars[glitchCharIndex];
            glitchText = glitchText.substr(0, index) + glitchChar + glitchText.substr(index + 1, glitchText.length);
          }
        }
        this.target.textContent = glitchText;
      } else {
        this.target.textContent = this.originalText;
        this.threshold *= (Math.random() + 14);
        this.glitchSteps = Math.round(Math.random() * 3) + 3;
      }
    }
  };

  return {
    glitch: function(elem) {
      return new Glitcher(elem);
    }
  };
})();

[].forEach.call(document.querySelectorAll('.glitch'), function(elem) {
  Glitcher.glitch(elem).start();
});

[].forEach.call(document.querySelectorAll('.glitch-hover'), function(elem) {
  var glitch = Glitcher.glitch(elem);
  elem.glitch = glitch;
});

function selectMenuItem(elem) {
  [].forEach.call(document.querySelectorAll('.menu-item'), function(elem) {
    elem.className = elem.className.replace('selected', '');
    [].forEach.call(elem.children, function(c) {
      if (c.glitch) {
        c.glitch.stop();
      }
    });
  });

  elem.className += ' selected';
  [].forEach.call(elem.children, function(c) {
    if (c.glitch) {
      c.glitch.start();
    }

    if (c.nodeName == 'A') {
      c.focus();
    }
  });
}

[].forEach.call(document.querySelectorAll('.menu-item'), function(elem) {
  elem.addEventListener('mouseenter', function() {
    selectMenuItem(elem);
  });
});

window.onkeydown = function(e) {
  var selectedElement = document.querySelector('.selected');
  var allItems = document.querySelectorAll('.menu-item');

  // 38 UP
  if (e.keyCode == 38) {
    if (selectedElement && selectedElement.previousElementSibling) {
      selectMenuItem(selectedElement.previousElementSibling);
    } else {
      selectMenuItem(allItems[allItems.length - 1]);
    }
  }

  // 40 DOWN
  if (e.keyCode == 40) {
    if (selectedElement && selectedElement.nextElementSibling) {
      selectMenuItem(selectedElement.nextElementSibling);
    } else {
      selectMenuItem(allItems[0]);
    }
  }
}

selectMenuItem(document.querySelector('.selected'));
