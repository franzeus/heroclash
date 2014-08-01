var Creature = function(options) {
  this.id = getRandomId();
  options = options || {};
  this.group = null;
  this.type = 'CREATURE';
  this.isDead = false;
  extend(this, options);
  this.element = document.createElement('div');
  this.element.className = 'creature';
};

Creature.prototype.setDead = function() {
  this.element.className = this.element.className + ' dead_creature';
  this.isDead = true;
};
